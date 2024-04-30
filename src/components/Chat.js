import { useContext, useEffect, useState } from "react";
import { Context } from "..";
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuthState } from "react-firebase-hooks/auth";
import { CHAT_ROUTE } from "../utils/consts";
import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import Loader from "./Loader"
import Autocomplete from '@mui/material/Autocomplete';
import { Avatar, Button, Grid, TextField } from "@mui/material";
import { collection, addDoc, query, serverTimestamp, doc, updateDoc, where, getDocs, orderBy, getDoc} from "firebase/firestore";
import {useCollectionData} from 'react-firebase-hooks/firestore'
import "./friend.css"

const drawerWidth = 240;

function Chat() {
  const { auth, firestore} = useContext(Context);
  const [user, loading] = useAuthState(auth);
  const [choosedUser, setChoosedUser] = useState('')
  let users = []
  const usersQuery = query(collection(firestore, 'users'));
  const [usersLoaded, setUsersLoaded] = useState(false); // Состояние для отслеживания загрузки пользователей
  const [allUsers, setAllUsers] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDocs(usersQuery);
      const usersData = snapshot.docs.map(doc => doc.data());
      console.log("Received users data:", usersData);
      setAllUsers(usersData);
      setUsersLoaded(true);
    };
  
    fetchData();
  }, []);
  const [friends, setFriends] = useState([])
    
  useEffect(() => {
    if (usersLoaded && !loading) {
      const thisUserQuery = query(collection(firestore, "users"), where("uid", "==", `${user.uid}`));
      getDocs(thisUserQuery).then(snapshot => {
        const thisUserDoc = snapshot.docs[0];
        console.log(snapshot)
        let chatUid = thisUserDoc.data().chatUid || [];
        setFriends(allUsers.filter(user => chatUid.includes(user.uid)));
      });
    }
  }, [usersLoaded, allUsers, firestore, user.uid]);

  const [message, setMessage] = useState('')
  const messagesQuery = query(collection(firestore, 'messages'), orderBy('createdAt'));
  const [messages, loadingMessages] = useCollectionData(messagesQuery)

  const windowHeignt = window.innerHeight - 52

  const navigate = useNavigate()
  const [path, setPath] = useState('')
  const location = useLocation()
  const otherUserDocUid = location.search.split("=")[1]
  useEffect(() => {
    setPath(location.pathname)
  }, [])
  const isChatEmpty = path === CHAT_ROUTE

  if (loading || !usersLoaded) {
    return <Loader />
  } else {
    users = allUsers.filter((otherU) => otherU.uid !== user.uid)

    async function sendMessage()  {
      const thisUserQuery = query(collection(firestore, "users"), where("uid", "==", `${user.uid}`));

      // Получаем данные о текущем пользователе
      const thisUserSnapshot = await getDocs(thisUserQuery);
      const thisUserDoc = thisUserSnapshot.docs[0];
      const thisUserDocRef = thisUserSnapshot.docs[0].ref;

      // Получаем текущий чат пользователя
      let chatUid = thisUserDoc.data().chatUid || [];

      const otherUserQuery = query(collection(firestore, "users"), where("uid", "==", `${otherUserDocUid}`));

      // Получаем данные о текущем пользователе
      const otherUserSnapshot = await getDocs(otherUserQuery);
      const otherUserDoc = otherUserSnapshot.docs[0];
      const otherUserDocRef = otherUserSnapshot.docs[0].ref;

      // Получаем текущий чат пользователя
      let otherChatUid = otherUserDoc.data().chatUid || [];
      await addDoc(collection(firestore, 'messages'), {
        uid: user.uid,
        otherUserId: otherUserDocUid,
        displayName: user.displayName,
        photoURL: user.photoURL,
        text: message,
        createdAt: serverTimestamp()
      })

      try {
        if (!chatUid.includes(otherUserDocUid)) {
          await updateDoc(thisUserDocRef, {
            chatUid: [...chatUid, otherUserDocUid]
          });
          console.log("ChatUid успешно обновлен для текущего пользователя!");
        } else {
          console.log("ChatUid уже был добавлен");
        }
      } catch (e) {
        console.error("Ошибка при обновлении chatUid для текущего пользователя:", e);
      }
      
      try {
        if (!otherChatUid.includes(user.uid)) {
          await updateDoc(otherUserDocRef, {
            chatUid: [...otherChatUid, user.uid]
          });
          console.log("ChatUid успешно обновлен для текущего пользователя!");
        } else {
          console.log("ChatUid уже был добавлен");
        }
      } catch (e) {
        console.error("Ошибка при обновлении chatUid для другого пользователя:", e);
      }

      setFriends(users.filter(user => chatUid.includes(user.uid)))
      setMessage('')
    }

    function goToUser(userMail) {
      let userUid = ''
      console.log(userMail)
      userUid = allUsers.filter((oUser) => oUser.email === userMail)[0].uid
      navigate(`/chat?uid=${userUid}`)
      setPath(window.location.href)
      setChoosedUser(userMail)
      console.log("User email:", choosedUser);
    }

    if (isChatEmpty && usersLoaded) {
      return (
        <Box sx={{ display: 'flex' }}>
          <Drawer
            onClick={console.log(allUsers)}
            sx={{
              width: drawerWidth,
              flexShrink: 0,
              '& .MuiDrawer-paper': {
                width: drawerWidth,
                boxSizing: 'border-box',
              },
            }}
            variant="permanent"
            anchor="left"
          >
            <Autocomplete
              style={{marginTop: "13px"}}
              id="free-solo-demo"
              freeSolo
              options={users.map((option) => option.email)}
              renderInput={(params) => <TextField {...params} label="Search" />}
              onChange={(e, newValue) => goToUser(newValue)}
            />
            <Divider />
            <List sx={{overflowY: "auto"}}>
              {friends.map((friend, index) => {
                  return (
                    <div className="friend" onClick={() => goToUser(friend.email)} style={{display: "flex", alignItems: "center"}} key={index}>
                      <Avatar sx={{marginRight: "10px"}} src={friend.photoURL}></Avatar>
                      <h4>{friend.displayName ? friend.displayName : friend.email}</h4>
                    </div>
                  )
              })}
            </List>
          </Drawer>
          <Box
            component="main"
            sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
          >
          </Box>
        </Box>
      );
    }
    if (path.includes("?uid") && usersLoaded && !loadingMessages) {
      return (
        <Box sx={{ display: 'flex' }}>
          <Drawer
            onClick={console.log(friends)}
            sx={{
              width: drawerWidth,
              flexShrink: 0,
              '& .MuiDrawer-paper': {
                width: drawerWidth,
                boxSizing: 'border-box',
              },
            }}
            variant="permanent"
            anchor="left"
          >
            <Autocomplete
              style={{marginTop: "13px"}}
              id="free-solo-demo"
              freeSolo
              options={users.map((option) => option.email)}
              renderInput={(params) => <TextField {...params} label="Search" />}
              onChange={(e, newValue) => goToUser(newValue)}
            />
            <Divider />
            <List sx={{overflowY: "auto"}}>
              {friends.map((friend, index) => {
                  return (
                    friend.uid === window.location.href.split("=")[1]
                    ?
                    <div className="friend friend-choosed" onClick={() => goToUser(friend.email)} style={{display: "flex", alignItems: "center"}} key={index}>
                      <Avatar sx={{marginRight: "10px"}} src={friend.photoURL}></Avatar>
                      <h4>{friend.displayName ? friend.displayName : friend.email}</h4>
                    </div> 
                    :
                    <div className="friend" onClick={() => goToUser(friend.email)} style={{display: "flex", alignItems: "center"}} key={index}>
                      <Avatar sx={{marginRight: "10px"}} src={friend.photoURL}></Avatar>
                      <h4>{friend.displayName ? friend.displayName : friend.email}</h4>
                    </div> 
                  )
              })}
            </List>
          </Drawer>
          <Box
            component="main"
            sx={{display: "flex", flexDirection: "column", height: `${windowHeignt}px`, flexGrow: 1, bgcolor: '#5FBDCE'}}
          >
            <div style={{height: `calc(${windowHeignt}px - 5%)`, width: "100%", overflowY: "auto"}}>
              {messages.filter((mes) => ((mes.uid === user.uid && mes.otherUserId === otherUserDocUid) || (mes.uid === otherUserDocUid && mes.otherUserId === user.uid))).map(mes => 
                <div 
                    style={{
                        margin: "10px", 
                        border: user.uid === mes.uid ? '2px solid green' : '2px dashed red',
                        marginLeft: user.uid === mes.uid ? 'auto' : '10px',
                        width: 'fit-content',
                        padding: '5px'}}>    
                    <Grid container>
                        <Avatar src={mes.photoURL}/>
                        <div>{mes.displayName}</div>
                    </Grid>
                    <div>{mes.text}</div>
                </div>
              )}
            </div>
            <Grid
                container
                style={{backgroundColor: "#fff", flexDirection: "column", justifyContent: "start", alignItems: "flex-start" ,width: "100%", height: "5%"}}
              >   
                <TextField 
                value={message}
                onChange={e => setMessage(e.target.value)}
                sx={{marginLeft: "5px", maxPadding: "10px", maxHeight: "10px", width: "87%"}} 
                maxRows={2} 
                variant="outlined"
                ></TextField>
                <Button 
                onClick={sendMessage} 
                variant="outlined">Отправить</Button>
            </Grid>
          </Box>
        </Box>
      );
    }
  }
}

export default Chat;