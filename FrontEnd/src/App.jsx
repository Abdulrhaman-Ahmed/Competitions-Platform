import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

// Auth Pages
import Login from './pages/Login';
import Register from './pages/Register';

// Admin Pages
import AdminDashboard from './pages/Admin/Dashboard';
import AdminCompetitions from './pages/Admin/Competitions';
import AdminParticipants from './pages/Admin/Participants';
import AdminJudges from './pages/Admin/Judges';
import AdminResults from './pages/Admin/Results';
import AdminCertificates from './pages/Admin/Certificates';

// Student Pages
import StudentCompetitions from './pages/Student/Competitions';
import StudentMyCompetitions from './pages/Student/MyCompetitions';
import StudentResults from './pages/Student/Results';
import StudentCertificates from './pages/Student/Certificates';

// Judge Pages
import JudgeCompetitions from './pages/Judge/Competitions';
import JudgeJudging from './pages/Judge/Judging';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-custom"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Router Component
const AppRoutes = () => {
  const { isAuthenticated, isAdmin, isJudge, isStudent } = useAuth();

  const getDefaultRoute = () => {
    if (!isAuthenticated) return '/login';
    if (isAdmin) return '/admin/dashboard';
    if (isJudge) return '/judge/competitions';
    if (isStudent) return '/student/competitions';
    return '/login';
  };

  return (
    <Routes >
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/competitions"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminCompetitions />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/participants"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminParticipants />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/judges"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminJudges />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/results"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminResults />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/certificates"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminCertificates />
          </ProtectedRoute>
        }
      />

      {/* Student Routes */}
      <Route
        path="/student/competitions"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentCompetitions />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/my-competitions"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentMyCompetitions />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/results"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentResults />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/certificates"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentCertificates />
          </ProtectedRoute>
        }
      />

      {/* Judge Routes */}
      <Route
        path="/judge/competitions"
        element={
          <ProtectedRoute allowedRoles={['judge']}>
            <JudgeCompetitions />
          </ProtectedRoute>
        }
      />
      <Route
        path="/judge/judging/:competitionId?"
        element={
          <ProtectedRoute allowedRoles={['judge']}>
            <JudgeJudging />
          </ProtectedRoute>
        }
      />

      {/* Default Route */}
      <Route path="/" element={<Navigate to={getDefaultRoute()} replace />} />
      <Route path="*" element={<Navigate to={getDefaultRoute()} replace />} />
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              fontFamily: 'Cairo, sans-serif',
              direction: 'rtl'
            }
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;