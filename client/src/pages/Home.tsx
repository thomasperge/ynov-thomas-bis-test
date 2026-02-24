import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div style={{ padding: 24, textAlign: "center" }}>
      <h1>MFP - My Favorite Places</h1>
      <p style={{ marginTop: 16 }}>
        <Link to="/signup">
          <button type="button" data-testid="signup-button">
            Signup
          </button>
        </Link>
        {" · "}
        <Link to="/login">
          <button type="button" data-testid="login-button">
            Login
          </button>
        </Link>
      </p>
    </div>
  );
}
