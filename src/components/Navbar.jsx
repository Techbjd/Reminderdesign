import React, { useState, useRef, useEffect, useContext } from "react";
import { Menu, Calendar, Bell, User, List, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { ReminderContext } from "../context/ReminderContext";
import dayjs from "dayjs";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activePopup, setActivePopup] = useState(null);
  const menuRef = useRef(); 
  const navigate = useNavigate();
  const { reminders, loading } = useContext(ReminderContext);
  const { user, logout, } = useContext(AuthContext);
  const toggleMenu = () => setMenuOpen(!menuOpen);
  const togglePopup = (item) => setActivePopup(activePopup === item ? null : item);
  const email=localStorage.getItem("email")
  const today = dayjs().format("YYYY-MM-DD");
  const todaysReminders = reminders.filter(
    (r) => r.start_date <= today && r.end_date >= today
  );

  const popupAnimation = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.25 },
  };

  // Close hamburger menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="w-full  flex justify-between items-center text-white px-4 py-3 shadow-lg relative">
      {/* Left Hamburger Menu */}
      <div className="flex items-center space-x-2 relative" ref={menuRef}>
        <Menu size={28} className="cursor-pointer" onClick={toggleMenu} />
        <span
          className="font-bold text-lg cursor-pointer"
          onClick={() => navigate("/")}
        >
          My App
        </span>

        {/* Hamburger Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="absolute top-0 left-0 w-64 h-screen bg-white text-black rounded-r-xl shadow-xl flex flex-col justify-between z-50 p-4"
            >
              <div className="flex flex-col gap-2">
                <Link to="/" className="hover:bg-blue-100 p-2 rounded flex items-center gap-2" onClick={() => setMenuOpen(false)}>
                  <List size={16} /> Dashboard
                </Link>
                <Link to="/events" className="hover:bg-blue-100 p-2 rounded flex items-center gap-2" onClick={() => setMenuOpen(false)}>
                  <Calendar size={16} /> Events
                </Link>
                <Link to="/calendar" className="hover:bg-blue-100 p-2 rounded flex items-center gap-2" onClick={() => setMenuOpen(false)}>
                  <Calendar size={16} /> Calendar
                </Link>
                <Link to="/eventspage" className="hover:bg-blue-100 p-2 rounded flex items-center gap-2" onClick={() => setMenuOpen(false)}>
                  <Bell size={16} /> Reminder Events
                </Link>
                <Link to="/timesheets" className="hover:bg-blue-100 p-2 rounded flex items-center gap-2" onClick={() => setMenuOpen(false)}>
                  <Bell size={16} /> TimeSheets
                </Link>
              </div>

              {/* User Info + Logout */}
              <div className="flex flex-col items-center justify-between p-4 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <User size={18} />
                  <span className="font-semibold">{email || "Guest"}</span>
                </div>
                <button onClick={logout} className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right icons: Event, Calendar, Reminder */}
      <ul className="flex items-center space-x-6">
        {/* Event Popup */}
        <li className="relative" onClick={() => togglePopup("event")}>
          <Calendar size={20} /> <span>Event</span>
          <AnimatePresence>
            {activePopup === "event" && (
              <motion.div {...popupAnimation} className="absolute top-full right-0 mt-2 w-64 bg-white text-black rounded-xl shadow-xl p-4 z-50">
                <p className="font-semibold">Today's Event: Team Meeting</p>
                <Link to="/eventspage" className="text-blue-600 hover:underline">View All Events</Link>
              </motion.div>
            )}
          </AnimatePresence>
        </li>

        {/* Calendar Popup */}
        <li className="relative" onClick={() => togglePopup("calendar")}>
          <Calendar size={20} /> <span>Calendar</span>
          <AnimatePresence>
            {activePopup === "calendar" && (
              <motion.div {...popupAnimation} className="absolute top-full right-0 mt-2 w-80 bg-white text-black rounded-xl shadow-xl p-4 z-50">
                <p className="font-semibold mb-2">{dayjs().format("dddd, MMM D, YYYY")}</p>
                {loading ? <p>Loading reminders...</p> : todaysReminders.length === 0 ? <p>No reminders today 🎉</p> :
                  <div className="space-y-2">{todaysReminders.map((r) => (
                    <motion.div key={r.id} className="bg-gradient-to-r from-green-50 to-green-100 p-3 rounded-lg shadow-md border-l-4 border-green-500">
                      <h3 className="font-semibold">{r.title}</h3>
                      <p className="text-sm text-gray-600">{r.remarks}</p>
                      <p className="text-xs text-gray-500 mt-1">{r.start_date} → {r.end_date}</p>
                    </motion.div>
                  ))}</div>}
              </motion.div>
            )}
          </AnimatePresence>
        </li>

        {/* Reminder Popup */}
        <li className="relative" onClick={() => togglePopup("reminder")}>
          <Bell size={20} /> <span>Reminder</span>
          <AnimatePresence>
            {activePopup === "reminder" && (
              <motion.div {...popupAnimation} className="absolute top-full right-0 mt-2 w-80 bg-white text-gray-800 rounded-xl shadow-xl p-4 z-50">
                {loading ? <p>Loading reminders...</p> : reminders.length === 0 ? <p>No reminders today 🎉</p> :
                  <div className="space-y-3">{reminders.map((r) => (
                    <motion.div key={r.id} className="bg-gradient-to-r from-blue-50 to-blue-100 p-3 rounded-lg shadow-md border-l-4 border-blue-500 cursor-pointer">
                      <h3 className="font-semibold">{r.title}</h3>
                      <p className="text-sm text-gray-600">{r.remarks}</p>
                      <p className="text-xs text-gray-500 mt-1">{r.start_date} → {r.end_date}</p>
                    </motion.div>
                  ))}</div>}
              </motion.div>
            )}
          </AnimatePresence>
        </li>
      </ul>
    </nav>
  );
}
