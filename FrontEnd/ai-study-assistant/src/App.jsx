import { Routes, Route, Navigate } from "react-router-dom";
import UserDashboard from "./pages/UserDashboard";
import LandingPage from "./pages/LandingPage";
import ProtectedRoute from "./ProtectedRoute";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Toaster } from "sonner";
import "./index.css";

function AppContent() {
  const { user, login } = useAuth();
  
  return (
    <>
      <Routes>
        <Route 
          path="/" 
          element={user ? <Navigate to="/dashboard" replace /> : <LandingPage onLogin={login} />} 
        />
        <Route 
          path="/dashboard/*" 
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;