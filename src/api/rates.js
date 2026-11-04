import { todayLocal } from '../lib/date';

const PREFIX = 'travel-wallet:rates:';
const HOUR = 60 * 60 * 1000;

// сегодня и будущее -> "latest", прошлое -> сама дата
export function rateKeyFor(date) {
  return !date || date >= todayLocal() ? 'latest' : date;
}

function urls(key) {
  return [
    `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@${key}/v1/currencies/kzt.json`,
    `https://${key}.currency-api.pages.dev/v1/currencies/kzt.json`,
  ];
}

function readCache(key) {
  try {
    const item = JSON.parse(localStorage.getItem(PREFIX + key));
    if (!item) return null;
    if (key === 'latest' && Date.now() - item.savedAt > HOUR) return null;
    return item.rates; // курс за прошедшую дату хранится вечно
  } catch {
    return null;
  }
}

function writeCache(key, rates) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify({ savedAt: Date.now(), rates }));
  } catch {
    // не страшно
  }
}

export async function getRates(key = 'latest') {
  const cached = readCache(key);
  if (cached) return cached;

  for (const url of urls(key)) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      writeCache(key, data.kzt);
      return data.kzt;
    } catch {
      // пробуем следующий адрес
    }
  }
  throw new Error(`Не удалось получить курсы (${key === 'latest' ? 'сегодня' : key})`);
}