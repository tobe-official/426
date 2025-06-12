import React, { useState, useEffect } from 'react';
import { User, Lock, Eye, EyeOff, AlertCircle, CheckCircle, FileText, Clock, Calendar } from 'lucide-react';
import './App.css';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [registerData, setRegisterData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentView, setCurrentView] = useState('login');
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [dashboardView, setDashboardView] = useState('overview');
  const [projectFilter, setProjectFilter] = useState('all');

  // Simulierte Benutzer
  const mockUsers = [
    { id: 1, username: 'admin', password: 'admin123', role: 'admin' },
    { id: 2, username: 'user', password: 'user123', role: 'user' },
    { id: 3, username: 'manager', password: 'manager123', role: 'manager' }
  ];

  // Mock-Daten für Dashboard
  const getDashboardData = () => {
    const projects = [
      {
        id: 1,
        name: 'Website Redesign',
        code: 'WEB-001',
        status: 'in_progress',
        progress: 75,
        deadline: '2025-07-15',
        priority: 'high',
        tasksTotal: 12,
        tasksCompleted: 9,
        customer: { id: 1, name: 'TechCorp AG', industry: 'Software Development' },
        milestones: [
          { id: 1, name: 'Design Review', deadline: '2025-06-20', status: 'completed' },
          { id: 2, name: 'Frontend Development', deadline: '2025-07-05', status: 'in_progress' },
          { id: 3, name: 'Testing & QA', deadline: '2025-07-15', status: 'pending' }
        ]
      },
      {
        id: 2,
        name: 'Mobile App Development',
        code: 'MOB-002',
        status: 'in_progress',
        progress: 45,
        deadline: '2025-08-30',
        priority: 'medium',
        tasksTotal: 18,
        tasksCompleted: 8,
        customer: { id: 1, name: 'TechCorp AG', industry: 'Software Development' },
        milestones: [
          { id: 4, name: 'UI/UX Design', deadline: '2025-06-25', status: 'in_progress' },
          { id: 5, name: 'Backend API', deadline: '2025-07-20', status: 'pending' },
          { id: 6, name: 'App Store Release', deadline: '2025-08-30', status: 'pending' }
        ]
      },
      {
        id: 3,
        name: 'Database Migration',
        code: 'DB-003',
        status: 'completed',
        progress: 100,
        deadline: '2025-06-10',
        priority: 'high',
        tasksTotal: 8,
        tasksCompleted: 8,
        customer: { id: 2, name: 'GlobalTrade GmbH', industry: 'E-Commerce & Handel' },
        milestones: [
          { id: 7, name: 'Datenmigration', deadline: '2025-05-20', status: 'completed' },
          { id: 8, name: 'Performance Tests', deadline: '2025-06-05', status: 'completed' },
          { id: 9, name: 'Go-Live', deadline: '2025-06-10', status: 'completed' }
        ]
      },
      {
        id: 4,
        name: 'E-Commerce Platform',
        code: 'ECOM-004',
        status: 'in_progress',
        progress: 60,
        deadline: '2025-10-01',
        priority: 'high',
        tasksTotal: 25,
        tasksCompleted: 15,
        customer: { id: 2, name: 'GlobalTrade GmbH', industry: 'E-Commerce & Handel' },
        milestones: [
          { id: 10, name: 'Produktkatalog', deadline: '2025-07-01', status: 'completed' },
          { id: 11, name: 'Warenkorb System', deadline: '2025-08-15', status: 'in_progress' },
          { id: 12, name: 'Payment Integration', deadline: '2025-09-20', status: 'pending' }
        ]
      },
      {
        id: 5,
        name: 'Security Audit',
        code: 'SEC-005',
        status: 'in_progress',
        progress: 30,
        deadline: '2025-07-30',
        priority: 'high',
        tasksTotal: 10,
        tasksCompleted: 3,
        customer: { id: 3, name: 'StartupX Ltd.', industry: 'Fintech' },
        milestones: [
          { id: 13, name: 'Vulnerability Scan', deadline: '2025-06-30', status: 'in_progress' },
          { id: 14, name: 'Penetration Test', deadline: '2025-07-15', status: 'pending' },
          { id: 15, name: 'Security Report', deadline: '2025-07-30', status: 'pending' }
        ]
      },
      {
        id: 6,
        name: 'Patient Portal',
        code: 'MED-006',
        status: 'in_progress',
        progress: 55,
        deadline: '2025-08-20',
        priority: 'high',
        tasksTotal: 22,
        tasksCompleted: 12,
        customer: { id: 4, name: 'MedTech Solutions', industry: 'Healthcare Technology' },
        milestones: [
          { id: 16, name: 'User Authentication', deadline: '2025-06-15', status: 'completed' },
          { id: 17, name: 'Medical Records View', deadline: '2025-07-10', status: 'in_progress' },
          { id: 18, name: 'HIPAA Compliance', deadline: '2025-08-20', status: 'pending' }
        ]
      }
    ];

    const upcomingTasks = [
      { id: 1, title: 'Frontend Testing abschließen', project: 'WEB-001', deadline: '2025-06-15', priority: 'high', estimated: '4h' },
      { id: 2, title: 'UI Mockups erstellen', project: 'MOB-002', deadline: '2025-06-18', priority: 'medium', estimated: '6h' },
      { id: 3, title: 'Code Review durchführen', project: 'WEB-001', deadline: '2025-06-20', priority: 'medium', estimated: '2h' },
      { id: 4, title: 'Security Testing', project: 'SEC-005', deadline: '2025-06-25', priority: 'high', estimated: '8h' }
    ];

    return { projects, upcomingTasks };
  };

  // Helper Functions
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'in_progress': return 'text-blue-600 bg-blue-100';
      case 'planning': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Abgeschlossen';
      case 'in_progress': return 'In Bearbeitung';
      case 'planning': return 'Planung';
      default: return 'Unbekannt';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityText = (priority) => {
    switch (priority) {
      case 'high': return 'Hoch';
      case 'medium': return 'Mittel';
      case 'low': return 'Niedrig';
      default: return 'Normal';
    }
  };

  const formatDeadline = (deadline) => {
    const date = new Date(deadline);
    const today = new Date();
    const diffTime = date - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { text: 'Überfällig', color: 'text-red-600' };
    if (diffDays === 0) return { text: 'Heute', color: 'text-red-600' };
    if (diffDays === 1) return { text: 'Morgen', color: 'text-orange-600' };
    if (diffDays <= 7) return { text: `${diffDays} Tage`, color: 'text-yellow-600' };
    return { text: date.toLocaleDateString('de-DE'), color: 'text-gray-600' };
  };

  const groupProjectsByCustomer = (projects) => {
    const grouped = {};
    projects.forEach(project => {
      const customerName = project.customer.name;
      if (!grouped[customerName]) {
        grouped[customerName] = {
          customer: project.customer,
          projects: []
        };
      }
      grouped[customerName].projects.push(project);
    });
    return grouped;
  };

  // Session handling
  useEffect(() => {
    const savedUser = sessionStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    
    const savedRegisteredUsers = localStorage.getItem('registeredUsers');
    if (savedRegisteredUsers) {
      setRegisteredUsers(JSON.parse(savedRegisteredUsers));
    }
  }, []);

  const handleLogin = async () => {
    setIsLoading(true);
    setLoginError('');

    setTimeout(() => {
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

    setTimeout(() => {
      const allUsers = [...mockUsers, ...registeredUsers];
      const existingUser = allUsers.find(u => u.username === registerData.username);

      if (existingUser) {
        setRegisterError('Benutzername bereits vergeben. Bitte wählen Sie einen anderen.');
        setIsLoading(false);
        return;
      }

      const newUser = {
        id: Date.now(),
        username: registerData.username,
        email: registerData.email,
        password: registerData.password,
        role: 'user'
      };

      const updatedUsers = [...registeredUsers, newUser];
      setRegisteredUsers(updatedUsers);
      localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));

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
    setDashboardView('overview');
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Benutzername</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Passwort</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Benutzername</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">E-Mail</label>
            <input
              type="email"
              value={registerData.email}
              onChange={(e) => handleInputChange('register', 'email', e.target.value)}
              className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="ihre.email@beispiel.com"
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Passwort</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Passwort bestätigen</label>
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

  // Rapport Form Component
  const RapportForm = () => {
    // This is a random comment about the RapportForm component
    const [rapportData, setRapportData] = useState({
      date: new Date().toISOString().split('T')[0],
      project: '',
      hours: '',
      minutes: '0',
      description: '',
      category: 'development'
    });
    
    const [projects] = useState([
      { id: 1, name: 'Website Redesign', code: 'WEB-001' },
      { id: 2, name: 'Mobile App Development', code: 'MOB-002' },
      { id: 3, name: 'Database Migration', code: 'DB-003' },
      { id: 4, name: 'E-Commerce Platform', code: 'ECOM-004' }
    ]);
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [savedRapports, setSavedRapports] = useState([]);

    const categories = [
      { value: 'development', label: 'Entwicklung' },
      { value: 'testing', label: 'Testing' },
      { value: 'meeting', label: 'Meeting' },
      { value: 'documentation', label: 'Dokumentation' },
      { value: 'support', label: 'Support' },
      { value: 'other', label: 'Sonstiges' }
    ];

    useEffect(() => {
      const saved = localStorage.getItem('rapports');
      if (saved) {
        setSavedRapports(JSON.parse(saved));
      }
    }, []);

    const handleRapportInputChange = (field, value) => {
      setRapportData(prev => ({ ...prev, [field]: value }));
      if (error) setError('');
      if (success) setSuccess('');
    };

    const validateForm = () => {
      if (!rapportData.date) {
        setError('Bitte wählen Sie ein Datum aus.');
        return false;
      }
      if (!rapportData.project) {
        setError('Bitte wählen Sie ein Projekt aus.');
        return false;
      }
      if (!rapportData.hours || rapportData.hours <= 0) {
        setError('Bitte geben Sie gültige Stunden ein (größer als 0).');
        return false;
      }
      if (!rapportData.description.trim()) {
        setError('Bitte geben Sie eine Beschreibung ein.');
        return false;
      }
      return true;
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      
      if (!validateForm()) {
        return;
      }
      
      setIsLoading(true);
      setError('');
      
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const totalMinutes = parseInt(rapportData.hours) * 60 + parseInt(rapportData.minutes);
        const selectedProject = projects.find(p => p.id === parseInt(rapportData.project));
        
        const newRapport = {
          id: Date.now(),
          userId: currentUser.id,
          userName: currentUser.username,
          date: rapportData.date,
          projectId: parseInt(rapportData.project),
          projectName: selectedProject.name,
          projectCode: selectedProject.code,
          totalMinutes: totalMinutes,
          hours: parseInt(rapportData.hours),
          minutes: parseInt(rapportData.minutes),
          description: rapportData.description.trim(),
          category: rapportData.category,
          createdAt: new Date().toISOString(),
          status: 'submitted'
        };
        
        const updatedRapports = [...savedRapports, newRapport];
        setSavedRapports(updatedRapports);
        localStorage.setItem('rapports', JSON.stringify(updatedRapports));
        
        setSuccess('Rapport erfolgreich gespeichert!');
        
        setRapportData({
          date: new Date().toISOString().split('T')[0],
          project: '',
          hours: '',
          minutes: '0',
          description: '',
          category: 'development'
        });
        
      } catch (err) {
        setError('Fehler beim Speichern des Rapports. Bitte versuchen Sie es erneut.');
        console.error('Rapport save error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    const getTotalHoursToday = () => {
      const today = new Date().toISOString().split('T')[0];
      const todayRapports = savedRapports.filter(r => 
        r.userId === currentUser.id && r.date === today
      );
      const totalMinutes = todayRapports.reduce((sum, r) => sum + r.totalMinutes, 0);
      return (totalMinutes / 60).toFixed(1);
    };

    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Rapport erfassen</h2>
              <p className="text-sm text-gray-600">Arbeitszeit und Tätigkeiten dokumentieren</p>
            </div>
          </div>
          <button
            onClick={() => setDashboardView('overview')}
            className="text-gray-600 hover:text-gray-800 text-sm font-medium"
          >
            ← Zurück zur Übersicht
          </button>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Heute erfasst:</span>
            </div>
            <span className="text-lg font-semibold text-blue-600">
              {getTotalHoursToday()}h
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Datum *</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  value={rapportData.date}
                  onChange={(e) => handleRapportInputChange('date', e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Projekt *</label>
              <select
                value={rapportData.project}
                onChange={(e) => handleRapportInputChange('project', e.target.value)}
                className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Projekt auswählen...</option>
                {projects.map(project => (
                  <option key={project.id} value={project.id}>
                    {project.code} - {project.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Arbeitszeit *</label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    value={rapportData.hours}
                    onChange={(e) => handleRapportInputChange('hours', e.target.value)}
                    min="0"
                    max="12"
                    step="0.25"
                    placeholder="0"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <span className="text-xs text-gray-500 mt-1 block">Stunden</span>
              </div>
              <div>
                <select
                  value={rapportData.minutes}
                  onChange={(e) => handleRapportInputChange('minutes', e.target.value)}
                  className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="0">0 Min</option>
                  <option value="15">15 Min</option>
                  <option value="30">30 Min</option>
                  <option value="45">45 Min</option>
                </select>
                <span className="text-xs text-gray-500 mt-1 block">Minuten</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kategorie</label>
            <select
              value={rapportData.category}
              onChange={(e) => handleRapportInputChange('category', e.target.value)}
              className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tätigkeitsbeschreibung *</label>
            <textarea
              value={rapportData.description}
              onChange={(e) => handleRapportInputChange('description', e.target.value)}
              placeholder="Beschreiben Sie Ihre Tätigkeiten..."
              rows={4}
              className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              required
            />
            <div className="flex justify-between items-center mt-1">
              <span className="text-xs text-gray-500">Mindestens 10 Zeichen erforderlich</span>
              <span className="text-xs text-gray-500">{rapportData.description.length}/500</span>
            </div>
          </div>

          {error && (
            <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-lg">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm">{success}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Wird gespeichert...</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                <span>Rapport speichern</span>
              </>
            )}
          </button>
        </form>

        {savedRapports.filter(r => r.userId === currentUser.id).length > 0 && (
          <div className="mt-8 border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Kürzlich erfasst ({savedRapports.filter(r => r.userId === currentUser.id).length})
            </h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {savedRapports
                .filter(r => r.userId === currentUser.id)
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 5)
                .map(rapport => (
                  <div key={rapport.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-900">{rapport.projectCode}</span>
                        <span className="text-sm text-gray-600">{rapport.date}</span>
                        <span className="text-sm font-medium text-blue-600">
                          {rapport.hours}:{rapport.minutes.toString().padStart(2, '0')}h
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 truncate">{rapport.description}</p>
                    </div>
                    <div className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">Gespeichert</div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Projects by Customer Component
  const ProjectsByCustomer = () => {
    const { projects } = getDashboardData();
    
    const getFilteredAndGroupedProjects = () => {
      if (projectFilter === 'by_customer') {
        return groupProjectsByCustomer(projects);
      } else if (projectFilter === 'by_status') {
        const grouped = {};
        projects.forEach(project => {
          const status = getStatusText(project.status);
          if (!grouped[status]) {
            grouped[status] = { projects: [] };
          }
          grouped[status].projects.push(project);
        });
        return grouped;
      } else if (projectFilter === 'by_priority') {
        const grouped = {};
        projects.forEach(project => {
          const priority = getPriorityText(project.priority);
          if (!grouped[priority]) {
            grouped[priority] = { projects: [] };
          }
          grouped[priority].projects.push(project);
        });
        return grouped;
      } else {
        return { 'Alle Projekte': { projects: projects } };
      }
    };

    const groupedData = getFilteredAndGroupedProjects();
    const groupNames = Object.keys(groupedData).sort();

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Projekt-Übersicht</h2>
              <p className="text-sm text-gray-600">Projekte nach verschiedenen Kriterien gruppiert</p>
            </div>
          </div>
          <button
            onClick={() => setDashboardView('overview')}
            className="text-gray-600 hover:text-gray-800 text-sm font-medium"
          >
            ← Zurück zur Übersicht
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">Gruppierung:</label>
              <select
                value={projectFilter}
                onChange={(e) => setProjectFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
              >
                <option value="all">Alle Projekte</option>
                <option value="by_customer">Nach Kunden</option>
                <option value="by_status">Nach Status</option>
                <option value="by_priority">Nach Priorität</option>
              </select>
            </div>
            <div className="text-sm text-gray-600">
              {projects.length} Projekte • {Object.keys(groupedData).length} Gruppen
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">
                  {projectFilter === 'by_customer' ? 
                    new Set(projects.map(p => p.customer.name)).size : 
                    groupNames.length}
                </h3>
                <p className="text-sm text-gray-600">
                  {projectFilter === 'by_customer' ? 'Kunden' : 
                   projectFilter === 'by_status' ? 'Status-Gruppen' :
                   projectFilter === 'by_priority' ? 'Prioritäts-Gruppen' : 'Gruppen'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{projects.length}</h3>
                <p className="text-sm text-gray-600">Gesamte Projekte</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center">
                <Clock className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">
                  {projects.reduce((sum, project) => sum + project.milestones.length, 0)}
                </h3>
                <p className="text-sm text-gray-600">Gesamte Milestones</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                <AlertCircle className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">
                  {projects.filter(p => p.status === 'in_progress').length}
                </h3>
                <p className="text-sm text-gray-600">Aktive Projekte</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {groupNames.map(groupName => {
            const groupData = groupedData[groupName];
            const groupProjects = groupData.projects;
            
            const completedProjects = groupProjects.filter(p => p.status === 'completed').length;
            const totalMilestones = groupProjects.reduce((sum, p) => sum + p.milestones.length, 0);
            const completedMilestones = groupProjects.reduce((sum, p) => 
              sum + p.milestones.filter(m => m.status === 'completed').length, 0
            );

            return (
              <div key={groupName} className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                          {projectFilter === 'by_customer' ? <User className="w-6 h-6 text-white" /> :
                           projectFilter === 'by_status' ? <CheckCircle className="w-6 h-6 text-white" /> :
                           projectFilter === 'by_priority' ? <AlertCircle className="w-6 h-6 text-white" /> :
                           <FileText className="w-6 h-6 text-white" />}
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">{groupName}</h3>
                          {projectFilter === 'by_customer' && groupData.customer && (
                            <p className="text-sm text-gray-600">{groupData.customer.industry}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-lg font-semibold text-gray-900">{groupProjects.length}</div>
                          <div className="text-xs text-gray-600">Projekte</div>
                        </div>
                        <div>
                          <div className="text-lg font-semibold text-green-600">{completedProjects}</div>
                          <div className="text-xs text-gray-600">Abgeschlossen</div>
                        </div>
                        <div>
                          <div className="text-lg font-semibold text-blue-600">{completedMilestones}/{totalMilestones}</div>
                          <div className="text-xs text-gray-600">Milestones</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-4">
                    {groupProjects.map(project => {
                      const deadline = formatDeadline(project.deadline);
                      return (
                        <div key={project.id} className="border border-gray-200 rounded-lg overflow-hidden">
                          <div className="p-4 bg-gray-50">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <span className="font-semibold text-gray-900">{project.code}</span>
                                <span className="text-gray-600">•</span>
                                <span className="text-gray-900">{project.name}</span>
                                {projectFilter !== 'by_customer' && (
                                  <>
                                    <span className="text-gray-600">•</span>
                                    <span className="text-sm text-purple-600 font-medium">{project.customer.name}</span>
                                  </>
                                )}
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                                  {getStatusText(project.status)}
                                </span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(project.priority)}`}>
                                  {getPriorityText(project.priority)}
                                </span>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-medium text-gray-900">{project.progress}%</div>
                                <div className={`text-xs ${deadline.color}`}>{deadline.text}</div>
                              </div>
                            </div>
                            
                            <div className="mt-3">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-sm text-gray-600">Projektfortschritt</span>
                                <span className="text-sm text-gray-600">
                                  {project.tasksCompleted}/{project.tasksTotal} Aufgaben
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full transition-all ${
                                    project.progress === 100 ? 'bg-green-500' : 
                                    project.progress >= 75 ? 'bg-blue-500' : 
                                    project.progress >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                                  }`}
                                  style={{ width: `${project.progress}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>

                          <div className="p-4">
                            <h4 className="text-sm font-medium text-gray-900 mb-3">
                              Milestones ({project.milestones.filter(m => m.status === 'completed').length}/{project.milestones.length})
                            </h4>
                            <div className="space-y-2">
                              {project.milestones.map(milestone => {
                                const milestoneDeadline = formatDeadline(milestone.deadline);
                                return (
                                  <div key={milestone.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                      <div className={`w-3 h-3 rounded-full ${
                                        milestone.status === 'completed' ? 'bg-green-500' :
                                        milestone.status === 'in_progress' ? 'bg-blue-500' : 'bg-gray-300'
                                      }`}></div>
                                      <span className="text-sm font-medium text-gray-900">{milestone.name}</span>
                                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        milestone.status === 'completed' ? 'text-green-600 bg-green-100' :
                                        milestone.status === 'in_progress' ? 'text-blue-600 bg-blue-100' :
                                        'text-gray-600 bg-gray-100'
                                      }`}>
                                        {milestone.status === 'completed' ? 'Abgeschlossen' :
                                         milestone.status === 'in_progress' ? 'In Bearbeitung' : 'Geplant'}
                                      </span>
                                    </div>
                                    <div className="text-right">
                                      <div className={`text-xs font-medium ${milestoneDeadline.color}`}>
                                        {milestoneDeadline.text}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Dashboard Component
  const Dashboard = () => {
    const { projects, upcomingTasks } = getDashboardData();
    const activeProjects = projects.filter(p => p.status !== 'completed');

    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">
                    {dashboardView === 'rapport' ? 'Rapport erfassen' : 
                     dashboardView === 'projects' ? 'Projekte nach Kunden' : 'Dashboard'}
                  </h1>
                  <p className="text-sm text-gray-600">Willkommen, {currentUser.username}!</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-600">
                  {currentUser.role === 'admin' && '👑 Administrator'}
                  {currentUser.role === 'manager' && '🎯 Manager'}
                  {currentUser.role === 'user' && '👨‍💻 Entwickler'}
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                >
                  Abmelden
                </button>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {dashboardView === 'rapport' ? (
            <RapportForm />
          ) : dashboardView === 'projects' ? (
            <ProjectsByCustomer />
          ) : (
            <div>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-100 rounded-lg p-6 mb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Willkommen zurück, {currentUser.username}! 👋
                    </h2>
                    <p className="text-gray-600">
                      Hier ist Ihr persönlicher Arbeitsbereich. Sie haben {activeProjects.length} aktive Projekte und {upcomingTasks.length} anstehende Aufgaben.
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Angemeldet seit</div>
                    <div className="text-lg font-semibold text-gray-900">
                      {new Date(currentUser.loginTime).toLocaleTimeString('de-DE', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <button 
                  onClick={() => setDashboardView('rapport')}
                  className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow text-left"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Rapport erfassen</h3>
                      <p className="text-sm text-gray-600">Arbeitszeit dokumentieren</p>
                    </div>
                  </div>
                </button>

                <div className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{activeProjects.length}</h3>
                      <p className="text-sm text-gray-600">Aktive Projekte</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-yellow-600 rounded-full flex items-center justify-center">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{upcomingTasks.length}</h3>
                      <p className="text-sm text-gray-600">Offene Aufgaben</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{projects.length}</h3>
                      <p className="text-sm text-gray-600">Alle Projekte</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-lg shadow">
                    <div className="p-6 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">Meine Projekte</h3>
                          <p className="text-sm text-gray-600">Übersicht über zugewiesene Projekte</p>
                        </div>
                        <button
                          onClick={() => {
                            setDashboardView('projects');
                            setProjectFilter('by_customer');
                          }}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          Nach Kunden gruppiert →
                        </button>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="space-y-4">
                        {projects.slice(0, 4).map(project => {
                          const deadline = formatDeadline(project.deadline);
                          return (
                            <div key={project.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center space-x-3">
                                  <div className="flex items-center space-x-2">
                                    <span className="font-semibold text-gray-900">{project.code}</span>
                                    <span className="text-gray-600">•</span>
                                    <span className="text-gray-900">{project.name}</span>
                                  </div>
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                                    {getStatusText(project.status)}
                                  </span>
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(project.priority)}`}>
                                    {getPriorityText(project.priority)}
                                  </span>
                                </div>
                                <div className="text-right">
                                  <div className="text-sm font-medium text-gray-900">{project.progress}%</div>
                                  <div className={`text-xs ${deadline.color}`}>
                                    Deadline: {deadline.text}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="mb-3">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-sm text-gray-600">Fortschritt</span>
                                  <span className="text-sm text-gray-600">
                                    {project.tasksCompleted}/{project.tasksTotal} Aufgaben
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div 
                                    className={`h-2 rounded-full transition-all ${
                                      project.progress === 100 ? 'bg-green-500' : 
                                      project.progress >= 75 ? 'bg-blue-500' : 
                                      project.progress >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                                    }`}
                                    style={{ width: `${project.progress}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6"> 
                  
                  <div className="bg-white rounded-lg shadow">
                    <div className="p-6 border-b border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900">Nächste Deadlines</h3>
                      <p className="text-sm text-gray-600">Anstehende Milestones</p>
                    </div>
                    <div className="p-6">
                      <div className="space-y-3">
                        {upcomingTasks.slice(0, 5).map(task => {
                          const deadline = formatDeadline(task.deadline);
                          return (
                            <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex-1">
                                <div className="font-medium text-gray-900 text-sm">{task.title}</div>
                                <div className="text-xs text-gray-600 mt-1">
                                  {task.project} • {task.estimated}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className={`text-xs font-medium ${deadline.color}`}>
                                  {deadline.text}
                                </div>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                                  {getPriorityText(task.priority)}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow">
                    <div className="p-6 border-b border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900">Schnellzugriff</h3>
                    </div>
                    <div className="p-6 space-y-3">
                      <button 
                        onClick={() => setDashboardView('rapport')}
                        className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <FileText className="w-5 h-5 text-blue-600" />
                          <span className="font-medium text-gray-900">Rapport erfassen</span>
                        </div>
                      </button>
                      
                      
                      <button 
                        onClick={() => {
                          setDashboardView('projects');
                          setProjectFilter('by_customer');
                        }}
                        className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <User className="w-5 h-5 text-purple-600" />
                          <span className="font-medium text-gray-900">Projekte nach Kunden</span>
                        </div>
                      </button>
                      
                      <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center space-x-3">
                          <Clock className="w-5 h-5 text-green-600" />
                          <span className="font-medium text-gray-900">Meine Arbeitszeit</span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    );
  };

  return currentUser ? <Dashboard /> : (currentView === 'login' ? <LoginForm /> : <RegisterForm />);
}

export default App;