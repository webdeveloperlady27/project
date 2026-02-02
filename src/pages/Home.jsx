import Hero from "../components/Hero";
import SlideCarousel from "../components/SlideCarousel";
import Accordion from "../components/Accordion";
import { slides } from "../data/slides";
import { Link } from "react-router-dom";

export default function Home() {
  const tips = [
    {
      id: 1,
      title: "Best time to visit",
      body: "Summer for beaches, Fall for colors, Winter for cozy trips, Spring for waterfalls.",
    },
    {
      id: 2,
      title: "Fundy tip",
      body: "Check tides before Hopewell Rocks / Sea Caves — low tide gives the best experience.",
    },
    {
      id: 3,
      title: "Family-friendly ideas",
      body: "Boardwalks, beaches, easy lookouts + a cozy café stop.",
    },
  ];

  return (
  
    <div
      className="home-page"
      style={{ backgroundImage: "url(/images/hero/home-hero.jpg)" }}
    >
      <div className="home-hero">
        <Hero
          title="New Brunswick Travel Stories"
          subtitle="Find the inspiration behind your next adventure — coastal roads, Fundy tides, beaches and cozy towns."
          primaryText="Explore destinations"
          primaryTo="/destinations"
          secondaryText="Build itinerary"
          secondaryTo="/itineraries"
        />
      </div>

      <section className="section home-slider-section">
        <div className="container home-slider-wrap">
          <SlideCarousel slides={slides} auto />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="card home-card">
            <h2 className="home-h2">Plan your trip</h2>
            <p className="muted home-lead">
              Quick tips to make your weekend plan easy.
            </p>

            <Accordion items={tips} />

            <div className="row home-actions">
              <Link className="btn btn-primary" to="/itineraries">
                See itineraries
              </Link>
              <Link className="btn btn-ghost" to="/tips">
                Travel tips
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section home-cta">
        <div className="container">
          <div className="card home-card home-card-center">
            <h2 className="home-h2">Ready to explore?</h2>
            <p className="muted home-lead">
              Browse all places — beaches, hikes, cities and viewpoints.
            </p>

            <div className="row home-actions">
              <Link className="btn btn-primary" to="/destinations">
                Go to Destinations
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
