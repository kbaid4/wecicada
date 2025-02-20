import React from "react";
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleScroll = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const refreshPage = () => {
    window.location.reload();
  };

  return (
    <div style={{ backgroundColor: '#441752', fontFamily: 'Arial, sans-serif' }}>
      {/* Navigation Bar */}
      <nav style={{ backgroundColor: '#A888B5', padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <img 
            src="/images/landingpage/logo.png" 
            alt="WeCicada Logo" 
            style={{ height: '40px', cursor: 'pointer' }} 
            onClick={refreshPage} 
          />
        </div>
        <ul style={{ display: 'flex', gap: '24px', listStyleType: 'none', margin: 0, padding: 0, justifyContent: 'center', flex: 1 }}>
          <li><a href="#" onClick={refreshPage} style={{ color: '#441752', textDecoration: 'none' }}>Home</a></li>
          <li><a href="#" onClick={() => handleScroll('features-section')} style={{ color: '#441752', textDecoration: 'none' }}>Benefits</a></li>
          <li><a href="#" onClick={() => handleScroll('how-it-works-section')} style={{ color: '#441752', textDecoration: 'none' }}>How it works?</a></li>
          <li><a href="#" onClick={() => handleScroll('footer-section')} style={{ color: '#441752', textDecoration: 'none' }}>Contact</a></li>
        </ul>
        <div style={{ display: 'flex', gap: '16px' }}>
          <a href="#" onClick={() => navigate('/AddSupplier')} style={{ color: '#441752', textDecoration: 'none', alignSelf: 'center' }}>Supplier login?</a>
          <button onClick={() => navigate('/SignInPage')} style={{ backgroundColor: '#441752', color: '#A888B5', padding: '12px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '16px' }}>Sign In</button>
        </div>      
      </nav>

      {/* Header Section */}
      <header style={{ textAlign: 'center', padding: '40px 20px' }}>
        <h1 style={{ color: '#A888B5', fontSize: '50px', fontWeight: 'bold', marginBottom: '16px' }}>Where Event Planning Meets Innovation</h1>
        <p style={{ color: '#A888B5', fontStyle: 'italic', fontSize: '18px', maxWidth: '768px', margin: '0 auto 24px' }}>
          Are you an event organizer looking for trusted suppliers? Or a supplier ready to expand your client base? WeCicada is the ultimate platform designed to make event planning and collaboration seamless, efficient, and secure.
        </p>
        <button onClick={() => navigate('/SignUpPage')} style={{ backgroundColor: '#A888B5', color: '#441752', padding: '16px 32px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '24px', fontWeight: 'bold' }}>Get Started</button>
      </header>

      {/* Landscape Image */}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center'}}>
        <img src="/images/landingpage/mainimage2.png" alt="Landscape" style={{ width: '100%', height: 'auto', maxWidth: '960px', borderRadius: '25px' }} />
      </div>

      {/* Why Choose Us Section */}
      <section id="features-section" style={{ backgroundColor: '#A888B5', padding: '40px 20px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: '#441752', marginBottom: '32px' }}>Why choose WeCicada?</h2>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'left', color: '#441752' }}>
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold' }}>Simplified Connections</h3>
            <p>With WeCicada, event organizers and suppliers can connect directly. Say goodbye to endless searches and hello to streamlined communication and collaboration. Our platform ensures you find the right partners faster than ever.</p>
          </div>
          <hr style={{ border: '0.5px solid #3b0764', margin: '16px 0' }} />
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold' }}>Trusted Partnership</h3>
            <p>We prioritize safety and reliability. Each supplier on our platform is thoroughly vetted, so you can focus on planning your event with peace of mind.</p>
          </div>
          <hr style={{ border: '0.5px solid #3b0764', margin: '16px 0' }} />
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold' }}>Unparalleled Efficiency</h3>
            <p>Our app simplifies every stage of event planning. From initial outreach to final agreements, we’ve built tools to save you time and resources.</p>
          </div>
          <hr style={{ border: '0.5px solid #3b0764', margin: '16px 0' }} />
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold' }}>Attract More Business</h3>
            <p>Suppliers can showcase their portfolios, gain visibility, and attract more clients. Event organizers can manage multiple events and vendors in one centralized platform.</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ backgroundColor: '#441752', padding: '40px 20px' }}>
        <h2 style={{ color: '#A888B5', fontSize: '32px', fontWeight: 'bold', textAlign: 'center', marginBottom: '32px' }}>Features Designed for Success</h2>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <img src="/images/landingpage/features.png" alt="Features Infographic" style={{ width: '100%', height: 'auto', maxWidth: '960px' }} />
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works-section" style={{ backgroundColor: '#441752', padding: '40px 20px' }}>
        <h2 style={{ color: '#A888B5', fontSize: '32px', fontWeight: 'bold', textAlign: 'center', marginBottom: '32px' }}>How it works?</h2>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <img src="/images/landingpage/howitworks.png" alt="How It Works Infographic" style={{ width: '100%', height: 'auto' }} />
        </div>
      </section>

      {/* Footer Section */}
      <footer id="footer-section" style={{ backgroundColor: '#A888B5', padding: '40px 20px', textAlign: 'center' }}>
        <p style={{ color: '#441752', fontSize: '24px' }}>
          Ready to Revolutionize Your Events? Join thousands of professionals who are transforming the way they work.
        </p>
        <a href="mailto:commercial@wecicada.com" style={{ fontSize: '20px', display: 'block', marginTop: '20px', color: '#441752', textDecoration: 'none' }}>
          Contact: commercial@wecicada.com
        </a>
        <p style={{ color: '#441752', fontSize: '12px', marginTop: '20px' }}>Copyright © WeCicada</p>
      </footer>
    </div>
  );
};

export default LandingPage;