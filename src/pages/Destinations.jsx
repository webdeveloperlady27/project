import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { destinations } from "../data/destinations";

import { useDispatch, useSelector } from "react-redux";
import {
  setSearch,
  setRegion,
  setCategory,
  resetFilters,
} from "../features/filters/filtersSlice";

function useIsMobile(breakpoint = 900) {
  const [isMobile, setIsMobile] = useState(() => {
    if (!window.matchMedia) return false;
    return window.matchMedia(`(max-width:${breakpoint}px)`).matches;
  });

  useEffect(() => {
    if (!window.matchMedia) return;
    const mq = window.matchMedia(`(max-width:${breakpoint}px)`);
    const onChange = () => setIsMobile(mq.matches);

    onChange();
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, [breakpoint]);

  return isMobile;
}

export default function Destinations() {
  const dispatch = useDispatch();
  const { search, region, category } = useSelector((s) => s.filters);

  const isMobile = useIsMobile(900);

  const stageRef = useRef(null);
  const cardsRef = useRef([]);
  const innerRef = useRef([]);

  const regions = useMemo(() => {
    const uniq = Array.from(new Set(destinations.map((d) => d.region)));
    return ["All", ...uniq];
  }, []);

  const categories = useMemo(() => {
    const uniq = Array.from(new Set(destinations.map((d) => d.category)));
    return ["All", ...uniq];
  }, []);

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();

    return destinations.filter((d) => {
      const matchSearch =
        !q ||
        d.title.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q);

      const matchRegion = region === "All" || d.region === region;
      const matchCategory = category === "All" || d.category === category;

      return matchSearch && matchRegion && matchCategory;
    });
  }, [search, region, category]);

  const showOrbit = !isMobile && filteredItems.length > 4;

  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    if (!showOrbit) return;

    const ctx = gsap.context(() => {
      const cards = cardsRef.current.filter(Boolean);
      const inners = innerRef.current.filter(Boolean);
      if (!cards.length || !inners.length) return;

      const total = cards.length;
      const radius = 280;
      const squash = 0.55;
      const orbit = { t: 0 };

      gsap.set(cards, { xPercent: -50, yPercent: -50, willChange: "transform" });

      const floatTweens = inners.map((el, idx) =>
        gsap.to(el, {
          y: -(6 + (idx % 5) * 1.5),
          duration: 2.6 + (idx % 4) * 0.25,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        })
      );

      const orbitTween = gsap.to(orbit, {
        t: 1,
        duration: 28,
        ease: "none",
        repeat: -1,
        onUpdate: () => {
          const shift = orbit.t * Math.PI * 2;

          cards.forEach((el, idx) => {
            const angle = (idx / total) * Math.PI * 2 + shift;

            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius * squash;

            const depth = (Math.sin(angle) + 1) / 2; 
            const scale = 0.92 + depth * 0.18;
            const zIndex = Math.round(1 + depth * 80);

            gsap.set(el, {
              x,
              y,
              scale,
              zIndex,
              rotate: Math.cos(angle) * 6,
              transformOrigin: "center",
              overwrite: "auto",
            });
          });
        },
      });

      const pause = () => orbitTween.pause();
      const resume = () => orbitTween.resume();
      stage.addEventListener("mouseenter", pause);
      stage.addEventListener("mouseleave", resume);

      const onEnter = (e) => {
        gsap.to(e.currentTarget, {
          y: "-=10",
          duration: 0.18,
          ease: "power2.out",
          overwrite: "auto",
        });
      };
      const onLeave = (e) => {
        gsap.to(e.currentTarget, {
          y: "+=10",
          duration: 0.22,
          ease: "power2.out",
          overwrite: "auto",
        });
      };

      inners.forEach((el) => {
        el.addEventListener("mouseenter", onEnter);
        el.addEventListener("mouseleave", onLeave);
      });

      return () => {
        stage.removeEventListener("mouseenter", pause);
        stage.removeEventListener("mouseleave", resume);
        inners.forEach((el) => {
          el.removeEventListener("mouseenter", onEnter);
          el.removeEventListener("mouseleave", onLeave);
        });
        floatTweens.forEach((t) => t.kill());
        orbitTween.kill();
      };
    }, stageRef);

    return () => ctx.revert();
  }, [showOrbit, filteredItems.length]);

  cardsRef.current = [];
  innerRef.current = [];

  return (
    <section className="section">
      <div className="container">
        <h1 className="page-title">Destinations</h1>
        <p className="muted page-subtitle">
          Browse all places in New Brunswick — beaches, hikes, cities and viewpoints.
        </p>

        <div className="filters">
          <div className="field">
            <label className="label" htmlFor="dest-search">Search</label>
            <input
              id="dest-search"
              className="input"
              placeholder="Search destinations..."
              value={search}
              onChange={(e) => dispatch(setSearch(e.target.value))}
            />
          </div>

          <div className="field">
            <label className="label" htmlFor="dest-region">Region</label>
            <select
              id="dest-region"
              className="select"
              value={region}
              onChange={(e) => dispatch(setRegion(e.target.value))}
            >
              {regions.map((r) => (
                <option key={r} value={r}>
                  {r === "All" ? "All regions" : r}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label className="label" htmlFor="dest-category">Category</label>
            <select
              id="dest-category"
              className="select"
              value={category}
              onChange={(e) => dispatch(setCategory(e.target.value))}
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c === "All" ? "All categories" : c}
                </option>
              ))}
            </select>
          </div>

          <div className="field field--button">
            <span className="label" style={{ opacity: 0 }}>.</span>
            <button
              className="btn btn-ghost"
              type="button"
              onClick={() => dispatch(resetFilters())}
            >
              Reset
            </button>
          </div>
        </div>

        {showOrbit ? (
          <>
            <div ref={stageRef} className="orbit-stage" aria-label="Destinations orbit">
              <div className="orbit">
                {filteredItems.map((d, idx) => (
                  <Link
                    key={d.id}
                    to={`/destinations/${d.slug ?? d.id}`}
                    className="orbit-card"
                    ref={(el) => (cardsRef.current[idx] = el)}
                  >
                    <div
                      className="orbit-card__inner"
                      ref={(el) => (innerRef.current[idx] = el)}
                    >
                      <img className="orbit-img" src={d.image} alt={d.title} />
                      <div className="orbit-body">
                        <div className="muted orbit-meta">
                          {d.region} • {d.category}
                        </div>
                        <h3 className="orbit-title">{d.title}</h3>
                        <p className="muted orbit-desc">{d.description}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <p className="muted" style={{ marginTop: 16, fontSize: 13 }}>
              Tip: hover pauses the orbit (desktop).
            </p>
          </>
        ) : (
          <div className="cards-grid">
            {filteredItems.map((d) => (
              <Link
                key={d.id}
                to={`/destinations/${d.slug ?? d.id}`}
                className="card"
              >
                <img className="card-img" src={d.image} alt={d.title} />
                <div className="card-body">
                  <div className="muted" style={{ fontSize: 12 }}>
                    {d.region} • {d.category}
                  </div>
                  <h3 style={{ marginTop: 6 }}>{d.title}</h3>
                  <p className="muted" style={{ marginTop: 6, fontSize: 14 }}>
                    {d.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {filteredItems.length === 0 && (
          <p className="muted" style={{ marginTop: 18 }}>
            No destinations match your filters.
          </p>
        )}
      </div>
    </section>
  );
}
