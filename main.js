const {app, BrowserWindow, ipcMain, nativeImage} = require('electron');
const path = require('path');
const icon = nativeImage.createFromPath(path.join(__dirname, './util/icon.png'));

require('./query').createDB();
require('electron-debug')({
 showDevTools: process.env.NODE_ENV === 'development' 
});

let loginWindow,
    mainProgram,
    reqWindow,
    popUp;

ipcMain.on('request-close-action', () => popUp.close());

ipcMain.on('request-mainprocess-action', () => {
  mainProgram = new BrowserWindow({
    skipTaskbar: false,
    fullscreen: true,
    resizable: false,
    frame: false,
    icon: icon
  });
  loginWindow.close();
  try{
    reqWindow.close();
  }catch(e){/*ingore*/}
  mainProgram.loadFile('mainProgram.html');
  mainProgram.setMenu(null);
  mainProgram.on('closed', () => mainProgram = null);
});
//
//
ipcMain.on('request-registration-action', () => {
  reqWindow = new BrowserWindow({
    skipTaskbar: false, 
    fullscreenable: false, 
    maximizable: false, 
    width: 480, 
    height: 460, 
    resizable: false,
    frame: false,
    transparent: true,
    icon: icon
  });
  reqWindow.loadFile('registerForm.html')
  reqWindow.setMenu(null);
  reqWindow.on('closed', () => reqWindow = null);
});
//
//minimize
//
ipcMain.on('request-login-minimize', () => loginWindow.minimize());
ipcMain.on('request-register-minimize', () => reqWindow.minimize());
ipcMain.on('request-mainwindow-minimize', () => mainProgram.minimize());
//
ipcMain.on('request-mainwindow-logOut', () => { 
  loginWindow = new BrowserWindow({
    skipTaskbar: false,
    fullscreenable: false, 
    maximizable: false, 
    width: 480, 
    height: 460, 
    resizable: false, 
    frame: false,
    transparent: true,
    icon: icon
  });
  loginWindow.loadFile('loginForm.html');
  loginWindow.setMenu(null);
  discardPopUp();
  popUp = new BrowserWindow({
    skipTaskbar: false,
    fullscreenable: false, 
    maximizable: false, 
    width: 450, 
    height: 170, 
    resizable: false, 
    frame: false,
    transparent: true,
    icon: icon
  });
  popUp.setMenu(null);
  let file = 'data:text/html;charset=UTF-8,' + encodeURIComponent(require('./renderAlert').loadView({
    title: 'Logged out!',
  }));
  popUp.loadURL(file);
  loginWindow.on('closed', () => loginWindow = null);
  mainProgram.close();
});
//
//
// everything below is generated on load! || default functions
//

const createWindow = () => {
  loginWindow = new BrowserWindow({
    skipTaskbar: false, 
    fullscreenable: false, 
    maximizable: false, 
    width: 480, 
    height: 460, 
    resizable: false, 
    frame: false,
    transparent: true,
    /*focus: true,*/
    icon: icon
  });
  loginWindow.loadFile('loginForm.html');
  loginWindow.setMenu(null);
  loginWindow.on('closed', () => loginWindow = null);
}
app.on('ready', createWindow);
app.on('window-all-closed', () => process.platform !== 'darwin' ? app.quit() : null);
app.on('activate', () => mainProgram === null ? createWindow() : null);
 
ipcMain.on('request-failed-to-generate-action', () => {
  discardPopUp();
  popUp = new BrowserWindow({
    skipTaskbar: true, 
    fullscreenable: false, 
    maximizable: false, 
    width: 450, 
    height: 170, 
    resizable: false, 
    frame: false,
    transparent: true,
    icon: icon
  });
  popUp.setMenu(null);
  let file = 'data:text/html;charset=UTF-8,' + encodeURIComponent(require('./renderAlert').loadView({
    title: 'Unknow error! <br> Try restoring the program!',
  }));
  popUp.loadURL(file);
});
  //
ipcMain.on('request-account-not-found', () => {
  discardPopUp();
  popUp = new BrowserWindow({
    skipTaskbar: true,  
    fullscreenable: false, 
    maximizable: false, 
    width: 450, 
    height: 170, 
    resizable: false, 
    frame: false,
    transparent: true,
    icon: icon
  });
  popUp.setMenu(null);
  let file = 'data:text/html;charset=UTF-8,' + encodeURIComponent(require('./renderAlert').loadView({
    title: 'Invalid username or password!',
  }));
  popUp.loadURL(file);
});
  //
ipcMain.on('request-already-exsists-action', () => {
  discardPopUp();
  popUp = new BrowserWindow({
    skipTaskbar: true, 
    fullscreenable: false, 
    maximizable: false, 
    width: 450, 
    height: 170, 
    resizable: false, 
    frame: false,
    transparent: true,
    icon: icon
  });
  popUp.setMenu(null);
  let file = 'data:text/html;charset=UTF-8,' + encodeURIComponent(require('./renderAlert').loadView({
    title: 'Username already in use!',
  }));
  popUp.loadURL(file);
});
  //
ipcMain.on('request-pasw-dont-match-action', () => {
  discardPopUp();
  popUp = new BrowserWindow({
    skipTaskbar: true,  
    fullscreenable: false, 
    maximizable: false, 
    width: 450, 
    height: 170, 
    resizable: false, 
    frame: false,
    transparent: true,
    icon: icon
  });
  popUp.setMenu(null);
  let file = 'data:text/html;charset=UTF-8,' + encodeURIComponent(require('./renderAlert').loadView({
    title: 'Passwords do not match!',
  }));
  popUp.loadURL(file);
});
  //
ipcMain.on('request-req-not-met-action', () => {
  discardPopUp();
  popUp = new BrowserWindow({
    skipTaskbar: true, 
    fullscreenable: false, 
    maximizable: false, 
    width: 450, 
    height: 170, 
    resizable: false, 
    frame: false,
    transparent: true,
    icon: icon
  });
  popUp.setMenu(null);
  let file = 'data:text/html;charset=UTF-8,' + encodeURIComponent(require('./renderAlert').loadView({
      title: 'Data not filled in properly!',
  }));
  popUp.loadURL(file);
});

ipcMain.on('request-createdAcc-action', () => {
  discardPopUp();
  popUp = new BrowserWindow({
    skipTaskbar: true,  
    fullscreenable: false, 
    maximizable: false, 
    width: 450, 
    height: 170, 
    resizable: false, 
    frame: false,
    transparent: true,
    icon: icon
  });
  try{
    loginWindow.focus();
  }catch(e){
    createWindow();
    loginWindow.focus();
  }
  let file = 'data:text/html;charset=UTF-8,' + encodeURIComponent(require('./renderAlert').loadView({
    title: 'New Account was Created!',
  }));
  popUp.loadURL(file);
});

ipcMain.on('request-noConnection-error', () => {
  discardPopUp();
  popUp = new BrowserWindow({
    skipTaskbar: true,  
    fullscreenable: false, 
    maximizable: false, 
    width: 450, 
    height: 170, 
    resizable: false, 
    frame: false,
    transparent: true,
    icon: icon
  });
  let file = 'data:text/html;charset=UTF-8,' + encodeURIComponent(require('./renderAlert').loadView({
    title: 'No internet connection!<br> \'R\' -> restart | \'Q\' -> quit',
  }));
  popUp.loadURL(file);
});

const discardPopUp = () => {
  try{
    popUp.close();
  }catch(e){/*ignore*/}
}