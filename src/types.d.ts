interface NoteCardProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    note: {
      id: string,
      date: Date,
      content: string
    }
  }