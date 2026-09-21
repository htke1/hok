'use client';

import React, { useState, useEffect } from 'react';
import { DayPicker, DateRange } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { isWithinInterval, startOfDay, isBefore } from 'date-fns';

interface DateRangePickerProps {
  bookedDates: { from: string; to: string }[];
  onRangeChange: (range: DateRange | undefined) => void;
}

export function DateRangePicker({ bookedDates, onRangeChange }: DateRangePickerProps) {
  const [range, setRange] = useState<DateRange | undefined>(undefined);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSelect = (selectedRange: DateRange | undefined) => {
    setRange(selectedRange);
    onRangeChange(selectedRange);
  };

  const disabledDates = (date: Date) => {
    const today = startOfDay(new Date());
    if (isBefore(date, today)) return true;

    for (const bDate of bookedDates) {
      const from = startOfDay(new Date(bDate.from));
      const to = startOfDay(new Date(bDate.to));
      if (isWithinInterval(date, { start: from, end: to })) {
        return true;
      }
    }
    return false;
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-sandstone">
      <style>{`
        .rdp {
          --rdp-color-selected: #B85C38;
          --rdp-color-selected-hover: #5C3D2E;
          --rdp-background-selected: #F5EDE3;
        }
        .rdp-day_selected, .rdp-day_selected:focus-visible, .rdp-day_selected:hover {
          color: white;
          background-color: #B85C38;
        }
        .rdp-day_selected:hover {
          background-color: #a04e2d;
        }
        .rdp-day:hover:not(.rdp-day_outside) {
          background-color: #F5EDE3;
        }
        .rdp-button:hover:not([disabled]):not(.rdp-day_selected) {
          background-color: #F5EDE3;
        }
      `}</style>
      <DayPicker
        mode="range"
        selected={range}
        onSelect={handleSelect}
        numberOfMonths={isMobile ? 1 : 2}
        disabled={disabledDates}
        className="mx-auto"
      />
    </div>
  );
}
