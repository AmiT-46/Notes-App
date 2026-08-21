import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <main className="hero">
      <section className="hero__content">
        <div className="hero__copy">
          <p className="hero__eyebrow">
            Your thoughts, beautifully organized
          </p>
          <h1 className="hero__title">
            A clearer home for your ideas.
          </h1>
          <p className="hero__description">
            Capture everyday thoughts, keep important ideas close, and find what you need when it matters.
          </p>

          <div className="hero__actions">
            <Link
              to="/signUp"
              className="button button--primary hero__action"
            >
              Get started for free
            </Link>
            <Link
              to="/login"
              className="button button--secondary hero__action"
            >
              I already have an account
            </Link>
          </div>
        </div>

        <div className="hero-preview">
          <div className="hero-preview__glow" />
          <div className="hero-preview__card">
            <div className="hero-preview__header">
              <span className="hero-preview__name">Notes</span>
              <span className="hero-preview__add">Add note</span>
            </div>
            <article className="hero-preview__note">
              <div className="hero-preview__note-header">
                <div>
                  <h2 className="hero-preview__note-title">Ideas for the next chapter</h2>
                  <p className="hero-preview__note-date">Today</p>
                </div>
                <span className="hero-preview__star">★</span>
              </div>
              <p className="hero-preview__note-copy">
                Keep the useful details together, then return to them with a clear mind.
              </p>
              <div className="hero-preview__tags">
                <span className="badge">#ideas</span>
                <span className="badge">#planning</span>
              </div>
            </article>
            <div className="hero-preview__skeleton">
              <div className="skeleton skeleton--title" />
              <div className="skeleton skeleton--line" />
              <div className="skeleton skeleton--line-short" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Hero;
