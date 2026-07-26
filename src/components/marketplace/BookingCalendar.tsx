import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface BookingCalendarProps {
  bookedDates: { start: string; end: string }[];
  startDate: string;
  endDate: string;
  onChange: (start: string, end: string) => void;
}

export default function BookingCalendar({
  bookedDates,
  startDate,
  endDate,
  onChange,
}: BookingCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const generateDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const prev = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    
    // Prevent navigating to past months
    if (prev.getFullYear() < today.getFullYear() || 
        (prev.getFullYear() === today.getFullYear() && prev.getMonth() < today.getMonth())) {
      return;
    }
    setCurrentDate(prev);
  };

  const isDateBooked = (date: Date) => {
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    
    for (const b of bookedDates) {
      const bStart = new Date(b.start);
      bStart.setHours(0, 0, 0, 0);
      const bEnd = new Date(b.end);
      bEnd.setHours(0, 0, 0, 0);
      
      if (checkDate >= bStart && checkDate <= bEnd) {
        return true;
      }
    }
    return false;
  };

  const isPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const handleDateClick = (date: Date) => {
    if (isPastDate(date) || isDateBooked(date)) return;

    const dateStr = date.toISOString().split("T")[0];

    if (!startDate || (startDate && endDate)) {
      // Start a new selection
      onChange(dateStr, "");
    } else {
      // Complete the selection
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      const selected = new Date(date);
      selected.setHours(0, 0, 0, 0);

      if (selected < start) {
        // If selected is before start, make it the new start
        onChange(dateStr, "");
      } else {
        // Make sure there are no booked dates between start and selected
        let valid = true;
        for (let d = new Date(start); d <= selected; d.setDate(d.getDate() + 1)) {
          if (isDateBooked(d)) {
            valid = false;
            break;
          }
        }

        if (!valid) {
          alert("Your selection includes already booked dates. Please choose another range.");
          onChange(dateStr, ""); // Reset to just this date
        } else {
          onChange(startDate, dateStr);
        }
      }
    }
  };

  const isDateInRange = (date: Date) => {
    if (!startDate || !endDate) return false;
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    const s = new Date(startDate);
    s.setHours(0, 0, 0, 0);
    const e = new Date(endDate);
    e.setHours(0, 0, 0, 0);
    return checkDate >= s && checkDate <= e;
  };

  const isDateSelected = (date: Date, type: "start" | "end") => {
    const checkDate = date.toISOString().split("T")[0];
    return type === "start" ? checkDate === startDate : checkDate === endDate;
  };

  const days = generateDays();
  const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  return (
    <div className="w-full rounded-xl border border-outline-variant bg-surface-container-low p-4">
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={prevMonth}
          className="rounded-lg p-2 text-on-surface-variant hover:bg-surface-container-high transition"
          type="button"
        >
          <ChevronLeft size={18} />
        </button>
        <span className="font-bold text-label-lg text-on-surface">
          {months[currentDate.getMonth()]} {currentDate.getFullYear()}
        </span>
        <button
          onClick={nextMonth}
          className="rounded-lg p-2 text-on-surface-variant hover:bg-surface-container-high transition"
          type="button"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {weekDays.map((day) => (
          <div key={day} className="py-2 text-[10px] font-bold uppercase text-on-surface-variant">
            {day}
          </div>
        ))}

        {days.map((date, index) => {
          if (!date) {
            return <div key={`empty-${index}`} className="h-9 w-9" />;
          }

          const booked = isDateBooked(date);
          const past = isPastDate(date);
          const inRange = isDateInRange(date);
          const isStart = startDate && isDateSelected(date, "start");
          const isEnd = endDate && isDateSelected(date, "end");
          
          let className = "relative flex h-9 w-full items-center justify-center text-sm font-medium transition-all ";
          
          if (past) {
            className += "text-on-surface-variant/30 cursor-not-allowed";
          } else if (booked) {
            className += "bg-red-50 text-red-400 cursor-not-allowed line-through decoration-red-300";
          } else {
            className += "cursor-pointer hover:bg-primary/10 hover:text-primary ";
            if (isStart || isEnd) {
              className += "bg-primary text-white hover:bg-primary hover:text-white rounded-lg shadow-sm ";
            } else if (inRange) {
              className += "bg-primary/10 text-primary ";
            } else {
              className += "text-on-surface rounded-lg";
            }
          }

          return (
            <div key={index} className="relative w-full">
              {/* Highlight background for range connecting start/end */}
              {inRange && !isStart && !isEnd && !booked && (
                <div className="absolute inset-y-0 -left-1 -right-1 bg-primary/10 z-0"></div>
              )}
              {isStart && endDate && (
                 <div className="absolute inset-y-0 right-0 w-1/2 bg-primary/10 z-0"></div>
              )}
              {isEnd && startDate && startDate !== endDate && (
                 <div className="absolute inset-y-0 left-0 w-1/2 bg-primary/10 z-0"></div>
              )}
              
              <button
                type="button"
                disabled={past || booked}
                onClick={() => handleDateClick(date)}
                className={`relative z-10 w-9 h-9 mx-auto flex items-center justify-center rounded-lg ${className}`}
              >
                {date.getDate()}
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded bg-red-100 border border-red-200 line-through text-transparent text-[8px] flex items-center justify-center decoration-red-400">X</div>
          <span className="text-on-surface-variant font-medium">Booked</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded bg-primary shadow-sm"></div>
          <span className="text-on-surface-variant font-medium">Selected</span>
        </div>
      </div>
    </div>
  );
}
