import React, { useContext, useState, useEffect } from 'react';
import { Clock, Calendar } from 'lucide-react';
import { ReminderContext } from "../context/ReminderContext";

const parseHour = (time) => {
  const hour = parseInt(time.split(":")[0], 10);
  return isNaN(hour) ? 9 : hour;
};

function assignLanes(events) {
  const lanes = [];
  const results = [];
  const sorted = [...events].sort((a, b) => {
    const aStart = parseHour(a.time.split(" - ")[0]);
    const bStart = parseHour(b.time.split(" - ")[0]);
    return aStart - bStart;
  });

  sorted.forEach((event) => {
    const startHour = parseHour(event.time.split(" - ")[0]);
  
    let placed = false;

    for (let laneIndex = 0; laneIndex < lanes.length; laneIndex++) {
      const lastInLane = lanes[laneIndex][lanes[laneIndex].length - 1];
      const lastEnd = parseHour(lastInLane.time.split(" - ")[1] || "17:00");

      if (startHour >= lastEnd) {
        lanes[laneIndex].push(event);
        results.push({ ...event, lane: laneIndex, totalLanes: null });
        placed = true;
        break;
      }
    }

    if (!placed) {
      lanes.push([event]);
      results.push({ ...event, lane: lanes.length - 1, totalLanes: null });
    }
  });

  return results.map((e) => ({ ...e, totalLanes: lanes.length }));
}

const Dashboard = () => {
  const { reminders } = useContext(ReminderContext);
  const [events, setEvents] = useState([]);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [hoverStates, setHoverStates] = useState({}); // Track hover per event

  useEffect(() => {
    const timer = setInterval(() => setCurrentDateTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (reminders && reminders.length > 0) {
      const mappedEvents = reminders.map((reminder, idx) => {
         let eventDate = new Date(reminder.start_date || new Date());
        if (typeof reminder.date === "string") eventDate = new Date(reminder.date);
        return {
          id: reminder.id || idx,
          title: reminder.title || "Untitled",
          date: eventDate,
          time: reminder.time || "09:00 - 10:00",
          category: reminder.category || "personal",
          participants: reminder.participants || [],
          color: reminder.color || "bg-blue-50",
          description: reminder.remarks || "anything"
        };
      });
      setEvents(mappedEvents);
    } else {
      setEvents([
        { id: 1, title: 'Daily Standup', date: new Date(), time: '10:00 - 11:00', category: 'work', participants: ['Team'], color: 'bg-red-50' },
        { id: 2, title: 'Doctor Checkup', date: new Date(), time: '14:00 - 15:00', category: 'personal', participants: ['Dr. Smith'], color: 'bg-green-50' }
      ]);
    }
  }, [reminders]);

  const getEventsForDay = (date) => assignLanes(
    events.filter(e => {
      const d = new Date(e.date);
      return d.getDate() === date.getDate() &&
             d.getMonth() === date.getMonth() &&
             d.getFullYear() === date.getFullYear();
    })
  );
  const isToday = (date) => {
    const t = new Date();
    return date.getDate() === t.getDate() &&
           date.getMonth() === t.getMonth() &&
           date.getFullYear() === t.getFullYear();
  };

  const renderEvent = (event) => {
    const [startTime, endTime] = event.time.split(" - ");
    const startHour = parseHour(startTime);
    const endHour = parseHour(endTime || startTime) || startHour + 1;
    const hourHeight = 48;
    const top = Math.max((startHour - 9) * hourHeight, 0);
    const height = Math.max((endHour - startHour) * hourHeight, 40);

    if (startHour < 9 || startHour > 17) return null;

    const isHovered = hoverStates[event.id];

    return (
      <div
        key={event.id}
        className={`absolute p-2  rounded-md ${event.color} border-l-4 cursor-pointer hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1  ${
          event.category === 'work' ? 'border-red-500' :
          event.category === 'personal' ? 'border-green-500' :
          event.category === 'celebration' ? 'border-blue-500' : 'border-yellow-500'
        }`}
        style={{ top: `${top}px`, height: `${height}px`, left: `${(event.lane * 100) / event.totalLanes}%`, width: `${100 / event.totalLanes}%` }}
        onMouseEnter={() => setHoverStates(prev => ({ ...prev, [event.id]: true }))}
        onMouseLeave={() => setHoverStates(prev => ({ ...prev, [event.id]: false }))}
      >
        <div className="font-medium   text-sm truncate text-gray-800">{event.title}</div>
        <div className="flex   items-center gap-1 text-xs text-gray-600 mt-1">
        </div>

        {isHovered && (
          <div className="absolute top-30 left-full ml-3 bg-white border border-gray-200 shadow-xl rounded-lg p-3 w-64">
            <div className="font-semibold text-gray-800 mb-2">{event.title}</div>
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-3"><Calendar size={14} /><span>{event.date.toLocaleDateString()}</span></div>
            <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
              <span className={`w-3 h-3 rounded-full ${
                event.category === 'work' ? 'bg-red-500' :
                event.category === 'personal' ? 'bg-green-500' :
                event.category === 'celebration' ? 'bg-blue-500' : 'bg-yellow-500'
              }`}></span>
              <span className="capitalize">{event.category}</span>
            </div>
            {event.participants?.length > 0 && (
              <div className="mt-2">
                <div className="text-xs text-gray-500 mb-1">Participants:</div>
                <div className="flex items-center gap-1 flex-wrap">
                  {event.participants.map((p, i) => (
                    <div key={i} className="flex items-center gap-1 text-xs">
                      <div className="w-6 h-6 rounded-full bg-gray-500 flex items-center justify-center text-white font-medium">{p.charAt(0).toUpperCase()}</div>
                      <span className="text-gray-700">{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {event.description && <div className="mt-2 pt-2 border-t border-gray-100 text-xs text-gray-600">{event.description}</div>}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto mb-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-600">Weekly Calendar View</p>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold text-gray-800">{currentDateTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
            <div className="text-sm text-gray-600">{currentDateTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="grid grid-cols-8">
          <div className="border-r border-gray-200 bg-gray-50">
            <div className="h-16 flex items-center justify-center border-b border-gray-200 font-medium text-gray-700">Time</div>
            {Array.from({ length: 9 }, (_, i) => (
              <div key={i} className="h-12 flex items-center justify-center border-b border-gray-100 text-sm text-gray-500">{String(9 + i).padStart(2,'0')}:00</div>
            ))}
          </div>

          {Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() + i);
            const dayEvents = getEventsForDay(date);
            const dayNumber = date.getDate();
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
            const monthName = date.toLocaleDateString('en-US', { month: 'short' });

            return (
              <div key={i} className="border-r border-gray-200 relative min-w-[140px]">
                <div className={`h-16 flex flex-col items-center justify-center border-b border-gray-200 ${isToday(date) ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'}`}>
                  <div className={`text-sm font-medium ${isToday(date) ? 'text-blue-700' : 'text-gray-700'}`}>{dayName}</div>
                  <div className={`text-xs flex items-center gap-1 ${isToday(date) ? 'text-blue-600' : 'text-gray-500'}`}>
                    <span>{monthName}</span>
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${isToday(date) ? 'bg-blue-600 text-white' : 'bg-transparent'}`}>{dayNumber}</span>
                  </div>
                </div>

                <div className="relative" style={{ height: '432px' }}>
                  {Array.from({ length: 9 }, (_, hourIndex) => (
                    <div key={hourIndex} className="absolute w-full border-b border-gray-100" style={{ top: `${hourIndex*48}px`, height:'48px'}}/>
                  ))}
                  {dayEvents.map(renderEvent)}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
