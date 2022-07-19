/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import React from 'react';

class SocketService
{
  constructor(token) {
    if (!SocketService.socket) {
      SocketService.socket = new WebSocket('ws://192.168.1.141:3000', null, {
        headers: {
          authorization: 'Bearer ' + token,
        },
      });
    }
    return this.socket;
  }
  // getSocket = function () {
  //   return this.socket;
  // };

  onopen = event => {
    // connection opened
    console.log('onopen');
    this.socket.send('something'); // send a message
  }
  onmessage = event =>
  { 
    console.log("on message!")
  }

  onerror() {
    // an error occurred
  }
  onclose() {
    // connection closed
    console.log('disconnect');
  }
}
export default SocketService;
