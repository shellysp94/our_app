/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, {createContext} from 'react';
import {useSelector, useDispatch} from 'react-redux';

const WebSocketContext = createContext(null);
export {WebSocketContext};

export default WebSocketProvider = ({children}) => {
  const dispatch = useDispatch();
  let socket;

  const token = useSelector(state => state.configuration.token);
  const status = useSelector(state => state.general.status);
  ws = {socket: socket};
  if (!socket) {
    socket = new WebSocket('ws://192.168.1.141:3000', null, {
      headers: {
        authorization: 'Bearer ' + token,
      },
    });
    if (token && status === 'connected') {
      socket.onopen = event => {
        // connection opened
        console.log('SOCKET');
        socket.send('something'); // send a message
      };

      socket.onclose = event => {
        console.log('disconnect');
        dispatch(changeStatus({status: 'disconnect'}));
      };

      socket.onmessage = event => {
        console.log('message recieve');
      };
    }

    return (
      <WebSocketContext.Provider value={ws}>
        {children}
      </WebSocketContext.Provider>
    );
  }
};
