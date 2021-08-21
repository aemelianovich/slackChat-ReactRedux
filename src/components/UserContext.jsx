// @ts-check

import React, {
  createContext, useContext, useEffect, useState,
} from 'react';
import { useRollbarPerson } from '@rollbar/react';

const UserContext = createContext(null);

export const useUserContext = () => useContext(UserContext);

const getUser = () => {
  const localData = localStorage.getItem('user');
  if (!localData) {
    return null;
  }

  const user = JSON.parse(localData);
  useRollbarPerson(user);
  return user;
};

const UserContextProvider = (props) => {
  const [user, setUser] = useState(getUser());

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      { props.children }
    </UserContext.Provider>
  );
};

export default UserContextProvider;
