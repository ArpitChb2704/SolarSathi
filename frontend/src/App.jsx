import { useState ,useEffect} from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import AddPlant from './pages/AddPlant'
import Profile from './pages/Profile'
import Chatbot from './pages/Chatbot'

const pageTitles = {
  dashboard: 'Dashboard',
  add: 'Add Solar Plant',
  profile: 'My Profile',
  chat: 'AI Assistant',
}

function AppShell() {
  const { userId, logout } = useAuth()
  const [authPage, setAuthPage] = useState('login') // 'login' | 'signup'
  const [page, setPage] = useState('dashboard')
  const [userName, setUserName] = useState('')

  useEffect(() => {
    if (!userId) return
    fetch(`/api/user/${userId}`)
      .then(r => r.json())
      .then(d => setUserName(d.name))
      .catch(() => {})
  }, [userId])

  // Not logged in → show auth
  if (!userId) {
    return authPage === 'login'
      ? <Login onSwitch={() => setAuthPage('signup')} />
      : <Signup onSwitch={() => setAuthPage('login')} />
  }

  const navItems = [
    { id: 'dashboard', icon: '⚡', label: 'Dashboard' },
    { id: 'add', icon: '＋', label: 'Add Plant' },
    { id: 'profile', icon: '👤', label: 'My Profile' },
    { id: 'chat', icon: '💬', label: 'AI Assistant' },
  ]

  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-icon"><img src="src/logo.png" alt="Logo" height={120} width={120}/></div>
          <div className="brand-name">SolarSathi</div>
          <div className="brand-sub">Monitoring Platform</div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(item => (
            <button
              key={item.id}
              className={`nav-item ${page === item.id ? 'active' : ''}`}
              onClick={() => setPage(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-badge">
            <div className="user-avatar">
              {userId && userId.name
                ? userId.name.charAt(0).toUpperCase()
                : String(userId).charAt(0).toUpperCase()}
            </div>
            <div className="user-info">
              <div className="user-label">Logged in as</div>
              <div className="user-id">
                {userName || `User #${userId}`}
              </div>
            </div>
            <button className="logout-btn" onClick={logout} title="Logout">⏻</button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="main">
        <div className="topbar">
          <div className="page-title">{pageTitles[page]}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="status-dot" />
            <span style={{ fontSize: 12, color: 'var(--text3)' }}>Backend Connected</span>
          </div>
        </div>

        <div className="page-content">
          {page === 'dashboard' && <Dashboard onNavigate={setPage} />}
          {page === 'add' && <AddPlant />}
          {page === 'profile' && <Profile />}
          {page === 'chat' && <Chatbot userName={userName} />}
        </div>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  )
}
