import * as Dialog from '@radix-ui/react-dialog'
import { X, Mic } from 'lucide-react'
import { ChangeEvent, useState, useContext, useRef } from 'react'
import { toast } from 'sonner';
import { NotesContext } from './../contexts/notesContext'

let speechRecognition: SpeechRecognition | null

export function NewNoteCard() {
  const [showDefaultText, setShowDefaultText] = useState(true)
  const [noteValue, setNoteValue] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const { notes, setNotes } = useContext(NotesContext)
  const dialogCloseRef = useRef<HTMLButtonElement>(null)

  function handleCloseDialog() {
    if (noteValue === '') {
      setNoteValue('') // Limpando o valor digitado
      setShowDefaultText(true) // Voltando ao texto original
    }
    if (dialogCloseRef.current) {
      dialogCloseRef.current.click() // Acionando o click remoto do botão de fechar o modal
    }
  }

  function handleStartNote() {
    setShowDefaultText(false)
  }

  function handleNoteChanged(event: ChangeEvent<HTMLTextAreaElement>) {
    setNoteValue(event.target.value)

    if (event.target.value === '') {
      setShowDefaultText(true)
    }
  }

  function handleSaveNote() {

    if (noteValue === '') {
      toast.error('Informe alguma mensagem na nota antes de salvar.')
      return
    }

    // Montando os dados da nota
    const newNote = {
      note: {
        id: crypto.randomUUID(),
        date: new Date(),
        content: noteValue
      }
    }

    const notesList = [newNote, ...notes]

    // Salvando a nova nota no contexto
    setNotes(notesList)

    setNoteValue('') // Limpando o valor digitado
    setShowDefaultText(true) // Voltando ao texto original

    if (dialogCloseRef.current) {
      dialogCloseRef.current.click() // Acionando o click remoto do botão de fechar o modal
    }

    toast.success('Nota criada com sucesso.')
  }

  function handleStartRecording() {
    
    const isSpeechRecognitionAPIAvailable = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window

    if (!isSpeechRecognitionAPIAvailable) {
      toast.error('Seu navegador não suporta essa funcionalidade. Utilize o metodo de texto.')
      return
    }

    setIsRecording(true)

    setShowDefaultText(false)

    const speechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition

    speechRecognition = new speechRecognitionAPI()

    speechRecognition.lang = 'pt-BR' // Linguagem da fala
    speechRecognition.continuous = true // Gravação continua até ter o comando para parar de gravar
    speechRecognition.maxAlternatives = 1 // Trazer somente uma alternativa da palavra dita (caso esta for muito difícil)
    speechRecognition.interimResults = true // Trazer o resultado conforme o usuário fala, e não somente no final da fala

    speechRecognition.onresult = (event) => {
      const transcription = Array.from(event.results).reduce((text, itemResult) => {
        return text.concat(itemResult[0].transcript)
      }, '')


      setNoteValue(transcription)
    }

    speechRecognition.onerror = (event) => {
      console.log(event)
    }

    speechRecognition.start()
  }

  function handleStopRecording() {
    setIsRecording(false)

    if (speechRecognition) {
      speechRecognition.stop()
    }
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger className='flex flex-col text-left outline-none rounded-md bg-slate-700 p-5 gap-6 overflow-y-auto hover:ring-2 hover:ring-slate-600 focus:ring-2 focus:ring-lime-200 shadow-lg'>
        <span className='text-sm font-medium text-slate-200'>Adicionar nota</span>
        <p className='text-sm leading-6 text-slate-400 '>Grave uma nota em áudio que será convertida em texto automaticamente.</p>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className='inset-0 fixed bg-black/60 flex justify-center items-center'>
          <Dialog.Content className='w-full h-full md:max-w-[640px] md:h-[60vh] bg-slate-700 md:rounded-md flex flex-col outline-none overflow-hidden fixed'>
            <Dialog.Close onClick={handleCloseDialog} ref={dialogCloseRef} className='absolute right-0 bg-slate-800 p-2 text-slate-400 hover:text-slate-100 rounded-bl-md outline-none'>
              <X size={22} />
            </Dialog.Close>
            <div className='flex flex-1 flex-col gap-3 p-5'>
              <span className='text-sm font-medium text-slate-300'>
                Adicionar nota
              </span>
              {showDefaultText ? (<p className='text-sm leading-6 text-slate-400'>
                Utilize a <button className='font-bold text-lime-400 hover:underline' onClick={handleStartRecording}>gravação de notas por áudio</button> ou <button className='font-bold text-lime-400 hover:underline' onClick={() => handleStartNote()}>digite o texto</button>.
              </p>) : (
                <textarea autoFocus
                  className='text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none'
                  onChange={(event) => handleNoteChanged(event)}
                  value={noteValue} />
              )}
            </div>
            {isRecording ? (
              <button
                type='button'
                className='flex justify-center items-center gap-1 w-full bg-slate-900 py-4 text-center text-sm text-slate-300 outline-none font-medium hover:text-slate-100 focus:bg-slate-800'
                onClick={handleStopRecording}>
                  <Mic color='red' size={20} className='animate-bounce'/>
                  Gravando! Clique para interromper a gravação.
              </button>
            ) : (
              <button
                type='button'
                className='w-full bg-lime-400 py-4 text-center text-sm text-red-400 outline-none font-medium hover:bg-lime-500 focus:bg-lime-500'
                onClick={() => handleSaveNote()}>
                Salvar nota
              </button>
            )}

          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>

  )
}