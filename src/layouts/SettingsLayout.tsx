import { BrainCogIcon, Keyboard, Pipette, Settings, User } from 'lucide-react'
import { Link } from 'react-router-dom'

interface SettingsLayoutProps {
  children: React.ReactNode
}

const SettingsLayout: React.FC<SettingsLayoutProps> = ({ children }) => {
  return (
    <div className="w-full h-full">
      <div className="flex flex-col w-full h-full">
        <div className="h-12 flex items-center w-full border-b border-border dark:border-border-dark">
          <p className="font-bold text-lg p-4">Settings</p>
        </div>
        <div className="w-full h-full flex">
          <div className="w-32 p-2 bg-secondary-background dark:bg-secondary-background-dark border-r border-border dark:border-border-dark">
            <Link
              to="/settings/user"
              className="text-left outline-none h-6 flex items-center gap-2 p-2 rounded-md hover:bg-hover dark:hover:bg-hover-dark transition text-sm"
            >
              <User size={16} strokeWidth={1.5} />
              <span className="">User</span>
            </Link>
            <Link
              to="/settings"
              className="text-left outline-none h-6 flex items-center gap-2 p-2 rounded-md hover:bg-hover dark:hover:bg-hover-dark transition text-sm"
            >
              <Settings size={16} strokeWidth={1.5} />
              <span className="">General</span>
            </Link>
            <Link
              to="/settings/shortcuts"
              className="text-left outline-none h-6 flex items-center gap-2 p-2 rounded-md hover:bg-hover dark:hover:bg-hover-dark transition text-sm"
            >
              <Keyboard size={16} strokeWidth={1.5} />
              <span className="">Shortcuts</span>
            </Link>
            <Link
              to="/settings/appearance"
              className="text-left outline-none h-6 flex items-center gap-2 p-2 rounded-md hover:bg-hover dark:hover:bg-hover-dark transition text-sm"
            >
              <Pipette size={16} strokeWidth={1.5} />
              <span className="">Appearance</span>
            </Link>
            <Link
              to="/settings/about"
              className="text-left outline-none h-6 flex items-center gap-2 p-2 rounded-md hover:bg-hover dark:hover:bg-hover-dark transition text-sm"
            >
              <BrainCogIcon size={16} strokeWidth={1.5} />
              <span className="">About</span>
            </Link>
          </div>
          <div className="flex-1 p-2">{children}</div>
        </div>
      </div>
    </div>
  )
}

export default SettingsLayout
