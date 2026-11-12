export function Loading() {
  return <div className="state-msg">Betöltés…</div>;
}
export function ErrorBox({ message }: { message: string }) {
  return <div className="alert alert-error">{message}</div>;
}
