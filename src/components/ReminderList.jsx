import { useContext, useState } from "react";
import ReminderForm from "./ReminderForm";
import { ReminderContext } from "../context/ReminderContext";
import { Calendar1 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";


export default function ReminderList() {
  const { reminders, loading, deleteReminder } = useContext(ReminderContext);
  const [editing, setEditing] = useState(null);
   const [setToastMessage] = useState(null);
  const containerVariants = {
    hidden: {},
    visible: { 
      transition: { staggerChildren: 0.15 } 
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: -20, rotateY: -15 },
    visible: { opacity: 1, y: 0, rotateY: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: 20, rotateY: 15, transition: { duration: 0.3 } },
  };

  return (
    
    <div className="min-h-screen  flex flex-col items-center justify-start py-10 px-4 ">
      <motion.div 
        className="w-full max-w-full bg-white/30 shadow-2xl rounded-3xl p-6 "
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-2">
          <Calendar1 className="text-blue-600" size={28} /> Add yours Reminders
        </h2>

        {/* Reminder Form */}
        <motion.div 
          className="mb-8 w-full"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <ReminderForm editing={editing} setEditing={setEditing} onNotify={(message) => setToastMessage(message)} />
        </motion.div>

        {/* Reminder List */}
        {loading ? (
          <motion.p
            className="text-gray-100 text-center italic"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Loading reminders...
          </motion.p>
        ) : reminders.length === 0 ? (
          <motion.p
            className="text-gray-100 text-center italic"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            No reminders yet. Add one above!
          </motion.p>
        ) : (
          <motion.ul
            className="w-full grid grid-cols-1 md:grid-cols-2 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence>
              {reminders.map((r) => (
                <motion.li
                  key={r.id}
                  className="bg-gradient-to-r from-blue-50 to-blue-100 p-5 rounded-2xl shadow-lg cursor-pointer perspective-1000"
                  variants={cardVariants}
                  whileHover={{ scale: 1.05, rotateY: 5, boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}
                  exit="exit"
                >
                  <div className="flex flex-col justify-between h-full">
                    <div>
                      <h3 className="font-bold text-lg text-gray-800">{r.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{r.remarks}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {r.start_date} → {r.end_date}
                      </p>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <button
                        className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-lg shadow-sm transition"
                        onClick={() => setEditing(r)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg shadow-sm transition"
                        onClick={() => deleteReminder(r.id)}
                      >
                         Delete
                      </button>
                    </div>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        )}
      </motion.div>
    </div>
  );
}
