import dayjs from "dayjs";

export default function FollowUpTag({ dateStr }) {
  if (!dateStr) return null;
  const d = dayjs(dateStr);
  if (!d.isValid()) return null;
  const days = d.startOf("day").diff(dayjs().startOf("day"), "day");

  let bg = "#eee", txt = "#333", label = `Follow-up ${d.format("MMM D")}`;
  if (days < 0)       { bg = "#ffe6e6"; txt = "#900"; label = `Overdue ${d.format("MMM D")}`; }
  else if (days === 0){ bg = "#fff0cc"; txt = "#884"; label = `Follow-up today`; }
  else if (days <= 7) { bg = "#fff7cc"; txt = "#665"; label = `Due in ${days}d`; }

  return (
    <span style={{ background: bg, color: txt, padding: "2px 8px", borderRadius: 999, fontSize: 12 }}>
      {label}
    </span>
  );
}
