import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import { Typography, Snackbar, Grid, Paper } from '@material-ui/core';
import { ReactComponent as BellsIcon } from '../icons/joya-no-kane.svg';
import SvgIcon from "@material-ui/core/SvgIcon";
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const drawerWidth = 250;
const useStyles = makeStyles((theme) => ({
    root:{
        height:'100%',
        width:'100%',
    },
    imageIcon: {
      display: 'flex',
      height: 'inherit',
      width: 'inherit'
    },
    iconRoot: {
      textAlign: 'center'
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
        [theme.breakpoints.down('sm')]:{
            width: drawerWidth/2,
        },
        right:0,
        left:'auto',
    },
    drawerContainer: {
        overflow: 'auto',
        paddingRight:'1rem',
    },
    info: {
        padding:'1rem',
    },
    bellsIcon:{
        marginTop:'1rem',
        height:'4rem',
        width:'4rem',
    },
    bellsContainer:{
        paddingLeft:'290px',
        paddingRight:'290px',
        paddingTop:'1.2rem',
        [theme.breakpoints.down('sm')]:{
            paddingLeft:'135px',
            paddingRight:'135px',
        },
    },
    bellImage:{
        marginBottom:'1rem',
        height:'100%',
        width:'100%',
        cursor:'pointer',
    },
    bellName:{
        fontWeight:'bold',
        fontSize:'1.5vmax',
        marginBottom:'1rem',
    },
    bellDescription:{
        fontSize:'1vmax',
    },
  }));

function Bells({ socket, userInfo, isUserLoggedIn }){

    React.useEffect(()=>{
        socket.on('userBellRungResponse',data=>{
            setSnackbarMessage(data.message);
            setSnackbarSeverity(data.type);
            setSnackbarOpen(true);
            socket.emit('loadUserInformation',{username:data.username});
        })
    },[socket])

    const classes = useStyles();

    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState('');
    const [snackbarSeverity, setSnackbarSeverity] = React.useState('success');
    const [bells,setBells] = React.useState([
        {
            bellName:'Bell of Prosperity',
            bellType:'bell_of_prosperity',
            bellImageUrl:'https://www.flaticon.com/svg/static/icons/svg/3627/3627120.svg',
            bellDescription:'This bell is rung whenever you wish prosperity for other beings'
        },
        {
            bellName:'Bell of Mourning',
            bellType:'bell_of_mourning',
            bellImageUrl:'https://www.flaticon.com/svg/static/icons/svg/3698/3698128.svg',
            bellDescription:'This bell is rung whenever you have lost someone dearly to your heart due to addiction'
        },
        {
            bellName:'Bell of Gratitude',
            bellType:'bell_of_gratitude',
            bellImageUrl:'https://www.flaticon.com/svg/static/icons/svg/3735/3735735.svg',
            bellDescription:'This bell is rung whenever you feel grateful to the Universe'
        },
        {
            bellName:'Bell of Peace',
            bellType:'bell_of_peace',
            bellImageUrl:'https://i.pinimg.com/originals/a1/04/b9/a104b90e6d86ac040d40a596db05bb49.png',
            bellDescription:'This bell is rung whenever you wish peace of mind upon all other human beings going through a struggle'
        },
        {
            bellName:'Bell of New Life',
            bellType:'bell_of_new_life',
            bellImageUrl:'https://www.flaticon.com/svg/static/icons/svg/3715/3715064.svg',
            bellDescription:'This bell is rung whenever new life has sprouted into existence',
        },
    ]);

    const [bellRung,setBellRung] = React.useState(false);

    const handleBellRung = (bellType,bellName)=>{

        if(!isUserLoggedIn){
            setSnackbarMessage('To ring a bell, you need to login first');
            setSnackbarSeverity('warning');
            setSnackbarOpen(true);
            return false;
        }else{
            if(bellRung || userInfo.last_bell_timestamp){
                setSnackbarMessage('You can only ring a bell once per hour');
                setSnackbarSeverity('warning');
                setSnackbarOpen(true);
                return false;
            }else{
                socket.emit('ringBellRequest',{bellType:bellType,bellName:bellName,username:userInfo.name,amountOfSoulEnergy:1});
                setBellRung(true);
            }
        }
     
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setSnackbarOpen(false);
      };

    return (
        <div className={classes.root}>
            <Drawer
                className={classes.drawer}
                variant="permanent"
                classes={{
                paper: classes.drawerPaper,
            }}>
                <div className={classes.drawerContainer}>
                    <SvgIcon className={classes.bellsIcon}><BellsIcon /></SvgIcon>
                    <Typography className={classes.info}>
                        On this section you can play various bells with their own symbolic meaning. Once a bell 
                        is struck, the sound will be heard by all users currently in the page. 
                        It will also be displayed on the Notification Box in the left navigation drawer.
                        You can only play a bell once per hour.
                    </Typography>
                    { isUserLoggedIn && userInfo.last_bell_timestamp && (
                        <Paper style={{padding:'1rem',backgroundColor:'#ff9400'}} elevation={0}>
                            <Typography style={{color:'white'}}>You have already rung a bell!</Typography>
                        </Paper>
                    ) }
                </div>
            </Drawer>
            <Grid container className={classes.bellsContainer} spacing={3}>
                { bells.map(bell=> (
                    <Grid item xs={3} style={{height:'fit-content'}}>
                        <div style={{height:'10rem',display:'flex',justifyContent:'center',alignItems:'center',flexFlow:'column'}}>
                            <img src={bell.bellImageUrl} alt="bell" className={classes.bellImage} onClick={()=>{handleBellRung(bell.bellType,bell.bellName)}}></img>
                        </div>
                        <div style={{height:'10rem',display:'flex',justifyContent:'flex-start',alignItems:'center',flexFlow:'column',marginTop:'1rem'}}>
                            <Typography className={classes.bellName}>{bell.bellName}</Typography>
                            <Typography className={classes.bellDescription}>{bell.bellDescription}</Typography>
                        </div>
                    </Grid>
                ))}
            </Grid>
            <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={snackbarSeverity}>
                    { snackbarMessage }
                </Alert>
            </Snackbar>
        </div>
    )
}

export default Bells;