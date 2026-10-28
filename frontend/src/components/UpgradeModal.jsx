import React from "react";
import { useNavigate } from "react-router-dom";

export default function UpgradeModal({ open, onClose }) {
  const navigate = useNavigate();

  if (!open) return null;

  const handleUpgrade = () => {
    onClose?.();
    navigate("/pricing");
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        background: "rgba(0, 0, 0, 0.75)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="upgrade-title"
        style={{
          width: "100%",
          maxWidth: "420px",
          padding: "28px",
          borderRadius: "20px",
          background: "#171923",
          color: "#ffffff",
          textAlign: "center",
          border: "1px solid #3b4052",
          boxShadow: "0 20px 70px rgba(0,0,0,0.5)",
        }}
      >
        <div style={{ fontSize: "42px", marginBottom: "12px" }}>
          🚀
        </div>

        <h2 id="upgrade-title" style={{ margin: "0 0 12px" }}>
          Free Messages Completed!
        </h2>

        <p style={{ color: "#c5c9d6", lineHeight: 1.6 }}>
          You have used your 5 free AI requests for today.
          Upgrade to CryvixAI Pro to continue using your AI tools.
        </p>

        <button
          onClick={handleUpgrade}
          style={{
            width: "100%",
            padding: "13px",
            marginTop: "12px",
            border: "none",
            borderRadius: "10px",
            background: "#7565f5",
            color: "#ffffff",
            fontWeight: "700",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          Upgrade to Pro
        </button>

        <button
          onClick={onClose}
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "10px",
            border: "1px solid #45495a",
            borderRadius: "10px",
            background: "transparent",
            color: "#ffffff",
            cursor: "pointer",
          }}
        >
          Maybe Later
        </button>
      </div>
    </div>
  );
}