const { app, BrowserWindow } = require('electron')
import child_process from 'child_process'
import util from 'util'
import path from 'path'

const execFile = util.promisify(child_process.execFile)

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit()
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
  })

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'))

  // Open the DevTools.
  mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

async function test_child_process_spawn() {
  const child = child_process.spawn('git', ['--version'])

  //process.stdin.pipe(child.stdin)
  for await (const data of child.stdout) {
    console.log(`stdout from the child: ${data}`)
  }

  child.on('exit', (code) => {
    console.log(`Exit code is : ${code}`)
  })
}

// 只执行可执行文件，不产生 shell
async function test_child_process_execFile() {
  const execFile = child_process.execFile
  const child = execFile('node', ['--version'], (err, stdout, stderr) => {
    if (err) {
      throw err
    }

    console.log(stdout)
  })
}

async function test_child_process_exec() {
  const exec = child_process.exec
  exec('node --version | findstr 12', (err, stdout, stderr) => {
    if (err) {
      console.error(`exec error: ${err}`)
      return
    }

    console.log(`stdout: ${stdout}`)
    console.log(`stderr: ${stderr}`)
  })
}

async function test_child_process_fork() {
  const child = child_process.fork(path.join(__dirname, 'fork_test.js'), ['hello'], { stdio: ['pipe', 'pipe', 'pipe', 'ipc']})
  


  
  child.stdout.on('data', (d) => {
    //e.reply('data', '[stdout-main-fork] ' + d.toString());
  });
  child.stderr.on('data', (d) => {
    //e.reply('data', '[stderr-main-fork] ' + d.toString());
  });

  child.send('hello');


  child.on('message', function (m) {
    console.log('message from child: ' + m)
  })
 
}


async function test_eval() {
  const sourceToEval = `
  console.log('starting child process 1')
  process.on('message', m => console.log('child 1 got message', m))
  console.log('waiting for messages in child process 1...')
  `

  console.log('forking child process 1 (using --eval)')
  const child1  = child_process.fork('--eval', [sourceToEval])
  console.log('done forking child 1, sending message')
  child1.send('hello from your parent')

}


async function test_child_process_ready() {

  const sourceToEval = `
  process.on('uncaughtException', function (err) {
   
  });

  process.on('message', function (msg) {    
    console.log(msg);
  });

  process.send('ready');
  `



  const child = child_process.fork('--eval', [sourceToEval])
  child.on('message', (msg) => {
    console.log(msg)
  })
}





// https://github.com/mslipper/electron-child-process-playground
;(async () => {
  console.log('11111111111111')

  // child_process.spawn() 返回流
  // child_process.exec() 返回缓冲区
  test_child_process_spawn()
  test_child_process_execFile()
  test_child_process_exec()
  test_child_process_fork()
  test_eval()
  test_child_process_ready()
})()
