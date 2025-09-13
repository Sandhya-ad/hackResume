const LABELS = {
    applied: "Applied",
    oa: "OA",
    interview: "Interview",
    offer: "Offer",
    rejected: "Rejected",
    ghosted: "No Response",
  };
  
  export default function StatusBadge({ value }) {
    const label = LABELS[value] || value;
    const palette = {
      applied: "#e8f0ff",
      oa: "#f0f7ff",
      interview: "#eaffea",
      offer: "#f5fff0",
      rejected: "#ffefef",
      ghosted: "#f7f7f7",
    }[value] || "#eee";
  
    return (
      <span style={{ background: palette, padding: "2px 8px", borderRadius: 999, fontSize: 12 }}>
        {label}
      </span>
    );
  }
  