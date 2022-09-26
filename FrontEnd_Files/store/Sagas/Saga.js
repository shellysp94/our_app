/* eslint-disable require-yield */
import {put, call, take, fork} from 'redux-saga/effects';
import axios from 'axios';
import {getRawText} from '../Slices/generalSlice';
import {getCurrentLocationSaga} from '../../utils/location';
import {watchSocket} from '../../utils/socket';
import {getCurrentPath} from '../../utils/generalFunctions';
import {changeStatus} from '../Slices/generalSlice';

export function* helloApp() {
  console.log('WELCOME TO OUR APP!');
}

const getData = async () => {
  const path = getCurrentPath();
  return await axios.get(`${path}/dataFromSetsToClient`);
};

export function* getConstants() {
  try {
    const response = yield call(getData);
    yield put(getRawText({rawText: response.data}));
    yield put(changeStatus({status: 'accepted'}));
  } catch (e) {
    console.error(e);
  }
}

export function* rootSaga() {
  console.log('---------------START---------------');
  yield call(helloApp);

  while (true) {
    yield call(getConstants);
    console.log('---------CONSTATNTS ACCEPTED----------');
    yield take(changeStatus.type);
    yield fork(getCurrentLocationSaga);
    yield fork(watchSocket);
    yield take(changeStatus.type);
  }
}
