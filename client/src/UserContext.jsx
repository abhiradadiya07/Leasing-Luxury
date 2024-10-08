/* eslint-disable react/prop-types */
import { createContext, useState, useEffect } from "react";
import axiosInstance from "./api/api";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(async () => {
    if (!user) {
      await axiosInstance.get('/profile', { withCredentials: true })
        .then(({ data }) => {
          setUser(data);
          setReady(true);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading, ready }}>
      {children}
    </UserContext.Provider>
  );
}
