// Layout.jsx
import Navbar from "./Navbar";
import { Outlet, useLocation } from "react-router-dom";
import bg from "../assets/bg.jpg"; // adjust path if needed

export default function Layout() {
  const location = useLocation();

  // List of routes where Navbar should be hidden
  const hideNavbarRoutes = ["/login"];

  // Check if current route matches any hidden route
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <div className="relative min-h-screen w-full flex flex-col">
    
      <img
        src={bg}
        alt="background"
        className="absolute inset-0 w-full h-full object-cover -z-10"
      />
    
      <div className="absolute inset-0 bg-black/40 -z-10"></div>

    
      {!shouldHideNavbar && <Navbar />}

      <main className="flex-1 p-4 relative z-10">
        <Outlet /> 
      </main>
    </div>
  );
}
