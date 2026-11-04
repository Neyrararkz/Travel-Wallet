import { useState } from 'react';
import { Link } from 'react-router-dom';
import { COUNTRIES, countryByCode } from '../data/countries';
import { formatKzt } from '../lib/money';
import { tripSummary } from '../lib/trips';
import { todayLocal } from '../lib/date';

export default function Trips({ trips, dispatch }) {
  const [code, setCode] = useState('TR');
  const [budget, setBudget] = useState('');
  const [startDate, setStartDate] = useState(todayLocal());
  const [endDate, setEndDate] = useState(todayLocal());
  const [formError, setFormError] = useState('');
  const [confirmId, setConfirmId] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();
    if (!(Number(budget) > 0)) return setFormError('Укажите бюджет больше нуля');
    if (endDate < startDate) return setFormError('Дата конца раньше даты начала');
    setFormError('');
    dispatch({
      type: 'ADD_TRIP',
      trip: { id: crypto.randomUUID(), code, budget: Number(budget), startDate, endDate, expenses: [] },
    });
    setBudget('');
  }

  return (
    <>
      <h1>Мои поездки</h1>

      <form className="form" onSubmit={handleSubmit}>
        <label>Страна
          <select value={code} onChange={(e) => setCode(e.target.value)}>
            {COUNTRIES.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
          </select>
        </label>
        <label>Бюджет, ₸
          <input type="number" min="1" value={budget} onChange={(e) => setBudget(e.target.value)} />
        </label>
        <label>С
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </label>
        <label>По
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </label>
        <button type="submit">Создать поездку</button>
        {formError && <p className="error full">{formError}</p>}
      </form>

      {trips.length === 0 && <p className="hint">Поездок пока нет. Создайте первую.</p>}

      <ul className="list">
        {trips.map((t) => {
          const country = countryByCode(t.code);
          const s = tripSummary(t);
          return (
            <li key={t.id} className="card trip-card">
              <Link to={`/trip/${t.id}`} className="trip-link">
                <img src={`https://flagcdn.com/w80/${t.code.toLowerCase()}.png`} alt={country?.name} width="48" />
                <div>
                  <b>{country?.name}</b>
                  <div className="muted">{t.startDate} — {t.endDate}</div>
                  <div>Бюджет {formatKzt(t.budget)} · потрачено {formatKzt(s.spent)}</div>
                </div>
              </Link>
              {confirmId === t.id ? (
                <div className="confirm">
                  Удалить поездку и все расходы?
                  <button className="danger" onClick={() => dispatch({ type: 'DELETE_TRIP', tripId: t.id })}>Да</button>
                  <button className="ghost" onClick={() => setConfirmId(null)}>Нет</button>
                </div>
              ) : (
                <button className="ghost" onClick={() => setConfirmId(t.id)}>Удалить</button>
              )}
            </li>
          );
        })}
      </ul>
    </>
  );
}