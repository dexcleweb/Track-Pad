import { Link } from "react-router-dom";
import {
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  Leaf,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";
import Button from "../components/common/Button";

const Home = () => {
  return (
    <section className="home-page">
      <div className="home-hero">
        <div className="hero-copy">
          <span className="badge hero-badge">
            <Leaf size={14} />
            Digital products for better living
          </span>

          <h1>
            Build better habits with{" "}
            <span>templates, trackers, and guidance.</span>
          </h1>

          <p>
            Discover Notion templates, habit trackers, digital planners, and
            paid counselling sessions built for clarity and calm execution.
          </p>

          <div className="actions">
            <Link to="/products">
              <Button>
                Explore Products <ArrowRight size={15} />
              </Button>
            </Link>

            <Link to="/login">
              <Button variant="outline">Login with OTP</Button>
            </Link>
          </div>

          <div className="hero-trust">
            <span>
              <ShieldCheck size={15} />
              Secure UPI payments
            </span>
            <span>
              <CheckCircle2 size={15} />
              Lifetime access
            </span>
          </div>
        </div>

        <div className="hero-card">

          <div className="dashboard-preview">
            <div className="preview-header">
              <div>
                <span className="mini-label">Growth Dashboard</span>
                <h3>Today’s Focus</h3>
              </div>
              <Target size={22} />
            </div>

            <div className="progress-block">
              <div className="progress-row">
                <span>Habit Tracker</span>
                <strong>99%🔥</strong>
              </div>
              <div className="progress-track">
                <div style={{ width: "82%" }} />
              </div>
            </div>

            <div className="preview-list">
              <div>
                <CheckCircle2 size={15} />
                Morning routine completed
              </div>
              <div>
                <CheckCircle2 size={15} />
                Weekly planner updated
              </div>
              <div>
                <CheckCircle2 size={15} />
                Counselling slot booked
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="home-features">
        <div className="feature-card">
          <Sparkles size={22} />
          <h3>Digital Templates</h3>
          <p>Notion systems, planners, trackers, and repeatable workflows.</p>
        </div>

        <div className="feature-card">
          <Target size={22} />
          <h3>Habit Tools</h3>
          <p>Simple products for tracking discipline, goals, and consistency.</p>
        </div>

        <div className="feature-card">
          <CalendarCheck size={22} />
          <h3>Counselling</h3>
          <p>Paid bookings for guided personal support and clarity sessions.</p>
        </div>
      </div>

      <style>{`
        .home-page {
          padding: 10px 0 48px;
          font-family: "Syne", "DM Sans", system-ui, sans-serif;
        }

        .home-hero {
          min-height: calc(100vh - 210px);
          display: grid;
          grid-template-columns: 1.05fr 0.95fr;
          align-items: center;
          gap: 38px;
        }

        .hero-copy {
          position: relative;
          z-index: 2;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          margin-bottom: 14px;
          font-size: 0.78rem;
          border: 1px solid rgba(34, 197, 94, 0.22);
        }

        .hero-copy h1 {
          margin: 0;
          max-width: 660px;
          font-size: clamp(2.45rem, 5.2vw, 5rem);
          line-height: 0.96;
          letter-spacing: -0.065em;
          font-weight: 950;
        }

        .hero-copy h1 span {
          background: linear-gradient(120deg, #f5d800, #22c55e 55%, #e6a800);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-copy p {
          margin: 18px 0 0;
          max-width: 560px;
          font-size: 0.98rem;
          line-height: 1.65;
          color: var(--muted);
        }

        .home-page .actions {
          margin-top: 24px;
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .home-page .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          padding: 12px 18px;
          font-size: 0.92rem;
          box-shadow: 0 10px 26px rgba(34, 197, 94, 0.15);
        }

        .hero-trust {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
          margin-top: 20px;
          color: var(--muted);
          font-size: 0.86rem;
          font-weight: 700;
        }

        .hero-trust span {
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .hero-trust svg {
          color: #22c55e;
        }

        .hero-card {
          position: relative;
          min-height: 420px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hero-card::before {
          content: "";
          position: absolute;
          width: 310px;
          height: 310px;
          border-radius: 999px;
          background:
            radial-gradient(circle, rgba(34, 197, 94, 0.28), transparent 62%),
            radial-gradient(circle at 70% 30%, rgba(245, 216, 0, 0.22), transparent 48%);
          filter: blur(8px);
          opacity: 0.85;
        }

        .dashboard-preview {
          position: relative;
          z-index: 2;
          width: min(480px, 100%);
          border-radius: 26px;
          padding: 22px;
          background:
            linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02)),
            var(--card);
          border: 1px solid rgba(34, 197, 94, 0.2);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
          overflow: hidden;
        }

        .dashboard-preview::before {
          content: "";
          position: absolute;
          inset: -70px -70px auto auto;
          width: 170px;
          height: 170px;
          border-radius: 999px;
          background: rgba(245, 216, 0, 0.16);
          filter: blur(10px);
        }

        .preview-header {
          position: relative;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 14px;
        }

        .mini-label {
          color: #22c55e;
          font-size: 0.72rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.11em;
        }

        .preview-header h3 {
          margin: 6px 0 0;
          font-size: 1.55rem;
          letter-spacing: -0.045em;
        }

        .preview-header svg {
          color: #f5d800;
        }

        .progress-block {
          margin-top: 24px;
          padding: 14px;
          border-radius: 18px;
          background: rgba(34, 197, 94, 0.08);
          border: 1px solid rgba(34, 197, 94, 0.16);
        }

        .progress-row {
          display: flex;
          justify-content: space-between;
          color: var(--text);
          font-size: 0.9rem;
          font-weight: 800;
        }

        .progress-track {
          height: 8px;
          margin-top: 11px;
          border-radius: 99px;
          background: rgba(34, 197, 94, 0.14);
          overflow: hidden;
        }

        .progress-track div {
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(90deg, #22c55e, #f5d800);
        }

        .preview-list {
          margin-top: 16px;
          display: grid;
          gap: 9px;
        }

        .preview-list div {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 12px;
          border-radius: 14px;
          color: var(--muted);
          background: rgba(255, 255, 255, 0.035);
          border: 1px solid rgba(34, 197, 94, 0.12);
          font-size: 0.86rem;
          font-weight: 700;
        }

        .preview-list svg {
          color: #22c55e;
          flex-shrink: 0;
        }

        .floating-pill {
          position: absolute;
          z-index: 3;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 9px 13px;
          border-radius: 999px;
          color: var(--text);
          background: var(--card);
          border: 1px solid rgba(34, 197, 94, 0.18);
          box-shadow: 0 14px 35px rgba(0, 0, 0, 0.12);
          font-size: 0.78rem;
          font-weight: 900;
        }

        .floating-pill svg {
          color: #22c55e;
        }

        .pill-one {
          top: 38px;
          left: 10px;
        }

        .pill-two {
          right: 0;
          bottom: 76px;
        }

        .home-features {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-top: 18px;
        }

        .feature-card {
          position: relative;
          padding: 20px;
          border-radius: 22px;
          background: var(--card);
          border: 1px solid var(--border);
          box-shadow: var(--shadow);
          overflow: hidden;
        }

        .feature-card::before {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at top right, rgba(34, 197, 94, 0.12), transparent 42%);
          pointer-events: none;
        }

        .feature-card svg {
          color: #22c55e;
        }

        .feature-card h3 {
          margin: 14px 0 6px;
          font-size: 1.08rem;
        }

        .feature-card p {
          margin: 0;
          color: var(--muted);
          font-size: 0.9rem;
          line-height: 1.55;
        }

        @media (max-width: 920px) {
          .home-hero {
            grid-template-columns: 1fr;
            gap: 24px;
            min-height: auto;
            padding-top: 22px;
          }

          .hero-card {
            min-height: 360px;
          }

          .home-features {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 560px) {
          .home-page {
            padding: 6px 0 38px;
          }

          .hero-copy h1 {
            font-size: clamp(2.25rem, 12vw, 3.45rem);
          }

          .hero-copy p {
            font-size: 0.92rem;
          }

          .dashboard-preview {
            width: 100%;
            padding: 18px;
            border-radius: 22px;
          }

          .floating-pill {
            display: none;
          }

          .hero-card {
            min-height: 320px;
          }

          .home-page .actions {
            align-items: stretch;
            flex-direction: column;
          }

          .home-page .actions a,
          .home-page .actions button {
            width: 100%;
          }

          .hero-trust {
            gap: 10px;
            font-size: 0.8rem;
          }
        }
      `}</style>
    </section>
  );
};

export default Home;