import { useEffect, useReducer } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import { tripsReducer, loadTrips, saveTrips } from './lib/trips';
import Trips from './pages/Trips';
import Trip from './pages/Trip';
import Rates from './pages/Rates';
import NotFound from './pages/NotFound';
import './App.css';

export default function App() {
  const [trips, dispatch] = useReducer(tripsReducer, undefined, loadTrips);

  useEffect(() => {
    saveTrips(trips);
  }, [trips]);

  return (
    <>
      <header className="header">
        <NavLink to="/" end>Мои поездки</NavLink>
        <NavLink to="/rates">Курсы</NavLink>
      </header>
      <main className="page">
        <Routes>
          <Route path="/" element={<Trips trips={trips} dispatch={dispatch} />} />
          <Route path="/trip/:id" element={<Trip trips={trips} dispatch={dispatch} />} />
          <Route path="/rates" element={<Rates />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  );
}