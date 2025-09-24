import { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import API from "../api/axios";
import { ReminderContext } from "../context/ReminderContext";

export default function ReminderForm({ editing, setEditing, onNotify }) {
  const { setReminders } = useContext(ReminderContext);

  const [profile, setProfile] = useState("");
  const [title, setTitle] = useState("");
  const [remarks, setRemarks] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    if (editing) {
      setProfile(editing.profile);
      setTitle(editing.title);
      setRemarks(editing.remarks);
      setStartDate(editing.start_date);
      setEndDate(editing.end_date);
    }
  }, [editing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { profile: parseInt(profile), title, start_date: startDate, end_date: endDate, remarks };
    try {
      if (editing) {
        await API.put(`api/policies/reminder/${editing.id}/`, payload);
        setEditing(null);
        if (onNotify) onNotify("✅ Reminder updated successfully!");
      } else {
        const res = await API.post("api/policies/reminder/", payload);
        setReminders((prev) => [...prev, res.data]);
        if (onNotify) onNotify("✅ Reminder added successfully!");
      }

      // Reset form
      setProfile("");
      setTitle("");
      setRemarks("");
      setStartDate("");
      setEndDate("");
    } catch (err) {
      console.error("Failed to save reminder:", err.response?.data || err.message);
      if (onNotify) onNotify("❌ Failed to save reminder");
    }
  };

  return (
    <motion.div
      className="max-w-lg w-full mx-auto p-6 bg-white rounded-2xl shadow-xl"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.h2
        className="text-2xl font-bold text-center mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {editing ? "✏️ Edit Reminder" : "📝 Create Reminder"}
      </motion.h2>

      <motion.form onSubmit={handleSubmit} className="flex flex-col gap-5">

        {/* Profile & Title */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-600 font-medium mb-1">Profile ID</label>
            <motion.input
              type="number"
              value={profile}
              onChange={(e) => setProfile(e.target.value)}
              placeholder="Enter Profile ID"
              className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
              whileFocus={{ scale: 1.02 }}
              required
            />
          </div>
          <div>
            <label className="block text-gray-600 font-medium mb-1">Title</label>
            <motion.input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Reminder Title"
              className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
              whileFocus={{ scale: 1.02 }}
              required
            />
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-600 font-medium mb-1">Start Date</label>
            <motion.input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
              whileFocus={{ scale: 1.02 }}
              required
            />
          </div>
          <div>
            <label className="block text-gray-600 font-medium mb-1">End Date</label>
            <motion.input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
              whileFocus={{ scale: 1.02 }}
              required
            />
          </div>
        </div>

        {/* Remarks */}
        <div>
          <label className="block text-gray-600 font-medium mb-1">Remarks</label>
          <motion.textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Additional notes..."
            rows={4}
            className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            whileFocus={{ scale: 1.02 }}
            required
          />
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {editing ? "Update Reminder" : "Create Reminder"}
        </motion.button>
      </motion.form>
    </motion.div>
  );
}
