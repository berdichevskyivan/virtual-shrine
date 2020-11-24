import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import { Typography, Button, Grid, Paper, Snackbar } from '@material-ui/core';

import { ReactComponent as CandleIcon } from '../icons/candle.svg';
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
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        [theme.breakpoints.down('md')]:{
            width:'20vw',
        },
    },
    drawerPaper: {
        width: drawerWidth,
        right:0,
        left:'auto',
        [theme.breakpoints.down('md')]:{
            width:'20vw',
        },
    },
    drawerContainer: {
        overflow: 'auto',
        paddingRight:'1rem',
    },
    info: {
        padding:'1rem',
    },
    candleIcon:{
        marginTop:'1rem',
        height:'4rem',
        width:'4rem',
    },
    noCandlesMessage:{
        fontSize:'1.5rem',
    },
    noCandlesIcon:{
        marginTop:'1rem',
        marginBottom:'1rem',
        height:'6rem',
        width:'6rem',
    },
    candlesContainer:{
        paddingLeft:'290px',
        paddingRight:'290px',
        paddingTop:'1rem',
        [theme.breakpoints.down('md')]:{
            paddingLeft:'32vw',
            paddingRight:'10px',
        },
    },
    candleImage:{
        height:'100%',
        width:'100%',
    }
  }));

function Candles({ socket, userInfo, isUserLoggedIn }){

    const calculateTimePassed = ()=>{
        let timePassed;
        if(userInfo && userInfo.last_candle_timestamp){
            let difference = +new Date() - +new Date(userInfo.last_candle_timestamp);
            timePassed = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60)
            }
        }else{
            timePassed = {};
        }

        return timePassed;
    }

    const calculateCandleTimePassed = (candle)=>{
        console.log('calculating candles...');
        let difference = +new Date() - +new Date(candle.created_on)
        let candleTimePassed = {
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60)
        }
        return candleTimePassed;
    }

    const classes = useStyles();

    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState('');
    const [snackbarSeverity, setSnackbarSeverity] = React.useState('success');
    const [lightCandleDisabled,setLightCandleDisabled] = React.useState(false);
    const [candles,setCandles] = React.useState([]);

    const [timePassed,setTimePassed] = React.useState(calculateTimePassed());

    React.useEffect(()=>{
        socket.on('saveCandleResponse',data=>{
            setSnackbarMessage(data.message);
            setSnackbarSeverity(data.type);
            setSnackbarOpen(true);
        })
        socket.on('loadCandlesResponse',data=>{
            let loadedCandles = data.candles.map((candle,index)=>{
                return {
                    candleId:index,
                    candleLitTimestamp:candle.created_on,
                    candleTimePassed:calculateCandleTimePassed(candle),
                }
            });
            setCandles(loadedCandles);
        })
        socket.emit('loadCandlesRequest');
    },[]);

    React.useEffect(()=>{
        const timer = setTimeout(()=>{
            let localTimePassed = calculateTimePassed();
            setTimePassed(localTimePassed);
            socket.emit('loadCandlesRequest');
            if(localTimePassed.days === 1){
                clearTimeout(timer);
            }
            return ()=>clearTimeout(timer);
        },5000)
    },[socket,timePassed])

    const handleAddCandle = ()=>{
        setCandles(elements=>[...elements,{candleId:elements.length}]);
        socket.emit('saveCandleRequest',{username:userInfo.name,timestamp:new Date(),amountOfSoulEnergy:1});
        setLightCandleDisabled(true);
    }

    const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
        return;
    }

    setSnackbarOpen(false);
    };

    const returnWidthString = (minutes)=>{
        return 100 - (minutes*100/60)
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
                    <SvgIcon className={classes.candleIcon}><CandleIcon /></SvgIcon>
                    <Typography className={classes.info}>
                        On this section you can light up virtual candles, a sign of hope and strength for those battling the Darkness.
                        You can light up only one candle per day and they last for one hour.
                    </Typography>
                    { !isUserLoggedIn && (
                        <Paper style={{padding:'1rem',backgroundColor:'#ff9400'}} elevation={0}>
                            <Typography style={{color:'white'}}>You need to login first!</Typography>
                        </Paper>
                    ) }
                    { isUserLoggedIn && userInfo.last_candle_timestamp && timePassed.days < 1 && (
                        <>
                            <Paper style={{padding:'1rem',backgroundColor:'#ff9400'}} elevation={0}>
                                <Typography style={{color:'white'}}>You have already lit up a candle!</Typography>
                            </Paper>
                            { Object.keys(timePassed).length > 0 && (
                                <Paper style={{padding:'1rem',backgroundColor:'green', marginTop:'1rem'}} elevation={0}>
                                    <Typography style={{color:'white'}}>
                                        Time passed since last lit up: {timePassed.hours} hour{timePassed.hours===1?'':'s'}, {timePassed.minutes} minute{timePassed.minutes===1?'':'s'}
                                    </Typography>
                                </Paper>
                            )}

                        </>
                    ) }
                    { ((isUserLoggedIn && !userInfo.last_candle_timestamp)||((isUserLoggedIn && timePassed.days >= 1)||(isUserLoggedIn && Object.keys(timePassed).length === 0))) && (
                        <>
                            <Button variant="contained" color="primary" onClick={handleAddCandle} disabled={lightCandleDisabled}>Light Up a Candle</Button>
                        </>
                    ) }
                    
                </div>
            </Drawer>
            { candles.length === 0 && (
                <>
                    <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'100%',width:'100%',flexFlow:'column'}}>
                        <SvgIcon className={classes.noCandlesIcon}><CandleIcon /></SvgIcon>
                        <Typography className={classes.noCandlesMessage}>
                            There are no candles yet. Be the first one to light up a candle!
                        </Typography>
                    </div>
                </>
            )}
            <Grid container className={classes.candlesContainer} spacing={3}>
                { candles.map(candle=> (
                    <>
                    { candle.candleTimePassed && candle.candleTimePassed.hours < 1 && (
                        <Grid item xs={3} md={1}>
                            <img src="https://cdn.pnggif.com/candles/candles-gif-images-145474.gif" alt="candle" className={classes.candleImage}></img>
                            <div style={{width:'100%',background:'red'}}>
                                <div style={{display:'block',width:returnWidthString(candle.candleTimePassed.minutes)+'%',height:'2rem',background:'lawngreen'}}></div>
                            </div>
                        </Grid>
                    )}
                    </>
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

export default Candles;