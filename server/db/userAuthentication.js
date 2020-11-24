// This file includes user Login and user Signup
function handleUserSignup(socket,pool,data){
    let username = data.username;
    let password = data.password;
    // First we check if username already exists
    let checkUsernameQuery = 'SELECT 1 FROM users WHERE name=$1;';
    pool.query(checkUsernameQuery,[username],(err,res)=>{
        if(err){
            // if error we just send "There was an internal error"
            console.log(err.stack);
        }else{
            //user exists
            if(res.rowCount>0){
                // in this case we send back this info to Frontend as error
                console.log('user exists');
                socket.emit('signUpResponse',{
                    type:'error',
                    message:'User already exists. Choose another username.',
                })
            }else{
                console.log('user does not exist');
                // now we can proceed to create the user
                let insertUserQuery = 'INSERT INTO users(name,password) VALUES($1, $2);'
                pool.query(insertUserQuery,[username,password],(err,res)=>{
                    if(err){
                        console.log(err.stack);
                    }else{
                        // user successfully created
                        socket.emit('signUpResponse',{
                            type:'success',
                            message:'User was created',
                        })
                    }
                });
            }
        }
    })
}

function handleUserLogin(socket,pool,data){
    let username = data.username;
    let password = data.password;
    // first we check if user exists. If it does exist, we check password. If both are correct, user is authenticated
    let checkUsernameQuery = 'SELECT 1 FROM users WHERE name=$1;';
    pool.query(checkUsernameQuery,[username],(err,res)=>{
        if(err){
            // if error we just send "There was an internal error"
            console.log(err.stack);
        }else{
            //user exists
            if(res.rowCount>0){
                // This is intended. Now we proceed to check the password
                console.log('user exists');
                let checkPasswordQuery = 'SELECT 1 FROM users WHERE name=$1 AND password=$2;';
                pool.query(checkPasswordQuery,[username,password],(err,res)=>{
                    if(err){
                        console.log(err.stack);
                    }else{
                        // user and password exists. user authenticated!
                        if(res.rowCount>0){
                            socket.emit('loginResponse',{
                                type:'success',
                                message:'User was correctly authenticated',
                                username:username,
                            })
                        }else{
                            // this means password was incorrect
                            socket.emit('loginResponse',{
                                type:'error',
                                message:'Password is incorrect',
                            })
                        }
                    }
                })
            }else{
                // user doesnt exist, prompt the user the sign up
                console.log('user does not exist');
                socket.emit('loginResponse',{
                    type:'error',
                    message:'User does not exist',
                })
            }
        }
    })
}

module.exports = { handleUserSignup, handleUserLogin }