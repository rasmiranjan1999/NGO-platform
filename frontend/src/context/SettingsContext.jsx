import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "../services/api";

const SettingsContext =
  createContext();

export const SettingsProvider = ({
  children,
}) => {
  const [settings, setSettings] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const fetchSettings = async () => {
    try {
      const response =
        await api.get("/settings");

      setSettings(
        response.data.data
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        loading,
        refreshSettings:
          fetchSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () =>
  useContext(SettingsContext);