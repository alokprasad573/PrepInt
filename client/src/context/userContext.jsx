import { createContext, useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import { getCookie } from "../utils/helper";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(() => {
    const accessToken = getCookie("token") || localStorage.getItem("token");
    return Boolean(accessToken);
  });

  const updateUser = (userData) => {
    setUser(userData);
  };

  const clearUser = () => {
    setUser(null);
    document.cookie =
      "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
    localStorage.removeItem("token");
    setLoading(false);
  };

  useEffect(() => {
    if (user) return;

    const accessToken = getCookie("token") || localStorage.getItem("token");
    if (!accessToken) return;

    let isMounted = true;

    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
        if (isMounted) {
          setUser(response.data);
        }
      } catch (error) {
        console.error("User not authenticated", error);
        if (isMounted) {
          clearUser();
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchUser();

    return () => {
      isMounted = false;
    };
  }, [user]);

  return (
    <UserContext.Provider value={{ user, loading, updateUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
