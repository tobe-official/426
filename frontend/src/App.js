import React, { useState, useEffect } from 'react';
import { User, Lock, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import './App.css';

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
  }, []);

  const handleLogin = async () => {
    setIsLoading(true);
    setLoginError('');

    // Simuliere API-Aufruf
    setTimeout(() => {
      const user = mockUsers.find(
        u => u.username === loginData.username && u.password === loginData.password
      );

      if (user) {
        const userSession = {
          id: user.id,
          username: user.username,
          role: user.role,
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

  const handleLogout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('currentUser');
    setLoginData({ username: '', password: '' });
    setLoginError('');
  };

  const handleInputChange = (field, value) => {
    setLoginData(prev => ({ ...prev, [field]: value }));
    if (loginError) setLoginError('');
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
                onChange={(e) => handleInputChange('username', e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Benutzername eingeben"
                required
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
                onChange={(e) => handleInputChange('password', e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Passwort eingeben"
                required
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

  return currentUser ? <Dashboard /> : <LoginForm />;
};

export default App;