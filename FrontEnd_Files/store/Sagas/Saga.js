/* eslint-disable require-yield */
import {put, all, call, takeEvery} from 'redux-saga/effects';
import axios from 'axios';
import {rawText, getConstants} from '../Slices/generalSlice';

//const delay = ms => new Promise(res => setTimeout(res, ms));

export function* helloSaga() {
  console.log('Hello Sagas!');
}

const getData = () => {
  return axios.get(`http://192.168.1.141:3000/dataFromSetsToClient`);
};

export function* workLogin() {
  console.log('Login!!!');
  try {
    const response = yield call(getData);
    yield put(rawText({rawText: response.data}));
    console.log('Login2');
  } catch (e) {
    console.log(e);
  }
}

// export function* incrementAsync() {
//   yield call(delay, 1000);
//   //yield put(Increment());
// }

// export function* watchIncrementAsync() {
//   //yield takeEvery(AsyncIncrement, incrementAsync);
// }
export function* watchLogin() {
  yield takeEvery(getConstants, workLogin);
}

export function* rootSaga() {
  yield all([helloSaga(), watchLogin()]);
}
