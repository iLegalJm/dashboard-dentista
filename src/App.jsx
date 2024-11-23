import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import { SignIn } from "./pages/auth";
import Logout from "./pages/auth/logout";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";

function App() {

  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<SignIn />} />
        <Route path="/logout" element={<Logout />} />
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <Routes>
                <Route path="/dashboard/*" element={<Dashboard />} />
                <Route path="/auth/*" element={<Auth />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </PrivateRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;
