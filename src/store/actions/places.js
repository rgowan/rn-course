import {
  SET_PLACES,
  REMOVE_PLACE,
  PLACE_ADDED,
  START_ADD_PLACE
} from './actionTypes';

import {
  uiStartLoading,
  uiStopLoading,
  authGetToken
} from './index';

export const startAddPlace = () => {
  return {
    type: START_ADD_PLACE
  };
};

export const addPlace = (placeName, location, image) => {
  return dispatch => {
    let authToken;

    dispatch(uiStartLoading());

    dispatch(authGetToken())
      .catch(() => alert('No valid token found'))
      .then(token => {
        authToken = token;
        return fetch('https://us-central1-api-project-730476993949.cloudfunctions.net/storeImage', {
          method: 'POST',
          body: JSON.stringify({
            image: image.base64
          }),
          headers: {
            'authorization': `Bearer ${authToken}`
          }
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
        const placeData = {
          name: placeName,
          location,
          image: data.imageUrl,
          imagePath: data.imagePath
        };

        return fetch(`https://api-project-730476993949.firebaseio.com/places.json?auth=${authToken}`, {
          method: 'POST',
          body: JSON.stringify(placeData)
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
      .then(() => {
        dispatch(uiStopLoading());
        dispatch(placeAdded());
      })
      .catch(() => {
        alert('Something went wrong, please try again!');
        dispatch(uiStopLoading());
      });
  };
};

export const placeAdded = () => {
  return {
    type: PLACE_ADDED
  };
};

export const getPlaces = () => {
  return dispatch => {
    dispatch(authGetToken())
      .then(token => {
        return fetch(`https://api-project-730476993949.firebaseio.com/places.json?auth=${token}`);
      })
      .catch(() => alert('No valid token found'))
      .then(res => res.json())
      .then(res => {
        if (res.ok) {
          return res.json();
        } else {
          throw(new Error());
        }
      })
      .then(data => {
        const places = [];

        for(const key in data) {
          places.push({
            ...data[key],
            image: {
              uri: data[key].image
            },
            key
          });
        }

        dispatch(setPlaces(places));
      })
      .catch(() => alert('Something went wrong, sorry'));
  };
};

export const setPlaces = places => {
  return {
    type: SET_PLACES,
    places
  };
};

export const removePlace = placeKey => {
  return {
    type: REMOVE_PLACE,
    placeKey
  };
};

export const deletePlace = key => {
  return (dispatch) => {
    dispatch(authGetToken())
      .catch(() => alert('No valid token found'))
      .then(token => {
        dispatch(removePlace(key));

        return fetch(`https://api-project-730476993949.firebaseio.com/places/${key}.json?auth=${token}`, {
          method: 'DELETE'
        });
      })
      .catch(() => alert('Something went wrong'));
  };
};