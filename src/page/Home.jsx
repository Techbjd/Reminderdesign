import React, { useContext } from "react";
import Dashboard from "../components/Dashboard";
import LoginForm from "../components/LoginForm";
import { AuthContext } from "../context/AuthContext";
import API from "../api/axios";
function Home() {
  const { user } = useContext(AuthContext);
    const res=API.get("./api/timesheets/attendencelogs")
console.log("res",res)
  return (
    <div className="relative z-10 w-full max-h-fit">
      {user ? <Dashboard /> : <LoginForm />}
    </div>
  );
}

export default Home;



