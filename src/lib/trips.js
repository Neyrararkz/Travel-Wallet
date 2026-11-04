import { roundMoney } from './money';

export function tripSummary(trip) {
  const spent = roundMoney(trip.expenses.reduce((s, e) => s + e.amountKzt, 0));
  const left = roundMoney(trip.budget - spent);
  const percent = trip.budget > 0 ? Math.round((spent / trip.budget) * 100) : 0;
  return { spent, left, percent };
}

export function byCategory(expenses) {
  const result = {};
  for (const e of expenses) {
    result[e.category] = roundMoney((result[e.category] ?? 0) + e.amountKzt);
  }
  return result;
}

export function tripsReducer(state, action) {
  switch (action.type) {
    case 'ADD_TRIP':
      return [...state, action.trip];
    case 'DELETE_TRIP':
      return state.filter((t) => t.id !== action.tripId);
    case 'ADD_EXPENSE':
      return state.map((t) =>
        t.id === action.tripId ? { ...t, expenses: [...t.expenses, action.expense] } : t
      );
    case 'DELETE_EXPENSE':
      return state.map((t) =>
        t.id === action.tripId
          ? { ...t, expenses: t.expenses.filter((e) => e.id !== action.expenseId) }
          : t
      );
    default:
      return state;
  }
}

const KEY = 'travel-wallet:trips';

export function loadTrips() {
  try {
    const raw = localStorage.getItem(KEY);
    const data = raw ? JSON.parse(raw) : [];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export function saveTrips(trips) {
  try {
    localStorage.setItem(KEY, JSON.stringify(trips));
  } catch {
    // переполнение или приватный режим: приложение продолжает работать    
  }
}