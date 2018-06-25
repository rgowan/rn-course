import React from 'react';

import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image
} from 'react-native';

const ListItem = ({ place, handleClick }) => (
  <TouchableOpacity onPress={ handleClick }>
    <View style={ styles.listItem }>
      <Image
        style={ styles.placeImage }
        source={ place.image }
      />
      <Text>
        { place.name }
      </Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  listItem: {
    width: '100%',
    padding: 10,
    backgroundColor: '#eee',
    marginBottom: 5,
    flexDirection: 'row',
    alignItems: 'center'
  },
  placeImage: {
    marginRight: 8,
    height: 30,
    width: 30
  }
});

export default ListItem;