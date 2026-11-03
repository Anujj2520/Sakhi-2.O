import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./Home";
import Dashboard from "./Dashboard";
import Alerts from "./Alerts";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/device"
          element={<Page title="Sakhi Wearable Device" />}
        />

        <Route
          path="/how-it-works"
          element={<Page title="How Sakhi Works" />}
        />

        <Route
          path="/technology"
          element={<Page title="Sakhi Technology" />}
        />

        <Route
          path="/about"
          element={<Page title="About Sakhi" />}
        />

        <Route path="/dashboard" element={<Dashboard />} />

        {/* Working Emergency Alerts Page */}
        <Route path="/alerts" element={<Alerts />} />

        <Route
          path="/devices"
          element={<Page title="Connected Devices" />}
        />

        <Route
          path="/location"
          element={<Page title="Live Location" />}
        />

        <Route
          path="/contacts"
          element={<Page title="Trusted Contacts" />}
        />

        <Route
          path="/settings"
          element={<Page title="Settings" />}
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

function Page({ title }: { title: string }) {
  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "60px 24px",
        background: "#080a12",
        color: "#f5f5fa",
        textAlign: "center",
      }}
    >
      <h1>{title}</h1>

      <p style={{ color: "#a0a5b8" }}>
        Welcome to Sakhi 2.0 — Smart Women Safety System.
      </p>

      <a
        href="/"
        style={{
          display: "inline-block",
          marginTop: "20px",
          padding: "12px 22px",
          background: "#a78bfa",
          color: "#080a12",
          borderRadius: "10px",
          fontWeight: 700,
        }}
      >
        Back to Home
      </a>
    </main>
  );
}

export default App;