import { describe, it, expect, vi } from 'vitest';
import { tripSummary, byCategory, tripsReducer, loadTrips } from './trips';

describe('trips', () => {
  it('tripSummary: в рамках бюджета', () => {
    const trip = { budget: 500000, expenses: [{ amountKzt: 100000 }, { amountKzt: 25000 }] };
    expect(tripSummary(trip)).toEqual({ spent: 125000, left: 375000, percent: 25 });
  });
  it('tripSummary: перерасход', () => {
    const trip = { budget: 100000, expenses: [{ amountKzt: 120000 }] };
    const s = tripSummary(trip);
    expect(s.left).toBe(-20000);
    expect(s.percent).toBe(120);
  });
  it('byCategory', () => {
    const list = [
      { category: 'food', amountKzt: 3000 },
      { category: 'transport', amountKzt: 1200 },
      { category: 'food', amountKzt: 2000 },
    ];
    expect(byCategory(list)).toEqual({ food: 5000, transport: 1200 });
  });
  it('ADD_EXPENSE: в нужную поездку, state не мутируется', () => {
    const state = [{ id: 't1', expenses: [] }, { id: 't2', expenses: [] }];
    const next = tripsReducer(state, {
      type: 'ADD_EXPENSE', tripId: 't1', expense: { id: 'e1', amountKzt: 100 },
    });
    expect(next[0].expenses).toHaveLength(1);
    expect(next[1].expenses).toHaveLength(0);
    expect(state[0].expenses).toHaveLength(0);
  });
  it('DELETE_TRIP: удаляет поездку вместе с расходами', () => {
    const state = [{ id: 't1', expenses: [{ id: 'e1' }] }, { id: 't2', expenses: [] }];
    const next = tripsReducer(state, { type: 'DELETE_TRIP', tripId: 't1' });
    expect(next).toHaveLength(1);
    expect(next[0].id).toBe('t2');
  });
  it('loadTrips: "abc" в localStorage -> []', () => {
    vi.stubGlobal('localStorage', { getItem: () => 'abc', setItem: () => {} });
    expect(loadTrips()).toEqual([]);
    vi.unstubAllGlobals();
  });
});