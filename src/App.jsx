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

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/flashcards" element={<DeckList />} />
      <Route path="/flashcards/:deckId" element={<Flashcards />} />
      <Route path="/import-pdf" element={<ImportPDF />} />
      <Route path="/progress" element={<Progress />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/pomodoro" element={<Pomodoro />} />
    </Routes>
  );
}

export default App;
