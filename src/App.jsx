import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./page/Home";
import Eventpage from "./page/Eventpage";
import Dashboard from "./components/Dashboard";
import LoginForm from "./components/LoginForm";
import Eventsuser from "./components/Events";
import CalendarPage from "./components/calendar";
import { AuthProvider } from "../src/context/AuthProvider";
import { ReminderProvider } from "./context/ReminderProvider";
import ReminderPage from "./page/ReminderPage";
import PrivateRoute from "./components/PrivateRoute"; // <-- import it
import TimeSheets from "./page/TimeSheets";

function App() {
  return (
    <AuthProvider>
      <ReminderProvider>
        <Router>
          <Routes>
            <Route element={<Layout />}>
              {/* Public Route */}
              <Route path="/login" element={<LoginForm />} />

              {/* Protected Routes */}
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <Home />
                  </PrivateRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/calendar"
                element={
                  <PrivateRoute>
                    <CalendarPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/events"
                element={
                  <PrivateRoute>
                    <Eventsuser />
                  </PrivateRoute>
                }
              />
              <Route
                path="/timesheets"
                element={
                  <PrivateRoute>
                    <TimeSheets />
                  </PrivateRoute>
                }
                />
               


              <Route
                path="/eventspage"
                element={
                  <PrivateRoute>
                    <Eventpage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/reminders"
                element={
                  <PrivateRoute>
                    <ReminderPage />
                  </PrivateRoute>
                }
              />
            </Route>
          </Routes>
        </Router>
      </ReminderProvider>
    </AuthProvider>
  );
}

export default App;
