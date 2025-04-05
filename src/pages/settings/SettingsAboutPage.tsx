import { BrainCog, Copyleft, ExternalLink, MessageCircleQuestion } from 'lucide-react'

const SettingsAboutPage = () => {
  return (
    <div className="w-full h-full px-2">
      <div className="w-full h-full flex flex-col gap-8 items-center justify-center">
        <div className="flex gap-4 items-center">
          <BrainCog size={64} strokeWidth={1} />
          <div className="flex flex-col">
            <p className="font-bold text-xl">brain</p>
            <p>Version 0.0.1</p>
            <p>Developed by Emek Kırarslan</p>
            <div className="flex gap-2 items-center">
              <Copyleft size={16} strokeWidth={1.5} />
              <p>All rights are not reserved.</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <a
            href="https://github.com/bozbulanik/brain"
            target="_blank"
            className="cursor-pointer flex gap-2 text-xs font-bold border border-button-border 
          dark:border-button-border-dark bg-button dark:bg-button-dark hover:bg-button-hover hover:border-button-border-hover
          dark:hover:bg-button-hover-dark dark:hover:border-button-border-hover-dark p-2 rounded-md"
          >
            <ExternalLink size={16} strokeWidth={1.5} />
            Visit website
          </a>
          <a
            href="https://github.com/bozbulanik/brain/issues/new/choose"
            target="_blank"
            className="cursor-pointer flex gap-2 text-xs font-bold border border-button-border 
          dark:border-button-border-dark bg-button dark:bg-button-dark hover:bg-button-hover hover:border-button-border-hover
          dark:hover:bg-button-hover-dark dark:hover:border-button-border-hover-dark p-2 rounded-md"
          >
            <MessageCircleQuestion size={16} strokeWidth={1.5} />
            Feedback
          </a>
        </div>
      </div>
    </div>
  )
}

export default SettingsAboutPage
