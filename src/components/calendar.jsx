import React, { useState } from "react";

const months = [
  "JAN","FEB","MAR","APR","MAY","JUN",
  "JUL","AUG","SEP","OCT","NOV","DEC"
];

const daysOfWeek = ["M","T","W","Th","F","Sa","Su"];

const CalendarGrid = ({ onDateSelect }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const prevMonth = () =>
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () =>
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let day = 1; day <= daysInMonth; day++) days.push(day);
    return days;
  };

  const handleDateClick = (day) => {
    if (!day) return;
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(date);
    if (onDateSelect) onDateSelect(date);
  };

  const isSelected = (date) =>
    date.getDate() === selectedDate.getDate() &&
    date.getMonth() === selectedDate.getMonth() &&
    date.getFullYear() === selectedDate.getFullYear();

  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const calendarDays = generateCalendarDays();

  return (
    <div
      className="w-1/2 h-1/2 mx-auto flex flex-col 
                 bg-white border border-gray-300 rounded-xl shadow-lg p-6 
                 max-w-md sm:w-3/4 sm:h-auto"
    >
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={prevMonth}
          className="p-2 rounded-full hover:bg-gray-200 transition-colors"
        >
          ◀
        </button>
        <div className="text-gray-800 font-semibold text-lg">
          {months[currentDate.getMonth()]} {currentDate.getFullYear()}
        </div>
        <button
          onClick={nextMonth}
          className="p-2 rounded-full hover:bg-gray-200 transition-colors"
        >
          ▶
        </button>
      </div>

      {/* Days of week */}
      <div className="grid grid-cols-7 gap-1 mb-2 flex-grow">
        {daysOfWeek.map((day, index) => (
          <div
            key={index}
            className="text-gray-600 text-sm font-medium text-center py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar days */}
      <div className="grid grid-cols-7 gap-1 flex-grow">
        {calendarDays.map((day, index) => {
          if (!day) return <div key={`empty-${index}`} className="h-10"></div>;

          const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);

          return (
            <button
              key={day}
              onClick={() => handleDateClick(day)}
              className={`h-10 rounded-full text-center transition-all duration-200 relative ${
                isSelected(date)
                  ? "bg-pink-500 text-white font-bold scale-105"
                  : isToday(date)
                  ? "bg-purple-200 text-purple-900 font-medium"
                  : "text-gray-800 hover:bg-gray-100"
              }`}
            >
              {day}
              {isSelected(date) && (
                <div className="absolute inset-0 border-2 border-pink-500 rounded-full"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarGrid;
