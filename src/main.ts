'use strict';

const electron = require('electron');
const { app, BrowserWindow, ipcMain, nativeImage } = electron;
const path = require('path');
const msgBox = require('./scripts/renderAlert');
const icon = nativeImage.createFromPath(path.join(__dirname, './util/icon.png'));
const setupPug = require('electron-pug');

require('./scripts/sqliteQuery').createDB();

//only for developers
require('electron-debug')({
    showDevTools: process.env.NODE_ENV === 'development'
});

let loginWindow,
    mainWindow,
    reqWindow,
    loadingWindow,
    popUpWindow,
    screenWidth,
    _Session_ = null;

// get current user logged 
ipcMain.on('user-request', event => {
    if(mainWindow && !_Session_){
        createWindow();
        drawAlert('User not defined!');
        event.returnValue = -1;
    } else {
        event.returnValue = _Session_;
    }
});

////global functions throughout the app

function createWindow() {
    _Session_ = null;
    if (loginWindow) {
        loginWindow.focus();
        return;
    }
    loginWindow = new BrowserWindow({
        skipTaskbar: false,
        fullscreenable: false,
        maximizable: false,
        width: (screenWidth ? Math.round(screenWidth / 3) : 640) || 640,
        height: (screenWidth ? Math.round(screenWidth / 5) : 384) || 384,
        resizable: false,
        frame: false,
        transparent: true,
        icon: icon
    });
    loginWindow.loadFile('./src/baseTemplates/loginForm.pug');
    loginWindow.setMenu(null);
    loginWindow.focus();
    loginWindow.on('closed', () => loginWindow = null);
}

function drawAlert(_msg_) {
    try {
        popUpWindow.close();
    } catch (e) { /*ignore*/ }
    popUpWindow = new BrowserWindow({
        skipTaskbar: true,
        fullscreenable: false,
        maximizable: false,
        width: (screenWidth ? Math.round(screenWidth / 5) : 384) || 384,
        height: (screenWidth ? Math.round(screenWidth / 8) : 240) || 240,
        resizable: false,
        frame: false,
        transparent: true,
        icon: icon
    });
    popUpWindow.setMenu(null);
    popUpWindow.loadURL('data:text/html;charset=UTF-8,' + encodeURIComponent(msgBox.generate({
        content: String(_msg_),
    })));
}

/// default app operations
app.on('ready', async () => {
    let pug = await setupPug({pretty: true}, {});
    pug.on('error', err => console.error('electron-pug error', err));
    screenWidth = electron.screen.getPrimaryDisplay().workAreaSize.width;
    createWindow();
});
app.on('window-all-closed', () => process.platform !== 'darwin' ? app.quit() : null);
app.on('activate', () => !loginWindow ? createWindow() : null);


/// mainWindow / reqisterWindow generate on ipcMain request

ipcMain.on('request-mainprocess-action', (event, data) => {
    _Session_ = data
    if (mainWindow) {
        mainWindow.focus();
        return;
    }

    loadingWindow = new BrowserWindow({
        skipTaskbar: true,
        fullscreenable: false,
        maximizable: false,
        width: (screenWidth ? Math.round(screenWidth / 5) : 384) || 384,
        height: (screenWidth ? Math.round(screenWidth / 5) : 384) || 384,
        resizable: false,
        frame: false,
        transparent: true,
        icon: icon
    });
    loadingWindow.loadFile('./src/baseTemplates/loading.pug');
    loadingWindow.setMenu(null);
    loadingWindow.focus();

    mainWindow = new BrowserWindow({
        skipTaskbar: false,
        fullscreen: true,
        resizable: false,
        frame: false,
        icon: icon,
        show: false,
        webPreferences: { plugins: true }
    });
    mainWindow.loadFile('./src/baseTemplates/mainWindow.pug');
    loginWindow.close();
    try {
        reqWindow.close();
    } catch (e) { /*ingore*/ }
    mainWindow.setMenu(null);
    mainWindow.on('closed', () => mainWindow = null);

    mainWindow.once('ready-to-show', () => setTimeout(() => {
        mainWindow.show();
        setTimeout(() => loadingWindow.close(), 500);
        mainWindow.focus();
    }, 5000));
});

ipcMain.on('request-registration-action', () => {
    if (reqWindow) {
        reqWindow.focus();
        return;
    }
    reqWindow = new BrowserWindow({
        skipTaskbar: false,
        fullscreenable: false,
        maximizable: false,
        width: (screenWidth ? Math.round(screenWidth / 3) : 640) || 640,
        height: (screenWidth ? Math.round(screenWidth / 5) : 384) || 384,
        resizable: false,
        frame: false,
        transparent: true,
        icon: icon
    });
    reqWindow.loadFile('./src/baseTemplates/registerForm.pug');
    reqWindow.setMenu(null);
    reqWindow.on('closed', () => reqWindow = null);
});

/// minimize 
ipcMain.on('request-login-minimize', () => loginWindow.minimize());
ipcMain.on('request-register-minimize', () => reqWindow.minimize());
ipcMain.on('request-mainwindow-minimize', () => mainWindow.minimize());

/// popup close 
ipcMain.on('request-close-action', () => popUpWindow.close());

/// other popup requests && ipcMain requests

ipcMain.on('request-mainwindow-logOut', () => {
    _Session_ = null;
    createWindow();
    mainWindow.close();
    drawAlert('Logged out!');
});

ipcMain.on('request-failed-to-generate-action', () => {
    _Session_ = null;
    drawAlert('Unknow error, app will close!');
    setTimeout(() => app.quit(), 2500);
});

ipcMain.on('request-createdAcc-action', () => {
    _Session_ = null;
    drawAlert('New Account was Created!');
    reqWindow.close();
});

ipcMain.on('request-account-not-found', () => drawAlert('Invalid username or password!'));
ipcMain.on('request-already-exsists-action', () => drawAlert('Username already exsists!'));
ipcMain.on('request-pasw-dont-match-action', () => drawAlert('Passwords do not match!'));
ipcMain.on('request-req-not-met-action', () => drawAlert('Data not filled in properly!'));