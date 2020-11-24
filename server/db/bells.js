const { handleLoadUserInformation, handleIncreaseSoulEnergyOfUser } = require('./userInfo');

function handleRingBell(io,socket,pool,data){
    let bellType = data.bellType;
    let username = data.username;
    let bellName = data.bellName;
    console.log(bellType);
    // first we save which bell was rung and when and by whom
    let saveBellRungQuery = 'INSERT INTO bells_rung(bell_type,rung_by,rung_on) SELECT $1,id,now() from users where name=$2;';
    pool.query(saveBellRungQuery,[bellType,username],(err,res)=>{
        if(err){
            console.log(err.stack);
        }else{
            // the bell was rung and now it can go back to all sockets
            io.emit('bellRungResponse',{
                notificationMessage:'The '+bellName+' has been rung!',
                bellType:bellType,
            })
            socket.emit('userBellRungResponse',{
                type:'success',
                message:'You successfully rung the '+bellName,
                username:username,
            })
            // we update the info on user
            let updateUserLastBellTimestamp = 'UPDATE users SET last_bell_timestamp=now() where name=$1;';
            pool.query(updateUserLastBellTimestamp,[username],(err,res)=>{
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

module.exports = { handleRingBell }