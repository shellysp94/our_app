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
  let socketMessage = {
    sender_user_id: '1',
    receiver_user_id: '2',
    sender_name: 'Danit',
    text: 'check',
    time: '10:08 am',
  };
  let dbMessage = {
    chat_id: 1,
    creation_date: '2022-07-14T19:24:54.000Z',
    sender_user_id: 1,
    receiver_user_id: 2,
    content: 'how are you? ',
  };
  const token = useSelector(state => state.configuration.token);
  const status = useSelector(state => state.general.status);

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
      socket.onmessage = event => {
        console.log('message recieve', event);
      };
      socket.onerror = error => {
        console.log(error);
      };
    }
  }

  // socket.onclose = event => {
  //   console.log('disconnect');
  //   dispatch(changeStatus({status: 'disconnect'}));
  // };

  return (
    <WebSocketContext.Provider value={socket}>
      {children}
    </WebSocketContext.Provider>
  );
};
