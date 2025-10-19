import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: JSX.Element;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const user = localStorage.getItem("user"); // or check your auth token

  if (!user) {
    // No user found → redirect to login
    return <Navigate to="/login" replace />;
  }

  // User is logged in → render page
  return children;
};
