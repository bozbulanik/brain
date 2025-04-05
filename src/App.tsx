import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import RootLayout from './layouts/RootLayout'
import { ThemeProvider } from './context/ThemeContext'
import LoggerPage from './pages/LoggerPage'
import SearchPage from './pages/SearchPage'
import SettingsPage from './pages/SettingsPage'
import SettingsLayout from './layouts/SettingsLayout'
import SettingsGeneralPage from './pages/settings/SettingsGeneralPage'
import SettingsAppearancePage from './pages/settings/SettingsAppearancePage'

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route
            path="/logger"
            element={
              <RootLayout>
                <LoggerPage />
              </RootLayout>
            }
          />
          <Route
            path="/search"
            element={
              <RootLayout>
                <SearchPage />
              </RootLayout>
            }
          />
          <Route
            path="/settings"
            element={
              <RootLayout>
                <SettingsLayout>
                  <SettingsGeneralPage />
                </SettingsLayout>
              </RootLayout>
            }
          />
          <Route
            path="/settings/appearance"
            element={
              <RootLayout>
                <SettingsLayout>
                  <SettingsAppearancePage />
                </SettingsLayout>
              </RootLayout>
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App
