const { handleLoadUserInformation, handleIncreaseSoulEnergyOfUser } = require('./userInfo');

function handleSavePrayer(io,socket,pool,data){
    let prayerText = data.prayerText;
    let username = data.username;
    let savePrayerQuery = 'INSERT INTO prayers(text,created_by,created_on) SELECT $1,id,now() from users where name=$2;';
    pool.query(savePrayerQuery,[prayerText,username],(err,res)=>{
        if(err){
            console.log(err.stack);
        }else{
            // prayer was saved!
            socket.emit('savePrayerResponse',{
                type:'success',
                message:'Your prayer was successfully engraved',
            })
            // send all prayers plus the new one to all users
            let loadPrayersQuery = 'SELECT * FROM prayers;'
            pool.query(loadPrayersQuery,(err,res)=>{
                if(err){
                    console.log(err.stack);
                }else{
                    io.emit('loadPrayersResponse',{prayers:res.rows});
                }
            })
            // we update the info on user
            let updateUserLastPrayerTimestamp = 'UPDATE users SET last_prayer_timestamp=now() where name=$1;';
            pool.query(updateUserLastPrayerTimestamp,[username],(err,res)=>{
                if(err){
                    console.log(err.stack);
                }else{
                    console.log(res.rows[0]);
                    handleLoadUserInformation(socket,pool,{username:username});
                    handleIncreaseSoulEnergyOfUser(socket,pool,data);
                }
            })
        }
    })
}

function handleLoadPrayers(socket,pool){
    let loadPrayersQuery = 'SELECT * FROM prayers;'
    pool.query(loadPrayersQuery,(err,res)=>{
        if(err){
            console.log(err.stack);
        }else{
            socket.emit('loadPrayersResponse',{prayers:res.rows});
        }
    })
}

module.exports = { handleSavePrayer, handleLoadPrayers }