import React from "react";
import { useNavigate } from 'react-router-dom';
import styles from './LandingPage.module.css';
import CookieConsent from './CookieConsent';

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

  // Add padding to the body when component mounts
//  React.useEffect(() => {
  //  document.body.style.paddingBottom = '140px';
   // return () => {
     // document.body.style.paddingBottom = '0';
    //};
//  }, []);

  return (
    <div className={styles['landing-root']} style={{ position: 'relative', minHeight: '100vh' }}>
      <div> {/* Removed inline padding as we're using body padding */}
      {/* Navigation Bar */}
      <nav className={styles['navbar']}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <img 
            src="/images/landingpage/logo.png" 
            alt="WeCicada Logo" 
            className={styles['logo']} 
            onClick={refreshPage} 
          />
        </div>
        <ul className={styles['nav-list']}>
          <li><a href="#" onClick={refreshPage} className={styles['nav-link']}>Home</a></li>
          <li><a href="#" onClick={() => handleScroll('features-section')} className={styles['nav-link']}>Benefits</a></li>
          <li><a href="#" onClick={() => handleScroll('how-it-works-section')} className={styles['nav-link']}>How it works?</a></li>
          <li><a href="#" onClick={() => handleScroll('footer-section')} className={styles['nav-link']}>Contact</a></li>
        </ul>
        <div className={styles['button-group']}>
          <button onClick={() => navigate('/SignInPage')} style={{ backgroundColor: '#441752', color: '#A888B5', padding: '12px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '16px' }}>Sign In</button>
        </div>      
      </nav>

      {/* Header Section */}
      <header className={styles['header-section']}>
        <h1>Where Event Planning Meets Innovation</h1>
        <p>
          Are you an event organizer looking for trusted suppliers? Or a supplier ready to expand your client base? WeCicada is the ultimate platform designed to make event planning and collaboration seamless, efficient, and secure.
        </p>
        <button onClick={() => navigate('/SignUpPage')} className={styles['get-started-btn']}>Get Started</button>
      </header>

      {/* Landscape Image */}
      <div className={styles['landing-image-wrapper']}>
        <img src="/images/landingpage/mainimage2.png" alt="Landscape" className={styles['landing-image']} />
      </div>

      {/* Why Choose Us Section */}
      <section id="features-section" className={styles['section']} style={{ backgroundColor: '#A888B5' }}>
        <h2 className={styles['section-title']} style={{ color: '#441752' }}>Why choose WeCicada?</h2>
        <div className={styles['section-content']}>
          <div>
            <h3>Simplified Connections</h3>
            <p>With WeCicada, event organizers and suppliers can connect directly. Say goodbye to endless searches and hello to streamlined communication and collaboration. Our platform ensures you find the right partners faster than ever.</p>
          </div>
          <hr />
          <div>
            <h3>Trusted Partnership</h3>
            <p>We prioritize safety and reliability. Each supplier on our platform is thoroughly vetted, so you can focus on planning your event with peace of mind.</p>
          </div>
          <hr />
          <div>
            <h3>Unparalleled Efficiency</h3>
            <p>Our app simplifies every stage of event planning. From initial outreach to final agreements, we’ve built tools to save you time and resources.</p>
          </div>
          <hr />
          <div>
            <h3>Attract More Business</h3>
            <p>Suppliers can showcase their portfolios, gain visibility, and attract more clients. Event organizers can manage multiple events and vendors in one centralized platform.</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles['section']} style={{ backgroundColor: '#441752' }}>
        <h2 className={styles['section-title']} style={{ color: '#A888B5' }}>Features Designed for Success</h2>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <img src="/images/landingpage/features.png" alt="Features Infographic" className={styles['features-image']} />
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works-section" className={styles['section']} style={{ backgroundColor: '#441752' }}>
        <h2 className={styles['section-title']} style={{ color: '#A888B5' }}>How it works?</h2>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <img src="/images/landingpage/howitworks.png" alt="How It Works Infographic" style={{ width: '100%', height: 'auto' }} />
        </div>
      </section>

      {/* Footer Section */}
      <footer id="footer-section" className={styles['footer']}>
        <p>
  Ready to Revolutionize Your Events? Join thousands of professionals who are transforming the way they work.
</p>

<a href="mailto:contact@wecicada.com" style={{ fontSize: '20px', display: 'block', marginTop: '20px' }}>
  Contact: contact@wecicada.com
</a>
<p style={{ fontSize: '12px', marginTop: '20px' }}>Copyright © WeCicada</p>
<p style={{ fontSize: '12px', marginTop: '4px' }}>
  <a href="#" onClick={() => navigate('/TermsAndConditions')}>Terms & Conditions</a>
</p>
      </footer>
      </div> {/* Close the padding div */}
      <CookieConsent />
    </div>
  );
};

export default LandingPage;
