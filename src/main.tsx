import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './app'
import './index.css'
import { Toaster } from 'sonner'
import { NotesProvider } from './contexts/notesContext'
import 'react-confirm-alert/src/react-confirm-alert.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <NotesProvider>
      <App />
    </NotesProvider>
    <Toaster theme='dark' richColors/>
  </React.StrictMode>,
)
