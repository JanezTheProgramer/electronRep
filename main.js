const {app, BrowserWindow, ipcMain} = require('electron');
require('./query').createDB();
require('electron-debug')({ showDevTools: process.env.NODE_ENV === 'development' })

ipcMain.on('request-close-action', (event) => {
  popUp.close();
});

ipcMain.on('request-mainprocess-action', (event) => {
  mainProgram = new BrowserWindow({fullscreen: true, resizable: false, frame: false});
  loginWindow.close();
  try{
    reqWindow.close();
  }catch(e){/*ingore*/}
  mainProgram.loadFile('mainProgram.html');
  mainProgram.setMenu(null);
  mainProgram.on('closed', () => {
    mainProgram = null;
  })
});
//
//
ipcMain.on('request-registration-action', (event) => {
  reqWindow = new BrowserWindow({fullscreenable: false, maximizable: false, width: 480, height: 460, resizable: false, frame: false,transparent: true,});
  reqWindow.loadFile('registerForm.html')
  reqWindow.setMenu(null);
  reqWindow.on('closed', () => {
    reqWindow = null
  })
});
//
//minimize
//
ipcMain.on('request-login-minimize', (event) => { 
  loginWindow.minimize();
});
//
ipcMain.on('request-register-minimize', (event) => { 
  reqWindow.minimize();
});
//
//main program
ipcMain.on('request-mainwindow-minimize', (event) => { 
  mainProgram.minimize();
});
//
ipcMain.on('request-mainwindow-logOut', (event) => { 
  loginWindow = new BrowserWindow({fullscreenable: false, maximizable: false, width: 480, height: 460, resizable: false, frame: false,transparent: true,});
  loginWindow.loadFile('loginForm.html');
  loginWindow.setMenu(null);
  closePopUP();
  popUp = new BrowserWindow({fullscreenable: false, maximizable: false, width: 450, height: 170, resizable: false, frame: false,transparent: true,});
  popUp.setMenu(null);
  let file = 'data:text/html;charset=UTF-8,' + encodeURIComponent(require('./renderAlert').loadView({
    title: "Logged out!",
  }));
  popUp.loadURL(file);
  loginWindow.on('closed', () => {
    loginWindow = null
  });
  mainProgram.close();
});
//
//
// everything below is generated on load! || default functions
//
let loginWindow;

let createWindow = () => {
  loginWindow = new BrowserWindow({fullscreenable: false, maximizable: false, width: 480, height: 460, resizable: false, frame: false,transparent: true,});
  loginWindow.loadFile('loginForm.html');
  loginWindow.setMenu(null);
  loginWindow.on('closed', () => {
    loginWindow = null;
  });
}
app.on('ready', createWindow);
app.on('window-all-closed', () => {
  if (process.platform !== "" ) {
    app.quit();
  }
})

app.on('activate', () => {
  if (mainProgram === null) {
    createWindow();
  }
})
let popUp; 
ipcMain.on('request-failed-to-generate-action', (event) => {
  closePopUP();
  popUp = new BrowserWindow({fullscreenable: false, maximizable: false, width: 450, height: 170, resizable: false, frame: false,transparent: true,});
  popUp.setMenu(null);
  let file = 'data:text/html;charset=UTF-8,' + encodeURIComponent(require('./renderAlert').loadView({
    title: "Unknow error! <br> Try restoring the program!",
  }));
  popUp.loadURL(file);
  try{
    mainProgram.close();
  }catch(e){/* ignore exception */}
});
  //
ipcMain.on('request-account-not-found', (event) => {
  closePopUP();
  popUp = new BrowserWindow({fullscreenable: false, maximizable: false, width: 450, height: 170, resizable: false, frame: false,transparent: true,});
  popUp.setMenu(null);
  let file = 'data:text/html;charset=UTF-8,' + encodeURIComponent(require('./renderAlert').loadView({
    title: "Invalid username or password!",
  }));
  popUp.loadURL(file);
});
  //
ipcMain.on('request-already-exsists-action', (event) => {
  closePopUP();
  popUp = new BrowserWindow({fullscreenable: false, maximizable: false, width: 450, height: 170, resizable: false, frame: false,transparent: true,});
  popUp.setMenu(null);
  let file = 'data:text/html;charset=UTF-8,' + encodeURIComponent(require('./renderAlert').loadView({
    title: "Username already in use!",
  }));
  popUp.loadURL(file);
});
  //
ipcMain.on('request-pasw-dont-match-action', (event) => {
  closePopUP();
  popUp = new BrowserWindow({fullscreenable: false, maximizable: false, width: 450, height: 170, resizable: false, frame: false,transparent: true,});
  popUp.setMenu(null);
  let file = 'data:text/html;charset=UTF-8,' + encodeURIComponent(require('./renderAlert').loadView({
    title: "Passwords do not match!",
  }));
  popUp.loadURL(file);
});
  //
ipcMain.on('request-req-not-met-action', (event) => {
  closePopUP();
  popUp = new BrowserWindow({fullscreenable: false, maximizable: false, width: 450, height: 170, resizable: false, frame: false,transparent: true,});
  popUp.setMenu(null);
  let file = 'data:text/html;charset=UTF-8,' + encodeURIComponent(require('./renderAlert').loadView({
      title: "Data not filled in properly!",
  }));
  popUp.loadURL(file);
});

ipcMain.on('request-createdAcc-action', (event) => {
  closePopUP();
  popUp = new BrowserWindow({fullscreenable: false, maximizable: false, width: 450, height: 170, resizable: false, frame: false,transparent: true,});
  popUp.setMenu(null);
  try{
    loginWindow.focus();
  }catch(e){
    createWindow();
  }
  let file = 'data:text/html;charset=UTF-8,' + encodeURIComponent(require('./renderAlert').loadView({
    title: "New Account was Created!",
  }));
  popUp.loadURL(file);
});

const closePopUP = () => {
  try{
    popUp.close();
  }catch(e){/*ignore*/}
}