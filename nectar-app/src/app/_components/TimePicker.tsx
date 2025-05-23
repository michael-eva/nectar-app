// components/ui/time-picker.tsx
'use client'

import * as React from 'react'
import { Clock } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface TimePickerProps {
    id?: string
    value: string
    onChange: (value: string) => void
    disabled?: boolean
    className?: string
}

export function TimePicker({
    id,
    value,
    onChange,
    disabled = false,
    className,
}: TimePickerProps) {
    const [isOpen, setIsOpen] = React.useState(false)
    const dropdownRef = React.useRef<HTMLDivElement>(null)

    // Close dropdown when clicking outside
    React.useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Quick time selection buttons
    const timeOptions = [
        { label: '12:00 AM', value: '00:00' },
        { label: '1:00 AM', value: '01:00' },
        { label: '2:00 AM', value: '02:00' },
        { label: '3:00 AM', value: '03:00' },
        { label: '4:00 AM', value: '04:00' },
        { label: '5:00 AM', value: '05:00' },
        { label: '6:00 AM', value: '06:00' },
        { label: '7:00 AM', value: '07:00' },
        { label: '8:00 AM', value: '08:00' },
        { label: '9:00 AM', value: '09:00' },
        { label: '10:00 AM', value: '10:00' },
        { label: '11:00 AM', value: '11:00' },
        { label: '12:00 PM', value: '12:00' },
        { label: '1:00 PM', value: '13:00' },
        { label: '2:00 PM', value: '14:00' },
        { label: '3:00 PM', value: '15:00' },
        { label: '4:00 PM', value: '16:00' },
        { label: '5:00 PM', value: '17:00' },
        { label: '6:00 PM', value: '18:00' },
        { label: '7:00 PM', value: '19:00' },
        { label: '8:00 PM', value: '20:00' },
        { label: '9:00 PM', value: '21:00' },
        { label: '10:00 PM', value: '22:00' },
        { label: '11:00 PM', value: '23:00' },
    ]

    // Format the time for display
    const formatTimeForDisplay = (timeString: string) => {
        const [h, m] = timeString.split(':').map(Number)
        const period = h && h >= 12 ? 'PM' : 'AM'
        const displayHour = (h && h % 12) ?? 12
        return `${displayHour}:${m?.toString().padStart(2, '0')} ${period}`
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <Button
                id={id}
                variant="outline"
                className={cn(
                    "w-full justify-start text-left font-normal",
                    !value && "text-muted-foreground",
                    className
                )}
                disabled={disabled}
                onClick={() => setIsOpen(!isOpen)}
            >
                <Clock className="mr-2 h-4 w-4" />
                {value ? formatTimeForDisplay(value) : "Select time"}
            </Button>
            {isOpen && (
                <div className="absolute top-full left-0 w-full mt-1 bg-white border rounded-md shadow-lg z-50 overflow-hidden">
                    <div className="max-h-[300px] overflow-y-auto p-2">
                        <div className="grid grid-cols-2 gap-2">
                            {timeOptions.map((option) => (
                                <Button
                                    key={option.value}
                                    variant={value === option.value ? "default" : "outline"}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        console.log('TimePicker option clicked:', option.value);
                                        onChange(option.value);
                                        setIsOpen(false);
                                    }}
                                    type="button"
                                    className={cn(
                                        "text-xs transition-colors",
                                        value === option.value && "bg-primary text-primary-foreground hover:bg-primary/90"
                                    )}
                                >
                                    {option.label}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}