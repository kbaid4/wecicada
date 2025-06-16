import React from "react";

const TermsAndConditions = () => (
  <div style={{ backgroundColor: "#A888B5", color: "#441752", padding: "40px 20px", minHeight: "100vh", fontFamily: "Arial, sans-serif" }}>
    <h1 style={{ color: "#441752", fontSize: "36px", fontWeight: "bold", marginBottom: "24px", textAlign: "center" }}>Terms & Conditions</h1>
    <div style={{ maxWidth: "900px", margin: "0 auto", fontSize: "18px", lineHeight: 1.7 }}>
      <p>
        Welcome to WeCicada! By accessing or using our platform, you agree to comply with and be bound by the following terms and conditions. Please read them carefully.
      </p>
      <ol>
        <li><b>Use of Platform:</b> You must use this platform for lawful purposes only and in accordance with these terms.</li>
        <li><b>Account Responsibility:</b> You are responsible for maintaining the confidentiality of your account and password and for all activities that occur under your account.</li>
        <li><b>Intellectual Property:</b> All content, trademarks, and data on this platform are the property of WeCicada or its licensors. Unauthorized use is prohibited.</li>
        <li><b>Limitation of Liability:</b> WeCicada is not liable for any damages arising from your use of the platform.</li>
        <li><b>Changes to Terms:</b> We may update these terms from time to time. Continued use of the platform means you accept the new terms.</li>
        <li><b>Contact:</b> For any questions, contact us at <a href="mailto:contact@wecicada.com" style={{ color: '#441752' }}>contact@wecicada.com</a>.</li>
      </ol>
      <p style={{ marginTop: "32px", color: "#441752" }}><b>Last updated:</b> May 28, 2025</p>
    </div>
  </div>
);

export default TermsAndConditions;
