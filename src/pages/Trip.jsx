import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CATEGORIES, CURRENCIES, countryByCode } from '../data/countries';
import { getRates, rateKeyFor } from '../api/rates';
import { convertToKzt, formatKzt } from '../lib/money';
import { tripSummary } from '../lib/trips';
import { todayLocal } from '../lib/date';

export default function Trip({ trips, dispatch }) {
  const { id } = useParams();
  const trip = trips.find((t) => t.id === id);
  const country = trip ? countryByCode(trip.code) : null;

  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState(country?.currency ?? 'usd');
  const [category, setCategory] = useState('food');
  const [date, setDate] = useState(todayLocal());
  const [comment, setComment] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  if (!trip) {
    return (
      <div className="center">
        <p>Поездка не найдена.</p>
        <Link to="/">К поездкам</Link>
      </div>
    );
  }

  const { spent, left, percent } = tripSummary(trip);
  const over = left < 0;
  const expenses = [...trip.expenses].sort((a, b) => b.date.localeCompare(a.date));

  async function handleSubmit(e) {
    e.preventDefault();
    if (!(Number(amount) > 0)) return setError('Сумма должна быть больше нуля');
    setError('');
    setSaving(true);
    try {
      const rates = currency === 'kzt' ? {} : await getRates(rateKeyFor(date));
      const amountKzt = convertToKzt(Number(amount), currency, rates);
      if (amountKzt === null) throw new Error('Нет курса для этой валюты на выбранную дату');
      dispatch({
        type: 'ADD_EXPENSE',
        tripId: trip.id,
        expense: { id: crypto.randomUUID(), amount: Number(amount), currency, category, date, comment, amountKzt },
      });
      setAmount('');
      setComment('');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Link to="/">← Все поездки</Link>
      <h1>
        <img src={`https://flagcdn.com/w80/${trip.code.toLowerCase()}.png`} alt="" width="36" /> {country?.name}
      </h1>

      <section className="card">
        <div>Бюджет: <b>{formatKzt(trip.budget)}</b></div>
        <div>Потрачено: <b>{formatKzt(spent)}</b></div>
        <div className={over ? 'over-text' : ''}>
          {over ? 'Перерасход' : 'Остаток'}: <b>{formatKzt(Math.abs(left))}</b>
        </div>
        <div className="bar"><div className={`bar-fill ${over ? 'over' : ''}`} style={{ width: `${Math.min(percent, 100)}%` }} /></div>
        <small className="muted">{percent}% бюджета</small>
      </section>

      <form className="form" onSubmit={handleSubmit}>
        <label>Сумма
          <input type="number" min="0" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </label>
        <label>Валюта
          <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
            {['kzt', ...CURRENCIES].map((c) => <option key={c} value={c}>{c.toUpperCase()}</option>)}
          </select>
        </label>
        <label>Категория
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </label>
        <label>Дата
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </label>
        <label className="full">Комментарий
          <input value={comment} onChange={(e) => setComment(e.target.value)} />
        </label>
        <button type="submit" disabled={saving}>{saving ? 'Считаю курс…' : 'Добавить расход'}</button>
        {error && <p className="error full">{error}</p>}
      </form>

      {expenses.length === 0 && <p className="hint">Расходов пока нет.</p>}
      <ul className="list">
        {expenses.map((e) => (
          <li key={e.id} className="card expense">
            <div>
              <b>{e.amount} {e.currency.toUpperCase()}</b> → {formatKzt(e.amountKzt)}
              <div className="muted">
                {CATEGORIES.find((c) => c.id === e.category)?.name} · {e.date}{e.comment && ` · ${e.comment}`}
              </div>
            </div>
            <button className="ghost" onClick={() => dispatch({ type: 'DELETE_EXPENSE', tripId: trip.id, expenseId: e.id })}>✕</button>
          </li>
        ))}
      </ul>
    </>
  );
}