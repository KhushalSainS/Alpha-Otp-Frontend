import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Footer from './components/footer/Footer';
import Navbar from './components/navbar/Navbar';
import Hero from './components/hero/Hero';
import User from './components/user/User';
import About from './components/about/about-us';
import Pricing from './components/pricing/Pricing';
import Login from './pages/login/Login';
import SignUp from './pages/signup/singup';
import ApiPage from './pages/api/studio';
import StoreContextProvider from './context/StoreContext'; // Make sure path is correct

function HomePage() {
  return (
    <>
      <Hero />
      <User />
      <div id="about">
        <About />
      </div>
      <div id="pricing">
        <Pricing />
      </div>
    </>
  );
}

// Layout component with Navbar and Footer
function Layout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer id="footer" />
    </>
  );
}

function App() {
  return (
    <StoreContextProvider>
      <Router>
        <div className="app">
          <Routes>
            {/* Routes with layout */}
            <Route path="/" element={
              <Layout>
                <HomePage />
              </Layout>
            } />
            
            
            {/* Other routes with layout */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/studio" element={ <ApiPage/>}/>
          </Routes>
        </div>
      </Router>
    </StoreContextProvider>
  );
}

export default App;