//pop up generator
const {app, BrowserWindow} = require('electron');
//
const loadView = ({title}) => {
  return (`
    <!DOCTYPE html>
    <html>
      <head>
      <style>
        body {
          background: linear-gradient(to bottom right, #4D92A8, #0F9557);
          -webkit-background-size: cover;
          -moz-background-size: cover;
          -o-background-size: cover;
          background-size: cover;
          background-repeat:no-repeat;      
          overflow-x: hidden;
          overflow-y: hidden; 
          border: 3px solid #3a3a3a;          
        }
        .card {
          margin-top: 0px;
          vertical-align: middle;
          height: 80px;
          width: 400px;
          display: inline-block;
          position: relative;
          display: flex;
          padding: 10px;
          color: #3a3a3a;
          font-size: 18px;
          font-family: Open Sans;
        }
        p{
          font-size: 20px;
        }
      </style>
        <title>PopUp</title>
        <meta charset="UTF-8">
        <script>
          const { ipcRenderer } = require('electron');
          let Timer = setInterval(exitPopUp, 2500);
          function exitPopUp(){
            ipcRenderer.send('request-close-action');
          }
        </script>
      </head>
      <body>
        <div class="card" id="view"><p>${title}</p></div>
      </body>
    </html>
  `)
}

const {ipcMain} = require('electron');

const query = require('./query');
const alerts = require('/.alerts');
query.createDB();

require('electron-debug')({ showDevTools: process.env.NODE_ENV === 'development' })

ipcMain.on('request-close-action', (event) => {
  popUp.close();
});

ipcMain.on('request-mainprocess-action', (event) => {
  mainProgram = new BrowserWindow({fullscreen: true, resizable: false, frame: false});
  loginWindow.close();
  try{
    //if window even exsists
    reqWindow.close();
  }catch(err){}
  mainProgram.loadFile('mainProgram.html');
  mainProgram.setMenu(null);
  mainProgram.on('closed', function () {
    mainProgram = null;
  })
});
//
//
ipcMain.on('request-registration-action', (event) => {
  reqWindow = new BrowserWindow({fullscreenable: false, maximizable: false, width: 480, height: 460, resizable: false, frame: false,transparent: true,});
  reqWindow.loadFile('registerForm.html')
  reqWindow.setMenu(null);
  reqWindow.on('closed', function () {
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
ipcMain.on('request-game-minimize', (event) => { 
  gameWindow.minimize();
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
  try{
    popUp.close();
  }catch(err){
    //do nothing
  }
  popUp = new BrowserWindow({fullscreenable: false, maximizable: false, width: 450, height: 170, resizable: false, frame: false,transparent: true,});
  popUp.setMenu(null);
  let file = 'data:text/html;charset=UTF-8,' + encodeURIComponent(loadView({
    title: "Logged out!",
  }));
  popUp.loadURL(file);
  loginWindow.on('closed', function () {
    loginWindow = null
  });
  mainProgram.close();
});
//
//
// everything below is generated on load! || default functions
//
let loginWindow;

function createWindow () {

  loginWindow = new BrowserWindow({fullscreenable: false, maximizable: false, width: 480, height: 460, resizable: false, frame: false,transparent: true,});
  loginWindow.loadFile('loginForm.html');
  loginWindow.setMenu(null);
  loginWindow.on('closed', function () {
    loginWindow = null;
  })
}


app.on('ready', createWindow);
app.on('window-all-closed', function () {
  if (process.platform !== "" ) {
    app.quit();
  }
})

app.on('activate', function () {
  if (mainProgram === null) {
    createWindow();
  }
})