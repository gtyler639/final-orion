import { Link } from 'react-router-dom'

function Pricing() {
  return (
    <div className="pricing-page">
      {/* Header Section */}
      <div className="pricing-header">
        <h1 className="pricing-main-title">Simple, transparent pricing</h1>
        <p className="pricing-subtitle">Choose the plan that's right for you</p>
      </div>

      {/* Pricing Cards */}
      <div className="pricing-cards-container">
        {/* Free Plan */}
        <div className="pricing-card">
          <div className="pricing-card-header">
            <span className="plan-label">For individuals</span>
            <h2 className="plan-name">Free</h2>
            <p className="plan-description">Get started with basic resume tools.</p>
          </div>

          <div className="pricing-card-price">
            <span className="price-amount">$0</span>
            <span className="price-currency">USD</span>
            <p className="price-period">/ month</p>
          </div>

          <Link to="/signup" className="pricing-cta-btn pricing-cta-secondary">
            Get started
          </Link>

          <div className="pricing-features">
            <h4 className="features-title">What's included:</h4>
            <ul className="features-list">
              <li>
                <span className="feature-icon">✓</span>
                <span>Resume rewriting tool</span>
              </li>
              <li>
                <span className="feature-icon">✓</span>
                <span>Free ATS Checker</span>
              </li>
              <li>
                <span className="feature-icon">✓</span>
                <span>3 resume rewrites</span>
              </li>
              <li>
              </li>
            </ul>
          </div>
        </div>

        {/* Pro Plan - Most Popular */}
        <div className="pricing-card pricing-card-featured">
          <div className="popular-badge">Most popular ※</div>

          <div className="pricing-card-header">
            <span className="plan-label">For job seekers</span>
            <h2 className="plan-name">Pro</h2>
            <p className="plan-description">Unlock all features to maximize your job search.</p>
          </div>

          <div className="pricing-card-price">
            <span className="price-amount">$12</span>
            <span className="price-currency">USD</span>
            <p className="price-period">/ member / month, billed annually</p>
            <p className="price-monthly">$20 when billed monthly</p>
          </div>

          <Link to="/signup" className="pricing-cta-btn pricing-cta-primary">
            Get started
          </Link>

          <div className="pricing-features">
            <h4 className="features-title">Everything in Free, plus:</h4>
            <ul className="features-list">
              <li>
                <span className="feature-icon">✓</span>
                <span>Unlimited resume rewrites</span>
              </li>
              <li>
                <span className="feature-icon">✓</span>
                <span>Smart Resume tailoring for specific jobs</span>
              </li>
              <li>
                <span className="feature-icon">✓</span>
                <span>Job fit analysis with scoring</span>
              </li>
              <li>
                <span className="feature-icon">✓</span>
                <span>ATS optimization (98% Average Score)</span>
              </li>
              <li>
                <span className="feature-icon">✓</span>
                <span>First Access to the Extension</span>
              </li>
              <li>
                <span className="feature-icon">✓</span>
                <span>Cover letter generation</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Enterprise Plan */}
        <div className="pricing-card">
          <div className="pricing-card-header">
            <span className="plan-label">For organizations</span>
            <h2 className="plan-name">Enterprise</h2>
            <p className="plan-description">Custom solutions for recruiting teams.</p>
          </div>

          <div className="pricing-card-price">
            <span className="price-amount">Custom</span>
            <p className="price-period">Contact us for pricing</p>
          </div>

          <a href="mailto:sales@orion.com" className="pricing-cta-btn pricing-cta-secondary">
            Contact Sales
          </a>

          <div className="pricing-features">
            <h4 className="features-title">Everything in Pro, plus:</h4>
            <ul className="features-list">
              <li>
                <span className="feature-icon">✓</span>
                <span>Dedicated account manager</span>
              </li>
              <li>
                <span className="feature-icon">✓</span>
                <span>Team collaboration tools</span>
              </li>
              <li>
                <span className="feature-icon">✓</span>
                <span>Custom integrations</span>
              </li>
              <li>
                <span className="feature-icon">✓</span>
                <span>Advanced analytics & reporting</span>
              </li>
              <li>
                <span className="feature-icon">✓</span>
                <span>SSO & custom security</span>
              </li>
              <li>
                <span className="feature-icon">✓</span>
                <span>Onboarding & training</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* FAQ or Additional Info Section */}
      <div className="pricing-footer">
        <h3>Need help choosing?</h3>
        <p>All plans include a 14-day free trial. No credit card required.</p>
        <Link to="/signup" className="btn-primary">Start your free trial</Link>
      </div>
    </div>
  )
}

export default Pricing
