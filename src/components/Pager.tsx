export default function Pager({ page, last, onChange }: { page: number; last: number; onChange: (p: number) => void }) {
  if (last <= 1) return null;
  return (
    <div className="pager">
      <button className="btn btn-outline btn-sm" disabled={page <= 1} onClick={() => onChange(page - 1)}>Előző</button>
      <span>{page} / {last}</span>
      <button className="btn btn-outline btn-sm" disabled={page >= last} onClick={() => onChange(page + 1)}>Következő</button>
    </div>
  );
}
