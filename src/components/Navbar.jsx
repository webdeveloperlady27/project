import { NavLink } from "react-router-dom";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export default function Navbar() {
  const navRef = useRef(null);
  const menuRef = useRef(null);
  const [open, setOpen] = useState(false);

  useLayoutEffect(() => {
    let lastY = window.scrollY;

    const onScroll = () => {
      if (open) return; 
      const y = window.scrollY;
      if (!navRef.current) return;

      if (y > lastY && y > 80) {
        gsap.to(navRef.current, { y: -90, duration: 0.25, ease: "power2.out" });
      } else {
        gsap.to(navRef.current, { y: 0, duration: 0.25, ease: "power2.out" });
      }
      lastY = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

  useLayoutEffect(() => {
    if (!menuRef.current) return;

    if (open) {
      gsap.to(menuRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.4,
        ease: "power2.out",
      });
    } else {
      gsap.to(menuRef.current, {
        y: "-100%",
        opacity: 0,
        duration: 0.35,
        ease: "power2.in",
      });
    }
  }, [open]);

  const linkClass = ({ isActive }) => "nav-link" + (isActive ? " active" : "");
  const closeMenu = () => setOpen(false);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") closeMenu();
    };

    if (open) {
      document.addEventListener("keydown", onKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header ref={navRef} className="nav">
        <div className="container nav-inner">
          <div className="logo">Explore NB</div>

          <nav className="nav-links desktop-only">
            <NavLink to="/" className={linkClass}>Home</NavLink>
            <NavLink to="/destinations" className={linkClass}>Destinations</NavLink>
            <NavLink to="/itineraries" className={linkClass}>Itineraries</NavLink>
            <NavLink to="/tips" className={linkClass}>Tips</NavLink>
          </nav>

          <button
            className={"burger mobile-only" + (open ? " open" : "")}
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobileMenu"
            type="button"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      <div
        ref={menuRef}
        id="mobileMenu"
        className="mobile-menu"
        onClick={closeMenu}
      >
        <div className="mobile-menu__panel" onClick={(e) => e.stopPropagation()}>
          <button
            className="mobile-close"
            onClick={closeMenu}
            aria-label="Close menu"
            type="button"
          >
            ✕
          </button>

          <nav className="mobile-nav">
            <NavLink to="/" onClick={closeMenu}>Home</NavLink>
            <NavLink to="/destinations" onClick={closeMenu}>Destinations</NavLink>
            <NavLink to="/itineraries" onClick={closeMenu}>Itineraries</NavLink>
            <NavLink to="/tips" onClick={closeMenu}>Tips</NavLink>
          </nav>
        </div>
      </div>
    </>
  );
}
