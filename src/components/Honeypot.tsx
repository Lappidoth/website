export function Honeypot() {
  return (
    <div className="honeypot" aria-hidden="true">
      <label>
        Company
        <input type="text" name="company" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}
