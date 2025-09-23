import React, { useState, useContext } from "react";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
export default function LoginForm() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "michael.chen1@example.com",
    password: "pass1234",
    role: "Staff",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("api/login/", formData);
      login(res.data, res.config.data);
        navigate("/", { replace: true });
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Login failed!");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4">
      {/* Centered container */}
      <motion.div
        className="w-full max-w-5xl flex flex-col md:flex-row justify-center items-stretch p-6 shadow-xl rounded-2xl bg-white/1 backdrop-blur-lg"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        {/* Left: Live JSON Preview */}
        <motion.div
          className="flex-1 text-green-400 font-mono text-sm md:text-lg p-4 rounded-lg overflow-auto flex items-center justify-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <pre>{JSON.stringify(formData, null, 2)}</pre>
        </motion.div>

        {/* Right: Login Form */}
        <motion.div
          className="flex-1 p-8 flex flex-col justify-center items-center"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7, ease: "easeOut" }}
        >
          <motion.h2
            className="text-3xl font-bold mb-8 text-center text-blue-600"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            Login
          </motion.h2>

          <motion.form
            onSubmit={handleSubmit}
            className="space-y-6 w-full max-w-sm"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
          >
            <motion.input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-blue-300 rounded-lg px-3 py-3 bg-blue-50 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            />

            <motion.input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-blue-300 rounded-lg px-3 py-3 bg-blue-50 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            />

            <motion.select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full border border-blue-300 rounded-lg px-3 py-3 bg-blue-50 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <option value="">Select role</option>
              <option value="Staff">Staff</option>
              <option value="Employee">Employee</option>
              <option value="Other">Other</option>
            </motion.select>

            <motion.button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold shadow-md hover:bg-blue-700 transition"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Login
            </motion.button>
          </motion.form>
        </motion.div>
      </motion.div>
    </div>
  );
}
