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

function PrivateRoute({ children }: { children: React.ReactNode }) {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
    const user = useAuthStore((state) => state.user)

    if (!isAuthenticated || !user) {
        return <Navigate to="/login" replace />
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
                        <PrivateRoute>
                            <PatientDashboard />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/patient/appointments"
                    element={
                        <PrivateRoute>
                            <PatientAppointments />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/patient/history"
                    element={
                        <PrivateRoute>
                            <PatientHistory />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/patient/profile"
                    element={
                        <PrivateRoute>
                            <PatientProfile />
                        </PrivateRoute>
                    }
                />

                {/* Protected Doctor Routes */}
                <Route
                    path="/doctor"
                    element={
                        <PrivateRoute>
                            <DoctorDashboard />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/doctor/schedule"
                    element={
                        <PrivateRoute>
                            <DoctorSchedule />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/doctor/history"
                    element={
                        <PrivateRoute>
                            <DoctorHistory />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/doctor/profile"
                    element={
                        <PrivateRoute>
                            <DoctorProfile />
                        </PrivateRoute>
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
