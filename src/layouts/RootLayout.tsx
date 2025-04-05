interface RootLayoutProps {
  children: React.ReactNode
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <div className="overflow-hidden h-screen w-screen rounded-rounded border-1 border-[#939393] dark:border-[#545454] text-text bg-background dark:bg-background-dark dark:text-text-dark">
      <div className="flex flex-row w-full h-full p-1.75 ">
        <div className="w-full h-full flex flex-col rounded-[8px] border border-border dark:border-border-dark">
          {children}
        </div>
      </div>
    </div>
  )
}

export default RootLayout
