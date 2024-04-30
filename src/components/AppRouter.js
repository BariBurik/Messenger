import { Routes, Route, Navigate } from 'react-router-dom';
import { CHAT_ROUTE, REGISTER_ROUTE } from '../utils/consts';
import { publicRoutes, privateRoutes } from '../routes';
import { useAuthState } from "react-firebase-hooks/auth";
import { Context } from "../index";
import { useContext } from 'react'

function AppRouter() {
    const {auth} = useContext(Context);
    const [user] = useAuthState(auth);
    return user
        ?
        <Routes>
            {privateRoutes.map(({path, Component}) => 
                <Route key={path} path={path} exact element={<Component />}></Route>
            )}
            <Route path='*' element={<Navigate to={CHAT_ROUTE} replace/> }></Route>
        </Routes>
        :  
        <Routes>
            {publicRoutes.map(({path, Component}) => 
                <Route key={path} path={path} exact element={<Component />}></Route>
            )}
            <Route path='*' element={<Navigate to={REGISTER_ROUTE} replace/> }></Route>
        </Routes>
    
}

export default AppRouter;