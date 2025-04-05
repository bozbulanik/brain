import { User, User2 } from 'lucide-react'

const SettingsUserPage = () => {
  return (
    <div className="w-full h-full px-2">
      <div className="w-full h-full flex flex-col gap-4">
        <div>
          <div className="uppercase text-text-muted font-bold text-sm">Profile</div>
          <div className="flex flex-col gap-2">
            <div className="flex gap-4 items-center">
              <button className="flex justify-center items-center cursor-pointer w-16 h-16 hover:border-button-border-hover dark:hover:border-button-border-hover-dark border border-border dark:border-border-dark rounded-full bg-secondary-background dark:bg-secondary-background-dark overflow-hidden">
                <User
                  size={32}
                  strokeWidth={1.5}
                  className="text-button-border dark:text-button-border-dark hover:text-button-border-hover dark:hover:text-button-border-hover-dark"
                />
              </button>
              <div className="flex flex-col gap-2">
                <input
                  placeholder="Your name"
                  className="h-8 px-1 focus:outline-none placeholder-text-muted bg-transparent border border-border dark:border-border-dark rounded-md"
                />
                <input
                  placeholder="E-mail"
                  className="h-8 px-1 focus:outline-none placeholder-text-muted bg-transparent border border-border dark:border-border-dark rounded-md"
                />
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="uppercase text-text-muted font-bold text-sm">AI</div>
          <div className="flex flex-col gap-2">
            <textarea
              placeholder="Bio"
              className="resize-none h-32 h-8 px-2 py-1 focus:outline-none placeholder-text-muted bg-transparent border border-border dark:border-border-dark rounded-md"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
export default SettingsUserPage
