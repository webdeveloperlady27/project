import { Link, useParams } from "react-router-dom";
import { useLayoutEffect, useMemo, useRef } from "react";
import { gsap } from "gsap";
import { destinations } from "../data/destinations";

export default function DestinationDetails() {
  const { slug } = useParams();
  const root = useRef(null);

  const place = useMemo(() => {
    return destinations.find((d) => (d.slug ?? d.id) === slug);
  }, [slug]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".details-anim",
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: "power2.out", stagger: 0.08 }
      );
    }, root);

    return () => ctx.revert();
  }, []);

  if (!place) {
    return (
      <section className="section">
        <div className="container">
          <h1>Not found</h1>
          <p className="muted" style={{ marginTop: 8 }}>
            This destination doesn’t exist.
          </p>
          <div className="center">
            <Link className="btn btn-primary" to="/destinations">
              Back to Destinations
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div ref={root} className="details-page">
      <header
        className="details-hero"
        style={{ backgroundImage: `url(${place.image})` }}
      >
        <div className="details-hero__overlay" />

        <div className="container details-hero__inner">
          <Link className="details-back details-anim" to="/destinations">
            ← Back
          </Link>

          <div className="details-hero__panel details-anim">
            <div className="details-meta muted">
              {place.region} • {place.category}
            </div>

            <h1 className="details-title">{place.title}</h1>
            <p className="details-subtitle">{place.description}</p>

            <div className="details-actions">
              <Link className="btn btn-primary" to="/itineraries">
                See itineraries
              </Link>
              <a className="btn btn-ghost" href="#info">
                Quick info
              </a>
            </div>
          </div>
        </div>
      </header>

      <section id="info" className="section details-section">
        <div className="container details-grid">
          <article className="details-card details-anim">
            <h2>Why go</h2>
            <p className="muted" style={{ marginTop: 10 }}>
              Perfect for a scenic day trip, photos, and an easy adventure.
              Add this stop to a Fundy / coastal route for maximum wow.
            </p>

            <div className="details-bullets">
              <div className="details-pill">Best for: families</div>
              <div className="details-pill">Time needed: 2–4 hours</div>
              <div className="details-pill">Season: Spring–Fall</div>
            </div>
          </article>

          <aside className="details-card details-anim">
            <h2>Quick tips</h2>
            <ul className="details-list muted">
              <li>Check tides (Fundy spots are best at low tide).</li>
              <li>Bring comfy shoes for boardwalk / short trails.</li>
              <li>Arrive early for quieter photo spots.</li>
            </ul>

            <div style={{ marginTop: 14 }}>
              <Link className="btn" to="/tips">
                More travel tips
              </Link>
            </div>
          </aside>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="details-more-head details-anim">
            <h2>More in New Brunswick</h2>
            <p className="muted" style={{ marginTop: 6 }}>
              A few nearby ideas to keep exploring.
            </p>
          </div>

          <div className="details-more-grid">
            {destinations
              .filter((d) => (d.slug ?? d.id) !== slug)
              .slice(0, 4)
              .map((d) => (
                <Link
                  key={d.id}
                  to={`/destinations/${d.slug ?? d.id}`}
                  className="details-mini details-anim"
                >
                  <img src={d.image} alt={d.title} />
                  <div>
                    <div className="muted" style={{ fontSize: 12 }}>
                      {d.region}
                    </div>
                    <div className="details-mini-title">{d.title}</div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
}
