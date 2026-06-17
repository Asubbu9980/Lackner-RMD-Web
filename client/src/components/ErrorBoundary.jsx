import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError() {
    return {
      hasError: true,
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error(
      "Dashboard Error:",
      error,
      errorInfo
    );
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            height: "500px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "16px",
            background:
              "linear-gradient(180deg, #020617 0%, #0f172a 100%)",
            borderRadius: "24px",
            color: "#fff",
            textAlign: "center",
            padding: "24px",
          }}
        >
          <div style={{ fontSize: "50px" }}>
            ⚠️
          </div>

          <h2
            style={{
              margin: 0,
            }}
          >
            Visualization Temporarily
            Unavailable
          </h2>

          <p
            style={{
              color: "#94a3b8",
              maxWidth: "450px",
              margin: 0,
            }}
          >
            Please refresh the dashboard
            and try again.
          </p>

          <button
            onClick={() =>
              window.location.reload()
            }
            style={{
              padding: "10px 20px",
              border: "none",
              borderRadius: "10px",
              background: "#2563eb",
              color: "#fff",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Refresh Dashboard
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;