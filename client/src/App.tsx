import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { Toast, useToast } from "./Toast";

function App() {
  const { toast, showToast } = useToast();

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup onSuccess={showToast} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
      {toast && (
        <Toast
          message={toast}
          type={toast.startsWith("Erreur") ? "error" : "success"}
        />
      )}
    </>
  );
}

export default App;
