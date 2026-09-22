import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { Toast, ToastContainer } from "react-bootstrap";

const STORAGE_KEY = "savedItemsComposite"; 
const SavedContext = createContext(null);

export function SavedProvider({ children }) {

    const parse = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? new Set(JSON.parse(raw)) : new Set();
    } catch {
      return new Set();
    }
  };

  const [savedSet, setSavedSet] = useState(() => parse());
  const [notification, setNotification] = useState(null);

  //cross tab
  useEffect(() => {
    const handler = (e) => {
      if (e.key === STORAGE_KEY) {
        setSavedSet(parse());
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const persist = (newSet) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...newSet]));
    } catch (error) {
      console.error("Unable to save bookmarks", error);
    }
  };

   const compositeKey = (type, id) => `${type}:${id}`;

   const isSaved = useCallback(
    (type, id) => savedSet.has(compositeKey(type, id)),
    [savedSet]
  );

  //change between save and unsave
  const toggle = useCallback((type, id) => {
    const key = compositeKey(type, id);
    const next = new Set(savedSet);
    const removing = next.has(key);

    if (removing) {
      next.delete(key);
    } else {
      next.add(key);
    }

    persist(next);
    setSavedSet(next);
    setNotification({
      message: removing ? "Removed from bookmarks." : "Saved to bookmarks.",
      variant: removing ? "secondary" : "success",
    });
  }, [savedSet]);

  //get id by type
  const getSavedIdsByType = useCallback(
    (type) => {
      const prefix = `${type}:`;
      return [...savedSet]
        .filter((s) => s.startsWith(prefix))
        .map((s) => s.slice(prefix.length));
    },
    [savedSet]
  );

  return (
    <SavedContext.Provider value={{ isSaved, toggle, getSavedIdsByType }}>
      {children}
      <ToastContainer
        position="bottom-end"
        className="p-3"
        style={{ position: "fixed", zIndex: 1100 }}
      >
        <Toast
          show={Boolean(notification)}
          onClose={() => setNotification(null)}
          delay={2500}
          autohide
          bg={notification?.variant}
          role="status"
          aria-live="polite"
        >
          <Toast.Header>
            <strong className="me-auto">Bookmarks</strong>
          </Toast.Header>
          <Toast.Body className="text-white">
            {notification?.message}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </SavedContext.Provider>
  );

}

export function useSavedComposite() {
  const ctx = useContext(SavedContext);
  if (!ctx) throw new Error("useSavedComposite must be inside SavedProvider");
  return ctx;
}

