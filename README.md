# Impulse (Flashcards & Foco)

O Impulse é um sistema moderno de produtividade e aprendizado, desenvolvido para auxiliar estudantes na memorização de conteúdos e gestão de tempo. O aplicativo une o poder dos flashcards com Repetição Espaçada (SRS), temporizador Pomodoro e um gerenciador de tarefas integrado.

O projeto foi criado para resolver a dificuldade de reter conhecimento a longo prazo. Ele permite organizar baralhos de estudo, importar conteúdos automaticamente a partir de PDFs, acompanhar o progresso diário (ofensivas) e gerenciar blocos de foco para combater a procrastinação.

> 🤖 **Nota:** Este sistema foi totalmente arquitetado, codificado e otimizado através de Pair Programming com Inteligência Artificial (Google Gemini).

## Funcionalidades

- Autenticação de usuários segura e criptografada (Supabase Auth).
- Criação e gerenciamento de Baralhos (Decks) e Flashcards.
- Importador de PDFs com leitura automática de palavras e termos.
- Algoritmo de Repetição Espaçada (SRS) baseado no Anki (ajusta os dias de revisão baseado no seu desempenho).
- Fila dinâmica de aprendizagem (cartões errados repetem no fim da sessão).
- Temporizador Pomodoro com gerador sintético de sons (Sino de Meditação Tibetano via Web Audio API).
- Gerenciador de Tarefas (To-Do List) interativo e persistente.
- Painel de Estatísticas com contagem de Ofensiva (Streak) e tempo de estudo.
- Interface Dark Mode Premium, responsiva para Desktop e Mobile.

## Tecnologias Utilizadas

- React (Vite)
- Tailwind CSS
- Supabase (PostgreSQL, Row Level Security, Auth)
- React Router DOM
- PDF.js
- Web Audio API
- Vercel (Hospedagem)

## Como Usar (Rodando Localmente)

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/impulse.git
```

### 2. Acesse a pasta do projeto

```bash
cd impulse
```

### 3. Instale as dependências

```bash
npm install
```

### 4. Configure as Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com suas credenciais do Supabase:

```env
VITE_SUPABASE_URL=sua_url_aqui
VITE_SUPABASE_ANON_KEY=sua_chave_anon_aqui
```

*Lembre-se de configurar suas tabelas e políticas de RLS no Supabase usando o SQL estrutural do projeto.*

### 5. Execute o programa

```bash
npm run dev
```

### 6. Acesse no Navegador

Abra `http://localhost:5173` para utilizar o sistema completo.

## Vídeo do Projeto

Em breve.

---
Desenvolvido com o objetivo de criar uma solução "World-Class" de aprendizado, mesclando engenharia de software moderna com Inteligência Artificial avançada em um fluxo ágil de desenvolvimento.
