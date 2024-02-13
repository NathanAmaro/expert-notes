import { createContext, useEffect, useState } from "react"

export type NoteCardContextType = {
    notes: NoteCardProps[],
    setNotes: (value: NoteCardProps[]) => void
}

export const NotesContext = createContext<NoteCardContextType>({notes: [], setNotes: () => {}})

export function NotesProvider({ children }: { children: React.ReactNode }) {
    const [notes, setNotes] = useState<NoteCardProps[]>(() => {
        const notesSaved = localStorage.getItem('notes')
        if (notesSaved) {
            return JSON.parse(notesSaved)
        }
        return []
    })

    useEffect(() => {
        // Salvando as notas no localstorage
        localStorage.setItem('notes', JSON.stringify(notes))
    }, [notes])

    return (
        <NotesContext.Provider value={{notes, setNotes}}>
            {children}
        </NotesContext.Provider>
    )
}
