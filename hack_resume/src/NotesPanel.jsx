import { useEffect, useState } from "react";
import { fetchNotes, addNote } from "./notesApi";

const TYPES = ["EMAIL_IN","EMAIL_OUT","CALL","MEETING","INTERVIEW","OFFER","REJECT","NOTE"];

export default function NotesPanel({ appId }) {
  const [items, setItems] = useState([]);
  const [type, setType] = useState("NOTE");
  const [content, setContent] = useState("");

  async function load(){ setItems(await fetchNotes(appId)); }
  useEffect(()=>{ load(); }, [appId]);

  async function onSubmit(e){
    e.preventDefault();
    if (!content.trim() && type==="NOTE") return;
    await addNote(appId, { type, content });
    setContent(""); setType("NOTE");
    await load();
  }

  return (
    <div style={{border:"1px solid #eee", borderRadius:12, padding:12}}>
      <h4 style={{marginTop:0}}>Notes / Responses</h4>

      <div style={{display:"flex", gap:8, flexWrap:"wrap", marginBottom:8}}>
        {TYPES.map(t=>(
          <button key={t}
            onClick={()=>setType(t)}
            style={{
              padding:"6px 10px", borderRadius:8, border:"1px solid #ddd",
              background: type===t ? "#111" : "#fff", color: type===t ? "#fff" : "#111"
            }}
          >{t}</button>
        ))}
      </div>

      <form onSubmit={onSubmit} style={{display:"grid", gap:8, marginBottom:12}}>
        <textarea rows={3} placeholder="Write details (e.g., 'Recruiter emailed about take-home')"
          value={content} onChange={e=>setContent(e.target.value)} />
        <button>Add</button>
      </form>

      <ul style={{listStyle:"none", padding:0, margin:0}}>
        {items.length===0 && <li>No notes yet.</li>}
        {items.map(n=>(
          <li key={n.id} style={{borderTop:"1px solid #f0f0f0", padding:"8px 0"}}>
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"baseline"}}>
              <b>{n.type}</b>
              <small style={{color:"#666"}}>{new Date(n.occurred_at).toLocaleString()}</small>
            </div>
            {n.content && <div style={{whiteSpace:"pre-wrap"}}>{n.content}</div>}
          </li>
        ))}
      </ul>
    </div>
  );
}
