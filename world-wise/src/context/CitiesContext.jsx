import { createContext, useEffect, useContext, useReducer } from "react";

const BASE_URL = "http://localhost:9000";

const CitiesContext = createContext();

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };
    case "cities/loaded":
      return {
        ...state,
        isLoading: false,
        cities: action.payload,
      };
    case "city/loaded":
      return { ...state, isLoading: false, currentCity: action.payload };
    case "city/created":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };
    case "city/deleted":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
        currentCity: {},
      };
    case "rejected":
      return { ...state, isLoading: false, error: action.payload };
    default:
      throw new Error("Unknown action type");
  }
}

function CitiesProvider({ children }) {
  const [{ cities, isLoading, currentCity }, dispatch] = useReducer(
    reducer,
    initialState
  );

  // const [cities, setCities] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [currentCity, setCurrentCity] = useState({});

  useEffect(() => {
    async function fetchCities() {
      dispatch({ type: "loading" });
      try {
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        dispatch({ type: "cities/loaded", payload: data });
      } catch (error) {
        dispatch({ type: "rejected", payload: "Error loading data" });
      }
    }
    fetchCities();
  }, []);

  function getCity(id) {
    if (Number(id) === currentCity.id) return;
    async function fetchCities() {
      dispatch({ type: "loading" });
      try {
        const res = await fetch(`${BASE_URL}/cities/${id}`);
        const data = await res.json();
        dispatch({ type: "city/loaded", payload: data });
      } catch (error) {
        dispatch({ type: "rejected", payload: "There was an error" });
      }
    }
    fetchCities();
  }

  function createCity(newCity) {
    async function fetchCities() {
      dispatch({ type: "loading" });
      try {
        const res = await fetch(`${BASE_URL}/cities`, {
          method: "POST",
          body: JSON.stringify(newCity),
          headers: {
            "Content-Type": " application/json",
          },
        });
        const data = await res.json();
        dispatch({ type: "city/created", payload: data });
      } catch (error) {
        dispatch({ type: "rejected", payload: "There was an error" });
      }
    }
    fetchCities();
  }

  function deleteCity(id) {
    async function fetchCities() {
      dispatch({ type: "loading" });
      try {
        await fetch(`${BASE_URL}/cities/${id}`, {
          method: "DELETE",
        });

        dispatch({ type: "city/deleted", payload: id });
      } catch (error) {
        alert("There was an error deleting city");
      }
    }
    fetchCities();
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
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
