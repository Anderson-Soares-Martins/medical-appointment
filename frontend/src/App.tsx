import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from 'react-router-dom'
import { useAuthStore } from './lib/store/auth'
import { MainLayout } from './components/layout/MainLayout'

// Patient Pages
import PatientDashboard from './pages/patient/Dashboard'
import PatientAppointments from './pages/patient/Appointments'
import PatientHistory from './pages/patient/History'
import PatientProfile from './pages/patient/Profile'

// Doctor Pages
import DoctorDashboard from './pages/doctor/Dashboard'
import DoctorSchedule from './pages/doctor/Schedule'
import DoctorHistory from './pages/doctor/History'
import DoctorProfile from './pages/doctor/Profile'

// Auth Pages
import Login from './pages/auth/Login'

// Novo componente para proteção de rotas por perfil
function ProtectedRoute({
    children,
    allowedRoles,
}: {
    children: React.ReactNode
    allowedRoles: string[]
}) {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
    const user = useAuthStore((state) => state.user)

    if (!isAuthenticated || !user) {
        return <Navigate to="/login" replace />
    }
    if (!allowedRoles.includes(user.role)) {
        // Redireciona para a home do perfil correto
        return (
            <Navigate
                to={user.role === 'DOCTOR' ? '/doctor' : '/patient'}
                replace
            />
        )
    }
    return <MainLayout>{children}</MainLayout>
}

function App() {
    const user = useAuthStore((state) => state.user)
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route
                    path="/login"
                    element={
                        isAuthenticated ? (
                            <Navigate
                                to={
                                    user?.role === 'DOCTOR'
                                        ? '/doctor'
                                        : '/patient'
                                }
                                replace
                            />
                        ) : (
                            <Login />
                        )
                    }
                />

                {/* Protected Patient Routes */}
                <Route
                    path="/patient"
                    element={
                        <ProtectedRoute allowedRoles={['PATIENT']}>
                            <PatientDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/patient/appointments"
                    element={
                        <ProtectedRoute allowedRoles={['PATIENT']}>
                            <PatientAppointments />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/patient/history"
                    element={
                        <ProtectedRoute allowedRoles={['PATIENT']}>
                            <PatientHistory />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/patient/profile"
                    element={
                        <ProtectedRoute allowedRoles={['PATIENT']}>
                            <PatientProfile />
                        </ProtectedRoute>
                    }
                />

                {/* Protected Doctor Routes */}
                <Route
                    path="/doctor"
                    element={
                        <ProtectedRoute allowedRoles={['DOCTOR']}>
                            <DoctorDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/doctor/schedule"
                    element={
                        <ProtectedRoute allowedRoles={['DOCTOR']}>
                            <DoctorSchedule />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/doctor/history"
                    element={
                        <ProtectedRoute allowedRoles={['DOCTOR']}>
                            <DoctorHistory />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/doctor/profile"
                    element={
                        <ProtectedRoute allowedRoles={['DOCTOR']}>
                            <DoctorProfile />
                        </ProtectedRoute>
                    }
                />

                {/* Redirect based on user role */}
                <Route
                    path="/"
                    element={
                        <Navigate
                            to={
                                user?.role === 'DOCTOR' ? '/doctor' : '/patient'
                            }
                            replace
                        />
                    }
                />
            </Routes>
        </Router>
    )
}

export default App
