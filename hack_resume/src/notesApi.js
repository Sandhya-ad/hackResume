const API = process.env.REACT_APP_API || "http://127.0.0.1:8000";
export async function fetchNotes(appId){
  const r = await fetch(`${API}/api/applications/${appId}/notes/`);
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.json();
}
export async function addNote(appId, note){
  const r = await fetch(`${API}/api/applications/${appId}/notes/new/`, {
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify(note)
  });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.json();
}
