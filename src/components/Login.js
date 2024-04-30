import { LOGIN_ROUTE, REGISTER_ROUTE } from "../utils/consts";
import { Button, Container, Grid, TextField, Avatar, IconButton, Typography } from "@mui/material";
import Box from '@mui/material/Box';
import { useContext, useState } from "react";
import {NavLink, useLocation, useNavigate} from "react-router-dom";
import {GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { collection, addDoc, serverTimestamp, query, orderBy } from "firebase/firestore";
import { Context } from "..";

function Login() {
    const location = useLocation()
    const isLogin = location.pathname === LOGIN_ROUTE
    const {auth, firestore} = useContext(Context)
    const [email, setEmail] = useState('')
    const [pass, setPass] = useState('')
    const [checkPass, setCheckPass] = useState('')
    
    const regWithEmailAndPassword = async (email, password, checkPassword) => {
        try {
            if (!(password === checkPassword)) {
                return alert("Пароли не совпадают")
            }
            const {user} = await createUserWithEmailAndPassword(auth, email, password)
            await addDoc(collection(firestore, 'users'), {
                uid: user.uid,
                chatUid: [],
                email: user.email,
                displayName: user.displayName,
                photoUrl: user.photoURL
            });
        } catch (e) {
            console.log(e)
        }
    }

    const loginWithEmailAndPassword = async (email, password) => {
        try {
            await signInWithEmailAndPassword(auth, email, password)
        } catch (e) {
            console.log(e)
        }
    }

    const loginWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        const {user} = await signInWithPopup(auth, provider)
    }

    const regWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        const {user} = await signInWithPopup(auth, provider)
        await addDoc(collection(firestore, 'users'), {
            uid: user.uid,
            chatUid: [],
            email: user.email,
            displayName: user.displayName,
            photoUrl: user.photoURL
        });
    }

    if (isLogin) {
        return (
            <Container>
                <Grid container
                    style={{height: window.innerHeight - 50}}
                    alignItems={"center"}
                    justifyContent={"center"}>
                        <Grid 
                            container
                            alignItems={"center"}
                            justifyContent={"center"}
                            style={{width: 500, background: '#f7f7f7', borderRadius: 10}}>
                            <Box style={{ width: "80%", display: "flex", flexDirection: "column"}} p={5}>
                                <TextField style={{width: "100%"}} type="email" placeholder="Почта" value={email} onChange={e => setEmail(e.target.value)} />
                                <TextField style={{width: "100%"}} type="password" placeholder="Пароль" value={pass} onChange={e => setPass(e.target.value)} />
                                <Button onClick={() => loginWithEmailAndPassword(email, pass)} style={{marginTop: "25px", height: "50px"}}>Войти</Button>
                            </Box>
                            <NavLink to={REGISTER_ROUTE} style={{color: "#000", argin: "10px" }}>Нет аккаунта? Зарегистрироваться</NavLink>
                            <Button onClick={loginWithGoogle} style={{width: "60%", height: "20%", margin: "0 20px", padding: "5px 15px" }}>
                                <Box style={{width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between"}}>
                                    <Avatar sx={{ width: 32, height: 32 }} src={'https://img2.freepng.ru/20180607/poh/kisspng-google-logo-computer-icons-mei-qi-5b19042809dd50.8354117915283661200404.jpg'}/>
                                    <Typography style={{fontSize: "15px", color: "#000"}}>Войти с помощью Google</Typography>
                                </Box>
                            </Button>
                        </Grid>
                </Grid>
            </Container>
        )
    } else {
        return (
            <Container>
                <Grid container
                    style={{height: window.innerHeight - 50}}
                    alignItems={"center"}
                    justifyContent={"center"}>
                        <Grid 
                            container
                            alignItems={"center"}
                            justifyContent={"center"}
                            style={{width: 500, background: '#f7f7f7', borderRadius: 10}}>
                            <Box style={{ width: "80%", display: "flex", flexDirection: "column"}} p={5}>
                                <TextField style={{width: "100%"}} type="email" placeholder="Почта" value={email} onChange={e => setEmail(e.target.value)} />
                                <TextField style={{width: "100%"}} type="password" placeholder="Пароль" value={pass} onChange={e => setPass(e.target.value)} />
                                <TextField style={{width: "100%"}} type="password" placeholder="Подтвердите пароль" value={checkPass} onChange={e => setCheckPass(e.target.value)} />
                                <Button onClick={() => regWithEmailAndPassword(email, pass, checkPass)} style={{marginTop: "25px", height: "50px"}}>Зарегистрироваться</Button>
                            </Box>
                            <NavLink to={LOGIN_ROUTE} style={{color: "#000", argin: "10px" }}>Есть аккаунт? Войти</NavLink>
                            <Button onClick={regWithGoogle} style={{width: "80%", height: "20%", margin: "0 20px", padding: "5px 15px" }}>
                                <Box style={{width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between"}}>
                                    <Avatar sx={{ width: 32, height: 32 }} src={'https://img2.freepng.ru/20180607/poh/kisspng-google-logo-computer-icons-mei-qi-5b19042809dd50.8354117915283661200404.jpg'}/>
                                    <Typography style={{fontSize: "15px", color: "#000"}}>Зарегистрироваться с помощью Google</Typography>
                                </Box>
                            </Button>
                        </Grid>
                </Grid>
            </Container>
        )
    }
}

export default Login;