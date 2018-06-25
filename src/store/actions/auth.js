import { AsyncStorage } from 'react-native';

import { 
  TRY_AUTH,
  AUTH_SET_TOKEN,
  AUTH_REMOVE_TOKEN
} from './actionTypes';

import App from '../../../App';

import {
  uiStartLoading,
  uiStopLoading
} from './index';

import startMainTabs from '../../screens/MainTabs/startMainTabs';

const API_KEY = 'AIzaSyDQrA7q6rvXvnqPKkKKsUa0u9APAq0OQ9s';

export const tryAuth = (authData, authMode) => {
  return dispatch => {
    dispatch(uiStartLoading());

    let url = `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=${API_KEY}`;

    if (authMode === 'signup') {
      url = `https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=${API_KEY}`;
    }

    fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        email: authData.email,
        password: authData.password,
        returnSecureToken: true
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(res => {
        if (res.ok) {
          return res.json();
        } else {
          throw(new Error());
        }
      })
      .then(data => {
        dispatch(uiStopLoading());

        if (!data.idToken) {
          alert('Authentication failed, please try again');
        } else {
          dispatch(authStoreToken(data.idToken, data.expiresIn, data.refreshToken));
          startMainTabs();
        }
      })
      .catch(err => {
        console.log(err);
        alert('Authentication failed, please try again');
        dispatch(uiStopLoading());
      });
  };
};

export const authStoreToken = (token, expiresIn, refreshToken) => {
  return dispatch => {
    const now = new Date();
    const expiryDate = now.getTime() + expiresIn * 1000;
    
    dispatch(authSetToken(token, expiryDate));
    AsyncStorage.setItem('ap:auth:token', token);
    AsyncStorage.setItem('ap:auth:expiryDate', expiryDate.toString());
    AsyncStorage.setItem('ap:auth:refreshToken', refreshToken);
  };
};

export const authSetToken = (token, expiryDate) => {
  return {
    type: AUTH_SET_TOKEN,
    token,
    expiryDate
  };
};

export const authGetToken = () => {
  return (dispatch, getState) => {
    const promise = new Promise((resolve, reject) => {
      const token = getState().auth.token;
      const expiryDate = getState().auth.expiryDate;


      if (!token || new Date(expiryDate) <= new Date()) {
        let fetchedToken;

        AsyncStorage
          .getItem('ap:auth:token')
          .then(tokenFromStorage => {
            fetchedToken = tokenFromStorage;
            if (!tokenFromStorage) {
              reject();
              return;
            }

            return AsyncStorage.getItem('ap:auth:expiryDate');
          })
          .then(expiryDate => {
            const parsedExpiryDate = new Date(parseInt(expiryDate));
            const now = new Date(); 

            if (parsedExpiryDate > now) {
              dispatch(authSetToken(fetchedToken));
              resolve(fetchedToken);
            } else {
              return reject();
            }
          })
          .catch(() => {
            return reject();
          });
      } else {
        resolve(token);
      }
    });

    return promise.catch(() => {
      return AsyncStorage.getItem('ap:auth:refreshToken')
        .then(refreshToken => {
          return fetch(`https://securetoken.googleapis.com/v1/token?key=${API_KEY}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `grant_type=refresh_token&refresh_token=${refreshToken}`
            
          }); 
        })
        .then(res => res.json())
        .then(res => {
          if (res.ok) {
            return res.json();
          } else {
            throw(new Error());
          }
        })
        .then(data => {
          if (data.id_token) {
            dispatch(
              authStoreToken(
                data.id_token,
                data.expires_in,
                data.refresh_token
              )
            );

            return data.id_token;
          } else {
            dispatch(authClearStorage());
          }
        });
    })
      .then(token => {
        if (!token) {
          throw(new Error());
        } else {
          return token;
        }
      });
  };
};

export const authAutoSignIn = () => {
  return dispatch => {
    dispatch(authGetToken())
      .then(() => {
        startMainTabs();
      })
      .catch(() => console.log('Failed to fetch token'));
  };
};

export const authClearStorage = () => {
  return dispatch => {
    AsyncStorage.removeItem('ap:auth:token');
    AsyncStorage.removeItem('ap:auth:expiryDate');
    return AsyncStorage.removeItem('ap:auth:refreshToken');
  };
};

export const authLogout = () => {
  return dispatch => {
    dispatch(authClearStorage())
      .then(() => {
        App();
      });

    dispatch(authRemoveToken());
  };
};

export const authRemoveToken = () => {
  return {
    type: AUTH_REMOVE_TOKEN
  };
};
