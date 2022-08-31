/* eslint-disable no-alert */
import {eventChannel} from 'redux-saga';
import {select, call, take, put} from 'redux-saga/effects';
import {newMessageWaiting, addMessageToChat} from '../store/Slices/chatSlice';

const getToken = state => state.configuration.token;
const getMyID = state => state.configuration.userConfig.user_id;

function socketService(token) {
  return eventChannel(emitter => {
    const socket = new WebSocket('ws://192.168.1.141:3000', null, {
      headers: {
        authorization: 'Bearer ' + token,
      },
    });

    if (socket) {
      socket.onopen = () => {
        console.log('SOCKET CONNECTED');
      };
      socket.onmessage = event => {
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
  const requestChan = yield call(socketService, token);

  try {
    while (true) {
      let data = yield take(requestChan);
      let theirMessage = JSON.parse(data.payload);
      if (theirMessage.receiver_user_id === myID)
        yield put(addMessageToChat({myMessage: theirMessage}));
    }
  } catch (err) {
    alert(err);
  }
}
