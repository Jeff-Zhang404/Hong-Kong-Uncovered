import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

const DataContext = createContext(null);

export function DataProvider({ children }){

    const [tourists, setTourists] = useState([]);
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [requestKey, setRequestKey] = useState(0);

    useEffect(() => {
        const controller = new AbortController();
        const base = import.meta.env.BASE_URL;
        setLoading(true);
        setError(null);

        const loadJson = async (path, label) => {
          const response = await fetch(`${base}${path}`, { signal: controller.signal });
          if (!response.ok) {
            throw new Error(`${label} data returned HTTP ${response.status}.`);
          }

          const data = await response.json();
          if (!Array.isArray(data)) {
            throw new Error(`${label} data has an invalid format.`);
          }
          return data;
        };

        Promise.all([
          loadJson("data/TouristPageData.json", "Attractions"),
          loadJson("data/FoodPageData.json", "Food"),
        ])
          .then(([touristData, foodData]) => {
            setTourists(touristData);
            setFoods(foodData);
          })
          .catch((loadError) => {
            if (loadError.name !== "AbortError") {
              console.error("Data loading failed", loadError);
              setError(loadError);
            }
          })
          .finally(() => {
            if (!controller.signal.aborted) setLoading(false);
          });

        return () => controller.abort();
    }, [requestKey]);

    const retry = useCallback(() => {
      setRequestKey((current) => current + 1);
    }, []);

    return(
        <DataContext.Provider value={{ tourists, foods, loading, error, retry }}>
            {children}
        </DataContext.Provider>
    )
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be inside DataProvider");
  return ctx;
}
