import { useEffect, useMemo, useState } from "react";

export default function SlideCarousel({ slides, auto = true }) {
  const [i, setI] = useState(0);

  const prev = () => setI((p) => (p - 1 + slides.length) % slides.length);
  const next = () => setI((p) => (p + 1) % slides.length);

  useEffect(() => {
    if (!auto) return;
    const id = setInterval(next, 4500);
    return () => clearInterval(id);
  }, [auto, slides.length]);

  const s = slides[i];
  const progress = useMemo(() => `${i + 1}/${slides.length}`, [i, slides.length]);

  return (
    <div className="carousel">
      <img className="carousel__img" src={s.image} alt={s.title} />

      <div className="carousel__overlay" />

      <div className="carousel__content">
        <div className="carousel__top muted">{progress}</div>
        <h2 className="carousel__title">{s.title}</h2>
        <p className="carousel__text muted">{s.text}</p>

        <div className="carousel__actions">
          <button className="btn btn-ghost" onClick={prev} aria-label="Previous slide">
            Prev
          </button>
          <button className="btn btn-primary" onClick={next} aria-label="Next slide">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
