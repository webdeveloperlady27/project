import { useLayoutEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { gsap } from "gsap";
import {
  resetItineraryFilters,
  setItineraryDays,
  setItineraryRegion,
} from "../features/itinerary/itinerarySlice";
import {
  selectFilteredItineraries,
  selectItineraryFilters,
  selectItineraryRegions,
} from "../features/itinerary/selectFilteredItineraries";

export default function Itineraries() {
  const dispatch = useDispatch();
  const { region, days } = useSelector(selectItineraryFilters);
  const filtered = useSelector(selectFilteredItineraries);
  const regions = useSelector(selectItineraryRegions);

  const rootRef = useRef(null);

  const dayOptions = useMemo(
    () => [
      { value: "All", label: "Any duration" },
      { value: "1", label: "1 day" },
      { value: "2", label: "2 days" },
    ],
    []
  );

  useLayoutEffect(() => {
    if (!rootRef.current) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray(".itinerary-card");
      if (!cards.length) return;

      gsap.fromTo(
        cards,
        { y: 18, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.55,
          ease: "power2.out",
          stagger: 0.06,
          clearProps: "transform,opacity",
        }
      );

      const onEnter = (e) => {
        gsap.to(e.currentTarget, {
          y: -6,
          duration: 0.18,
          ease: "power2.out",
          overwrite: "auto",
        });
      };

      const onLeave = (e) => {
        gsap.to(e.currentTarget, {
          y: 0,
          duration: 0.22,
          ease: "power2.out",
          overwrite: "auto",
        });
      };

      cards.forEach((el) => {
        el.addEventListener("mouseenter", onEnter);
        el.addEventListener("mouseleave", onLeave);
      });

      return () => {
        cards.forEach((el) => {
          el.removeEventListener("mouseenter", onEnter);
          el.removeEventListener("mouseleave", onLeave);
        });
      };
    }, rootRef);

    return () => ctx.revert();
  }, [region, days, filtered.length]);

  return (
    <section className="section" ref={rootRef}>
      <div className="container">
        <h1 style={{ marginBottom: 6 }}>Itineraries</h1>
        <p className="muted" style={{ marginBottom: 18 }}>
          Ready-to-use routes for day trips and weekend escapes.
        </p>

        <div className="filters">
          <select
            className="select"
            value={region}
            onChange={(e) => dispatch(setItineraryRegion(e.target.value))}
          >
            {regions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>

          <select
            className="select"
            value={days}
            onChange={(e) => dispatch(setItineraryDays(e.target.value))}
          >
            {dayOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <button
            className="btn btn-ghost"
            type="button"
            onClick={() => dispatch(resetItineraryFilters())}
          >
            Reset
          </button>
        </div>

        <div className="itinerary-list">
          {filtered.map((it) => (
            <article key={it.id} className="itinerary-card">
              <img className="itinerary-img" src={it.image} alt={it.title} />

              <div className="itinerary-body">
                <div className="itinerary-meta muted">
                  {it.region} • {it.days} day{it.days > 1 ? "s" : ""}
                </div>

                <h3 className="itinerary-title">{it.title}</h3>

                <ul className="itinerary-stops">
                  {it.stops.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="muted" style={{ marginTop: 20 }}>
            No itineraries match your filters.
          </p>
        )}
      </div>
    </section>
  );
}
