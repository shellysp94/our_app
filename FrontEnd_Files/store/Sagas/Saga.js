/* eslint-disable require-yield */
import {put, all, call, take, fork} from 'redux-saga/effects';
import axios from 'axios';
import {rawText} from '../Slices/generalSlice';
import {getCurrentLocationSaga} from '../../utils/location';
import {watchSocket} from '../../utils/socket-test';
import {changeStatus} from '../Slices/generalSlice';

export function* helloApp() {
  console.log('WELCOME TO OUR APP!');
}

const getData = async () => {
  return await axios.get(`http://192.168.1.141:3000/dataFromSetsToClient`);
};

export function* getConstants() {
  try {
    const response = yield call(getData);
    yield put(rawText({rawText: response.data}));
    console.log('CONSTANTS ACCEPTED');
  } catch (e) {
    console.log(e);
  }
}

export function* rootSaga() {
  console.log('---------------START---------------');
  yield all([helloApp(), getConstants()]);
  console.log('-----------------');
  // while (true) {
  yield take(changeStatus.type);

  yield fork(getCurrentLocationSaga);
  yield fork(watchSocket); // //yield take(changeStatus.type);
  yield take(changeStatus.type);
}
// }
