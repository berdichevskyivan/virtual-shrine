import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Drawer, SvgIcon, Typography, Button } from '@material-ui/core';
import { ReactComponent as MailboxIcon } from '../icons/love-letter.svg';
import { ReactComponent as SpiritIcon } from '../icons/spirit.svg';

import { ReactComponent as EnvelopeIcon } from '../icons/envelope.svg';
import { ReactComponent as WritingPaperIcon } from '../icons/writing_paper.svg';

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
    mailWritingToolCost:{
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        flexFlow:'row',
        marginTop:'0.5rem',
        border:'1px solid black',
        borderRadius:'2px',
        padding:'0.5rem',
    },
    exchangeButton:{
        marginTop:'1rem',
    },
    mailWritingToolImage:{
        marginBottom:'0.5rem',
        marginTop:'1rem',
        height:'3rem',
        width:'3rem',
    }
}));

function Mailbox({socket,isUserLoggedIn,userInfo}){

    const classes = useStyles();

    const [userMail,setuserMail] = React.useState({}); // can be received mail sent mail

    return (
        <div className={classes.root}>
            <Drawer
                className={classes.drawer}
                variant="permanent"
                classes={{
                paper: classes.drawerPaper,
            }}>
                <div className={classes.drawerContainer}>
                    <SvgIcon className={classes.drawerIcon}><MailboxIcon /></SvgIcon>
                    <Typography className={classes.info}>
                    The direct messages between users is treated with great respect. A connection between human beings has proved to often be the spark that can save 
                    lives. To write a letter, you must use your Soul Energy in exchange for the Writing Paper and the Envelope. Once that is set up, you can write your letter
                    and send it to the target user.
                    </Typography>                    
                </div>
                <div className={classes.mailWritingTools}>
                    <div style={{display:'flex',justifyContent:'center',alignItems:'center',flexFlow:'column'}}>
                        {/* icon */}
                            <SvgIcon className={classes.mailWritingToolImage}><WritingPaperIcon /></SvgIcon>
                            <Typography style={{marginRight:'0.4rem',fontWeight:'bold'}}>Writing Paper</Typography>
                        {/* cost */}
                        <div className={classes.mailWritingToolCost}>
                            <Typography style={{marginRight:'0.4rem',fontWeight:'bold'}}>2</Typography>
                            <SvgIcon><SpiritIcon /></SvgIcon>
                        </div>
                        {/* exchange button */}
                        <Button variant="contained" color="primary" className={classes.exchangeButton}>Exchange</Button>
                    </div>
                    <div style={{display:'flex',justifyContent:'center',alignItems:'center',flexFlow:'column'}}>
                        {/* icon */}
                            <SvgIcon className={classes.mailWritingToolImage}><EnvelopeIcon /></SvgIcon>
                            <Typography style={{marginRight:'0.4rem',fontWeight:'bold'}}>Envelope</Typography>
                        {/* cost */}
                        <div className={classes.mailWritingToolCost}>
                            <Typography style={{marginRight:'0.4rem',fontWeight:'bold'}}>2</Typography>
                            <SvgIcon><SpiritIcon /></SvgIcon>
                        </div>
                        {/* exchange button */}
                        <Button variant="contained" color="primary" className={classes.exchangeButton}>Exchange</Button>
                    </div>
                </div>
            </Drawer>
        </div>
    );
}

export default Mailbox;