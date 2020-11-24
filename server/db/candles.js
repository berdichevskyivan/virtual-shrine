const { handleLoadUserInformation, handleIncreaseSoulEnergyOfUser } = require('./userInfo');

function handleSaveCandle(io,socket,pool,data){
    let username = data.username;
    let timestamp = data.timestamp;
    let saveCandleQuery = 'INSERT INTO candles(created_by,created_on) SELECT id,$2 from users where name=$1;';
    pool.query(saveCandleQuery,[username,timestamp],(err,res)=>{
        if(err){
            console.log(err.stack);
        }else{
            // candle was saved!
            socket.emit('saveCandleResponse',{
                type:'success',
                message:'Your candle was successfully lit up',
            })
            // we send all candles to all sockets
            let loadCandlesQuery = 'SELECT * FROM candles;'
            pool.query(loadCandlesQuery,(err,res)=>{
                if(err){
                    console.log(err.stack);
                }else{
                    io.emit('loadCandlesResponse',{candles:res.rows});
                }
            })
            // we update the info on user
            let updateUserLastCandleTimestamp = 'UPDATE users SET last_candle_timestamp=$2 where name=$1;';
            pool.query(updateUserLastCandleTimestamp,[username,timestamp],(err,res)=>{
                if(err){
                    console.log(err.stack);
                }else{
                    console.log(res.rows[0]);
                    console.log('im being run');
                    handleLoadUserInformation(socket,pool,{username:username});
                    handleIncreaseSoulEnergyOfUser(socket,pool,data);
                }
            })
        }
    })
}

function handleLoadCandles(socket,pool){
    let loadCandlesQuery = 'SELECT * FROM candles;'
    pool.query(loadCandlesQuery,(err,res)=>{
        if(err){
            console.log(err.stack);
        }else{
            socket.emit('loadCandlesResponse',{candles:res.rows});
        }
    })
}

module.exports = { handleLoadCandles, handleSaveCandle }