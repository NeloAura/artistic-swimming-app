const {app, BrowserWindow} = require('electron')
const path = require('path')
const isDev = require('electron-is-dev');




function createWindow() {
    
  if (!isDev) {
    require(path.join(__dirname, 'build-server/server'));
}




  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })
   
  
  
  mainWindow.loadURL(isDev ? 'http://localhost:3000' : url.format({
    pathname: path.join(__dirname, 'build/index.html'),
    protocol: 'file:',
    slashes: true
}));



    // express server is started here when production build
   
}// in production mode use the built React app in build/index.html





  // and load the index.html of the app.
 

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  
  createWindow()
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
