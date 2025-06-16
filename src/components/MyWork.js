import React from "react";

const MyWork = () => (
  <div className="mywork-container">
    <h1 className="mywork-title">My Work</h1>
    <p className="mywork-desc">(Feature coming soon!)</p>
    <style jsx>{`
      .mywork-container {
        background-color: #A888B5;
        min-height: 100vh;
        padding: 40px 20px;
        font-family: Arial, sans-serif;
        color: #441752;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
      }
      .mywork-title {
        font-size: 32px;
        font-weight: bold;
        margin-bottom: 24px;
      }
      .mywork-desc {
        font-size: 18px;
      }
      @media (max-width: 600px) {
        .mywork-container {
          padding: 20px 8px;
          align-items: stretch;
        }
        .mywork-title {
          font-size: 22px;
          margin-bottom: 14px;
        }
        .mywork-desc {
          font-size: 15px;
        }
      }
    `}</style>
  </div>
);

export default MyWork;
