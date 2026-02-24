import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const TOKEN_KEY = "token";
const API_URL = "/api";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ email: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      navigate("/login");
      return;
    }
    fetch(`${API_URL}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) {
          localStorage.removeItem(TOKEN_KEY);
          navigate("/login");
          return;
        }
        return res.json();
      })
      .then((data) => data && setUser(data.item))
      .catch(() => navigate("/login"));
  }, [navigate]);

  if (!user) return <div style={{ padding: 24 }}>Chargement...</div>;

  return (
    <div style={{ padding: 24 }} data-testid="dashboard">
      <h1>Dashboard</h1>
      <p>Bienvenue, {user.email}.</p>
    </div>
  );
}
