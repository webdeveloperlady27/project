import { Link } from "react-router-dom";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";

export default function Hero({
  title,
  subtitle,
  bg, 
  primaryText,
  primaryTo,
  secondaryText,
  secondaryTo,
}) {
  const root = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero-content > *",
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out", stagger: 0.12 }
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      className={`hero ${bg ? "hero--with-bg" : ""}`}
      style={bg ? { backgroundImage: `url(${bg})` } : undefined}
    >
      {bg ? <div className="hero-overlay" /> : null}

      <div className="container hero-inner">
        <div className="hero-content">
          <h1 className="hero-title">{title}</h1>
          <p className="hero-subtitle">{subtitle}</p>

          <div className="hero-actions">
            <Link className="btn btn-primary" to={primaryTo}>
              {primaryText}
            </Link>

            {secondaryText ? (
              <Link className="btn btn-ghost" to={secondaryTo}>
                {secondaryText}
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
