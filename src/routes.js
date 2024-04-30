import { CHAT_ROUTE, LOGIN_ROUTE, REGISTER_ROUTE } from "./utils/consts";
import Login from './components/Login'
import Chat from './components/Chat'

export const publicRoutes = [
    {
        path: LOGIN_ROUTE,
        Component: Login
    },
    {
        path: REGISTER_ROUTE,
        Component: Login
    }
]

export const privateRoutes = [
    {
        path: CHAT_ROUTE,
        Component: Chat
    },
    {
        path: CHAT_ROUTE + `?uid=id`,
        Component: Chat
    }
]