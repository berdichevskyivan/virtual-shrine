function handleLoadUserInformation(socket,pool,data){
    const username = data.username;
    const loadUserInfoQuery = 'SELECT name,soul_energy,last_prayer_timestamp,last_candle_timestamp,last_bell_timestamp FROM users WHERE name=$1';
    pool.query(loadUserInfoQuery,[username],(err,res)=>{
        if(err){
            console.log(err.stack);
        }else{
            console.log(res.rows[0]);
            let data = res.rows[0];
            socket.emit('loadUserInformationResponse',data);
        }
    });
}

function handleIncreaseSoulEnergyOfUser(socket,pool,data){
    const username = data.username;
    const amount = data.amountOfSoulEnergy;
    const updateUserSoulEnergyQuery = 'UPDATE users SET soul_energy=soul_energy+$1 WHERE name=$2';
    pool.query(updateUserSoulEnergyQuery,[amount,username],(err,res)=>{
        if(err){
            console.log(err.stack);
        }else{
            handleLoadUserInformation(socket,pool,data);
            socket.emit('notificationResponse',{
                notificationMessage:'Your soul energy has increased by '+amount+'.',
            })
        }
    })
}

module.exports = { handleLoadUserInformation, handleIncreaseSoulEnergyOfUser }