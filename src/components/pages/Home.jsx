import { Link } from 'react-router-dom'

function Home() {
  return (
    <>
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-left">
          <h1 className="hero-title">
            Your dream job at your<br />
            <em>Fingertips</em>
          </h1>
          <p className="hero-subtitle">Land your dream job with AI-powered optimization.</p>
          <div className="hero-buttons">
            <Link to="/signup" className="btn-primary">Try for free</Link>
          </div>
        </div>

        <div className="hero-right">
          <div className="hero-image-container">
            <img src="/Action Sheets.png" alt="Orion Platform Interface" className="hero-image" />
          </div>
        </div>
      </div>

      {/* Trusted by section */}
      <div className="trust-section">
        <p className="trust-label">Trusted by employees of</p>
        <div className="trust-logos">
          <img className="brand" src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" alt="Google" />
          <img className="brand" src="https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_Bélo.svg" alt="Airbnb" />
          <img className="brand" src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Lockheed_Martin_logo.svg/768px-Lockheed_Martin_logo.svg.png?20230620162959" alt="Lockheed Martin" />
          <img className="brand" src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Coca-Cola_logo.svg/768px-Coca-Cola_logo.svg.png?20250612123859" alt="Coca-Cola" />
          <img className="brand" src="https://upload.wikimedia.org/wikipedia/commons/5/53/KP_logo.svg" alt="Kaiser Permanente" />
          {/* Duplicate logos for infinite scroll */}
          <img className="brand" src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" alt="Google" />
          <img className="brand" src="https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_Bélo.svg" alt="Airbnb" />
          <img className="brand" src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Lockheed_Martin_logo.svg/768px-Lockheed_Martin_logo.svg.png?20230620162959" alt="Lockheed Martin" />
          <img className="brand" src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Coca-Cola_logo.svg/768px-Coca-Cola_logo.svg.png?20250612123859" alt="Coca-Cola" />
          <img className="brand" src="https://upload.wikimedia.org/wikipedia/commons/5/53/KP_logo.svg" alt="Kaiser Permanente" />
        </div>
      </div>

      {/* Three cards section */}
      <div className="three-cards-section">
        <div className="section-header">
          <h2 className="section-title">Just drop the url and our AI-Powered Tools will do the rest.</h2>
        </div>

        <div className="cards-grid">
          {/* Card 1: Cater */}
          <div className="vertical-card card-yellow">
            <div className="card-visual">
              <div className="card-icon-large">
                <img src="/Group 2 (1).png" alt="Cater Icon" className="card-icon-img" />
              </div>
            </div>
            <div className="card-content">
              <h3 className="card-title">Cater</h3>
              <p className="card-description">Paste the link or job description and watch Orion edit your resume to maximize your resume's compatibility</p>
              <ul className="card-bullets">
                <li>AI-powered keyword optimization</li>
                <li>ATS compatibility scoring (98% average)</li>
                <li>Job-specific tailoring</li>
                <li>Industry keyword suggestions</li>
                <li>Format optimization</li>
              </ul>
            </div>
          </div>

          {/* Card 2: Job Fit */}
          <div className="vertical-card card-blue">
            <div className="card-visual">
              <div className="card-icon-large">
                <img src="/Group 2 (1).png" alt="Job Fit Icon" className="card-icon-img" />
              </div>
            </div>
            <div className="card-content">
              <h3 className="card-title">Job Fit</h3>
              <p className="card-description">Analyze how well your profile matches job requirements and get personalized improvement suggestions.</p>
              <ul className="card-bullets">
                <li>Skills gap analysis</li>
                <li>Experience matching (92% average)</li>
                <li>Education compatibility check</li>
                <li>Personalized recommendations</li>
                <li>Career path suggestions</li>
              </ul>
            </div>
          </div>

          {/* Card 3: Rewrite */}
          <div className="vertical-card card-orange">
            <div className="card-visual">
              <div className="card-icon-large">
                <img src="/Group 2 (1).png" alt="Rewrite Icon" className="card-icon-img" />
              </div>
            </div>
            <div className="card-content">
              <h3 className="card-title">Rewrite</h3>
              <p className="card-description">Transform your resume with professional language and impactful phrasing that catches recruiters' attention.</p>
              <ul className="card-bullets">
                <li>Professional language enhancement</li>
                <li>Action verb optimization</li>
                <li>Quantified achievements</li>
                <li>Industry-specific terminology</li>
                <li>Impact-focused descriptions</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Home
