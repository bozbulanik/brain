import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LoggerLayout from './layouts/LoggerLayout'
import { ThemeProvider } from './context/ThemeContext'
import LoggerPage from './pages/LoggerPage'

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route
            path="/logger"
            element={
              <LoggerLayout>
                <LoggerPage />
              </LoggerLayout>
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App
