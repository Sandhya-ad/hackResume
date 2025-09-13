export default function Home() {
  return (
    <div style={{textAlign:"center", padding:40}}>
      <h2>Home</h2>
      <p>This is the landing page.</p>
      {/* temporary port for testing notes */}
      <p><a href="/notes?app=1">Go to Notes for app #1 →</a></p>
    </div>
  );
}
