import { useContext, useState } from 'react'
import logo from './assets/logo-nlw.svg'
import { NewNoteCard } from './components/new-note-card'
import { NoteCard } from './components/note-card'
import { NotesContext } from './contexts/notesContext'

export function App() {
  const {notes} = useContext(NotesContext)
  const [search, setSearch] = useState('')

  function handleSearch(event: React.ChangeEvent<HTMLInputElement>) {
    const query = event.target.value
    setSearch(query)
  }

  // Filtrando as notas conforme o usuário digita
  const filteredNotes = search != '' ? notes.filter(note => note.note.content.toLowerCase().includes(search.toLowerCase())) : notes

  return (
    <div className='mx-auto max-w-6xl my-12 space-y-6 px-5'>
      <img src={logo} alt='Logo NLW Experts'/>
      <form className='w-full'>
        <input 
          className='w-full bg-transparent text-3xl font-semibold tracking-tight placeholder:text-slate-500 outline-none'
          type='text'
          placeholder='Busque em suas notas...'
          onChange={handleSearch}
        />
        
      </form>
      <div className='h-px bg-slate-700' />
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-[250px] gap-6'>
        <NewNoteCard />

        {filteredNotes.map((element) => (
          <NoteCard key={element.note.id} note={element.note}/>
        ))}
      </div>  
    </div>
    
  )
}
