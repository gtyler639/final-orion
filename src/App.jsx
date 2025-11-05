import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './components/pages/Home'
import Cater from './components/pages/Cater'
import Jobfit from './components/pages/Jobfit'
import Resume from './components/pages/Resume'
import Signup from './components/pages/Signup'
import Pricing from './components/pages/Pricing'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cater" element={<Cater />} />
          <Route path="/jobfit" element={<Jobfit />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
