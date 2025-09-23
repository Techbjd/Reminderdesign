import { useContext } from "react";
import { ReminderContext } from "../context/ReminderContext";

export default function ReminderTimeline() {
  const { reminders, loading } = useContext(ReminderContext);

  if (loading) return <p>Loading timeline...</p>;
  if (reminders.length === 0) return <p>No events to show 🎉</p>;

  // Group reminders by date
  const grouped = reminders.reduce((acc, r) => {
    const dateKey = new Date(r.start_date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(r);
    return acc;
  }, {});

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Events Timeline</h2>
      <div className="space-y-8">
        {Object.keys(grouped).map((date) => (
          <div key={date} className="relative">
            {/* Date marker */}
            <div className="flex items-center mb-4">
              <div className="w-3 h-3 bg-indigo-600 rounded-full mr-3"></div>
              <h3 className="text-lg font-semibold text-gray-800">{date}</h3>
            </div>

            {/* Events of that date */}
            <div className="ml-6 space-y-3">
              {grouped[date].map((event) => (
                <div
                  key={event.id}
                  className="bg-gradient-to-r from-purple-100 to-purple-200 p-4 rounded-lg shadow-sm border-l-4 border-purple-500"
                >
                  <h4 className="font-semibold text-gray-800">{event.title}</h4>
                  {event.remarks && (
                    <p className="text-sm text-gray-600 mt-1">{event.remarks}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(event.start_date).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    {event.end_date &&
                      " → " +
                        new Date(event.end_date).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
