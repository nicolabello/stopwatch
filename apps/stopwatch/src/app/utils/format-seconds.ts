export function formatSeconds(s: number, addSign = false) {
  const sign = s > 0 ? '+' : s < 0 ? '-' : '';

  s = Math.abs(s);

  const hours = `${Math.floor(s / 3600)}`.padStart(2, '0');
  const minutes = `${Math.floor((s % 3600) / 60)}`.padStart(2, '0');
  const seconds = `${s % 60}`.padStart(2, '0');

  return `${addSign ? sign : ''}${hours !== '00' ? `${hours}:` : ''}${minutes}:${seconds}`;
}
