import React, { useState, useMemo, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock } from 'lucide-react';

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const today = new Date();

  const calendarData = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Previous month days
    const prevMonth = new Date(year, month - 1, 0);
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({ day: prevMonth.getDate() - i, isCurrentMonth: false, date: new Date(year, month - 1, prevMonth.getDate() - i) });
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({ day, isCurrentMonth: true, date: new Date(year, month, day) });
    }

    // Next month days
    const remaining = 42 - days.length;
    for (let day = 1; day <= remaining; day++) {
      days.push({ day, isCurrentMonth: false, date: new Date(year, month + 1, day) });
    }

    return days;
  }, [currentDate]);

  const navigateMonth = (dir) => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + dir, 1));
  };

  const selectDate = (date) => {
    setSelectedDate(date);
    setCurrentDate(new Date(date.getFullYear(), date.getMonth(), 1));
  };

  const isToday = (date) => date.toDateString() === today.toDateString();
  const isSelected = (date) => date.toDateString() === selectedDate.toDateString();

  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-4 bg-gray-800 rounded-xl text-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <Calendar className="w-6 h-6" />
          <h1 className="text-xl font-bold">{months[currentDate.getMonth()]} {currentDate.getFullYear()}</h1>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5" />
          <span className="font-mono">{currentTime}</span>
        </div>
      </div>

      {/* Month Navigation */}
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => navigateMonth(-1)} className="px-3 py-1 bg-blue-600 rounded hover:bg-blue-500">Prev</button>
        <button onClick={() => selectDate(today)} className="px-3 py-1 bg-blue-600 rounded hover:bg-blue-500">Today</button>
        <button onClick={() => navigateMonth(1)} className="px-3 py-1 bg-blue-600 rounded hover:bg-blue-500">Next</button>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 text-center font-semibold mb-2">
        {weekdays.map(day => <div key={day}>{day}</div>)}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarData.map((d, i) => {
          const baseClass = d.isCurrentMonth ? 'bg-gray-700' : 'bg-gray-600 text-gray-400';
          const todayClass = isToday(d.date) ? 'bg-blue-600' : '';
          const selectedClass = isSelected(d.date) ? 'bg-green-600' : '';
          return (
            <button
              key={i}
              onClick={() => selectDate(d.date)}
              className={`p-2 rounded text-center ${baseClass} ${todayClass} ${selectedClass}`}
            >
              {d.day}
            </button>
          )
        })}
      </div>

      {/* Footer */}
      <div className="mt-4 text-center text-gray-300">
        Selected Date: <span className="text-white font-semibold">{selectedDate.toDateString()}</span>
      </div>
    </div>
  );
};

export default CalendarPage;
