import Stripe from "stripe";
import { loadStripe } from "@stripe/stripe-js";

const stripeServer = new Stripe(process.env.STRIPE_SECRET_KEY!);
const stripeClient = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

interface CreateCheckoutSessionParams {
  venueName: string;
  venueId: string;
  price: number;
  customerData: {
    name: string;
    email: string;
    sex: string;
    receivePromo: boolean;
  };
}

export const stripeService = {
  createCheckoutSessionAndRedirect: async ({
    venueName,
    venueId,
    price,
    customerData,
  }: CreateCheckoutSessionParams) => {
    try {
      const session = await stripeServer.checkout.sessions.create({
        payment_method_types: ["card"],
        payment_intent_data: {
          description: `Queue Skip at ${venueName}`,
        },
        line_items: [
          {
            price_data: {
              currency: "aud",
              product_data: {
                name: `Queue Skip at ${venueName}`,
                description: "Skip the queue at the venue",
              },
              unit_amount: price * 100,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/trpc/stripe_success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/${venueId}`,
        customer_email: customerData.email,
        metadata: {
          venueName,
          venueId,
          customerName: customerData.name,
          customerSex: customerData.sex,
          receivePromo: customerData.receivePromo ? "true" : "false",
        },
      });

      const stripe = await stripeClient;
      await stripe?.redirectToCheckout({
        sessionId: session.id,
        mode: "payment",
        billingAddressCollection: "auto",
      });

      return { url: session.url, success: true };
    } catch (error) {
      console.error("Stripe error:", error);
      throw error;
    }
  },
};
