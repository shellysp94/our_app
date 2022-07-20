// eslint-disable-next-line no-unused-vars
import React, {useEffect} from 'react';
import LogInScreen from './roots/root';
import {Provider} from 'react-redux';
import store from './store/store';
import {
  requestUserPermission,
  NotificationListener,
} from './utils/pushNotification_helper';
import WebSocketProvider from './utils/socketService';

const App = () => {
  useEffect(() => {
    requestUserPermission();
    NotificationListener();
  }, []);

  return (
    <Provider store={store}>
      <WebSocketProvider>
        <LogInScreen />
      </WebSocketProvider>
    </Provider>
  );
};

export default App;
