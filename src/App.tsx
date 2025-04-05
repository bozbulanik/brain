import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import RootLayout from './layouts/RootLayout'
import LoggerPage from './pages/LoggerPage'
import SearchPage from './pages/SearchPage'
import SettingsLayout from './layouts/SettingsLayout'
import SettingsGeneralPage from './pages/settings/SettingsGeneralPage'
import SettingsAppearancePage from './pages/settings/SettingsAppearancePage'
import { useSettingsStore } from './store/settingsStore'
import { useEffect } from 'react'
import SettingsAboutPage from './pages/settings/SettingsAboutPage'
import SettingsShortcutsPage from './pages/settings/SettingsShortcutsPage'
import SettingsUserPage from './pages/settings/SettingsUserPage'

function App() {
  const { settings, initialized, initializeSettings } = useSettingsStore()

  useEffect(() => {
    if (!initialized) {
      initializeSettings()
    }
  }, [initialized, initializeSettings])

  useEffect(() => {
    if (initialized) {
      document.body.className = settings.theme
    }
  }, [initialized, settings.theme])

  if (!initialized) {
    return <div>Loading application settings...</div>
  }

  return (
    // <ThemeProvider>
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
          path="/settings/user"
          element={
            <RootLayout>
              <SettingsLayout>
                <SettingsUserPage />
              </SettingsLayout>
            </RootLayout>
          }
        />
        <Route
          path="/settings/shortcuts"
          element={
            <RootLayout>
              <SettingsLayout>
                <SettingsShortcutsPage />
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
        <Route
          path="/settings/about"
          element={
            <RootLayout>
              <SettingsLayout>
                <SettingsAboutPage />
              </SettingsLayout>
            </RootLayout>
          }
        />
      </Routes>
    </Router>
    // </ThemeProvider>
  )
}

export default App
