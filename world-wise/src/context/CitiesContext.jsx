import { createContext, useState, useEffect, useContext } from "react";

const BASE_URL = "http://localhost:9000";

const CitiesContext = createContext();

function CitiesProvider({ children }) {
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCity, setCurrentCity] = useState({});

  useEffect(() => {
    async function fetchCities() {
      try {
        setIsLoading(true);
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        setCities(data);
      } catch (error) {
        alert("Error loading data");
      } finally {
        setIsLoading(false);
      }
    }
    fetchCities();
  }, []);

  function getCity(id) {
    async function fetchCities() {
      try {
        setIsLoading(true);
        const res = await fetch(`${BASE_URL}/cities/${id}`);
        const data = await res.json();
        setCurrentCity(data);
      } catch (error) {
        alert("Error loading data");
      } finally {
        setIsLoading(false);
      }
    }
    fetchCities();
  }

  function createCity(newCity) {
    async function fetchCities() {
      try {
        setIsLoading(true);
        const res = await fetch(`${BASE_URL}/cities`, {
          method: "POST",
          body: JSON.stringify(newCity),
          headers: {
            "Content-Type": " application/json",
          },
        });
        const data = await res.json();
        setCities((cities) => [...cities, data]);
      } catch (error) {
        alert("There was an error deleting city");
      } finally {
        setIsLoading(false);
      }
    }
    fetchCities();
  }

  function deleteCity(id) {
    async function fetchCities() {
      try {
        setIsLoading(true);
        await fetch(`${BASE_URL}/cities/${id}`, {
          method: "DELETE",
        });

        setCities((cities) => cities.filter((city) => city.id !== id));
      } catch (error) {
        alert("There was an error deleting city");
      } finally {
        setIsLoading(false);
      }
    }
    fetchCities();
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        getCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error("CitiesContext was used outside the CitiesProvider");

  return context;
}

export { CitiesProvider, useCities };
