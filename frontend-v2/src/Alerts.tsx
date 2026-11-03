import { useEffect, useState } from "react";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  RefreshCw,
  ShieldAlert,
} from "lucide-react";

interface AlertItem {
  id: string;
  deviceId: string;
  type: string;
  message: string;
  latitude: number | null;
  longitude: number | null;
  status: string;
  createdAt: string;
}

const API_BASE = "http://localhost:5000/api";

export default function Alerts() {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  async function loadAlerts() {
    try {
      setError("");

      const response = await fetch(`${API_BASE}/alerts`);

      if (!response.ok) {
        throw new Error("Unable to load alerts from the server.");
      }

      const result = await response.json();

      if (result.success === false) {
        throw new Error(result.message || "Failed to load alerts.");
      }

      setAlerts(Array.isArray(result.alerts) ? result.alerts : []);
      setLastUpdated(new Date());
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while loading alerts."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadAlerts();

    const interval = window.setInterval(() => {
      void loadAlerts();
    }, 5000);

    return () => window.clearInterval(interval);
  }, []);

  const activeCount = alerts.filter(
    (alert) => alert.status.toLowerCase() === "active"
  ).length;

  const resolvedCount = alerts.filter(
    (alert) => alert.status.toLowerCase() === "resolved"
  ).length;

  function formatDate(date: string) {
    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Unknown date";
    }

    return parsedDate.toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }

  return (
    <main className="alerts-page">
      <header className="alerts-header">
        <div>
          <span className="alerts-eyebrow">
            <ShieldAlert size={16} /> SAKHI SAFETY SYSTEM
          </span>

          <h1>Emergency Alerts</h1>

          <p>
            Monitor and review SOS alerts received from Sakhi devices.
          </p>
        </div>

        <button
          className="alerts-refresh-button"
          onClick={() => void loadAlerts()}
          disabled={loading}
        >
          <RefreshCw size={17} />
          Refresh Alerts
        </button>
      </header>

      {error && (
        <div className="alerts-error" role="alert">
          <AlertTriangle size={20} />
          <span>{error}</span>
          <button onClick={() => void loadAlerts()}>Retry</button>
        </div>
      )}

      <section className="alerts-stats">
        <article className="alerts-stat-card">
          <div className="alerts-stat-icon">
            <ShieldAlert size={22} />
          </div>
          <div>
            <p>Total Alerts</p>
            <h2>{alerts.length}</h2>
          </div>
        </article>

        <article className="alerts-stat-card">
          <div className="alerts-stat-icon active">
            <AlertTriangle size={22} />
          </div>
          <div>
            <p>Active Alerts</p>
            <h2>{activeCount}</h2>
          </div>
        </article>

        <article className="alerts-stat-card">
          <div className="alerts-stat-icon resolved">
            <CheckCircle size={22} />
          </div>
          <div>
            <p>Resolved Alerts</p>
            <h2>{resolvedCount}</h2>
          </div>
        </article>
      </section>

      <section className="alerts-list-section">
        <div className="alerts-list-heading">
          <div>
            <h2>Alert History</h2>
            <p>Latest alerts from your Sakhi backend.</p>
          </div>

          {lastUpdated && (
            <span className="alerts-updated">
              Updated {lastUpdated.toLocaleTimeString("en-IN")}
            </span>
          )}
        </div>

        {loading ? (
          <div className="alerts-empty">
            <RefreshCw size={26} />
            <p>Loading alerts...</p>
          </div>
        ) : alerts.length === 0 ? (
          <div className="alerts-empty">
            <ShieldAlert size={32} />
            <h3>No alerts yet</h3>
            <p>Test SOS alerts will appear here when received.</p>
          </div>
        ) : (
          <div className="alerts-list">
            {alerts.map((alert) => (
              <article className="alert-card" key={alert.id}>
                <div className="alert-card-icon">
                  <AlertTriangle size={23} />
                </div>

                <div className="alert-card-content">
                  <div className="alert-card-title">
                    <h3>{alert.type || "Emergency Alert"}</h3>

                    <span
                      className={`alert-status ${
                        alert.status.toLowerCase() === "active"
                          ? "is-active"
                          : "is-resolved"
                      }`}
                    >
                      {alert.status}
                    </span>
                  </div>

                  <p className="alert-message">{alert.message}</p>

                  <div className="alert-metadata">
                    <span>
                      <ShieldAlert size={15} />
                      {alert.deviceId}
                    </span>

                    <span>
                      <Clock size={15} />
                      {formatDate(alert.createdAt)}
                    </span>

                    <span>
                      <MapPin size={15} />
                      {alert.latitude != null && alert.longitude != null
                        ? `${alert.latitude}, ${alert.longitude}`
                        : "Location unavailable"}
                    </span>
                  </div>

                  {alert.latitude != null && alert.longitude != null && (
                    <a
                      className="alert-map-link"
                      href={`https://www.google.com/maps?q=${alert.latitude},${alert.longitude}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View on Google Maps
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <p className="alerts-demo-note">
        Demo mode: alerts are fetched from the local backend every 5 seconds.
        This page does not contact emergency services.
      </p>
    </main>
  );
}
import "./Alerts.css";