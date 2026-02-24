import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "/api";

export default function Signup({ onSuccess }: { onSuccess: (msg: string) => void }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.message || "Erreur lors de l'inscription");
        return;
      }
      onSuccess("Compte créé avec succès !");
      setTimeout(() => navigate("/login"), 500);
    } catch (err) {
      setError("Erreur réseau");
    }
  }

  return (
    <div style={{ padding: 24, maxWidth: 400, margin: "0 auto" }}>
      <h1 data-testid="signup-title">Inscription</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="email">Email</label>
          <br />
          <input
            id="email"
            type="email"
            data-testid="signup-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: 8 }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="password">Mot de passe</label>
          <br />
          <input
            id="password"
            type="password"
            data-testid="signup-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: 8 }}
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" data-testid="signup-submit">
          S'inscrire
        </button>
      </form>
    </div>
  );
}
