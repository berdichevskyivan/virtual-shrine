import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import { Typography, Button, Grid, TextField, List, ListItem, ListItemText } from '@material-ui/core';

import { ReactComponent as SupportChatIcon } from '../icons/helping-hand.svg';
import SvgIcon from "@material-ui/core/SvgIcon";
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
    supportChatIcon:{
        marginTop:'1rem',
        height:'4rem',
        width:'4rem',
    },
    supportChatContainer:{
        paddingLeft:'270px',
        paddingRight:'270px',
        paddingTop:'1rem',
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        flexFlow:'column',
        height:'90%',
    },
    controlsContainer:{
        height:'10%',
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        position:'fixed',
        bottom:0,
        left:0,
        right:0,
    }
  }));

function SupportChat({ socket, userInfo, isUserLoggedIn }){
    const classes = useStyles();

    React.useEffect(()=>{
        socket.on('sendChatMessageResponse',data=>{
            let text = '[' + data.username + '] ' + data.messageText;
            setMessages(elements=>[...elements,{messageText:text}])
            let element = document.getElementById('messages_box');
            element.scrollTop = element.scrollHeight;
        })
    },[socket])

    const [messages,setMessages] = React.useState([]);
    const [messageInputText,setMessageInputText] = React.useState('');

    const handleChangeMessageInputText = (e)=>{
        setMessageInputText(e.target.value);
    }

    const handleSendMessage = ()=>{
        if(messageInputText==='') return;
        socket.emit('sendChatMessageRequest',{messageText:messageInputText, username:userInfo.name});
        setMessageInputText('');
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
                    <SvgIcon className={classes.supportChatIcon}><SupportChatIcon /></SvgIcon>
                    <Typography className={classes.info}>
                        If you are currently undergoing suffering in your life caused by the many illnesses and darkness that plague all human beings,
                        you can find solace and support from your fellow brothers. You need only to ask and someone will answer.
                    </Typography>
                </div>
            </Drawer>
            <Grid container className={classes.supportChatContainer} spacing={3}>
                {/* Messages box */}
                <Grid item xs={12} style={{width:'100%',overflow:'auto'}} id="messages_box">
                    <List>
                        { messages.map(message=>(
                            <ListItem button onClick={()=>{console.log('Message was clicked')}}>
                                <ListItemText primary={message.messageText} primaryTypographyProps={{className:classes.messageText}} />
                            </ListItem>
                        )) }
                    </List>
                </Grid>
            </Grid>
            <div className={classes.controlsContainer}>
                <TextField  
                value={messageInputText}
                onChange={handleChangeMessageInputText}
                variant="outlined"
                style={{width:'50%',marginRight:'2rem'}}
                onKeyPress={(e)=>{
                    if(e.key === 'Enter'){
                        if(messageInputText==='') return;
                        handleSendMessage();
                    }
                }} />
                <Button variant="contained" color="primary" onClick={handleSendMessage}>Send</Button>
            </div>
        </div>
    )
}

export default SupportChat;