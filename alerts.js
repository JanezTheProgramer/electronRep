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