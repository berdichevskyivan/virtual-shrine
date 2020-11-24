import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Drawer, SvgIcon, Typography, List, ListItem, ListItemText, Button, ListItemIcon } from '@material-ui/core';
import { ReactComponent as LibraryIcon } from '../icons/book.svg';

import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';

import theBiblePdfUrl from '../pdf/thebible.pdf';
import theQuranPdfUrl from '../pdf/thequran.pdf';

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
    readingTableContainer:{
        height:'100%',
        width:'100%',
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        flexFlow:'column',
    },
    controlButton:{
        width:'7rem',
        marginRight:'1rem',
    },
    bookItemIcon:{
        height:'2rem',
        width:'2rem',
    },
    documentContainer:{
        height:'90%',
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
    },
    pageContainer:{
        height:'inherit',
    }
}));

function Library({socket,isUserLoggedIn,userInfo}){

    const classes = useStyles();

    const [numPages, setNumPages] = React.useState(null);
    const [pageNumber, setPageNumber] = React.useState(1);

    const [currentBookUrl, setCurrentBookUrl] = React.useState(theBiblePdfUrl);

    const testBooks = [
        {
            pdfName:'The Bible',
            pdfUrl:theBiblePdfUrl,
        },
        {
            pdfName:'The Quran',
            pdfUrl:theQuranPdfUrl,
        },
    ];

    const [books,setBooks] = React.useState(testBooks);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    const handleGoToPreviousPage = ()=>{
        setPageNumber(element=>element-1);
    }

    const handleGoToNextPage = ()=>{
        setPageNumber(element=>element+1);
    }

    const handleChangeCurrentBookUrl = (newBookUrl)=>{
        setPageNumber(1);
        setCurrentBookUrl(newBookUrl);
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
                    <SvgIcon className={classes.drawerIcon}><LibraryIcon /></SvgIcon>
                    <Typography className={classes.info}>
                    On this section, you will find a wide assortment of texts, books, manuscripts and all sort of literature written by human beings that have lived life before
                    and have something to teach. You can select a text from the list down below and read it on the page or download it.
                    </Typography>
                    <List className={classes.booksContainer}>
                        {books.map((book) => (
                            <ListItem button key={book.pdfName} onClick={()=>{handleChangeCurrentBookUrl(book.pdfUrl)}}>
                                <ListItemIcon style={{display:'flex',justifyContent:'center',alignItems:'center'}}><SvgIcon className={classes.bookItemIcon}><LibraryIcon /></SvgIcon></ListItemIcon>
                                <ListItemText primary={book.pdfName} primaryTypographyProps={{className:classes.bookItemText}} />
                            </ListItem>
                        ))}
                    </List>                    
                </div>
            </Drawer>
            <div className={classes.readingTableContainer}>
                <Document file={currentBookUrl} onLoadSuccess={onDocumentLoadSuccess} className={classes.documentContainer}>
                    <Page pageNumber={pageNumber} className={classes.pageContainer}></Page>
                </Document>
                <div className={classes.readingControls}>
                    <Button variant="contained" color="primary" className={classes.controlButton} onClick={()=>{handleGoToPreviousPage()}} disabled={pageNumber===1}>Previous</Button>
                    <Button variant="contained" color="primary" className={classes.controlButton} onClick={()=>{handleGoToNextPage()}} disabled={pageNumber===numPages}>Next</Button>
                </div>
            </div>
        </div>
    );
}

export default Library;