function Signup() {
  return (
    <div className="signup-container">
      <div className="form-section">
        <div className="form-content">
          <img src="/gf.png" alt="Orion Logo" className="form-logo" />
          <h2>Welcome to Orion</h2>
          <p>Create your account to get started</p>

          <button className="google-btn">Continue with Google</button>
          <button className="secondary-btn">See other options</button>
          <div className="divider"><span>or</span></div>

          <form>
            <input type="email" placeholder="Enter email address" required />
            <button type="submit" className="submit-btn">Continue</button>
          </form>

          <small className="terms-text">
            By continuing, you agree to Orion's{' '}
            <a href="#">Terms of Service</a> and{' '}
            <a href="#">Privacy Policy</a>.
          </small>
        </div>
      </div>

      <div className="preview-section">
        <img src="/mockup-showcase.png" alt="App Preview" />
      </div>
    </div>
  )
}

export default Signup
