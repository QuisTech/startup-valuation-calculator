import Link from 'next/link';
import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>Startup Valuation Calculator — Landing Page</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      {/* Your original HTML structure with Next.js Link components */}
      <header>
        <h1>Startup Valuation Calculator</h1>
        <nav>
          <a href="#features">Features</a>
          <Link href="/calculator">Calculator</Link>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-text">
          <h2>Know Your Startup's True Worth</h2>
          <p>Our Startup Valuation Calculator uses advanced algorithms and market data to give you accurate, investor‑ready valuations in minutes.</p>
          <Link href="/calculator" className="btn">Try the Calculator</Link>
        </div>
        <div className="hero-illustration">💡 Startup Insights</div>
      </section>

      <section id="features" className="features">
        <h3>Why Use Our Calculator?</h3>
        <div className="feature-grid">
          <div className="feature">
            <h4>Data‑Driven Accuracy</h4>
            <p>Leverage AI and market analytics to ensure your startup's valuation reflects real‑time conditions and growth potential.</p>
          </div>
          <div className="feature">
            <h4>Investor‑Ready Reports</h4>
            <p>Generate detailed reports you can confidently present to investors and stakeholders.</p>
          </div>
          <div className="feature">
            <h4>Instant Results</h4>
            <p>Input your metrics and receive your valuation within seconds — no waiting, no guesswork.</p>
          </div>
        </div>
      </section>

      <section className="cta" id="calculator">
        <h3>Calculate Your Valuation Today</h3>
        <p>Get started now and discover how much your startup is worth in less than 5 minutes.</p>
        <Link href="/calculator" className="btn">Launch Calculator</Link>
      </section>

      <footer>
        <p>© 2025 Startup Valuation Calculator — Empowering founders with smarter valuation insights.</p>
      </footer>
    </>
  );
}