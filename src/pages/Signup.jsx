import { useState } from 'react';
import { Mail, User, Lock, CloudSun, AlertTriangle, CheckCircle, Info, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDocs, query, collection, where } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig/firebaseConfig';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState({ field: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const validateForm = () => {
    
    if (name.trim().length < 2) {
      setError({ field: 'name', message: 'Name must be at least 2 characters long' });
      return false;
    }

  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError({ field: 'email', message: 'Please enter a valid email address' });
      return false;
    }

  
    if (password.length < 8) {
      setError({ field: 'password', message: 'Password must be at least 8 characters long' });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError({ field: '', message: '' });
    setSuccess('');

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      
      const emailQuery = query(collection(db, "users"), where("email", "==", email));
      const emailSnapshot = await getDocs(emailQuery);
      
      if (!emailSnapshot.empty) {
        setError({ field: 'email', message: 'An account with this email already exists' });
        setLoading(false);
        return;
      }

      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: name,
        email: user.email,
        createdAt: new Date(),
      });

      setSuccess('Account created successfully! Redirecting to login...');
      
      
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error("Registration Error", error);
      
    
      switch (error.code) {
        case 'auth/email-already-in-use':
          setError({ field: 'email', message: 'This email is already registered' });
          break;
        case 'auth/invalid-email':
          setError({ field: 'email', message: 'Please enter a valid email address' });
          break;
        case 'auth/weak-password':
          setError({ field: 'password', message: 'Password is too weak. Please use a stronger password' });
          break;
        case 'auth/network-request-failed':
          setError({ field: '', message: 'Network error. Please check your connection and try again' });
          break;
        default:
          setError({ field: '', message: error.message || 'Failed to create account. Please try again later' });
      }
    } finally {
      setLoading(false);
    }
  };

  const getInputClasses = (field) => {
    const baseClasses = "flex h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-white dark:ring-offset-gray-900 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 dark:placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-10";
    
    if (error.field === field) {
      return `${baseClasses} border-red-500 bg-red-50 dark:bg-red-900/10 focus-visible:ring-red-500`;
    }
    return `${baseClasses} border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus-visible:ring-[#2563EB]`;
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-sky-50 to-white p-4 dark:from-sky-950 dark:to-gray-900">
      <a href="/" className="mb-8 flex items-center gap-2">
        <CloudSun className="h-6 w-6 text-sky-500" />
        <span className="text-xl font-bold dark:text-white">SkySage</span>
      </a>

      <div className="rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm w-full max-w-md">
        <div className="flex flex-col p-6 space-y-1">
          <h3 className="font-semibold tracking-tight text-2xl">Create an account</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Enter your information to create your SkySage account</p>
        </div>

        {success && (
          <div className="mx-6 mb-4 flex items-center gap-2 bg-green-100 dark:bg-green-900/20 p-3 text-green-700 dark:text-green-400 rounded-md animate-pulse">
            <CheckCircle className="h-5 w-5" />
            <span>{success}</span>
          </div>
        )}

        {error.message && error.field === '' && (
          <div className="mx-6 mb-4 flex items-center gap-2 bg-red-100 dark:bg-red-900/20 p-3 text-red-700 dark:text-red-400 rounded-md">
            <AlertTriangle className="h-5 w-5" />
            <span>{error.message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="p-6 pt-0 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none mb-2 block peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="name">
                Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-500 dark:text-gray-400" />
                <input
                  className={getInputClasses('name')}
                  id="name"
                  placeholder="Your name"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (error.field === 'name') setError({ field: '', message: '' });
                  }}
                />
              </div>
              {error.field === 'name' && (
                <p className="text-xs text-red-500 dark:text-red-400 mt-1 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" /> {error.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none mb-2 block peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="email">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500 dark:text-gray-400" />
                <input
                  className={getInputClasses('email')}
                  id="email"
                  placeholder="you@example.com"
                  required
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error.field === 'email') setError({ field: '', message: '' });
                  }}
                />
              </div>
              {error.field === 'email' && (
                <p className="text-xs text-red-500 dark:text-red-400 mt-1 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" /> {error.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none mb-2 block peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500 dark:text-gray-400" />
                <input
                  className={getInputClasses('password')}
                  id="password"
                  required
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error.field === 'password') setError({ field: '', message: '' });
                  }}
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex="-1"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {error.field === 'password' ? (
                <p className="text-xs text-red-500 dark:text-red-400 mt-1 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" /> {error.message}
                </p>
              ) : (
                <div className="flex flex-col gap-1 mt-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <Info className="h-3 w-3" /> Password must be at least 8 characters long
                  </p>
                </div>
              )}
            </div>

            <button
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white dark:ring-offset-gray-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100 h-10 px-4 py-2 w-full gap-2"
              type="button"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                <path d="M1 1h22v22H1z" fill="none"></path>
              </svg>
              Continue with Google
            </button>
          </div>

          <div className="items-center p-6 pt-0 flex flex-col space-y-4">
            <button
              className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-white dark:ring-offset-gray-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 w-full ${
                loading ? 'bg-sky-400 dark:bg-sky-700' : 'bg-[#2563EB] hover:bg-sky-600'
              } text-white`}
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </>
              ) : (
                "Create account"
              )}
            </button>
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-[#0EA5E9] hover:underline">
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUp;