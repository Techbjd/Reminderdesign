import { useState } from "react";

const CalendarGrid = ({ events, onDateSelect }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateLocal, setSelectedDateLocal] = useState(null);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = new Date();

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Previous month
    const prevMonth = new Date(year, month - 1, 0);
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        day: prevMonth.getDate() - i,
        isCurrentMonth: false,
        date: new Date(year, month - 1, prevMonth.getDate() - i)
      });
    }

    // Current month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({ day, isCurrentMonth: true, date: new Date(year, month, day) });
    }

    // Next month
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      days.push({ day, isCurrentMonth: false, date: new Date(year, month + 1, day) });
    }

    return days;
  };

  const navigateMonth = (dir) => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + dir, 1));
  };

  const selectDate = (date) => {
    setSelectedDateLocal(date);
    onDateSelect(date);
  };

  const hasEvents = (date) => events.some(e => {
    const eventDate = new Date(e.start_date);
    return eventDate.toDateString() === date.toDateString();
  });

  const days = getDaysInMonth();

  return (
    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-white p-6">
        <div className="flex items-center justify-between text-white">
          <button onClick={() => navigateMonth(-1)} className="p-2 rounded-full hover:bg-white/20">
            &lt;
          </button>
          <h2 className="text-2xl font-bold">{months[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
          <button onClick={() => navigateMonth(1)} className="p-2 rounded-full hover:bg-white/20">
            &gt;
          </button>
        </div>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 bg-gray-50 border-b">
        {weekdays.map(d => (
          <div key={d} className="p-3 text-center text-sm font-semibold text-gray-600">{d}</div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7">
        {days.map((dayData, idx) => {
          const isToday = dayData.date.toDateString() === today.toDateString();
          const isSelected = selectedDateLocal && dayData.date.toDateString() === selectedDateLocal.toDateString();
          return (
            <button
              key={idx}
              onClick={() => selectDate(dayData.date)}
              className={`
                relative p-4 h-16 border-r border-b border-gray-100 transition-all duration-200
                ${dayData.isCurrentMonth ? 'hover:bg-purple-50' : 'text-gray-300 hover:bg-gray-50'}
                ${isToday ? 'bg-gradient-to-br from-purple-100 to-indigo-100' : ''}
                ${isSelected ? 'bg-gradient-to-br from-purple-200 to-indigo-200' : ''}
              `}
            >
              <span className={`text-sm font-medium ${isToday ? 'text-purple-700' : dayData.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}`}>{dayData.day}</span>
              {hasEvents(dayData.date) && <div className="absolute bottom-1 right-1 w-2 h-2 bg-purple-500 rounded-full"></div>}
            </button>
          );
        })}
      </div>
    </div>
  );
};
export default CalendarGrid;