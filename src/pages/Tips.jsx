import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { tips } from "../data/tips";

export default function Tips() {
  const [openId, setOpenId] = useState("pack");
  const [query, setQuery] = useState("");

  const pageRef = useRef(null);

  const panelsRef = useRef({}); 
  const prevOpenRef = useRef("pack");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tips;

    return tips.filter((t) => {
      const inTitle = t.title.toLowerCase().includes(q);
      const inItems = t.items.some((x) => x.toLowerCase().includes(q));
      return inTitle || inItems;
    });
  }, [query]);

  useLayoutEffect(() => {
  if (!filtered.length) return;

  if (!openId) return;

  const exists = filtered.some((t) => t.id === openId);
  if (!exists) {
    const next = filtered[0].id;
    setOpenId(next);
    prevOpenRef.current = next;
  }
}, [filtered, openId]);


  useLayoutEffect(() => {
    if (!pageRef.current) return;

    const ctx = gsap.context(() => {
      gsap.killTweensOf([".tips-hero", ".tips-search", ".tips-card"]);

      gsap.fromTo(
        ".tips-hero",
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" }
      );

      gsap.fromTo(
        ".tips-search",
        { y: 12, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.45, ease: "power2.out", delay: 0.08 }
      );

      gsap.fromTo(
        ".tips-card",
        { y: 10, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.35,
          ease: "power2.out",
          stagger: 0.06,
          delay: 0.14,
        }
      );
    }, pageRef);

    return () => ctx.revert();
  }, [filtered.length]);

  useLayoutEffect(() => {
 
    const nextMap = {};
    filtered.forEach((t) => {
      const el = panelsRef.current[t.id];
      if (el) nextMap[t.id] = el;
    });
    panelsRef.current = nextMap;

    filtered.forEach((t) => {
      const panel = panelsRef.current[t.id];
      if (!panel) return;

      const isOpen = t.id === openId;
      gsap.killTweensOf(panel);

      if (isOpen) {
        gsap.set(panel, { height: "auto", opacity: 1, overflow: "visible" });
      } else {
        gsap.set(panel, { height: 0, opacity: 0, overflow: "hidden" });
      }
    });

    prevOpenRef.current = openId || prevOpenRef.current;
  }, [filtered, openId]);

  useLayoutEffect(() => {
    const prev = prevOpenRef.current;
    const next = openId;

    if (prev === next) return;

    const prevPanel = panelsRef.current[prev];
    const nextPanel = panelsRef.current[next];

    if (prevPanel) {
      gsap.killTweensOf(prevPanel);
      gsap.to(prevPanel, {
        height: 0,
        opacity: 0,
        duration: 0.22,
        ease: "power2.inOut",
        overwrite: "auto",
        onStart: () => gsap.set(prevPanel, { overflow: "hidden" }),
      });
    }

    if (nextPanel) {
      gsap.killTweensOf(nextPanel);

      gsap.set(nextPanel, { height: "auto", opacity: 1, overflow: "hidden" });
      const h = nextPanel.scrollHeight;

      gsap.fromTo(
        nextPanel,
        { height: 0, opacity: 0 },
        {
          height: h,
          opacity: 1,
          duration: 0.28,
          ease: "power2.out",
          overwrite: "auto",
          onComplete: () => gsap.set(nextPanel, { height: "auto", overflow: "visible" }),
        }
      );
    }

    prevOpenRef.current = next;
  }, [openId]);

  const toggle = (id) => {
    setOpenId((curr) => (curr === id ? "" : id)); 
  };

  return (
    <section className="section">
      <div className="container" ref={pageRef}>
        <div className="tips-hero">
          <h1 className="tips-title">Travel Tips</h1>
          <p className="muted tips-subtitle">Small things that make your trip easier.</p>

          <div className="tips-actions">
            <Link className="btn btn-primary" to="/destinations">
              Browse destinations
            </Link>
            <Link className="btn btn-ghost" to="/itineraries">
              Itineraries
            </Link>
          </div>
        </div>

        <div className="tips-search">
          <input
            className="input"
            placeholder="Search tips… (tides, packing, kids)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="btn btn-ghost" type="button" onClick={() => setQuery("")}>
            Clear
          </button>
        </div>

        <div className="tips-list">
          {filtered.map((t) => {
            const isOpen = openId === t.id;

            return (
              <div key={t.id} className={"tips-card" + (isOpen ? " open" : "")}>
                <button
                  className="tips-head"
                  type="button"
                  onClick={() => toggle(t.id)}
                  aria-expanded={isOpen}
                  aria-controls={`tips-panel-${t.id}`}
                >
                  <span>{t.title}</span>
                  <span className="tips-chevron">{isOpen ? "–" : "+"}</span>
                </button>

          
                <div
                  id={`tips-panel-${t.id}`}
                  className="tips-panel"
                  ref={(el) => {
                    if (el) panelsRef.current[t.id] = el;
                  }}
                >
                  <div className="tips-panel__inner">
                    <ul className="tips-items">
                      {t.items.map((x) => (
                        <li key={x}>{x}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <p className="muted" style={{ marginTop: 18 }}>
            No tips match your search.
          </p>
        )}
      </div>
    </section>
  );
}
