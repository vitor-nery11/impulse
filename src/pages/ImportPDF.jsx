import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard } from '../components/LayoutDashboard';
import { Button } from '../components/Button';
import { UploadCloud, CheckCircle2 } from 'lucide-react';
import { extractWordsFromPDF } from '../utils/pdfExtractor';
import { useDecks } from '../context/DeckContext';

export function ImportPDF() {
  const [status, setStatus] = useState('idle'); // idle, processing, editing
  const [extractedWords, setExtractedWords] = useState([]);
  const [deckName, setDeckName] = useState('');
  
  const { addDeck } = useDecks();
  const navigate = useNavigate();

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setStatus('processing');
    setDeckName(`Palavras de: ${file.name}`);
    
    try {
      const extractedData = await extractWordsFromPDF(file);
      
      const wordsToEdit = extractedData.map((item, index) => ({
        id: index,
        word: item.word,
        translation: item.translation || '', 
        selected: true
      }));

      setExtractedWords(wordsToEdit);
      setStatus('editing');
    } catch (error) {
      alert("Erro ao ler PDF. Certifique-se de que é um PDF válido.");
      setStatus('idle');
    }
  };

  const handleToggleWord = (id) => {
    setExtractedWords(prev => prev.map(w => w.id === id ? { ...w, selected: !w.selected } : w));
  };

  const handleTranslationChange = (id, newTranslation) => {
    setExtractedWords(prev => prev.map(w => w.id === id ? { ...w, translation: newTranslation } : w));
  };

  const handleSaveDeck = async () => {
    const selectedCards = extractedWords.filter(w => w.selected);
    
    if (selectedCards.length === 0) {
      alert("Selecione pelo menos uma palavra para salvar no Deck.");
      return;
    }

    const newDeck = {
      name: deckName || 'Novo Baralho',
      cards: selectedCards.map(c => ({
        id: Date.now() + Math.random(), // Vai ser sobrescrito pelo ID real do banco
        word: c.word,
        translation: c.translation || '[Sem tradução]',
        category: 'PDF',
        level: 'Misto'
      }))
    };

    setStatus('processing'); // Feedback visual durante o salvamento
    await addDeck(newDeck);
    setStatus('idle');
    navigate('/dashboard');
  };

  return (
    <LayoutDashboard>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#f5f5f5]">Importar PDF</h1>
          <p className="text-[#888] mt-2">Crie baralhos de estudo automaticamente a partir dos seus documentos.</p>
        </div>

        {status === 'idle' && (
          <div className="bg-[#141414] rounded-3xl p-12 shadow-sm border border-dashed border-white/5 text-center flex flex-col items-center justify-center">
            <div className="w-20 h-20 bg-[#1e1e1e] text-[#f5f5f5] border border-white/5 rounded-full flex items-center justify-center mb-6">
              <UploadCloud size={40} />
            </div>
            <h2 className="text-2xl font-bold text-[#f5f5f5] mb-2">Faça upload de um PDF ou TXT</h2>
            <p className="text-[#888] mb-8 max-w-md">
              O sistema irá ler o documento e extrair as palavras automaticamente.
            </p>
            
            <div>
              <input 
                type="file" 
                id="file-upload"
                accept=".pdf,.txt,application/pdf,text/plain" 
                className="hidden" 
                onChange={handleFileUpload}
              />
              <label htmlFor="file-upload">
                <Button as="span" size="lg" className="cursor-pointer">Selecionar Arquivo</Button>
              </label>
            </div>
          </div>
        )}

        {status === 'processing' && (
          <div className="bg-[#141414] rounded-3xl p-12 shadow-sm border border-white/5 text-center flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-16 h-16 border-4 border-[#333] border-t-[#f5f5f5] rounded-full animate-spin mb-6"></div>
            <h2 className="text-xl font-bold text-[#f5f5f5]">Extraindo palavras...</h2>
            <p className="text-[#888]">Lendo texto diretamente no seu navegador.</p>
          </div>
        )}

        {status === 'editing' && (
          <div className="bg-[#141414] rounded-3xl p-6 md:p-8 shadow-sm border border-white/5 animate-in fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-[#1e1e1e] text-emerald-400 border border-white/5 p-2 rounded-lg">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-xl font-bold text-[#f5f5f5]">Palavras Extraídas!</h2>
                    <span className="bg-[#1e1e1e] text-[#888] border border-white/5 text-xs font-bold px-2.5 py-0.5 rounded-md">
                      {extractedWords.length} identificadas
                    </span>
                  </div>
                  <p className="text-sm text-[#888]">Preencha as traduções para os flashcards que deseja salvar.</p>
                </div>
              </div>

              <input 
                type="text" 
                placeholder="Nome do Novo Deck"
                value={deckName}
                onChange={(e) => setDeckName(e.target.value)}
                className="border border-[#333] bg-[#0a0a0a] text-[#f5f5f5] rounded-xl px-4 py-2 focus:ring-1 focus:ring-white/20 focus:border-white/30 outline-none w-full md:w-80 font-medium"
              />
            </div>

            <div className="border border-white/5 rounded-2xl overflow-hidden mb-8">
              <div className="hidden md:grid bg-[#1a1a1a] px-6 py-3 border-b border-white/5 grid-cols-12 gap-4 font-semibold text-[#888] text-sm">
                <div className="col-span-1 text-center">Salvar</div>
                <div className="col-span-5">Palavra Original</div>
                <div className="col-span-6">Sua Tradução</div>
              </div>
              
              <div className="divide-y divide-white/5 max-h-[60vh] md:max-h-96 overflow-y-auto">
                {extractedWords.map((item) => (
                  <div key={item.id} className="p-4 md:px-6 md:py-3 flex flex-col md:grid md:grid-cols-12 gap-3 md:gap-4 md:items-center hover:bg-[#1a1a1a] transition-colors">
                    
                    <div className="flex items-center gap-3 md:col-span-6 md:grid md:grid-cols-6 md:gap-4 w-full">
                      <div className="md:col-span-1 flex justify-start md:justify-center shrink-0">
                        <input 
                          type="checkbox" 
                          checked={item.selected}
                          onChange={() => handleToggleWord(item.id)}
                          className="w-5 h-5 md:w-5 md:h-5 rounded border-[#333] bg-[#0a0a0a] text-[#f5f5f5] focus:ring-white/20"
                        />
                      </div>
                      <div className="md:col-span-5 font-bold md:font-medium text-[#f5f5f5] text-lg md:text-base truncate break-words w-full">
                        {item.word}
                      </div>
                    </div>

                    <div className="md:col-span-6 pl-8 md:pl-0">
                      <label className="text-xs font-medium text-[#555] mb-1 block md:hidden">Sua Tradução:</label>
                      <input 
                        type="text" 
                        value={item.translation}
                        onChange={(e) => handleTranslationChange(item.id, e.target.value)}
                        placeholder="Digite a tradução..."
                        disabled={!item.selected}
                        className={`w-full border rounded-lg px-3 py-2 text-sm outline-none transition-colors
                          ${item.selected 
                            ? 'bg-[#0a0a0a] border-[#333] text-[#f5f5f5] focus:border-white/30 focus:ring-1 focus:ring-white/20' 
                            : 'bg-[#141414] border-white/5 text-[#555] cursor-not-allowed'}
                        `}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-4">
              <Button variant="ghost" onClick={() => setStatus('idle')} className="w-full sm:w-auto">Cancelar</Button>
              <Button onClick={handleSaveDeck} className="w-full sm:w-auto font-bold">Salvar Baralho</Button>
            </div>
          </div>
        )}
      </div>
    </LayoutDashboard>
  );
}
