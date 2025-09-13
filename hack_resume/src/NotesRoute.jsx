import { useSearchParams } from "react-router-dom";
import NotesPanel from "./NotesPanel";

export default function NotesRoute() {
  const [params] = useSearchParams();
  const appId = params.get("app") || "1";   // 默认 1，随时可换
  return (
    <div style={{maxWidth:800, margin:"0 auto", padding:16}}>
      <h2>Notes</h2>
      <NotesPanel appId={appId} />
    </div>
  );
}
