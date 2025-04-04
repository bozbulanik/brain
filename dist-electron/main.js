import { app, BrowserWindow, globalShortcut, ipcMain } from "electron";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let initialWindow;
let logWindow;
let searchWindow;
function createInitialWindow() {
  initialWindow = new BrowserWindow({
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs")
    }
  });
  initialWindow.webContents.on("did-finish-load", () => {
    initialWindow == null ? void 0 : initialWindow.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  });
  if (VITE_DEV_SERVER_URL) {
    initialWindow.loadURL(VITE_DEV_SERVER_URL);
  } else {
    initialWindow.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    initialWindow = null;
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createInitialWindow();
  }
});
app.whenReady().then(() => {
  createInitialWindow();
  globalShortcut.register("CommandOrControl+N", () => {
    createLogWindow();
    logWindow == null ? void 0 : logWindow.focus();
  });
  globalShortcut.register("CommandOrControl+Space", () => {
    createSearchWindow();
    searchWindow == null ? void 0 : searchWindow.focus();
  });
});
function createLogWindow() {
  if (logWindow) {
    if (VITE_DEV_SERVER_URL) {
      logWindow.loadURL(`${VITE_DEV_SERVER_URL}logger`);
    } else {
      logWindow.loadFile(path.join(RENDERER_DIST, "logger"));
    }
    return;
  }
  logWindow = new BrowserWindow({
    width: 720,
    height: 480,
    resizable: false,
    autoHideMenuBar: true,
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    transparent: true,
    center: true,
    title: "",
    frame: false,
    vibrancy: "under-window",
    backgroundMaterial: "acrylic",
    visualEffectState: "active",
    titleBarStyle: "hidden",
    trafficLightPosition: { x: 12, y: 10 },
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
      sandbox: true,
      contextIsolation: true,
      nodeIntegration: true
    }
  });
  logWindow.on("closed", () => {
    logWindow = null;
  });
  logWindow.webContents.on("did-finish-load", () => {
    logWindow == null ? void 0 : logWindow.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  });
  if (VITE_DEV_SERVER_URL) {
    logWindow.loadURL(`${VITE_DEV_SERVER_URL}logger`);
  } else {
    logWindow.loadFile(path.join(RENDERER_DIST, "logger"));
  }
}
function createSearchWindow() {
  if (searchWindow) {
    if (VITE_DEV_SERVER_URL) {
      searchWindow.loadURL(`${VITE_DEV_SERVER_URL}search`);
    } else {
      searchWindow.loadFile(path.join(RENDERER_DIST, "search"));
    }
    return;
  }
  searchWindow = new BrowserWindow({
    width: 720,
    height: 480,
    resizable: false,
    autoHideMenuBar: true,
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    transparent: true,
    center: true,
    title: "",
    frame: false,
    vibrancy: "under-window",
    backgroundMaterial: "acrylic",
    visualEffectState: "active",
    titleBarStyle: "hidden",
    trafficLightPosition: { x: 12, y: 10 },
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
      sandbox: true,
      contextIsolation: true,
      nodeIntegration: true
    }
  });
  searchWindow.on("closed", () => {
    searchWindow = null;
  });
  searchWindow.webContents.on("did-finish-load", () => {
    searchWindow == null ? void 0 : searchWindow.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  });
  if (VITE_DEV_SERVER_URL) {
    searchWindow.loadURL(`${VITE_DEV_SERVER_URL}search`);
  } else {
    searchWindow.loadFile(path.join(RENDERER_DIST, "search"));
  }
}
ipcMain.handle("openWindow", async (_, windowName) => {
  switch (windowName) {
    case "log":
      createLogWindow();
      logWindow == null ? void 0 : logWindow.focus();
      break;
    case "search":
      createSearchWindow();
      searchWindow == null ? void 0 : searchWindow.focus();
      break;
  }
});
ipcMain.handle("closeWindow", async (_, windowName) => {
  switch (windowName) {
    case "log":
      logWindow == null ? void 0 : logWindow.close();
      break;
    case "search":
      searchWindow == null ? void 0 : searchWindow.close();
      break;
  }
});
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
