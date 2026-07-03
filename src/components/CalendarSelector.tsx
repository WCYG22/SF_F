import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar as CalendarIcon, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, parseISO, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, addMonths, subMonths, isToday, isBefore, startOfToday } from 'date-fns';
import { cn } from '../lib/utils';

interface CalendarSelectorProps {
  label: string;
  value: string;
  onChange: (date: string) => void;
  originCode?: string;
  destCode?: string;
  searchResults?: any[]; // Actual search results with real prices
}

// Unused price extraction - calendar just shows dates now
// Prices come from actual search results, not predictions

export function CalendarSelector({ label, value, onChange, originCode, destCode, searchResults }: CalendarSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(() => {
    if (value) {
      try {
        return parseISO(value);
      } catch (e) {
        return new Date();
      }
    }
    return new Date();
  });
  
  const selectedDate = value ? parseISO(value) : null;
  const today = startOfToday();

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentMonth)),
    end: endOfWeek(endOfMonth(currentMonth)),
  });

  const handleDateSelect = (date: Date) => {
    if (isBefore(date, today)) return;
    onChange(format(date, 'yyyy-MM-dd'));
    setIsOpen(false);
  };

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  return (
    <div className="relative">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white/3 border border-white/5 rounded-lg py-3 pl-10 pr-8 cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent/50 hover:border-accent/30 transition-all group relative"
      >
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-hover:text-accent transition-colors">
          <CalendarIcon className="w-4 h-4" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-white/70 uppercase font-bold tracking-widest leading-none mb-1">{label}</span>
          <span className={cn("text-sm font-semibold mono truncate", !value && "text-white/50")}>
            {selectedDate ? format(selectedDate, 'PPP') : 'Select Date'}
          </span>
        </div>
        <ChevronDown className={cn("absolute right-4 top-1/2 -translate-y-1/2 text-muted transition-transform w-4 h-4", isOpen && "rotate-180")} />
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)} 
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute top-full left-0 right-0 mt-2 bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden p-4 min-w-[300px]"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold mono text-white">
                  {format(currentMonth, 'MMMM yyyy')}
                </h3>
                <div className="flex gap-1">
                  <button 
                    type="button"
                    onClick={(e) => { e.stopPropagation(); prevMonth(); }}
                    className="p-1 hover:bg-white/10 rounded-lg text-muted hover:text-white transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button 
                    type="button"
                    onClick={(e) => { e.stopPropagation(); nextMonth(); }}
                    className="p-1 hover:bg-white/10 rounded-lg text-muted hover:text-white transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1 mb-2">
                {weekDays.map(day => (
                  <div key={day} className="text-center text-[10px] font-bold text-muted uppercase py-1">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-2">
                {days.map((day, i) => {
                  const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
                  const isSelected = selectedDate && isSameDay(day, selectedDate);
                  const isPast = isBefore(day, today);
                  const isTodayDate = isToday(day);

                  return (
                    <button
                      key={i}
                      type="button"
                      disabled={isPast}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDateSelect(day);
                      }}
                      className={cn(
                        "p-2 rounded-lg text-sm font-bold transition-all relative flex flex-col items-center justify-center border h-14",
                        !isCurrentMonth && "opacity-20",
                        isSelected ? "bg-accent text-white shadow-lg shadow-accent/20 border-accent" : "hover:bg-white/10 text-white border-transparent hover:border-accent/30",
                        isPast && "opacity-10 cursor-not-allowed grayscale",
                        isTodayDate && !isSelected && "border border-accent/30 text-accent"
                      )}
                    >
                      {format(day, 'd')}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
