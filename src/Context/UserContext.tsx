import { error } from "console"
import { useContext, createContext, ReactNode, useReducer } from "react"
interface User {

}

interface State {
    user:User | null,
    loading:boolean,
    error:null | string
}

const InitialState:State = {
    user:null,
    loading:false,
    error:null
}

interface FetchUserData {
    type:"FETCH_USER_DATA",
    payload:User
}

type ActionTypes = FetchUserData

const userReducer = (state:State, action:ActionTypes) => {
    switch(action.type) {
        case "FETCH_USER_DATA":
            return {...state, user:action.payload, loading:false, error:null}
        default:
            return state;
    }
}

const UserContext = createContext<{
    state:State,
    dispatch:React.Dispatch<ActionTypes>
}>({state:InitialState, dispatch: () => {}})

export const UserProvider: React.FC<{ children: ReactNode }> = ({children}) => {
    const [state, dispatch] = useReducer(userReducer, InitialState)
    return <UserContext.Provider value={{state, dispatch}}>
        {children}
    </UserContext.Provider>
}


export default UserContext