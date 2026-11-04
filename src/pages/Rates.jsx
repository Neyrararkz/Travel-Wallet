import { useEffect, useState } from 'react';
import { CURRENCIES } from '../data/countries';
import { getRates, rateKeyFor } from '../api/rates';
import { convertToKzt, roundMoney, formatKzt } from '../lib/money';
import { todayLocal } from '../lib/date';

export default function Rates() {
  const [date, setDate] = useState(todayLocal());
  const [rates, setRates] = useState(null);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const [amount, setAmount] = useState('100');
  const [currency, setCurrency] = useState('usd');
  const [toKzt, setToKzt] = useState(true);

  useEffect(() => {
    let ignore = false;
    setStatus('loading');
    getRates(rateKeyFor(date))
      .then((r) => { if (!ignore) { setRates(r); setStatus('success'); } })
      .catch((err) => { if (!ignore) { setError(err.message); setStatus('error'); } });
    return () => { ignore = true; };
  }, [date]);

  let result = '';
  if (status === 'success' && Number(amount) > 0) {
    if (toKzt) {
      const v = convertToKzt(Number(amount), currency, rates);
      result = v === null ? 'нет курса' : formatKzt(v);
    } else {
      const rate = rates[currency];
      result = rate ? `${roundMoney(Number(amount) * rate)} ${currency.toUpperCase()}` : 'нет курса';
    }
  }

  return (
    <>
      <h1>Курсы</h1>
      <label className="full">Дата курса
        <input type="date" value={date} max={todayLocal()} onChange={(e) => setDate(e.target.value)} />
      </label>

      {status === 'loading' && <p className="hint">Загрузка…</p>}
      {status === 'error' && <p className="error">{error}</p>}

      {status === 'success' && (
        <>
          <section className="card form">
            <label>Сумма
              <input type="number" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} />
            </label>
            <label>Валюта
              <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                {CURRENCIES.map((c) => <option key={c} value={c}>{c.toUpperCase()}</option>)}
              </select>
            </label>
            <button type="button" className="ghost" onClick={() => setToKzt(!toKzt)}>
              {toKzt ? `${currency.toUpperCase()} → ₸` : `₸ → ${currency.toUpperCase()}`} (сменить)
            </button>
            <div className="result">{result}</div>
          </section>

          <table className="table">
            <thead><tr><th>Валюта</th><th>1 ₸</th><th>1 ед. в ₸</th></tr></thead>
            <tbody>
              {CURRENCIES.map((c) => (
                <tr key={c}>
                  <td>{c.toUpperCase()}</td>
                  <td>{rates[c] ?? '—'}</td>
                  <td>{rates[c] ? formatKzt(1 / rates[c]) : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </>
  );
}