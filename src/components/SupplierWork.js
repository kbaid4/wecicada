import React from "react";

const MyWork = () => (
  <div className="supplier-work-root" style={{ backgroundColor: "#A888B5", minHeight: "100vh", padding: "40px 20px", fontFamily: "Arial, sans-serif", color: "#441752" }}>
    <h1 className="supplier-work-title" style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "24px" }}>My Work</h1>
    <p className="supplier-work-desc" style={{ fontSize: "18px" }}>(Feature coming soon!)</p>
    <style>{`
      @media (max-width: 600px) {
        .supplier-work-root {
          padding: 16px 4px !important;
        }
        .supplier-work-title {
          font-size: 20px !important;
          margin-bottom: 12px !important;
        }
        .supplier-work-desc {
          font-size: 14px !important;
        }
      }
    `}</style>
  </div>
);

export default MyWork;

