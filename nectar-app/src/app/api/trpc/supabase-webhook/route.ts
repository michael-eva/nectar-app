import formatVenueName from "@/lib/FormatVenueName";
import { appRouter } from "@/server/api/root";
import { NextResponse } from "next/server";

interface TradeLog {
  session_id: string;
  venue_id: string;
  customer_email: string;
  customer_name: string;
  payment_status: string;
  amount_total: number;
  created_at: string;
}

interface WebhookBody {
  record: TradeLog;
}

export async function POST(req: Request) {
  try {
    const body: WebhookBody = await req.json();
    const record: TradeLog = body.record;
    const caller = appRouter.createCaller({
      headers: req.headers,
    });
    await caller.transaction.insertTradeLog(record);
    if (record.payment_status === "paid") {
      const dateObj = new Date(record.created_at);
      if (isNaN(dateObj.getTime())) {
        return NextResponse.json(
          { error: "Invalid timestamp format" },
          { status: 400 },
        );
      }

      // Use Melbourne timezone (AEST)
      const userTimezone = "Australia/Melbourne";

      // Format date and time in AEST
      const date = dateObj.toLocaleDateString("en-US", {
        timeZone: userTimezone,
      });
      const time = dateObj.toLocaleTimeString("en-US", {
        timeZone: userTimezone,
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      const formatTime = (timeStr: string) => {
        if (!timeStr) return "";

        // Parse the time string and add 1 hour
        const [time, period] = timeStr.split(" ");
        if (!time || !period) return timeStr;

        const [hoursStr, minutesStr] = time.split(":");
        if (!hoursStr || !minutesStr) return timeStr;

        let hours = parseInt(hoursStr, 10);
        const minutes = parseInt(minutesStr, 10);

        if (isNaN(hours) || isNaN(minutes)) return timeStr;

        // Convert to 24-hour format for easier manipulation
        if (period === "PM" && hours !== 12) hours += 12;
        if (period === "AM" && hours === 12) hours = 0;

        // Add 1 hour
        hours = (hours + 1) % 24;

        // Convert back to 12-hour format
        const newPeriod = hours >= 12 ? "PM" : "AM";
        if (hours > 12) hours -= 12;
        if (hours === 0) hours = 12;

        return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")} ${newPeriod}`;
      };
      const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
          timeZone: userTimezone,
        });
      };
      await caller.email.sendEmail({
        email: record.customer_email,
        userName: record.customer_name,
        venueName: formatVenueName(record.venue_id),
        date: formatDate(date ?? ""),
        time: formatTime(time ?? ""),
      });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
