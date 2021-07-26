// @ts-check

import React, {
  createContext, useEffect, useState, useMemo,
} from 'react';

export const UserContext = createContext(null);

const getUser = () => {
  const localData = localStorage.getItem('user');
  return localData ? JSON.parse(localData) : null;
};

const UserContextProvider = (props) => {
  const [user, setUser] = useState(getUser());
  const value = useMemo(() => ({ user, setUser }), [user, setUser]);

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  return (
    <UserContext.Provider value={value}>
      { props.children }
    </UserContext.Provider>
  );
};

export default UserContextProvider;
