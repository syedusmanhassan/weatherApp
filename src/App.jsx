import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebaseConfig/firebaseConfig';
import './App.css';
import Login from "./pages/Login";
import SignUp from './pages/Signup';
import { ProtectedRoute } from './protectedRoute/protectedRoute';
import Sidebar from './weatherpages/Sidebar';
import { WeatherProvider } from './WeatherContext/WeatherContext';


function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <WeatherProvider>

    <Router>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <SignUp />} />
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <SignUp />} />
        
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Sidebar/>
            </ProtectedRoute>
          } 
          />
        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
      </Routes>
    </Router>
        </WeatherProvider>
  );
}

export default App;