import io from 'socket.io-client';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import 'fontsource-roboto';
import Drawer from '@material-ui/core/Drawer';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { Accordion, AccordionSummary, AccordionDetails, TextField, Button, Snackbar } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MuiAlert from '@material-ui/lab/Alert';

import { ReactComponent as PrayerIcon } from './icons/prayer.svg';
import { ReactComponent as CandleIcon } from './icons/candle.svg';
import { ReactComponent as SignUpIcon } from './icons/itsukushima-shrine.svg';
import { ReactComponent as LoginIcon } from './icons/login.svg';
import { ReactComponent as SupportChatIcon } from './icons/helping-hand.svg';
import { ReactComponent as BellsIcon } from './icons/joya-no-kane.svg';
import { ReactComponent as ArtifactsIcon } from './icons/character.svg';
import { ReactComponent as LibraryIcon } from './icons/book.svg';
import { ReactComponent as SpiritIcon } from './icons/spirit.svg';
import { ReactComponent as MailboxIcon } from './icons/love-letter.svg';
import { ReactComponent as NotificationsIcon } from './icons/radio-antenna.svg';
import SvgIcon from "@material-ui/core/SvgIcon";

import SupportChat from './components/SupportChat';
import Prayers from './components/Prayers';
import Candles from './components/Candles';
import Bells from './components/Bells';
import SignUp from './components/SignUp';

import Artifacts from './components/Artifacts';
import Library from './components/Library';
import Mailbox from './components/Mailbox';

import Sound from 'react-sound';

import bellOfProsperitySound from './sounds/bell_of_prosperity.mp3'
import bellOfMourningSound from './sounds/bell_of_mourning.mp3'
import bellOfPeaceSound from './sounds/bell_of_peace.mp3'
import bellOfGratitudeSound from './sounds/bell_of_gratitude.mp3'


import './App.css';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const drawerWidth = 260;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    [theme.breakpoints.down('md')]:{
      width:'50vw'
    },
  },
  drawerPaper: {
    width: drawerWidth,
    [theme.breakpoints.down('md')]:{
      width:'50vw'
    },
  },
  drawerContainer: {
    overflow: 'auto',
  },
  content: {
    flexGrow: 1,
    height:'100%',
  },
  imageIcon: {
    display: 'flex',
    height: 'inherit',
    width: 'inherit'
  },
  iconRoot: {
    textAlign: 'center'
  },
  notificationBox:{
    bottom:0,
    overflow:'scroll',
    paddingBottom:0,
    width:'100%',
  },
  notificationText:{
    fontSize:'0.8rem',
  },
  notificationBoxTitle:{
    fontWeight:'bold',
    fontSize:'1rem',
    background:'#d3d3d340',
    padding:'0.8rem',
  },
  notificationMessagesBox:{
    overflowY:'hidden',
  },
  accordionDetails:{
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
    flexFlow:'column',
    padding:'0 !important',
  },
  usernameTextField:{
    marginBottom:'1rem',
  },
  passwordTextField:{
    marginBottom:'1rem',
  },
  loginIcon:{
    marginRight:'1rem',
  },
  accordion:{
    boxShadow:'none',
    overflow:'hidden',
    marginTop:'0 !important',
    zIndex:'20',
  },
  notificationsAccordion:{
    boxShadow:'none',
    overflow:'hidden',
    marginTop:'1rem !important',
    zIndex:'10',
  },
  loggedInUserBox:{
    marginTop:'1rem',
  },
  logoutButton:{
    marginTop:'1rem',
  },
  loginSnackbar:{
    paddingLeft:drawerWidth,
  },
  unreadNotifications:{
    marginLeft:'1rem',
    background:'#00dc62',
    height:'100%',
    width:'1.5rem',
    fontSize:'1rem',
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
    borderRadius:'100%',
    color:'white',
  }
}));

const localStorageUsername = localStorage.getItem('username');
const socket = io('http://localhost:5000');

function App() {

  const classes = useStyles();
  
  const [isUserLoggedIn, setIsUserLoggedIn] = React.useState(false);
  const [userInfo, setUserInfo] = React.useState({});

  const [isNotificationAccordionExpanded, setIsNotificationAccordionExpanded] = React.useState(false);
  const [amountOfUnreadNotifications, setAmountOfUnreadNotifications] = React.useState(0);

  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');
  const [snackbarSeverity, setSnackbarSeverity] = React.useState('success');
  const [usernameForLogin, setUsernameForLogin] = React.useState('');
  const [passwordForLogin, setPasswordForLogin] = React.useState('');
  const [disableLogin, setDisableLogin] = React.useState(false);

  const [selectedPage, setSelectedPage] = React.useState('prayers');
  const [notifications, setNotifications] = React.useState([]);

  const [bellOfProsperityPlayStatus, setBellOfProsperityPlayStatus] = React.useState(Sound.status.STOPPED);
  const [bellOfGratitudePlayStatus, setBellOfGratitudePlayStatus] = React.useState(Sound.status.STOPPED);
  const [bellOfPeacePlayStatus, setBellOfPeacePlayStatus] = React.useState(Sound.status.STOPPED);
  const [bellOfMourningPlayStatus, setBellOfMourningPlayStatus] = React.useState(Sound.status.STOPPED);

  let currentPage;

  if(selectedPage==='prayers'){
    currentPage = <Prayers socket={socket} userInfo={userInfo} isUserLoggedIn={isUserLoggedIn} />
  }else if(selectedPage==='candles'){
    currentPage = <Candles socket={socket} userInfo={userInfo} isUserLoggedIn={isUserLoggedIn} />
  }else if(selectedPage==='bells'){
    currentPage = <Bells socket={socket} userInfo={userInfo} isUserLoggedIn={isUserLoggedIn} />
  }else if(selectedPage==='signup'){
    currentPage = <SignUp socket={socket}/>
  }else if(selectedPage==='supportChat'){
    currentPage = <SupportChat socket={socket} userInfo={userInfo} isUserLoggedIn={isUserLoggedIn} />
  }else if(selectedPage==='library'){
    currentPage = <Library socket={socket} userInfo={userInfo} isUserLoggedIn={isUserLoggedIn} />
  }else if(selectedPage==='artifacts'){
    currentPage = <Artifacts socket={socket} userInfo={userInfo} isUserLoggedIn={isUserLoggedIn} />
  }else if(selectedPage==='mailbox'){
    currentPage = <Mailbox socket={socket} userInfo={userInfo} isUserLoggedIn={isUserLoggedIn} />
  }else{
    currentPage = <Prayers socket={socket} userInfo={userInfo} isUserLoggedIn={isUserLoggedIn} />
  }

  const handleRingBell = (bellType)=>{
    if(bellType==='bell_of_prosperity'){
      setBellOfGratitudePlayStatus(Sound.status.STOPPED);
      setBellOfMourningPlayStatus(Sound.status.STOPPED);
      setBellOfPeacePlayStatus(Sound.status.STOPPED);
      setBellOfProsperityPlayStatus(Sound.status.PLAYING);
    }else if(bellType==='bell_of_mourning'){
      setBellOfGratitudePlayStatus(Sound.status.STOPPED);
      setBellOfProsperityPlayStatus(Sound.status.STOPPED);
      setBellOfPeacePlayStatus(Sound.status.STOPPED);
      setBellOfMourningPlayStatus(Sound.status.PLAYING);
    }else if(bellType==='bell_of_gratitude'){
      setBellOfProsperityPlayStatus(Sound.status.STOPPED);
      setBellOfMourningPlayStatus(Sound.status.STOPPED);
      setBellOfPeacePlayStatus(Sound.status.STOPPED);
      setBellOfGratitudePlayStatus(Sound.status.PLAYING);
    }else if(bellType==='bell_of_peace'){
      setBellOfGratitudePlayStatus(Sound.status.STOPPED);
      setBellOfMourningPlayStatus(Sound.status.STOPPED);
      setBellOfProsperityPlayStatus(Sound.status.STOPPED);
      setBellOfPeacePlayStatus(Sound.status.PLAYING);
    }
  }

  React.useEffect(()=>{
    socket.on('loginResponse',data=>{
      if(data.type==='success'){
        setUsernameForLogin('');
        setPasswordForLogin('');
        console.log('im also performing this')
        socket.emit('loadUserInformation',{username:data.username});
        localStorage.setItem('username',data.username);
        handleChangePage('prayers');
      }else{
        setSnackbarOpen(true);
        setSnackbarSeverity(data.type);
        setSnackbarMessage(data.message);
        setDisableLogin(false);
      }
    });
    socket.on('loadUserInformationResponse',data=>{
      console.log(data);
      console.log('loadUserInformationResponse CHECK ME OUT!');
      if(data){
        setUserInfo(data);
        setIsUserLoggedIn(true);
      }else{
        localStorage.removeItem('username');
      }
    })
    if(localStorageUsername){
      if(userInfo.name && localStorageUsername !== userInfo.name){
        localStorage.removeItem('username');
        setIsUserLoggedIn(false);
      }else{
        socket.emit('loadUserInformation',{username:localStorageUsername});
      }
    }

    socket.on('bellRungResponse',data=>{
      console.log(data);
      let bellType = data.bellType;
      handleRingBell(bellType);
      setNotifications(elements=>[...elements,{
        notificationId:elements.length-1,
        notificationText:data.notificationMessage
      }]);
      if(!isNotificationAccordionExpanded){
        setAmountOfUnreadNotifications(element=>element+1);
      }
    })

    socket.on('notificationResponse',data=>{
      console.log(data);
      setNotifications(elements=>[...elements,{
        notificationId:elements.length-1,
        notificationText:data.notificationMessage
      }]);
      if(!isNotificationAccordionExpanded){
        setAmountOfUnreadNotifications(element=>element+1);
      }
    })

  },[socket]);

  const handleChangePage = (menuOption)=>{
    setBellOfProsperityPlayStatus(Sound.status.STOPPED);
    setBellOfMourningPlayStatus(Sound.status.STOPPED);
    setBellOfPeacePlayStatus(Sound.status.STOPPED);
    setBellOfGratitudePlayStatus(Sound.status.STOPPED);
    setSelectedPage(menuOption.pageLabel);
  }

  let menuOptions = [
    {
      menuLabel:'Support Chat',
      pageLabel:'supportChat',
      menuIcon:<SvgIcon><SupportChatIcon /></SvgIcon>
    },
    {
      menuLabel:'Prayers',
      pageLabel:'prayers',
      menuIcon:<SvgIcon><PrayerIcon /></SvgIcon>
    },
    {
      menuLabel:'Candles',
      pageLabel:'candles',
      menuIcon:<SvgIcon><CandleIcon /></SvgIcon>
    },
    {
      menuLabel:'Bells',
      pageLabel:'bells',
      menuIcon:<SvgIcon><BellsIcon /></SvgIcon>
    },
    {
      menuLabel:'Library',
      pageLabel:'library',
      menuIcon:<SvgIcon><LibraryIcon /></SvgIcon>
    },
    {
      menuLabel:'Mailbox',
      pageLabel:'mailbox',
      menuIcon:<SvgIcon><MailboxIcon /></SvgIcon>
    },
    {
      menuLabel:'Artifacts',
      pageLabel:'artifacts',
      menuIcon:<SvgIcon><ArtifactsIcon /></SvgIcon>
    },
    {
      menuLabel:'Sign Up',
      pageLabel:'signup',
      menuIcon:<SvgIcon><SignUpIcon /></SvgIcon>
    },
  ]

  const handleChangeUsernameForLogin = (e)=>{
    setUsernameForLogin(e.target.value);
  }

  const handleChangePasswordForLogin = (e)=>{
    setPasswordForLogin(e.target.value);
  }

  const handleLogin = ()=>{
    socket.emit('loginRequest',{username:usernameForLogin,password:passwordForLogin});
  }

  const handleLogout = ()=>{
    setBellOfProsperityPlayStatus(Sound.status.STOPPED);
    setBellOfMourningPlayStatus(Sound.status.STOPPED);
    setBellOfPeacePlayStatus(Sound.status.STOPPED);
    setBellOfGratitudePlayStatus(Sound.status.STOPPED);
    setUserInfo({});
    setIsUserLoggedIn(false);
    setNotifications([]);
    setAmountOfUnreadNotifications(0);
    setIsNotificationAccordionExpanded(false);
    setSelectedPage('prayers');
    localStorage.removeItem('username');
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleBellFinishedPlaying = (bellType)=>{
    if(bellType==='bell_of_prosperity'){
      setBellOfProsperityPlayStatus(Sound.status.STOPPED);
    }else if(bellType==='bell_of_mourning'){
      setBellOfMourningPlayStatus(Sound.status.STOPPED);
    }else if(bellType==='bell_of_gratitude'){
      setBellOfGratitudePlayStatus(Sound.status.STOPPED);
    }else if(bellType==='bell_of_peace'){
      setBellOfPeacePlayStatus(Sound.status.STOPPED);
    }
  }

  const handleToggleNotificationAccordion = ()=>{
    if(amountOfUnreadNotifications>0){
      setAmountOfUnreadNotifications(0);
    }
    setIsNotificationAccordionExpanded(element=>!element);
  }

  return (
    <div className="App">
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerContainer}>
          <List>
            {menuOptions.map((menuOption) => {
              if(menuOption.pageLabel==='signup' && isUserLoggedIn){
                return false;
              }else if((menuOption.pageLabel==='library' || menuOption.pageLabel==='artifacts' || menuOption.pageLabel==='mailbox') && !isUserLoggedIn){
                return false;
              }else{
                return (
                  <ListItem button key={menuOption.menuLabel} onClick={()=>{handleChangePage(menuOption)}}>
                    <ListItemIcon>{menuOption.menuIcon}</ListItemIcon>
                    <ListItemText primary={menuOption.menuLabel} />
                  </ListItem>
                );
              }
          })}
          </List>
          { !isUserLoggedIn && (
            <Accordion className={classes.accordion}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <SvgIcon className={classes.loginIcon}><LoginIcon /></SvgIcon>
                <Typography className={classes.heading}>Login</Typography>
              </AccordionSummary>
              <AccordionDetails className={classes.accordionDetails}>
                <TextField 
                  id="username-textfield"
                  label="Username"
                  variant="outlined"
                  className={classes.usernameTextField}
                  value={usernameForLogin}
                  onChange={handleChangeUsernameForLogin}
                />
                <TextField 
                  id="username-textfield"
                  label="Password"
                  type="password"
                  variant="outlined"
                  className={classes.passwordTextField}
                  value={passwordForLogin}
                  onChange={handleChangePasswordForLogin}
                />
                <Button variant="contained" color="primary" onClick={handleLogin} disabled={disableLogin}>Login</Button>
              </AccordionDetails>
            </Accordion>
          ) }
          { isUserLoggedIn && (
            <>
              <div className={classes.loggedInUserBox}>
                <Typography>Welcome, {userInfo.name}!</Typography>
                <div style={{display:'flex',justifyContent:'center',alignItems:'center',flexFlow:'row', marginTop:'0.5rem'}}>
                  <Typography style={{marginRight:'0.2rem'}}>{userInfo.soul_energy}</Typography>
                  <SvgIcon><SpiritIcon /></SvgIcon>
                </div>
                <Button variant="contained" color="primary" onClick={handleLogout} className={classes.logoutButton} >Logout</Button>
              </div>
              <Accordion className={classes.notificationsAccordion} expanded={isNotificationAccordionExpanded} onChange={handleToggleNotificationAccordion}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <SvgIcon className={classes.loginIcon}><NotificationsIcon /></SvgIcon>
                  <Typography className={classes.heading}>Notifications</Typography>
                  <Typography className={classes.unreadNotifications}>{amountOfUnreadNotifications}</Typography>
                </AccordionSummary>
                <AccordionDetails className={classes.accordionDetails}>
                  <List className={classes.notificationBox}>
                    <div className={classes.notificationMessagesBox}>
                      {notifications.map((notification) => (
                        <ListItem button key={notification.notificationId} onClick={()=>{console.log('Notification was clicked')}}>
                          {/* <ListItemIcon>{menuOption.menuIcon}</ListItemIcon> */}
                          <ListItemText primary={notification.notificationText} primaryTypographyProps={{className:classes.notificationText}} />
                        </ListItem>
                      ))}
                    </div>
                  </List>
                </AccordionDetails>
              </Accordion>
            </>
          ) }
        </div>
      </Drawer>
      <main className={classes.content}>
        { currentPage }
      </main>
      <Snackbar className={classes.loginSnackbar} open={snackbarOpen} autoHideDuration={3000} onClose={handleClose}>
          <Alert onClose={handleClose} severity={snackbarSeverity}>
              { snackbarMessage }
          </Alert>
      </Snackbar>
      <Sound url={bellOfGratitudeSound} playStatus={bellOfGratitudePlayStatus} onFinishedPlaying={()=>{handleBellFinishedPlaying('bell_of_gratitude')}}/>
      <Sound url={bellOfPeaceSound} playStatus={bellOfPeacePlayStatus} onFinishedPlaying={()=>{handleBellFinishedPlaying('bell_of_peace')}}/>
      <Sound url={bellOfMourningSound} playStatus={bellOfMourningPlayStatus} onFinishedPlaying={()=>{handleBellFinishedPlaying('bell_of_mourning')}}/>
      <Sound url={bellOfProsperitySound} playStatus={bellOfProsperityPlayStatus} onFinishedPlaying={()=>{handleBellFinishedPlaying('bell_of_prosperity')}}/>
    </div>
  );
}

export default App;
