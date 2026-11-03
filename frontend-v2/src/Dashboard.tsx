import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  LayoutDashboard,
  Bell,
  Smartphone,
  MapPin,
  Users,
  Settings,
  Battery,
  Wifi,
  WifiOff,
  Activity,
  ArrowUpRight,
  Clock3,
  RefreshCw,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import "./Dashboard.css";

const API_BASE = "http://localhost:5000/api";

type Device = {
  id?: string;
  deviceId?: string;
  name?: string;
  battery?: number;
  batteryLevel?: number;
  online?: boolean;
  status?: string;
  latitude?: number;
  longitude?: number;
  location?: {
    latitude?: number;
    longitude?: number;
  };
  lastSeen?: string;
};

type Alert = {
  id?: string | number;
  type?: string;
  title?: string;
  message?: string;
  status?: string;
  createdAt?: string;
  timestamp?: string;
};

type ApiData = {
  devices: Device[];
  alerts: Alert[];
};

const initialData: ApiData = {
  devices: [],
  alerts: [],
};

const navigation = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Emergency Alerts", path: "/alerts", icon: Bell },
  { label: "Connected Devices", path: "/devices", icon: Smartphone },
  { label: "Live Location", path: "/location", icon: MapPin },
  { label: "Trusted Contacts", path: "/contacts", icon: Users },
  { label: "Settings", path: "/settings", icon: Settings },
];

function getDeviceId(device: Device) {
  return device.deviceId || device.id || "Sakhi device";
}

function getBattery(device: Device) {
  return device.battery ?? device.batteryLevel ?? null;
}

function isOnline(device: Device) {
  return device.online === true || device.status?.toLowerCase() === "online";
}

function formatTime(value?: string) {
  if (!value) return "Time unavailable";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Time unavailable";

  return date.toLocaleString([], {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function Dashboard() {
  const [data, setData] = useState<ApiData>(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sosSending, setSosSending] = useState(false);
  const [sosMessage, setSosMessage] = useState("");

  async function loadDashboard() {
    setLoading(true);
    setError("");

    try {
      const [deviceResponse, alertResponse] = await Promise.all([
        fetch(`${API_BASE}/devices`),
        fetch(`${API_BASE}/alerts`),
      ]);

      if (!deviceResponse.ok || !alertResponse.ok) {
        throw new Error("The server could not load all dashboard information.");
      }

      const deviceJson = await deviceResponse.json();
      const alertJson = await alertResponse.json();

      const devices: Device[] = Array.isArray(deviceJson)
        ? deviceJson
        : Array.isArray(deviceJson.devices)
          ? deviceJson.devices
          : Array.isArray(deviceJson.data)
            ? deviceJson.data
            : [];

      const alerts: Alert[] = Array.isArray(alertJson)
        ? alertJson
        : Array.isArray(alertJson.alerts)
          ? alertJson.alerts
          : Array.isArray(alertJson.data)
            ? alertJson.data
            : [];

      setData({ devices, alerts });
      setLastUpdated(new Date());
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to connect to the Sakhi server.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function sendTestSOS() {
    if (sosSending) return;

    setSosSending(true);
    setSosMessage("");

    try {
      const device = data.devices[0];

      if (!device) {
        throw new Error("No connected device found.");
      }

      const latitude =
        device.latitude ?? device.location?.latitude ?? null;
      const longitude =
        device.longitude ?? device.location?.longitude ?? null;

      const response = await fetch(`${API_BASE}/alerts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          deviceId: getDeviceId(device),
          type: "SOS",
          message: "Test SOS alert generated from Sakhi dashboard.",
          latitude,
          longitude,
        }),
      });

      const result = await response.json();

      if (!response.ok || result.success === false) {
        throw new Error(result.message || "Unable to create SOS alert.");
      }

      setSosMessage("Test SOS alert created successfully!");
      await loadDashboard();
    } catch (err) {
      setSosMessage(
        err instanceof Error
          ? `Failed: ${err.message}`
          : "Unable to create test SOS alert.",
      );
    } finally {
      setSosSending(false);
    }
  }

  useEffect(() => {
    void loadDashboard();

    const interval = window.setInterval(() => {
      void loadDashboard();
    }, 30000);

    return () => window.clearInterval(interval);
  }, []);

  const onlineDevices = data.devices.filter(isOnline).length;

  const activeAlerts = data.alerts.filter((alert) => {
    const status = alert.status?.toLowerCase();

    return (
      status === "active" ||
      status === "new" ||
      status === "pending" ||
      status === "unresolved"
    );
  }).length;

  const primaryDevice = data.devices[0];
  const battery = primaryDevice ? getBattery(primaryDevice) : null;

  const latitude =
    primaryDevice?.latitude ?? primaryDevice?.location?.latitude;

  const longitude =
    primaryDevice?.longitude ?? primaryDevice?.location?.longitude;

  const hasLocation =
    typeof latitude === "number" && typeof longitude === "number";

  return (
    <div className="sakhi-dashboard">
      <aside className={`dashboard-sidebar ${mobileMenuOpen ? "open" : ""}`}>
        <Link to="/" className="dashboard-brand">
          <span className="dashboard-brand-icon">
            <ShieldCheck size={25} />
          </span>

          <span>
            <strong>Sakhi</strong>
            <small>SAFETY SYSTEM</small>
          </span>
        </Link>

        <div className="sidebar-label">WORKSPACE</div>

        <nav className="dashboard-navigation">
          {navigation.map(({ label, path, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              onClick={() => setMobileMenuOpen(false)}
              className={`dashboard-nav-link ${
                path === "/dashboard" ? "active" : ""
              }`}
            >
              <Icon size={19} />
              <span>{label}</span>

              {path === "/alerts" && activeAlerts > 0 && (
                <span className="nav-count">{activeAlerts}</span>
              )}
            </Link>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-safety-card">
            <ShieldCheck size={22} />
            <strong>Your safety matters</strong>
            <p>Sakhi helps you monitor connected safety devices.</p>
          </div>

          <Link to="/" className="back-home-link">
            <ChevronRight size={16} className="back-home-arrow" />
            Back to website
          </Link>
        </div>
      </aside>

      {mobileMenuOpen && (
        <button
          className="dashboard-overlay"
          aria-label="Close navigation"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <main className="dashboard-main">
        <header className="dashboard-topbar">
          <button
            className="dashboard-menu-button"
            aria-label="Toggle navigation"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <div className="dashboard-breadcrumb">
            <span>Workspace</span>
            <ChevronRight size={15} />
            <strong>Dashboard</strong>
          </div>

          <div className="dashboard-topbar-right">
            <span className="dashboard-live-indicator" />
            <span>Device monitoring</span>

            <Link to="/settings" className="dashboard-settings-button" aria-label="Settings">
              <Settings size={19} />
            </Link>
          </div>
        </header>

        <div className="dashboard-content">
          <section className="dashboard-heading">
            <div>
              <div className="dashboard-eyebrow">SAKHI SAFETY CENTER</div>
              <h1>Safety Dashboard</h1>
              <p>
                Monitor your connected devices and review safety alerts in one
                place.
              </p>
            </div>

            <button
              className="dashboard-refresh-button"
              onClick={() => void loadDashboard()}
              disabled={loading}
            >
              <RefreshCw
                size={17}
                className={loading ? "refresh-spinning" : ""}
              />
              Refresh data
            </button>

            <button
              className="dashboard-sos-button"
              onClick={() => void sendTestSOS()}
              disabled={sosSending || loading || data.devices.length === 0}
            >
              <Bell size={17} />
              {sosSending ? "Sending SOS..." : "Send Test SOS"}
            </button>
          </section>

          {sosMessage && (
            <div
              role="status"
              className={`dashboard-sos-message ${
                sosMessage.startsWith("Failed:") ? "error" : "success"
              }`}
            >
              {sosMessage}
            </div>
          )}

          {error && (
            <section className="dashboard-error" role="alert">
              <WifiOff size={20} />
              <div>
                <strong>Unable to refresh dashboard data</strong>
                <p>{error}</p>
                <p>
                  The information may be unavailable until the server
                  reconnects. No new alerts have been created.
                </p>
              </div>
              <button onClick={() => void loadDashboard()}>Retry</button>
            </section>
          )}

          <section className="dashboard-summary-grid">
            <article className="summary-card">
              <div className="summary-card-top">
                <span>Total Devices</span>
                <span className="summary-icon purple">
                  <Smartphone size={21} />
                </span>
              </div>
              <strong className="summary-number">
                {loading && data.devices.length === 0
                  ? "—"
                  : data.devices.length}
              </strong>
              <div className="summary-card-bottom">
                <span className="summary-dot purple-dot" />
                Registered devices
              </div>
            </article>

            <article className="summary-card">
              <div className="summary-card-top">
                <span>Online Devices</span>
                <span className="summary-icon green">
                  <Wifi size={21} />
                </span>
              </div>
              <strong className="summary-number">
                {loading && data.devices.length === 0
                  ? "—"
                  : onlineDevices}
              </strong>
              <div className="summary-card-bottom">
                <span className="summary-dot green-dot" />
                Currently reported online
              </div>
            </article>

            <article className="summary-card">
              <div className="summary-card-top">
                <span>Active Alerts</span>
                <span className="summary-icon orange">
                  <Bell size={21} />
                </span>
              </div>
              <strong className="summary-number">
                {loading && data.alerts.length === 0 ? "—" : activeAlerts}
              </strong>
              <div className="summary-card-bottom">
                <span className="summary-dot orange-dot" />
                Unresolved alert records
              </div>
            </article>

            <article className="summary-card">
              <div className="summary-card-top">
                <span>Primary Battery</span>
                <span className="summary-icon blue">
                  <Battery size={21} />
                </span>
              </div>
              <strong className="summary-number">
                {battery === null ? "—" : `${battery}%`}
              </strong>
              <div className="summary-card-bottom">
                <span className="summary-dot blue-dot" />
                {battery === null
                  ? "Battery data unavailable"
                  : "Reported device battery"}
              </div>
            </article>
          </section>

          <section className="dashboard-main-grid">
            <article className="dashboard-panel device-panel">
              <div className="panel-heading">
                <div>
                  <span className="panel-kicker">DEVICE MANAGEMENT</span>
                  <h2>Connected Devices</h2>
                </div>

                <Link to="/devices" className="panel-link">
                  View all <ArrowUpRight size={16} />
                </Link>
              </div>

              {data.devices.length === 0 ? (
                <div className="dashboard-empty-state">
                  <Smartphone size={30} />
                  <strong>
                    {loading ? "Loading devices..." : "No device data available"}
                  </strong>
                  <p>
                    Registered devices will appear here when the server returns
                    their information.
                  </p>
                </div>
              ) : (
                <div className="device-list">
                  {data.devices.slice(0, 4).map((device, index) => {
                    const deviceBattery = getBattery(device);
                    const online = isOnline(device);

                    return (
                      <div
                        className="device-row"
                        key={`${getDeviceId(device)}-${index}`}
                      >
                        <div className="device-avatar">
                          <Smartphone size={22} />
                        </div>

                        <div className="device-details">
                          <strong>{getDeviceId(device)}</strong>
                          <span>
                            {device.name || "Sakhi safety wearable"}
                          </span>
                        </div>

                        <div className="device-row-status">
                          <span
                            className={`status-pill ${
                              online ? "online" : "offline"
                            }`}
                          >
                            <span />
                            {online ? "Online" : "Offline"}
                          </span>

                          <small>
                            {deviceBattery === null
                              ? "Battery —"
                              : `Battery ${deviceBattery}%`}
                          </small>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <Link to="/devices" className="panel-bottom-link">
                Manage connected devices <ChevronRight size={17} />
              </Link>
            </article>

            <article className="dashboard-panel location-panel">
              <div className="panel-heading">
                <div>
                  <span className="panel-kicker">LOCATION OVERVIEW</span>
                  <h2>Device Location</h2>
                </div>

                <span className="location-icon">
                  <MapPin size={19} />
                </span>
              </div>

              <div className="location-preview">
                <div className="location-grid-pattern" />

                <div className="location-pin">
                  <MapPin size={25} />
                </div>

                <span className="location-preview-label">
                  {hasLocation
                    ? "Device coordinates available"
                    : "Location unavailable"}
                </span>
              </div>

              {hasLocation ? (
                <div className="coordinates-box">
                  <span>LATITUDE</span>
                  <strong>{latitude!.toFixed(5)}</strong>
                  <span>LONGITUDE</span>
                  <strong>{longitude!.toFixed(5)}</strong>
                </div>
              ) : (
                <p className="location-unavailable">
                  The server has not provided usable coordinates for the
                  primary device.
                </p>
              )}

              <Link to="/location" className="panel-bottom-link">
                Open location page <ChevronRight size={17} />
              </Link>
            </article>
          </section>

          <section className="dashboard-panel alerts-panel">
            <div className="panel-heading">
              <div>
                <span className="panel-kicker">SAFETY ACTIVITY</span>
                <h2>Recent Alerts</h2>
              </div>

              <Link to="/alerts" className="panel-link">
                View all <ArrowUpRight size={16} />
              </Link>
            </div>

            {data.alerts.length === 0 ? (
              <div className="dashboard-empty-state compact">
                <Bell size={26} />
                <strong>
                  {loading ? "Loading alerts..." : "No alert records available"}
                </strong>
                <p>
                  Alerts returned by the backend will appear in this section.
                </p>
              </div>
            ) : (
              <div className="alert-list">
                {data.alerts.slice(0, 5).map((alert, index) => {
                  const alertTime = alert.createdAt || alert.timestamp;

                  return (
                    <div
                      className="alert-row"
                      key={`${alert.id ?? "alert"}-${index}`}
                    >
                      <span className="alert-row-icon">
                        <Bell size={18} />
                      </span>

                      <div className="alert-row-content">
                        <strong>
                          {alert.title || alert.type || "Safety alert"}
                        </strong>
                        <p>{alert.message || "No additional details provided."}</p>
                        <span className="alert-time">
                          <Clock3 size={13} />
                          {formatTime(alertTime)}
                        </span>
                      </div>

                      <span
                        className={`alert-status ${
                          alert.status?.toLowerCase() === "active"
                            ? "alert-active"
                            : ""
                        }`}
                      >
                        {alert.status || "Status unknown"}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            <Link to="/alerts" className="panel-bottom-link">
              Open emergency alerts <ChevronRight size={17} />
            </Link>
          </section>

          <section className="dashboard-bottom-grid">
            <article className="dashboard-panel activity-panel">
              <div className="panel-heading">
                <div>
                  <span className="panel-kicker">SYSTEM INFORMATION</span>
                  <h2>Monitoring Status</h2>
                </div>
                <Activity size={20} />
              </div>

              <div className="monitoring-status">
                <span
                  className={`monitoring-indicator ${
                    error ? "monitoring-error" : ""
                  }`}
                />
                <div>
                  <strong>{error ? "Connection issue" : "Dashboard active"}</strong>
                  <p>
                    {error
                      ? "Live data could not be refreshed."
                      : "Dashboard refreshes data every 30 seconds."}
                  </p>
                </div>
              </div>

              <div className="last-updated">
                Last successful refresh:{" "}
                {lastUpdated ? lastUpdated.toLocaleTimeString() : "Not yet"}
              </div>
            </article>

            <article className="dashboard-panel quick-actions-panel">
              <div className="panel-heading">
                <div>
                  <span className="panel-kicker">QUICK NAVIGATION</span>
                  <h2>Quick Actions</h2>
                </div>
              </div>

              <div className="quick-actions">
                <Link to="/alerts">
                  <Bell size={19} />
                  <span>View alerts</span>
                  <ChevronRight size={17} />
                </Link>

                <Link to="/devices">
                  <Smartphone size={19} />
                  <span>Manage devices</span>
                  <ChevronRight size={17} />
                </Link>

                <Link to="/contacts">
                  <Users size={19} />
                  <span>Trusted contacts</span>
                  <ChevronRight size={17} />
                </Link>

                <Link to="/settings">
                  <Settings size={19} />
                  <span>Dashboard settings</span>
                  <ChevronRight size={17} />
                </Link>
              </div>
            </article>
          </section>

          <footer className="dashboard-footer">
            <span>© Sakhi 2.0 · Smart Women Safety System</span>
            <span>Safety technology with care.</span>
          </footer>
        </div>
      </main>
    </div>
  );
}