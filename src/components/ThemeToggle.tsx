import { useContext } from 'react'
import { ThemeContext } from '../context/ThemeContext'
import { Moon, Sun } from 'lucide-react'

const ThemeToggle = () => {
  const theme = useContext(ThemeContext)

  if (!theme) return null

  return (
    <button
      onClick={theme.toggleDarkMode}
      className="transition p-2 m-2 rounded-lg hover:bg-button-hover dark:hover:bg-button-hover-dark cursor-pointer"
    >
      {theme.darkMode ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  )
}

export default ThemeToggle
