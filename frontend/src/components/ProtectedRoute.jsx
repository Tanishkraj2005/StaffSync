import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading)
    return (
      <div className="text-center mt-10 text-lg text-gray-700 dark:text-gray-300">
        Loading...
      </div>
    );

  if (!user) return <Navigate to="/" />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;