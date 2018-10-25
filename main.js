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

  try{
    const sqlite3 = require('sqlite3');
    let db = new sqlite3.Database('database.db');
    db.serialize(function() {
      db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, pass TEXT, date_c TEXT)");
      db.run("CREATE TABLE IF NOT EXISTS log_history (id INTEGER PRIMARY KEY AUTOINCREMENT, id_user INTEGER, date_l TEXT)");
    });
    db.close();
  }catch(e){
    console.log(e.toString());
  }
const {ipcMain} = require('electron');
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
//game request 
ipcMain.on('load-game-request', (event) => {
  gameWindow = new BrowserWindow({fullscreen: true, resizable: false, frame: false,transparent: false});
  gameWindow.loadFile('shoterOne/shoterOne.html')
  gameWindow.setMenu(null);
  mainProgram.minimize();
  gameWindow.on('closed', function () {
    gameWindow = null
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

ipcMain.on('request-createdAcc-action', (event) => {
  try{
    loginWindow.close();
  }catch(e){
    //do nothing
  }
  loginWindow = new BrowserWindow({fullscreenable: false, maximizable: false, width: 480, height: 460, resizable: false, frame: false,transparent: true,});
  loginWindow.loadFile('loginForm.html');
  loginWindow.setMenu(null);
  reqWindow.close();
  popUp = new BrowserWindow({fullscreenable: false, maximizable: false, width: 450, height: 170, resizable: false, frame: false,transparent: true,});
  popUp.setMenu(null);
  let file = 'data:text/html;charset=UTF-8,' + encodeURIComponent(loadView({
    title: "New Account was Created!",
  }));
  popUp.loadURL(file);
});
//
//alerts
//
ipcMain.on('request-failed-to-generate-action', (event) => {
  try{
    popUp.close();
  }catch(e){
    // do nothing
  }
  popUp = new BrowserWindow({fullscreenable: false, maximizable: false, width: 450, height: 170, resizable: false, frame: false,transparent: true,});
  popUp.setMenu(null);
  let file = 'data:text/html;charset=UTF-8,' + encodeURIComponent(loadView({
    title: "Unknow error! <br> Try restoring the program!",
  }));
  popUp.loadURL(file);
  //must be after popup try close!!!!!
  try{
    mainProgram.close();

  }catch(e){
    //do nothing
  }
});
//
ipcMain.on('request-account-not-found', (event) => {
  try{
    popUp.close();
  }catch(e){
    // do nothing
  }
  popUp = new BrowserWindow({fullscreenable: false, maximizable: false, width: 450, height: 170, resizable: false, frame: false,transparent: true,});
  popUp.setMenu(null);
  let file = 'data:text/html;charset=UTF-8,' + encodeURIComponent(loadView({
    title: "Invalid username or password!",
  }));
  popUp.loadURL(file);
});
//
ipcMain.on('request-already-exsists-action', (event) => {
  try{
    popUp.close();
  }catch(e){
    // do nothing
  }
  popUp = new BrowserWindow({fullscreenable: false, maximizable: false, width: 450, height: 170, resizable: false, frame: false,transparent: true,});
  popUp.setMenu(null);
  let file = 'data:text/html;charset=UTF-8,' + encodeURIComponent(loadView({
    title: "Username already in use!",
  }));
  popUp.loadURL(file);
});
//
ipcMain.on('request-pasw-dont-match-action', (event) => {
  try{
    popUp.close();
  }catch(e){
    // do nothing
  }
  popUp = new BrowserWindow({fullscreenable: false, maximizable: false, width: 450, height: 170, resizable: false, frame: false,transparent: true,});
  popUp.setMenu(null);
  let file = 'data:text/html;charset=UTF-8,' + encodeURIComponent(loadView({
    title: "Passwords do not match!",
  }));
  popUp.loadURL(file);
});
//
ipcMain.on('request-req-not-met-action', (event) => {
  try{
    popUp.close();
  }catch(e){
    // do nothing
  }
  popUp = new BrowserWindow({fullscreenable: false, maximizable: false, width: 450, height: 170, resizable: false, frame: false,transparent: true,});
  popUp.setMenu(null);
  let file = 'data:text/html;charset=UTF-8,' + encodeURIComponent(loadView({
    title: "Data not filled in properly!",
  }));
  popUp.loadURL(file);
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
ipcMain.on('request-mainwindow-missingData', (event) => { 
  loginWindow = new BrowserWindow({fullscreenable: false, maximizable: false, width: 480, height: 460, resizable: false, frame: false,transparent: true,});
  loginWindow.loadFile('loginForm.html');
  loginWindow.setMenu(null);
  try{
    popUp.close();
  }catch(err){
    //do nothing
  }
  mainProgram.close();
  popUp = new BrowserWindow({fullscreenable: false, maximizable: false, width: 450, height: 170, resizable: false, frame: false,transparent: true,});
  popUp.setMenu(null);
  let file = 'data:text/html;charset=UTF-8,' + encodeURIComponent(loadView({
    title: "Missing data! Crash occurred!",
  }));
  popUp.loadURL(file);
  loginWindow.on('closed', function () {
    loginWindow = null
  });
});
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
});
