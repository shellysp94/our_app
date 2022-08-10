// /* eslint-disable prettier/prettier */
// /* eslint-disable no-unused-vars */
// import React from 'react';

// // class SocketService
// // {
// //   constructor(token) {
// //     if (!SocketService.socket) {
// //       this.socket = new WebSocket('ws://192.168.1.141:3000', null, {
// //         headers: {
// //           authorization: 'Bearer ' + token,
// //         },
// //       });
// //     }
// //     return this.socket;
// //   }
// //   getSocket = function () {
// //     return this.socket;
// //   };
// //   myonOpen(event)
// //   {
// //     this.socket.onopen = (event) => {
// //       // connection opened
// //       console.log("socket")
// //       this.socket.send('something');  // send a message
// //     };
// // }

// //   onmessage = event =>
// //   {
// //     console.log("event ",event)
// //     console.log("on message!")
// //   }

// //   onerror() {
// //     // an error occurred
// //   }
// //   onclose() {
// //     // connection closed
// //     console.log('disconnect');
// //   }
// // }
// // export default SocketService;

// let socketService = class
// {
//   constructor(token)
//   {
//     this.socket = new WebSocket('ws://192.168.1.141:3000', null, {
//       headers: {
//         authorization: 'Bearer ' + token,
//       },
//     });
//   };

//   getSocket()
//   {
//     return this.socket;
//   };
//   myOnOpen()
//   {
//     this.socket.onopen = () =>
//     {
//       // connection opened
//       console.log("socket")
//       this.socket.send('something');  // send a message
//     };

//   };
//   myOnClose()
//   {
//     this.socket.onclose = () =>
//     {
//           console.log('disconnect');
//     }

//   }
// };

// class Singleton {
// 	constructor() {
// 		if (!Singleton.instance) {
// 			Singleton.instance = new socketService();
// 		}
// 	}

// 	getInstance() {
// 		return Singleton.instance;
// 	}
// }

// export default Singleton;
