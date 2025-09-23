import React, { useState } from "react";
import CalendarGrid from "../components/CalendarGrid";
import MonthCard from "../../src/components/MonthCard";
import ErrorBoundary from "../components/ErrorBoundary";

const CalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 min-h-screen bg-gray-900 justify-center items-start">
      
      {/* Left Side - MonthCard */}
      <div className="w-full md:w-1/2 flex justify-center">
        <MonthCard selectedDate={selectedDate} />
      </div>

      {/* Right Side - Calendar Grid */}
      <div className="w-full md:w-1/2 flex justify-center">
        <CalendarGrid onDateSelect={(date) => setSelectedDate(date)} />
      </div>
    </div>
  );
};

export default CalendarPage;
