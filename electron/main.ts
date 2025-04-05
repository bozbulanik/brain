import { app, BrowserWindow, globalShortcut, ipcMain, shell } from 'electron'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import Store from 'electron-store'

import { SettingsSchema } from '../src/store/settingsStore'

const store = new Store<SettingsSchema>({
  name: 'app-settings',
  defaults: {
    theme: 'light'
  }
})

const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

const sqlite3 = require('sqlite3')
const db = new sqlite3.Database('logs.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) {
    console.error('Database connection error:', err.message)
  } else {
    console.log('Connected to SQLite database')
  }
})
// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, 'public')
  : RENDERER_DIST

let initialWindow: BrowserWindow | null
let welcomeWindow: BrowserWindow | null
let logWindow: BrowserWindow | null
let searchWindow: BrowserWindow | null
let settingsWindow: BrowserWindow | null
let dataManagerWindow: BrowserWindow | null

function createInitialWindow() {
  initialWindow = new BrowserWindow({
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs')
    }
  })

  initialWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (VITE_DEV_SERVER_URL) {
    initialWindow.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // initialWindow.loadFile('dist/index.html')
    initialWindow.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    initialWindow = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createInitialWindow()
  }
})

app.whenReady().then(() => {
  createInitialWindow()

  initialWindow?.webContents.on('did-finish-load', () => {
    createWelcomeWindow()
    welcomeWindow?.focus()
  })

  globalShortcut.register('CommandOrControl+N', () => {
    createLogWindow()
    logWindow?.focus()
  })
  globalShortcut.register('CommandOrControl+Space', () => {
    createSearchWindow()
    searchWindow?.focus()
  })
  globalShortcut.register('CommandOrControl+Alt+S', () => {
    createSettingsWindow()
    settingsWindow?.focus()
  })
  globalShortcut.register('CommandOrControl+D', () => {
    createDataManagerWindow()
    dataManagerWindow?.focus()
  })
})

function createLogWindow() {
  if (logWindow) {
    if (VITE_DEV_SERVER_URL) {
      logWindow.loadURL(`${VITE_DEV_SERVER_URL}logger`)
    } else {
      // logWindow.loadFile('dist/index.html')
      logWindow.loadFile(path.join(RENDERER_DIST, 'logger'))
    }
    return
  }
  logWindow = new BrowserWindow({
    width: 720,
    height: 480,
    resizable: false,
    autoHideMenuBar: true,
    transparent: true,
    center: true,
    title: '',
    frame: false,
    vibrancy: 'under-window',
    backgroundMaterial: 'acrylic',
    visualEffectState: 'active',
    titleBarStyle: 'hidden',
    trafficLightPosition: { x: 12, y: 10 },

    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
      sandbox: true,
      contextIsolation: true,
      nodeIntegration: true
    }
  })

  logWindow.on('closed', () => {
    logWindow = null
  })
  // Test active push message to Renderer-process.
  logWindow.webContents.on('did-finish-load', () => {
    logWindow?.webContents.send('main-process-message', new Date().toLocaleString())
  })
  logWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })
  if (VITE_DEV_SERVER_URL) {
    logWindow.loadURL(`${VITE_DEV_SERVER_URL}logger`)
  } else {
    // logWindow.loadFile('dist/index.html')
    logWindow.loadFile(path.join(RENDERER_DIST, 'logger'))
  }
}

function createSearchWindow() {
  if (searchWindow) {
    if (VITE_DEV_SERVER_URL) {
      searchWindow.loadURL(`${VITE_DEV_SERVER_URL}search`)
    } else {
      // logWindow.loadFile('dist/index.html')
      searchWindow.loadFile(path.join(RENDERER_DIST, 'search'))
    }
    return
  }
  searchWindow = new BrowserWindow({
    width: 720,
    height: 480,
    resizable: false,
    autoHideMenuBar: true,
    transparent: true,
    center: true,
    title: '',
    frame: false,
    vibrancy: 'under-window',
    backgroundMaterial: 'acrylic',
    visualEffectState: 'active',
    titleBarStyle: 'hidden',
    trafficLightPosition: { x: 12, y: 10 },

    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
      sandbox: true,
      contextIsolation: true,
      nodeIntegration: true
    }
  })

  searchWindow.on('closed', () => {
    searchWindow = null
  })
  // Test active push message to Renderer-process.
  searchWindow.webContents.on('did-finish-load', () => {
    searchWindow?.webContents.send('main-process-message', new Date().toLocaleString())
  })
  searchWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })
  if (VITE_DEV_SERVER_URL) {
    searchWindow.loadURL(`${VITE_DEV_SERVER_URL}search`)
  } else {
    // logWindow.loadFile('dist/index.html')
    searchWindow.loadFile(path.join(RENDERER_DIST, 'search'))
  }
}

function createSettingsWindow() {
  if (settingsWindow) {
    if (VITE_DEV_SERVER_URL) {
      settingsWindow.loadURL(`${VITE_DEV_SERVER_URL}settings`)
    } else {
      // logWindow.loadFile('dist/index.html')
      settingsWindow.loadFile(path.join(RENDERER_DIST, 'settings'))
    }
    return
  }
  settingsWindow = new BrowserWindow({
    width: 720,
    height: 480,
    resizable: false,
    autoHideMenuBar: true,
    transparent: true,
    center: true,
    title: '',
    frame: false,
    vibrancy: 'under-window',
    backgroundMaterial: 'acrylic',
    visualEffectState: 'active',
    titleBarStyle: 'hidden',
    trafficLightPosition: { x: 12, y: 10 },

    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
      sandbox: true,
      contextIsolation: true,
      nodeIntegration: true
    }
  })

  settingsWindow.on('closed', () => {
    settingsWindow = null
  })
  // Test active push message to Renderer-process.
  settingsWindow.webContents.on('did-finish-load', () => {
    settingsWindow?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  settingsWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (VITE_DEV_SERVER_URL) {
    settingsWindow.loadURL(`${VITE_DEV_SERVER_URL}settings`)
  } else {
    // logWindow.loadFile('dist/index.html')
    settingsWindow.loadFile(path.join(RENDERER_DIST, 'settings'))
  }
}

function createWelcomeWindow() {
  if (welcomeWindow) {
    if (VITE_DEV_SERVER_URL) {
      welcomeWindow.loadURL(`${VITE_DEV_SERVER_URL}welcome`)
    } else {
      // logWindow.loadFile('dist/index.html')
      welcomeWindow.loadFile(path.join(RENDERER_DIST, 'welcome'))
    }
    return
  }
  welcomeWindow = new BrowserWindow({
    width: 720,
    height: 480,
    resizable: false,
    autoHideMenuBar: true,
    transparent: true,
    center: true,
    title: '',
    frame: false,
    vibrancy: 'under-window',
    backgroundMaterial: 'acrylic',
    visualEffectState: 'active',
    titleBarStyle: 'hidden',
    trafficLightPosition: { x: 12, y: 10 },

    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
      sandbox: true,
      contextIsolation: true,
      nodeIntegration: true
    }
  })

  welcomeWindow.on('closed', () => {
    welcomeWindow = null
  })
  // Test active push message to Renderer-process.
  welcomeWindow.webContents.on('did-finish-load', () => {
    welcomeWindow?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  welcomeWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (VITE_DEV_SERVER_URL) {
    welcomeWindow.loadURL(`${VITE_DEV_SERVER_URL}welcome`)
  } else {
    // logWindow.loadFile('dist/index.html')
    welcomeWindow.loadFile(path.join(RENDERER_DIST, 'welcome'))
  }
}

function createDataManagerWindow() {
  if (dataManagerWindow) {
    if (VITE_DEV_SERVER_URL) {
      dataManagerWindow.loadURL(`${VITE_DEV_SERVER_URL}datamanager`)
    } else {
      // logWindow.loadFile('dist/index.html')
      dataManagerWindow.loadFile(path.join(RENDERER_DIST, 'datamanager'))
    }
    return
  }
  dataManagerWindow = new BrowserWindow({
    width: 720,
    height: 480,
    resizable: false,
    autoHideMenuBar: true,
    transparent: true,
    center: true,
    title: '',
    frame: false,
    vibrancy: 'under-window',
    backgroundMaterial: 'acrylic',
    visualEffectState: 'active',
    titleBarStyle: 'hidden',
    trafficLightPosition: { x: 12, y: 10 },

    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
      sandbox: true,
      contextIsolation: true,
      nodeIntegration: true
    }
  })

  dataManagerWindow.on('closed', () => {
    dataManagerWindow = null
  })
  // Test active push message to Renderer-process.
  dataManagerWindow.webContents.on('did-finish-load', () => {
    dataManagerWindow?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  dataManagerWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (VITE_DEV_SERVER_URL) {
    dataManagerWindow.loadURL(`${VITE_DEV_SERVER_URL}datamanager`)
  } else {
    // logWindow.loadFile('dist/index.html')
    dataManagerWindow.loadFile(path.join(RENDERER_DIST, 'datamanager'))
  }
}

ipcMain.handle('openWindow', async (_, windowName) => {
  switch (windowName) {
    case 'datamanager':
      createDataManagerWindow()
      dataManagerWindow?.focus()
      break
    case 'welcome':
      createWelcomeWindow()
      welcomeWindow?.focus()
      break
    case 'log':
      createLogWindow()
      logWindow?.focus()
      break
    case 'search':
      createSearchWindow()
      searchWindow?.focus()
      break
    case 'settings':
      createSettingsWindow()
      settingsWindow?.focus()
      break
    default:
      break
  }
})
ipcMain.handle('closeWindow', async (_, windowName) => {
  switch (windowName) {
    case 'datamanager':
      dataManagerWindow?.close()
      break
    case 'welcome':
      welcomeWindow?.close()
      break
    case 'log':
      logWindow?.close()
      break
    case 'search':
      searchWindow?.close()
      break
    case 'settings':
      settingsWindow?.close()
      break
    default:
      break
  }
})

ipcMain.handle('getSettings', (_, key?: keyof SettingsSchema) => {
  return key ? store.get(key) : store.store
})

ipcMain.handle('setSettings', (_, key: keyof SettingsSchema, value: any) => {
  store.set(key, value)
  return true
})

ipcMain.handle('resetSettings', () => {
  store.clear()
  return true
})

ipcMain.handle('get-data', async () => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM logs', [], (err, rows) => {
      if (err) reject(err)
      else resolve(rows)
    })
  })
})

ipcMain.handle(
  'add-data',
  async (
    _,
    id: number,
    type: string,
    title: string,
    content: string,
    createdAt: Date,
    updatedAt: Date
  ) => {
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO logs (type, title, content, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)',
        [type, title, content, createdAt, updatedAt],
        function (err) {
          if (err) reject(err)
          else resolve({ id: db.lastID, content })
        }
      )
    })
  }
)
