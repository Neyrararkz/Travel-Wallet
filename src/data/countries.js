export const COUNTRIES = [
  { code: 'TR', name: 'Турция', currency: 'try' },
  { code: 'AE', name: 'ОАЭ', currency: 'aed' },
  { code: 'GE', name: 'Грузия', currency: 'gel' },
  { code: 'TH', name: 'Таиланд', currency: 'thb' },
  { code: 'CN', name: 'Китай', currency: 'cny' },
  { code: 'UZ', name: 'Узбекистан', currency: 'uzs' },
  { code: 'KG', name: 'Кыргызстан', currency: 'kgs' },
  { code: 'EG', name: 'Египет', currency: 'egp' },
  { code: 'VN', name: 'Вьетнам', currency: 'vnd' },
  { code: 'KR', name: 'Южная Корея', currency: 'krw' },
  { code: 'JP', name: 'Япония', currency: 'jpy' },
  { code: 'DE', name: 'Германия', currency: 'eur' },
  { code: 'US', name: 'США', currency: 'usd' },
  { code: 'RU', name: 'Россия', currency: 'rub' },
];

export const CATEGORIES = [
  { id: 'food', name: 'Еда' },
  { id: 'transport', name: 'Транспорт' },
  { id: 'stay', name: 'Жильё' },
  { id: 'fun', name: 'Развлечения' },
  { id: 'other', name: 'Другое' },
];

export const CURRENCIES = [...new Set(COUNTRIES.map((c) => c.currency))];

export const countryByCode = (code) => COUNTRIES.find((c) => c.code === code);