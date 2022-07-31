/* eslint-disable require-yield */
import {eventChannel} from 'redux-saga';
import {select, call, take, put} from 'redux-saga/effects';
import {newMessageWaiting, addMessageToChat} from '../store/Slices/chatSlice';

const getToken = state => state.configuration.token;
const getMyID = state => state.configuration.userConfig.user_id;

// export function* initializeWebSocketsChannel() {
//   const token = yield select(getToken);
//   const socket = new WebSocket('ws://192.168.1.103:3000', null, {
//     headers: {
//       authorization: 'Bearer ' + token,
//     },
//   });
//   if (socket) {
//     socket.onmessage = event => {
//       console.log('message:', event.data);
//       //yield put(newMessageWaiting.type, {messageWaiting: true}); // FIX ME
//     };
//   }
// }

function socketService(token) {
  return eventChannel(emitter => {
    const socket = new WebSocket('ws://192.168.1.103:3000', null, {
      headers: {
        authorization: 'Bearer ' + token,
      },
    });
    console.log('6');

    if (socket) {
      socket.onopen = () => {
        console.log('SOCKET CONNECTED');
      };
      socket.onmessage = event => {
        console.log('7');
        console.log('EVENT DATA: ', event.data);
        return emitter({type: newMessageWaiting.type, payload: event.data});
      };
    }

    // The subscriber must return an unsubscribe function
    return () => {
      console.log('Socket off');
    };
  });
}

export function* watchSocket() {
  const token = yield select(getToken);
  const myID = yield select(getMyID);
  console.log('5');
  const requestChan = yield call(socketService, token);
  console.log('8');

  try {
    while (true) {
      let data = yield take(requestChan);
      // console.log('data: ', data);
      // console.log('payload: ', JSON.parse(data.payload));
      let theirMessage = JSON.parse(data.payload);
      // console.log('theirMessage: ', theirMessage);
      if (theirMessage.receiver_user_id === myID)
        yield put(addMessageToChat({myMessage: theirMessage}));
    }
  } catch (err) {
    alert(err);
  }
}
