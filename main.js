const { app, BrowserWindow, screen, ipcMain, shell, globalShortcut } = require('electron');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

function createWindow() {
  const { x, y, width, height } = screen.getPrimaryDisplay().workArea;

  const win = new BrowserWindow({
    width: width,
    height: height,
    x: x,
    y: y,
    frame: false,
    skipTaskbar: true,
    backgroundColor: '#000000',
    show: true,
    webPreferences: {
      devTools: false,
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.loadFile('index.html');

  win.webContents.on('before-input-event', (event, input) => {
    const k = (input.key || '').toLowerCase();
    if (k === 'f12') { event.preventDefault(); return; }
    if (input.control && input.shift && (k === 'i' || k === 'j' || k === 'c')) { event.preventDefault(); return; }
    if (input.control && k === 'u') { event.preventDefault(); return; }
  });

  win.on('blur', () => {
    win.webContents.send('window-blur');
  });

  win.on('focus', () => {
    win.webContents.send('window-focus');
  });
}

ipcMain.handle('launch', async (event, target) => {
  if (!target) return { ok: false, error: 'no target' };

  if (target.startsWith('http://') || target.startsWith('https://')) {
    shell.openExternal(target);
    return { ok: true, launched: target };
  }

  let appPath = target;
  const configPath = path.join(__dirname, 'apps_config.json');

  if (fs.existsSync(configPath)) {
    try {
      const apps = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      if (apps[target]) appPath = apps[target];
    } catch (e) {
      return { ok: false, error: 'apps_config.json broken: ' + e.message };
    }
  }

  if (!fs.existsSync(appPath)) {
    return { ok: false, error: 'not found: ' + appPath };
  }

  try {
    if (process.platform === 'win32') {
      exec(`start "" "${appPath}"`);
    } else if (process.platform === 'darwin') {
      exec(`open "${appPath}"`);
    } else {
      exec(`"${appPath}"`);
    }
    return { ok: true, launched: appPath };
  } catch (e) {
    return { ok: false, error: e.message };
  }
});

ipcMain.handle('open-site', async (event, url) => {
  if (!url) return { ok: false, error: 'no url' };
  try {
    shell.openExternal(url);
    return { ok: true, launched: url };
  } catch (e) {
    return { ok: false, error: e.message };
  }
});

app.whenReady().then(() => {
  createWindow();
  globalShortcut.register('CommandOrControl+Shift+I', () => {});
  globalShortcut.register('F12', () => {});
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});