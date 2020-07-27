console.log('ExecPath', process.execPath);

process.on('message', (m) => {
  console.log('Got message:', m);
 
  process.send(`reply message: 999`);
});