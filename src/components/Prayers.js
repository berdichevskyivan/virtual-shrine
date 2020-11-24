import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import { Typography, Button, Grid, Paper, TextField, Snackbar } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';

import { ReactComponent as PrayerIcon } from '../icons/prayer.svg';
import SvgIcon from "@material-ui/core/SvgIcon";

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
        [theme.breakpoints.down('md')]:{
            display:'none',
        },
    },
    drawerPaper: {
        width: drawerWidth,
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
    prayerIcon:{
        marginTop:'1rem',
        height:'4rem',
        width:'4rem',
    },
    noPrayerIcon:{
        marginTop:'1rem',
        marginBottom:'1rem',
        height:'6rem',
        width:'6rem',
    },
    prayerContainer:{
        paddingLeft:'290px',
        paddingRight:'290px',
        [theme.breakpoints.down('md')]:{
            paddingLeft:'32vw',
            paddingRight:'10px',
        },
        paddingTop:'1rem',
    },
    woodenPlaque:{
        height:'15rem',
        display:'flex',
        flexFlow:'column',
        padding:'1rem',
        background:'url("https://images.pexels.com/photos/129728/pexels-photo-129728.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260")',
    },
    prayerText:{
        fontSize:'1.5vmax',
        height:'100%',
        width:'100%',
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        fontWeight:'bold',
        color:'#7a3e22',
    },
    prayerTextInput:{
        marginBottom:'1rem',
    },
    noPrayersMessage:{
        fontSize:'1.5rem',
    }
  }));

function Prayers({ socket, userInfo, isUserLoggedIn }){

    React.useEffect(()=>{
        socket.on('savePrayerResponse',data=>{
            setSnackbarMessage(data.message);
            setSnackbarSeverity(data.type);
            setSnackbarOpen(true);
        })
        socket.on('loadPrayersResponse',data=>{
            console.log(data);
            let loadedPrayers = data.prayers.map(prayer=>{
                return {
                    prayerWoodenPlaqueText:prayer.text,
                }
            });
            setPrayers(loadedPrayers);
        })
        socket.emit('loadPrayersRequest');
    },[socket])

    const classes = useStyles();

    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState('');
    const [snackbarSeverity, setSnackbarSeverity] = React.useState('success');
    const [prayers,setPrayers] = React.useState([]);
    const [prayerText,setPrayerText] = React.useState('');
    const [engraveDisabled,setEngraveDisabled] = React.useState(false);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setSnackbarOpen(false);
      };

    const verifyPrayerProfanity = (text)=>{
        if(text==='f'){
            setSnackbarMessage('Your prayer contains profanities');
            return true;
        }else if(text===''){
            setSnackbarMessage('You can\'t inscribe an empty prayer');
            return true;
        }
        return false;
    }

    const handleChangePrayerText = (event)=>{
        setPrayerText(event.target.value);
    }

    const handleAddPrayer = ()=>{
        console.log(prayerText);
        if(verifyPrayerProfanity(prayerText)){
            console.log('Your prayer is invalid')
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return;
        }
        setEngraveDisabled(true);
        setPrayers(elements=>[...elements,{
            prayerWoodenPlaqueText:prayerText
        }])
        setPrayerText('');
        socket.emit('engravePrayerRequest',{prayerText:prayerText,username:userInfo.name,amountOfSoulEnergy:1});
    }

    return (
        <div className={classes.root}>
            <Drawer
                className={classes.drawer}
                variant="permanent"
                classes={{
                paper: classes.drawerPaper,
                }}>
                <div className={classes.drawerContainer}>
                    <SvgIcon className={classes.prayerIcon}><PrayerIcon /></SvgIcon>
                    <Typography className={classes.info}>
                        Inspired by the Shinto practice of Ema on which a wooden plaque is inscribed with a wish or prayer, here
                        you can engrave yours on a virtual wooden plaque for other beings to see and feel strenghtened by.
                        Every Sunday at 7:00 PM EST we "burn"
                        these wooden plaques (delete them from the database) just as the physical ones would.
                        You can only engrave a prayer once per week so think your message deeply through. We do not use signatures as a way 
                        to symbolize our separation of the Ego from the Self and relate to each and every being in the all-existing
                        infinite ever-creating Universe.
                    </Typography>
                    { !isUserLoggedIn && (
                        <Paper style={{padding:'1rem',backgroundColor:'#ff9400'}} elevation={0}>
                            <Typography style={{color:'white'}}>You need to login first!</Typography>
                        </Paper>
                    ) }
                    { isUserLoggedIn && userInfo.last_prayer_timestamp && (
                        <Paper style={{padding:'1rem',backgroundColor:'#ff9400'}} elevation={0}>
                            <Typography style={{color:'white'}}>You have already engraved a prayer!</Typography>
                        </Paper>
                    ) }
                    { isUserLoggedIn && !userInfo.last_prayer_timestamp && (
                        <>
                            <TextField
                                id="standard-multiline-static"
                                label="Inscribe your prayer"
                                multiline
                                rows={4}
                                variant="outlined"
                                className={classes.prayerTextInput}
                                value={prayerText}
                                onChange={handleChangePrayerText}
                            />
                            <Button variant="contained" color="primary" onClick={handleAddPrayer} disabled={engraveDisabled}>Offer your prayer</Button>
                        </>
                    ) }
                </div>
            </Drawer>
            { prayers.length === 0 && (
                <>
                    <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'100%',width:'100%',flexFlow:'column'}}>
                        <SvgIcon className={classes.noPrayerIcon}><PrayerIcon /></SvgIcon>
                        <Typography className={classes.noPrayersMessage}>
                            There are no prayers yet. Be the first one to offer a prayer!
                        </Typography>
                    </div>
                </>
            )}
            <Grid container className={classes.prayerContainer} spacing={2}>
                { prayers.map(prayerWoodenPlaque=> (
                    <Grid item xs={3}>
                        <Paper className={classes.woodenPlaque}>
                            <Typography className={classes.prayerText}>{prayerWoodenPlaque.prayerWoodenPlaqueText}</Typography>
                        </Paper>
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

export default Prayers;