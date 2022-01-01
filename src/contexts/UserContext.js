import React, {useContext, useState} from 'react';

const UserContext = React.createContext();

export function useUserInfo(){
    return useContext(UserContext);
}

export function UserProvider({ children }){

    const [userInfo, setUserInfo] = useState({});
    const kcraftekArtisanUser = {
        userInfo: userInfo,
        setUserInfo: setUserInfo
    }

    return (
        <UserContext.Provider value={kcraftekArtisanUser}>
            
                {children}
            
        </UserContext.Provider>
    )
}
