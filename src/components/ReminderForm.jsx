import { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import API from "../api/axios";
import { ReminderContext } from "../context/ReminderContext";
import { Link } from "react-router-dom";
export default function ReminderForm({ editing, setEditing,onNotify }) {
  const { setReminders } = useContext(ReminderContext);

  const [profile, setProfile] = useState(23);
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
    const payload = {
      profile: parseInt(profile, 10),
      title,
      start_date: startDate,
      end_date: endDate,
      remarks,
    };

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

      // reset form
      setProfile("");
      setTitle("");
      setRemarks("");
      setStartDate("");
      setEndDate("");
    } catch (err) {
      
      console.error("Failed to save reminder:", err.response?.data || err.message);
      if(onNotify) onNotify("Failed to save reminder")
    }
  };

  return (
    
    <motion.div
      className="max-w-lg w-full mx-auto"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
       
      <motion.form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 p-6 rounded-2xl shadow-xl bg-white text-gray-900"
        whileHover={{ scale: 1.01 }}
      >
       
        <h2 className="text-2xl font-semibold mb-2 text-center">
          {editing ? "✏️ Edit Reminder" : "📝 Create Reminder"}
        </h2>

        {/* Profile */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Profile ID
          </label>
          <motion.input
            type="number"
            placeholder="Enter Profile ID"
            className="w-full border rounded-lg p-2 bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
            value={profile}
            onChange={(e) => setProfile(e.target.value)}
            required
            whileFocus={{ scale: 1.02 }}
          />
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Title
          </label>
          <motion.input
            type="text"
            placeholder="Reminder Title"
            className="w-full border rounded-lg p-2 bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            whileFocus={{ scale: 1.02 }}
          />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Start Date
            </label>
            <motion.input
              type="date"
              className="w-full border rounded-lg p-2 bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              whileFocus={{ scale: 1.02 }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              End Date
            </label>
            <motion.input
              type="date"
              className="w-full border rounded-lg p-2 bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
              whileFocus={{ scale: 1.02 }}
            />
          </div>
        </div>

        {/* Remarks */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Remarks
          </label>
          <motion.textarea
            placeholder="Additional notes..."
            className="w-full border rounded-lg p-2 bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            required
            rows={3}
            whileFocus={{ scale: 1.02 }}
          />
        </div>

        {/* Submit */}
        <motion.button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition w-full"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {editing ? "Update Reminder" : "Create Reminder"}
        </motion.button>

       
      </motion.form>
    </motion.div>
  );
}
