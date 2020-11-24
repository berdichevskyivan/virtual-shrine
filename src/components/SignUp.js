import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, TextField, Snackbar, SvgIcon } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';

import { ReactComponent as SignUpIcon } from '../icons/itsukushima-shrine.svg';

import mp4VideoSource from '../videos/forest.mp4';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
    root:{
        height:'100%',
        width:'100%',
    },
    signUpContainer:{
      height:'100%',
      display:'flex',
      justifyContent:'center',
      alignItems:'center',
      flexFlow:'column',
      paddingLeft:'260px',
    },
    imageIcon: {
      display: 'flex',
      height: 'inherit',
      width: 'inherit'
    },
    iconRoot: {
      textAlign: 'center'
    },
    signUpIcon:{
      marginBottom:'1.5rem',
      height:'10rem',
      width:'10rem',
    },
    usernameTextField:{
      marginBottom:'1rem',
    },
    passwordTextField:{
      marginBottom:'1rem',
    },
    signUpSnackbar:{
      paddingLeft:'260px',
    },
    videoBackground:{
      position: 'fixed',
      objectFit: 'cover',
      top: 0,
      left: 0,
      height: '100%',
      width: '100%',
      zIndex:-1,
    },
    signupInput:{
      background:'white',
    }
  }));

function SignUp({ socket }){

    React.useEffect(()=>{
      socket.on('signUpResponse',data=>{
        console.log(data);
        setSnackbarOpen(true);
        setSnackbarSeverity(data.type);
        setSnackbarMessage(data.message);
        setDisableSignUp(false);
      })
      let videoBackground = document.getElementById('video_background');
      setTimeout(()=>{
        videoBackground.play();
      },200)
    },[socket])

    const classes = useStyles();

    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState('');
    const [snackbarSeverity, setSnackbarSeverity] = React.useState('success');
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [disableSignUp, setDisableSignUp] = React.useState(false);

    const handleClose = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
      setSnackbarOpen(false);
    };

    const handleChangeUsername = (e)=>{
      setUsername(e.target.value);
    }

    const handleChangePassword = (e)=>{
      setPassword(e.target.value);
    }

    const validateCredentials = ()=>{
      if(username==='' || password===''){
        setSnackbarOpen(true);
        setSnackbarMessage('You must complete both fields');
        setSnackbarSeverity('warning');
        return false;
      }
      return true;
    }

    const handleSignUp = () => {
      if(!validateCredentials()) return;
      setDisableSignUp(true);
      socket.emit('signUpRequest',{username:username,password:password});
    }

    return (
      <>
        <div className={classes.root}>
            <div className={classes.signUpContainer}>
              <div style={{display:'flex',justifyContent:'center',alignItems:'center',flexFlow:'column', padding:'2rem',borderRadius:'5px'}}>
                <SvgIcon className={classes.signUpIcon}><SignUpIcon /></SvgIcon>
                <TextField 
                  id="username-textfield"
                  label="Username"
                  variant="outlined"
                  className={classes.usernameTextField}
                  value={username}
                  onChange={handleChangeUsername}
                  InputProps={{className:classes.signupInput}}
                  InputLabelProps={{
                    style: {color:'black',background:'white',borderRadius:'5px',padding:'2px'},
                  }}
                />
                <TextField 
                  id="username-textfield"
                  label="Password"
                  type="password"
                  variant="outlined"
                  className={classes.passwordTextField}
                  value={password}
                  onChange={handleChangePassword}
                  InputProps={{className:classes.signupInput}}
                  InputLabelProps={{
                    style: {color:'black',background:'white',borderRadius:'5px',padding:'2px'},
                  }}
                />
                <Button variant="contained" color="primary" onClick={handleSignUp} disabled={disableSignUp}>Sign Up</Button>
              </div>
            </div>
            <Snackbar className={classes.signUpSnackbar} open={snackbarOpen} autoHideDuration={3000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={snackbarSeverity}>
                    { snackbarMessage }
                </Alert>
            </Snackbar>
            <video allowfullscreen autoplay loop muted className={classes.videoBackground} id="video_background">
              <source src={mp4VideoSource} type="video/mp4" />
            </video>
        </div>
      </>
    )
}

export default SignUp;