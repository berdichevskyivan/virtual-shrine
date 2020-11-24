import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Drawer, SvgIcon, Typography, Grid, Button } from '@material-ui/core';
import { ReactComponent as ArtifactsIcon } from '../icons/character.svg';
import { ReactComponent as SpiritIcon } from '../icons/spirit.svg';

const drawerWidth = 250;
const useStyles = makeStyles((theme)=>({
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
    drawerIcon:{
        marginTop:'1rem',
        height:'4rem',
        width:'4rem',
    },
    info: {
        padding:'1rem',
    },
    artifactsContainer:{
        paddingLeft:'290px',
        paddingRight:'290px',
        paddingTop:'1.2rem',
        [theme.breakpoints.down('sm')]:{
            paddingLeft:'135px',
            paddingRight:'135px',
        },
    },
    artifactImage:{
        marginBottom:'1rem',
        height:'100%',
        width:'100%',
        cursor:'pointer',
    },
    artifactName:{
        fontWeight:'bold',
        fontSize:'1.5vmax',
        marginBottom:'1rem',
    },
    artifactDescription:{
        fontSize:'1vmax',
    },
    artifactCost:{
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        flexFlow:'row',
        marginTop:'1rem',
        border:'1px solid black',
        borderRadius:'2px',
        padding:'0.5rem',
    },
    exchangeButton:{
        marginTop:'1rem',
    },
}));

function Artifacts({socket,isUserLoggedIn,userInfo}){

    const classes = useStyles();

    const testArtifacts = [
        {
            artifactId:0,
            artifactName:'Totem of Fertility',
            artifactImageUrl:'https://www.flaticon.com/svg/static/icons/svg/1800/1800158.svg',
            artifactDescription:'Holding this artifact will double how much Soul Energy you produce from actions',
            artifactSoulEnergyCost:100,
        },
        {
            artifactId:1,
            artifactName:'Mask of Renewal',
            artifactImageUrl:'https://www.flaticon.com/svg/static/icons/svg/2028/2028351.svg',
            artifactDescription:'You\'ve shed your old skin and now you\'re a renewed person',
            artifactSoulEnergyCost:300,
        },
    ];

    const [artifacts,setArtifacts] = React.useState(testArtifacts);

    return (
        <div className={classes.root}>
            <Drawer
                className={classes.drawer}
                variant="permanent"
                classes={{
                paper: classes.drawerPaper,
            }}>
                <div className={classes.drawerContainer}>
                    <SvgIcon className={classes.drawerIcon}><ArtifactsIcon /></SvgIcon>
                    <Typography className={classes.info}>
                        Artifacts are virtual objects that have a symbolism and effect on the user experience. Some artifacts can 
                        influence the current user and others can influence all users globally, anyone currently on the page. Artifacts 
                        can be obtained in exchange for Soul Energy.
                    </Typography>
                </div>
            </Drawer>
            <Grid container className={classes.artifactsContainer} spacing={3}>
                { artifacts.map(artifact=> (
                    <Grid item xs={3} style={{height:'fit-content',display:'flex',justifyContent:'center',alignItems:'center',flexFlow:'column'}}>
                        <div style={{height:'10rem',display:'flex',justifyContent:'center',alignItems:'center',flexFlow:'column'}}>
                            <img src={artifact.artifactImageUrl} alt="artifact" className={classes.artifactImage} ></img>
                        </div>
                        <div style={{height:'10rem',display:'flex',justifyContent:'flex-start',alignItems:'center',flexFlow:'column',marginTop:'1rem'}}>
                            <Typography className={classes.artifactName}>{artifact.artifactName}</Typography>
                            <Typography className={classes.artifactDescription}>{artifact.artifactDescription}</Typography>
                        </div>
                        <div className={classes.artifactCost}>
                            <Typography style={{marginRight:'0.4rem',fontWeight:'bold'}}>{artifact.artifactSoulEnergyCost}</Typography>
                            <SvgIcon><SpiritIcon /></SvgIcon>
                        </div>
                        <Button variant="contained" color="primary" className={classes.exchangeButton}>Exchange</Button>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
}

export default Artifacts;