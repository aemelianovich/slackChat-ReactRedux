/* eslint-disable react/destructuring-assignment */
// @ts-check

import React, {
  createContext, useEffect, useState,
} from 'react';

export const UserContext = createContext(null);

const getUser = () => {
  const localData = localStorage.getItem('user');
  if (!localData) {
    return null;
  }

  const user = JSON.parse(localData);
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
