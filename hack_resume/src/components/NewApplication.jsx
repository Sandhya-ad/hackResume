import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import dayjs from "dayjs";

const STAGES = [
  ["applied","Applied"], ["oa","Online Assessment"],
  ["interview","Interview"], ["offer","Offer"],
  ["rejected","Rejected"], ["ghosted","No Response"],
];

export default function NewApplication() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    company: "",
    role: "",
    date_applied: dayjs().format("YYYY-MM-DD"),
    status: "applied",
    notes: "",
    next_followup_on: dayjs().add(7, "day").format("YYYY-MM-DD"), // ok if backend has this field
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setSaving(true); setErr("");
    try {
      await api.post("/applications/", form);
      nav("/applications");
    } catch {
      setErr("Save failed. Is Django running and fields match the model?");
    } finally { setSaving(false); }
  }

  return (
    <div>
      <h2>New Application</h2>
      {err && <div style={{ color: "crimson", marginBottom: 8 }}>{err}</div>}
      <form onSubmit={submit} style={{ display: "grid", gap: 10, maxWidth: 480 }}>
        <input placeholder="Company" value={form.company} onChange={set("company")} required />
        <input placeholder="Role" value={form.role} onChange={set("role")} required />
        <label>
          Date applied
          <input type="date" value={form.date_applied} onChange={set("date_applied")} required />
        </label>
        <label>
          Status
          <select value={form.status} onChange={set("status")}>
            {STAGES.map(([v,l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </label>
        <textarea placeholder="Notes" rows={3} value={form.notes} onChange={set("notes")} />
        <label>
          Follow-up on
          <input type="date" value={form.next_followup_on} onChange={set("next_followup_on")} />
        </label>
        <button type="submit" disabled={saving}>{saving ? "Saving..." : "Create"}</button>
      </form>
    </div>
  );
}
