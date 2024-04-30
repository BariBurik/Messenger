import * as React from 'react';
import { useContext } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import { Avatar, Grid, Typography } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { CHAT_ROUTE, LOGIN_ROUTE, PROFILE_ROUTE } from '../utils/consts';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { useAuthState } from "react-firebase-hooks/auth";
import { Context } from "../index";

export default function NavBar() {
    const {auth} = useContext(Context);
    const [user] = useAuthState(auth);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <AppBar color='primary' position="static">
            <Toolbar variant='dense'>
                <Grid container justifyContent={"flex-end"}>
                    {
                    user 
                    ?
                    <Box >
                        <Tooltip title="Account settings">
                            <IconButton
                                onClick={handleClick}
                                size="small"
                                sx={{ ml: 2 }}
                                aria-controls={open ? 'account-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? 'true' : undefined}
                            >
                                <Avatar sx={{ width: 32, height: 32 }} src={user.photoURL}></Avatar>
                            </IconButton>
                        </Tooltip>
                        <Menu
                            anchorEl={anchorEl}
                            id="account-menu"
                            open={open}
                            onClose={handleClose}
                            onClick={handleClose}
                            PaperProps={{
                            elevation: 0,
                            sx: {
                                overflow: 'visible',
                                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                mt: 1.5,
                                '& .MuiAvatar-root': {
                                width: 32,
                                height: 32,
                                ml: -0.5,
                                mr: 1,
                                },
                                '&::before': {
                                content: '""',
                                display: 'block',
                                position: 'absolute',
                                top: 0,
                                right: 14,
                                width: 10,
                                height: 10,
                                bgcolor: 'background.paper',
                                transform: 'translateY(-50%) rotate(45deg)',
                                zIndex: 0,
                                },
                            },
                            }}
                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        >
                            <MenuItem onClick={() => {
                                auth.signOut()
                                handleClose()
                            }}>
                                <NavLink style={{color: '#000', textDecoration: "none"}}>Выйти</NavLink>
                            </MenuItem>
                        </Menu>
                    </Box>
                    :
                    <NavLink style={{color: 'white'}} to={LOGIN_ROUTE}>
                        <Button variant={'success'}>Войти</Button>
                    </NavLink>
                    }
                </Grid>
            </Toolbar>
        </AppBar>
    );
}