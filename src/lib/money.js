export function roundMoney(n) {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

export function convertToKzt(amount, currency, rates) {
  if (currency === 'kzt') return amount;
  const rate = rates[currency];
  if (!rate) return null;
  return roundMoney(amount / rate);
}

export function formatKzt(n) {
  const num = new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
  return `${num}\u00a0₸`; 
}