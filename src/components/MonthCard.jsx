import React from "react";

const months = [
  "JAN","FEB","MAR","APR","MAY","JUN",
  "JUL","AUG","SEP","OCT","NOV","DEC"
];

const MonthCard = ({ selectedDate }) => {
  if (!selectedDate) selectedDate = new Date();

  return (
    <div className="w-full md:w-64 bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-pink-500 px-6 py-4 text-white text-center text-2xl font-bold">
        {months[selectedDate.getMonth()]}
      </div>
      <div className="bg-gradient-to-b from-purple-800 to-purple-900 px-6 py-4 text-center">
        <div className="text-8xl font-bold text-pink-500">{selectedDate.getDate()}</div>
        <div className="text-white mt-2 font-semibold">{selectedDate.toDateString()}</div>
      </div>
    </div>
  );
};

export default MonthCard;
