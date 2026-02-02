import { useState } from "react";

export default function Accordion({ items }) {
  const [openId, setOpenId] = useState(items[0]?.id ?? null);

  return (
    <div className="stack">
      {items.map((it) => (
        <div key={it.id} className="card" style={{ padding: 14 }}>
          <button
            className="accordion-btn"
            onClick={() => setOpenId(openId === it.id ? null : it.id)}
          >
            <b>{it.title}</b>
            <span className="muted">{openId === it.id ? "−" : "+"}</span>
          </button>

          {openId === it.id && (
            <p className="muted" style={{ marginTop: 10 }}>{it.body}</p>
          )}
        </div>
      ))}
    </div>
  );
}
