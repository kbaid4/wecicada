import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

const AddSupplier = () => {

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    console.log('Form submitted:', formData);
    setError('');

    navigate("/SupplierHomepage"); 

  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

    //navigate("/LandingPage");
  };

  return (
    <div className="main-container">
      <div className="signup-container">
      <div className="logo-container">
          <img 
            src={`${process.env.PUBLIC_URL}/images/landingpage/logo.png`} 
            alt="CITADA Logo" 
            className="site-logo"
          />
        </div>        
        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="signup-button" onClick={() => navigate("/SupplierHomepage")}>Invite</button>
        </form>

        <style jsx>{`
          .main-container {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background-image: url('/images/landingpage/loginbg.png');
            background-size: cover;
            background-position: center;
            background-attachment: fixed;
          }

          .signup-container {
            max-width: 400px;
            width: 90%;
            margin: 2rem;
            padding: 2rem;
            background: rgba(168, 136, 181, 0.95);
            box-shadow: 0 0 20px rgba(0,0,0,0.2);
            border-radius: 10px;
            backdrop-filter: blur(5px);
          }
          .logo-container {
            text-align: center;
            margin: 0 auto 2rem;
            max-width: 200px;
          }

          .site-logo {
            width: 100%;
            height: auto;
            max-height: 80px;
            object-fit: contain;
          }

          .signup-form {
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }

          .form-group {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          }

          label {
            font-weight: 500;
            color: #555;
          }

          input, select {
            padding: 0.8rem;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 1rem;
            background: rgba(255, 255, 255, 0.9);
          }

          input:focus, select:focus {
            outline: none;
            border-color: #646cff;
          }

          .signup-button {
            background-color: #441752;
            color: white;
            padding: 1rem;
            border: none;
            border-radius: 4px;
            font-size: 1rem;
            cursor: pointer;
            margin-top: 1rem;
            transition: all 0.3s ease;
          }


          .error-message {
            color: #ff0000;
            margin: 0.5rem 0;
            text-align: center;
          }

          .forgot-password {
            display: block;
            text-align: center;
            margin-top: 1rem;
            color: #441752;
            text-decoration: none;
          }

          .forgot-password:hover {
            text-decoration: underline;
          }
        `}</style>
      </div>
    </div>
  );
};

export default AddSupplier;


