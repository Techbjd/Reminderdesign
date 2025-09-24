import React, { useContext, useState } from "react";
import CalendarGrid from "./calendar";
import { motion, AnimatePresence } from "framer-motion";
import ReminderForm from "./ReminderForm";
import { ReminderContext } from "../context/ReminderContext";

export default function Eventsuser() {
  const { reminders, loading, deleteReminder, setReminders } = useContext(ReminderContext);
console.log(reminders)
  const [selectedDate, setSelectedDate] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [editing, setEditing] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);

  // Filter reminders for selected date
  const filteredReminders = selectedDate
    ? reminders.filter((r) => {
        const start = new Date(r.start_date);
        const end = new Date(r.end_date || r.start_date);
        const selected = new Date(selectedDate);
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        selected.setHours(12, 0, 0, 0);
        return selected >= start && selected <= end;
      })
    : reminders;

  const openDrawer = () => {
    setEditing(null);
    setDrawerOpen(true);
  };

  const closeDrawer = () => setDrawerOpen(false);

  const handleNotification = (msg) => {
    setDrawerOpen(false);
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="p-4 min-h-screen flex flex-col lg:flex-row gap-6">
      {/* Left Side: Calendar and Reminders List */}
      <div className="flex-1 flex flex-col gap-6">
        {/* Calendar Section */}
        <div className="rounded-xl flex flex-col w-full p-3 bg-slate-900/20">
          <h2 className="text-xl font-semibold text-white mb-4 text-center lg:text-left">
            Calendar
          </h2>
          <CalendarGrid
            events={reminders}
            onDateSelect={(date) => setSelectedDate(date)}
          />
        </div>

        {/* Filtered Reminders Section */}
        <div className="rounded-xl shadow p-4 flex flex-col bg-white">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Reminders</h2>
            <button
              onClick={openDrawer}
              className="bg-orange-400 hover:bg-orange-500 text-white font-semibold px-4 py-2 rounded-lg"
            >
              ADD Reminder
            </button>
          </div>

          {loading ? (
            <p className="text-center text-gray-500">Loading reminders...</p>
          ) : filteredReminders.length === 0 ? (
            <p className="text-center text-gray-500 italic">
              {selectedDate ? "No reminders for this day." : "No reminders yet."}
            </p>
          ) : (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.1 } },
              }}
              className="space-y-4"
            >
              <AnimatePresence>
                {filteredReminders.map((r) => (
                  <motion.div
                    key={r.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    whileHover={{
                      scale: 1.03,
                      boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
                    }}
                    transition={{ duration: 0.2 }}
                    className="relative bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl shadow-md border-l-4 border-green-500 flex justify-between"
                  >
                    <div>
                      <h3 className="font-semibold text-gray-800">{r.title}</h3>
                      {r.remarks && (
                        <p className="text-sm text-gray-600 mt-1">{r.remarks}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(r.start_date).toLocaleDateString()} →{" "}
                        {r.end_date
                          ? new Date(r.end_date).toLocaleDateString()
                          : "-"}
                      </p>
                    </div>

                    {/* Menu button */}
                    <div className="relative">
                      <button
                        className="text-gray-600 hover:text-gray-800 font-bold px-2"
                        onClick={() =>
                          setActiveMenu(activeMenu === r.id ? null : r.id)
                        }
                      >
                        ⋮
                      </button>

                      {activeMenu === r.id && (
                        <div className="absolute right-0 mt-2 w-36 bg-white rounded-xl shadow-xl border border-gray-100 z-10">
                          <button
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => {
                              setEditing(r);
                              setDrawerOpen(true);
                              setActiveMenu(null);
                            }}
                          >
                            <span>Edit</span>
                          </button>
                          <div className="h-px bg-gray-200"></div>
                          <button
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                            onClick={() => {
                              deleteReminder(r.id);
                              setActiveMenu(null);
                            }}
                          >
                            <span>Delete</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>

      {/* Right Drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 z-40"
              onClick={closeDrawer}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              className="fixed top-0 right-0 h-full w-full md:w-96 bg-white shadow-xl z-50 flex flex-col overflow-y-auto"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
            >
              <div className="p-6 flex justify-between items-center border-b border-gray-200">
                <h2 className="text-xl font-bold">
                  {editing ? "Edit Reminder" : "Add Reminder"}
                </h2>
                <button
                  className="text-gray-600 hover:text-gray-900 font-bold"
                  onClick={closeDrawer}
                >
                  ✖
                </button>
              </div>
              <div className="p-6 flex-1">
                <ReminderForm
                  editing={editing}
                  setEditing={setEditing}
                  onNotify={handleNotification}
                  setReminders={setReminders}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-12 right-5 bg-green-800 text-white px-4 py-2 rounded shadow-lg animate-slide-in z-50">
          {toastMessage}
          <button
            className="ml-2 font-bold"
            onClick={() => setToastMessage(null)}
          >
            ✖
          </button>
        </div>
      )}
    </div>
  );
}
