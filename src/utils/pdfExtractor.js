import * as pdfjsLib from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.mjs?url';

// Configurando o worker do PDF.js para funcionar com o Vite de forma mais segura
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

export async function extractWordsFromPDF(file) {
  try {
    let fullText = "";

    // Se for arquivo TXT
    if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
      fullText = await file.text();
    } 
    // Se for arquivo PDF
    else if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(" ");
        fullText += pageText + " ";
      }
    } else {
      throw new Error("Formato não suportado");
    }
    
    // Verifica se o texto tem formato "palavra = tradução" (muito comum em TXT)
    const lines = fullText.split('\n');
    const pairs = [];
    
    for (const line of lines) {
      if (line.includes('=')) {
        const parts = line.split('=');
        if (parts.length >= 2) {
          const word = parts[0].trim();
          const translation = parts.slice(1).join('=').trim(); // Junta o resto caso a tradução tenha '='
          if (word && translation) {
            pairs.push({ word, translation });
          }
        }
      }
    }

    if (pairs.length > 0) {
      // Se encontrou o padrão "palavra = tradução", retorna os pares
      return pairs;
    }
    
    // Fallback original: Limpeza super básica para pegar palavras soltas
    const words = fullText
      .replace(/[^a-zA-ZáéíóúãõçÁÉÍÓÚÃÕÇ\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3)
      .map(word => word.toLowerCase());
      
    // Remover duplicatas
    const uniqueWords = [...new Set(words)];
    
    // Retornar as primeiras palavras (aumentei o limite para 50)
    return uniqueWords.slice(0, 50).map(word => ({ word, translation: '' }));
  } catch (error) {
    console.error("Erro ao extrair arquivo:", error);
    throw new Error("Falha ao processar o arquivo.");
  }
}
