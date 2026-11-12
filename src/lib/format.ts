export const cap = (s?: string | null) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : '');

export function ageText(date?: string | null): string {
  if (!date) return 'ismeretlen kor';
  const b = new Date(date);
  const n = new Date();
  let months = (n.getFullYear() - b.getFullYear()) * 12 + n.getMonth() - b.getMonth();
  if (n.getDate() < b.getDate()) months--;
  if (months < 0) months = 0;
  return months < 12 ? `${months} hónapos` : `${Math.floor(months / 12)} éves`;
}

export function timeAgo(date: string): string {
  const mins = Math.floor((Date.now() - new Date(date).getTime()) / 60000);
  if (mins < 1) return 'most érkezett';
  if (mins < 60) return `${mins} perce érkezett`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} órája érkezett`;
  return `${Math.floor(hours / 24)} napja érkezett`;
}

export const isNew = (date: string) => Date.now() - new Date(date).getTime() < 24 * 3600 * 1000;

export const fmtDateTime = (d: string) =>
  new Date(d).toLocaleString('hu-HU', { dateStyle: 'medium', timeStyle: 'short' });

export const fmtTime = (d: string) =>
  new Date(d).toLocaleTimeString('hu-HU', { hour: '2-digit', minute: '2-digit' });

/** "Kulcs: érték" sorokból álló szöveg szétszedése (a talált állat űrlap így menti az adatokat). */
export function parseLines(text?: string | null): Record<string, string> {
  const out: Record<string, string> = {};
  (text ?? '').split('\n').forEach((line) => {
    const i = line.indexOf(':');
    if (i > 0) out[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  });
  return out;
}
