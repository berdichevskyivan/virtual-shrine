const app = require('express')();
const http = require('http').createServer(app);
const { Pool } = require('pg');
const io = require('socket.io')(http);
const { handleUserSignup, handleUserLogin } = require('./db/userAuthentication');
const { handleLoadUserInformation } = require('./db/userInfo');
const { handleSavePrayer, handleLoadPrayers } = require('./db/prayers');
const { handleSaveCandle, handleLoadCandles } = require('./db/candles');
const { handleRingBell } = require('./db/bells');

// if parameters not provided, it will use environment variables
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: '12345',
  port: 5433,
})

pool.query('SELECT NOW()', (err, res) => {
  if(err){
    console.log(err);
    return;
  }else{
    console.log(res.rows);
  }
})

app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect',()=>{
      console.log('user disconnected');
  })

  socket.on('loadUserInformation',data=>{
    handleLoadUserInformation(socket,pool,data);
  })

  socket.on('signUpRequest',data=>{
    handleUserSignup(socket,pool,data);
  })

  socket.on('loginRequest',data=>{
    handleUserLogin(socket,pool,data);
  })

  socket.on('engravePrayerRequest',data=>{
    handleSavePrayer(io,socket,pool,data);
  })

  socket.on('loadPrayersRequest',()=>{
    handleLoadPrayers(socket,pool);
  })

  socket.on('saveCandleRequest',data=>{
    handleSaveCandle(io,socket,pool,data);
  })

  socket.on('loadCandlesRequest',()=>{
    handleLoadCandles(socket,pool);
  })

  socket.on('ringBellRequest',data=>{
    handleRingBell(io,socket,pool,data);
  })

  socket.on('sendChatMessageRequest',data=>{
    io.emit('sendChatMessageResponse',{messageText:data.messageText,username:data.username})
  });
  
});

http.listen(5000, () => {
  console.log('listening on *:5000');
});