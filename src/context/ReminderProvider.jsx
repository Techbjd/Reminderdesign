import { useState, useEffect } from "react";
import API from "../api/axios";
import dayjs from "dayjs";
import { ReminderContext } from "./ReminderContext";

export const ReminderProvider = ({ children }) => {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch reminders on mount
  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const res = await API.get("api/policies/reminder/");
        setReminders(res.data.data);
      } catch (err) {
        console.error("Failed to fetch reminders:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchReminders();
  }, []);

  // Delete reminder and update context
  const deleteReminder = async (id) => {
    try {
      await API.delete(`api/policies/reminder/${id}/`);
      setReminders((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error("Failed to delete reminder:", err.response?.data || err.message);
    }
  };

  // Automatically remove expired reminders every 10 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      const expired = reminders.filter((r) =>
        dayjs(r.end_date).isBefore(dayjs(), "day")
      );
      expired.forEach((r) => deleteReminder(r.id));
    }, 600000); 

    return () => clearInterval(interval);
  }, [reminders]);

  return (
    <ReminderContext.Provider value={{ reminders, loading, deleteReminder, setReminders }}>
      {children}
    </ReminderContext.Provider>
  );
};
