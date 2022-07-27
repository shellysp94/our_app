/* eslint-disable require-yield */
import {put, all, call} from 'redux-saga/effects';
import axios from 'axios';
import {rawText} from '../Slices/generalSlice';
import {getCurrentLocationSaga} from '../../utils/location';
import {getSocketSaga} from '../../utils/socket';

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
  yield call(getCurrentLocationSaga);
  yield call(getSocketSaga);
}
