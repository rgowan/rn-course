import React from 'react';

import DefaultInput from '../UI/DefaultInput/DefaultInput';

const placeInput = ({ placeData, onChangeText }) => (
  <DefaultInput
    placeholder="Place Name"
    value={placeData.value}
    onChangeText={onChangeText}
    valid={placeData.valid}
    touched={placeData.touched}
  />
);

export default placeInput;