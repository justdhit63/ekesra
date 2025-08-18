import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ session, children }) => {
  if (!session) {
    // Jika tidak ada sesi (belum login), arahkan ke halaman login
    return <Navigate to="/login" replace />;
  }

  // Jika sudah login, tampilkan komponen yang diminta (children)
  return children;
};

export default ProtectedRoute;