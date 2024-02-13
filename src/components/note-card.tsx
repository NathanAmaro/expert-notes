import * as Dialog from '@radix-ui/react-dialog'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { X } from 'lucide-react'
import { NotesContext } from '../contexts/notesContext'
import { useContext } from 'react'
import { confirmAlert } from 'react-confirm-alert'

export function NoteCard({ note, ...props }: NoteCardProps) {
  const { notes, setNotes } = useContext(NotesContext)

  function handleDeleteNote() {
    confirmAlert({
      title: 'Confirmação',
      message: 'Deseja excluir a nota?',
      buttons: [
        {
          label: 'Sim',
          onClick: () => {
            const notesArray = notes.filter(element => element.note.id != note.id)
            setNotes(notesArray)
          }
        },
        {
          label: 'Não'
        }
      ]
    })
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger
        className='flex flex-col text-left outline-none rounded-md bg-slate-800 p-5 gap-6 overflow-y-auto bg-gradient-to-t from-black/20 to-black/0 hover:ring-2 hover:ring-slate-600 focus:ring-2 focus:ring-lime-200 shadow-lg'
        {...props}
      >
        <span className='text-sm font-medium text-slate-300'>
          {formatDistanceToNow(note.date, {locale: ptBR, addSuffix: true})}
        </span>
        <p className='text-sm leading-6 text-slate-400'>
          {note.content}
        </p>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className='inset-0 fixed bg-black/60 flex justify-center items-center'>
          <Dialog.Content className='w-full h-full md:max-w-[640px] md:h-[60vh] bg-slate-700 md:rounded-md flex flex-col outline-none overflow-hidden fixed'>
            <Dialog.Close className='absolute right-0 bg-slate-800 p-2 text-slate-400 hover:text-slate-100 rounded-bl-md outline-none'>
              <X size={22}/>
            </Dialog.Close>
            <div className='flex flex-1 flex-col gap-3 p-5'>
              <span className='text-sm font-medium text-slate-300'>
                {formatDistanceToNow(note.date, {locale: ptBR, addSuffix: true})}
              </span>
              <p className='text-sm leading-6 text-slate-400'>
                {note.content}
              </p>
            </div>
            <button onClick={handleDeleteNote} type='button' className='w-full bg-slate-800 py-4 text-center text-sm text-red-400 outline-none font-medium hover:underline'>
              Apagar nota
            </button>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>

  )
}