import {take, call, select} from 'redux-saga/effects';
import {changeStatus} from '../store/Slices/generalSlice';
// import {newMessageWaiting} from '../store/Slices/chatSlice';

const getToken = state => state.configuration.token;

export function* createWebSocketConnection() {
  console.log('6');

  const token = yield select(getToken);
  console.log('token: ', token);
  const socket = new WebSocket('ws://192.168.1.103:3000', null, {
    headers: {
      authorization: 'Bearer ' + token,
    },
  });
  return socket;
}
export function* update() { }


export function* getSocketSaga() {
  console.log('5');
  yield take(changeStatus.type);
  const socket = yield call(createWebSocketConnection);
  //   const token = yield select(getToken);
  console.log('socket: ', socket);

  if (socket) {
    console.log('in line 28');
    socket.onopen = event => {
      // connection opened
      console.log('SOCKET');
    };
    socket.onmessage = event => {
      console.log('7');
      console.log(JSON.parse(event.data));
      //yield put(newMessageWaiting({newMessage: true})); //FIX ME - how to update message from function*
      //yield put(addMessageToChat(event.data[0])); //FIX ME - how to update message from function*
    };
    socket.onerror = error => {
      console.log(error);
    };
  }
}
