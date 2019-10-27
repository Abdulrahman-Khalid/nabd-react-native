'use strict';

import LoginManager from './LoginManager';

export default async message => {
  console.log(
    'PushBackground android: notification: ' + JSON.stringify(message)
  );
  LoginManager.getInstance().pushNotificationReceived(message.data);
  return Promise.resolve();
};
