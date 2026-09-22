import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

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
    setSavedSet((prev) => {
      const key = compositeKey(type, id);
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
        window.alert("Remove From Save Successfully!");
      } else {
        next.add(key);
        window.alert("Saved Successfully!");
      }
      persist(next);
      return next;
    });
  }, []);

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
    </SavedContext.Provider>
  );

}

export function useSavedComposite() {
  const ctx = useContext(SavedContext);
  if (!ctx) throw new Error("useSavedComposite must be inside SavedProvider");
  return ctx;
}

