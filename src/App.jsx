import { Routes, Route } from 'react-router-dom';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { DeckList } from './pages/DeckList';
import { Flashcards } from './pages/Flashcards';
import { ImportPDF } from './pages/ImportPDF';
import { Progress } from './pages/Progress';
import { Settings } from './pages/Settings';
import { Pomodoro } from './pages/Pomodoro';
import { Tasks } from './pages/Tasks';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Protected Routes */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/flashcards" element={<ProtectedRoute><DeckList /></ProtectedRoute>} />
      <Route path="/flashcards/:deckId" element={<ProtectedRoute><Flashcards /></ProtectedRoute>} />
      <Route path="/import-pdf" element={<ProtectedRoute><ImportPDF /></ProtectedRoute>} />
      <Route path="/progress" element={<ProtectedRoute><Progress /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="/pomodoro" element={<ProtectedRoute><Pomodoro /></ProtectedRoute>} />
      <Route path="/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
    </Routes>
  );
}

export default App;
