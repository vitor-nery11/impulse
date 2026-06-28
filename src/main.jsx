import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { DeckProvider } from './context/DeckContext'
import { UserProvider } from './context/UserContext'
import { ThemeProvider } from './context/ThemeContext'
import { TasksProvider } from './context/TasksContext'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <UserProvider>
            <TasksProvider>
              <DeckProvider>
                <App />
              </DeckProvider>
            </TasksProvider>
          </UserProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
