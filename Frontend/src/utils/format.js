const CURRENCY_LOCALES = {
  INR: 'en-IN',
  USD: 'en-US',
  EUR: 'de-DE',
  GBP: 'en-GB',
  JPY: 'ja-JP',
  AUD: 'en-AU',
  CAD: 'en-CA',
};

const RATES_CACHE_KEY = 'exchange_rates';
const RATES_CACHE_TTL = 86400000; // 24 hours

const getCurrency = () => localStorage.getItem('currency') || 'INR';

const getCachedRates = () => {
  try {
    const raw = localStorage.getItem(RATES_CACHE_KEY);
    if (!raw) return null;
    const { rates, timestamp } = JSON.parse(raw);
    if (Date.now() - timestamp > RATES_CACHE_TTL) return null;
    return rates;
  } catch {
    return null;
  }
};

const setCachedRates = (rates) => {
  localStorage.setItem(RATES_CACHE_KEY, JSON.stringify({ rates, timestamp: Date.now() }));
};

const BASE_CURRENCY = 'INR';

const convertValue = (value, targetCurrency) => {
  if (targetCurrency === BASE_CURRENCY) return value;
  const rates = getCachedRates();
  if (!rates || !rates[targetCurrency]) return value;
  return value * rates[targetCurrency];
};

export const formatCurrency = (value) => {
  if (value == null || isNaN(value)) value = 0;
  const currency = getCurrency();
  const locale = CURRENCY_LOCALES[currency] || 'en-US';
  const converted = convertValue(value, currency);
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: converted % 1 === 0 ? 0 : 2,
  }).format(converted);
};

export const getCurrencySymbol = () => {
  const currency = getCurrency();
  return { INR: '₹', USD: '$', EUR: '€', GBP: '£', JPY: '¥', AUD: 'A$', CAD: 'C$' }[currency] || '₹';
};

export const fetchExchangeRates = async () => {
  try {
    const cached = getCachedRates();
    if (cached) return cached;
    const res = await fetch('https://api.exchangerate-api.com/v4/latest/INR');
    const data = await res.json();
    setCachedRates(data.rates);
    return data.rates;
  } catch (err) {
    console.warn('Failed to fetch exchange rates:', err.message);
    return null;
  }
};
