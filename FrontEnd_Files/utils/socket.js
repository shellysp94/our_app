/* eslint-disable no-alert */
import {eventChannel} from 'redux-saga';
import {select, call, take, put} from 'redux-saga/effects';
import {newMessageWaiting, addMessageToChat} from '../store/Slices/chatSlice';
import {refreshOnlineUsers} from '../store/Slices/generalSlice';
import {getCurrentSocketPath} from './generalFunctions';

const getToken = state => state.configuration.token;
const path = getCurrentSocketPath();

function socketService(token) {
  return eventChannel(emitter => {
    const socket = new WebSocket(`${path}`, null, {
      headers: {
        authorization: 'Bearer ' + token,
      },
    });

    if (socket) {
      socket.onopen = () => {
        console.log('SOCKET CONNECTED');
      };
      socket.onmessage = event => {
        if (
          JSON.parse(event.data).msg === 'New User Connected' ||
          JSON.parse(event.data).msg === 'User Disconnected' ||
          JSON.parse(event.data).msg === 'User Updated Search Mode'
        ) {
          return emitter({type: refreshOnlineUsers.type, payload: true});
        } else {
          return emitter({type: newMessageWaiting.type, payload: event.data});
        }
      };
      socket.onclose = event => {
        console.log(event);
        alert('SOCKET CLOSED');
      };
    }
    return () => {
      console.log('SOCKET OFF');
    };
  });
}

export function* watchSocket() {
  const token = yield select(getToken);
  // const myID = yield select(getMyID);
  const requestChan = yield call(socketService, token);

  try {
    while (true) {
      let data = yield take(requestChan);
      if (data.type === refreshOnlineUsers.type) {
        yield put(refreshOnlineUsers());
      }
      if (data.type === newMessageWaiting.type) {
        let theirMessage = JSON.parse(data.payload);
        // if (theirMessage.receiver_user_id === myID) {
        yield put(newMessageWaiting());
        yield put(addMessageToChat({myMessage: theirMessage}));
      }
    }
  } catch (err) {
    console.error(err);
  }
}
