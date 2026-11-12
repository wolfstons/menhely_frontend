const CLASS: Record<string, string> = {
  'örökbefogadható': 'badge-green',
  'örökbefogadva': 'badge-gray',
  'beteg': 'badge-red',
  'vizsgálat alatt': 'badge-yellow',
};

export default function StatusBadge({ status }: { status?: string }) {
  if (!status) return null;
  const label = status.charAt(0).toUpperCase() + status.slice(1);
  return <span className={`badge ${CLASS[status] ?? 'badge-green'}`}>{label}</span>;
}
