import React, { useState, useEffect } from 'react';
import { User, Lock, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import './App.css';

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [registerData, setRegisterData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentView, setCurrentView] = useState('login'); // 'login' oder 'register'
  const [registeredUsers, setRegisteredUsers] = useState([]);

  // Simulierte Benutzer (in echter App würde das von einer API kommen)
  const mockUsers = [
    { id: 1, username: 'admin', password: 'admin123', role: 'admin' },
    { id: 2, username: 'user', password: 'user123', role: 'user' },
    { id: 3, username: 'manager', password: 'manager123', role: 'manager' }
  ];

  // Session handling (simuliert JWT/Session)
  useEffect(() => {
    const savedUser = sessionStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    
    // Gespeicherte registrierte Benutzer laden
    const savedRegisteredUsers = localStorage.getItem('registeredUsers');
    if (savedRegisteredUsers) {
      setRegisteredUsers(JSON.parse(savedRegisteredUsers));
    }
  }, []);

  const handleLogin = async () => {
    setIsLoading(true);
    setLoginError('');

    // Simuliere API-Aufruf
    setTimeout(() => {
      // Kombiniere Mock-Users und registrierte Benutzer
      const allUsers = [...mockUsers, ...registeredUsers];
      const user = allUsers.find(
        u => u.username === loginData.username && u.password === loginData.password
      );

      if (user) {
        const userSession = {
          id: user.id,
          username: user.username,
          role: user.role || 'user',
          loginTime: new Date().toISOString()
        };
        setCurrentUser(userSession);
        sessionStorage.setItem('currentUser', JSON.stringify(userSession));
        setLoginData({ username: '', password: '' });
      } else {
        setLoginError('Ungültige Anmeldedaten. Bitte versuchen Sie es erneut.');
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleRegister = async () => {
    setIsLoading(true);
    setRegisterError('');

    // Validierung
    if (registerData.password !== registerData.confirmPassword) {
      setRegisterError('Passwörter stimmen nicht überein.');
      setIsLoading(false);
      return;
    }

    if (registerData.password.length < 6) {
      setRegisterError('Passwort muss mindestens 6 Zeichen lang sein.');
      setIsLoading(false);
      return;
    }

    // Simuliere API-Aufruf
    setTimeout(() => {
      // Prüfe ob Benutzername bereits existiert
      const allUsers = [...mockUsers, ...registeredUsers];
      const existingUser = allUsers.find(u => u.username === registerData.username);

      if (existingUser) {
        setRegisterError('Benutzername bereits vergeben. Bitte wählen Sie einen anderen.');
        setIsLoading(false);
        return;
      }

      // Neuen Benutzer erstellen
      const newUser = {
        id: Date.now(), // Einfache ID-Generation
        username: registerData.username,
        email: registerData.email,
        password: registerData.password,
        role: 'user'
      };

      const updatedUsers = [...registeredUsers, newUser];
      setRegisteredUsers(updatedUsers);
      localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));

      // Automatisch einloggen
      const userSession = {
        id: newUser.id,
        username: newUser.username,
        role: newUser.role,
        loginTime: new Date().toISOString()
      };
      setCurrentUser(userSession);
      sessionStorage.setItem('currentUser', JSON.stringify(userSession));
      setRegisterData({ username: '', email: '', password: '', confirmPassword: '' });
      setIsLoading(false);
    }, 1000);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('currentUser');
    setLoginData({ username: '', password: '' });
    setRegisterData({ username: '', email: '', password: '', confirmPassword: '' });
    setLoginError('');
    setRegisterError('');
    setCurrentView('login');
  };

  const handleInputChange = (form, field, value) => {
    if (form === 'login') {
      setLoginData(prev => ({ ...prev, [field]: value }));
      if (loginError) setLoginError('');
    } else {
      setRegisterData(prev => ({ ...prev, [field]: value }));
      if (registerError) setRegisterError('');
    }
  };

  const switchToRegister = () => {
    setCurrentView('register');
    setLoginError('');
    setRegisterError('');
  };

  const switchToLogin = () => {
    setCurrentView('login');
    setLoginError('');
    setRegisterError('');
  };

  // Login Form Component
  const LoginForm = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Anmeldung</h1>
          <p className="text-gray-600 mt-2">Melden Sie sich mit Ihren Zugangsdaten an</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Benutzername
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={loginData.username}
                onChange={(e) => handleInputChange('login', 'username', e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Benutzername eingeben"
                autoComplete="username"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Passwort
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={loginData.password}
                onChange={(e) => handleInputChange('login', 'password', e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Passwort eingeben"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {loginError && (
            <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm">{loginError}</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleLogin}
            disabled={isLoading || !loginData.username || !loginData.password}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Wird angemeldet...' : 'Anmelden'}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={switchToRegister}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Noch kein Konto? Jetzt registrieren
            </button>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 font-medium mb-2">Demo-Zugangsdaten:</p>
          <div className="text-xs text-gray-500 space-y-1">
            <div>admin / admin123 (Administrator)</div>
            <div>user / user123 (Benutzer)</div>
            <div>manager / manager123 (Manager)</div>
          </div>
        </div>
      </div>
    </div>
  );

  // Register Form Component
  const RegisterForm = () => (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Registrierung</h1>
          <p className="text-gray-600 mt-2">Erstellen Sie Ihr neues Konto</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Benutzername
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={registerData.username}
                onChange={(e) => handleInputChange('register', 'username', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Benutzername wählen"
                autoComplete="username"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              E-Mail
            </label>
            <div className="relative">
              <input
                type="email"
                value={registerData.email}
                onChange={(e) => handleInputChange('register', 'email', e.target.value)}
                className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="ihre.email@beispiel.com"
                autoComplete="email"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Passwort
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={registerData.password}
                onChange={(e) => handleInputChange('register', 'password', e.target.value)}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Mindestens 6 Zeichen"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Passwort bestätigen
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={registerData.confirmPassword}
                onChange={(e) => handleInputChange('register', 'confirmPassword', e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleRegister()}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Passwort wiederholen"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {registerError && (
            <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm">{registerError}</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleRegister}
            disabled={isLoading || !registerData.username || !registerData.email || !registerData.password || !registerData.confirmPassword}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Wird registriert...' : 'Registrieren'}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={switchToLogin}
              className="text-green-600 hover:text-green-700 text-sm font-medium"
            >
              Bereits ein Konto? Jetzt anmelden
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Dashboard Component (für eingeloggte Benutzer)
  const Dashboard = () => (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
            >
              Abmelden
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <h2 className="text-xl font-semibold text-gray-900">Erfolgreich angemeldet!</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Benutzername:</span>
              <span className="ml-2 text-gray-900">{currentUser.username}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Rolle:</span>
              <span className="ml-2 text-gray-900 capitalize">{currentUser.role}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Anmeldung:</span>
              <span className="ml-2 text-gray-900">
                {new Date(currentUser.loginTime).toLocaleString('de-DE')}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Session-ID:</span>
              <span className="ml-2 text-gray-900 font-mono text-xs">{currentUser.id}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Benutzer-Bereich</h3>
            <p className="text-gray-600 text-sm mb-4">
              Hier sehen nur angemeldete Benutzer ihre persönlichen Inhalte.
            </p>
            <div className="text-xs text-gray-500">
              ✓ Basic Auth-Gate implementiert
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Session-Status</h3>
            <p className="text-gray-600 text-sm mb-4">
              Ihre Session wird automatisch verwaltet und gespeichert.
            </p>
            <div className="text-xs text-green-600">
              ✓ Session aktiv
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Erweiterungen</h3>
            <p className="text-gray-600 text-sm mb-4">
              Die App ist modular aufgebaut für einfache Erweiterungen.
            </p>
            <div className="text-xs text-blue-600">
              → Rollen-Management
              <br />
              → API-Integration
              <br />
              → Weitere Features
            </div>
          </div>
        </div>
      </main>
    </div>
  );

  return currentUser ? <Dashboard /> : (currentView === 'login' ? <LoginForm /> : <RegisterForm />);
};

export default App;