import { useState } from "react";
import { AuthContext } from "./AuthContext";


export const AuthProvider = ({ children }) => {
  // Initialize user from localStorage
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token")
     const organization=localStorage.getItem("organization")
    if (token  && organization  ) {
      return {
        token,organization
  
      };
    }
    return null;
  });
  const login = (data,user) => {

        const users = JSON.parse(user);
    // Save access token (not refresh) 
    localStorage.setItem("email",users.email)

    localStorage.setItem("role",users.role)
    localStorage.setItem("token", data.access);
     const orgKey = data.organization[0].api_key ;
  if (orgKey) {
    localStorage.setItem("organization", orgKey);
  }
    setUser({
      token: data.access,
      organization:orgKey,
      role:users.role,
      email:users.email,
    });
  
  };
  const logout = () => {
    localStorage.removeItem("email");
   localStorage.removeItem("role")
    localStorage.removeItem("token");
   localStorage.removeItem("organization")
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
