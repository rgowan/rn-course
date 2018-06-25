import React from 'react';

import {
  StyleSheet,
  FlatList
} from 'react-native';

import ListItem from '../ListItem/ListItem';

const ListContainer = ({ places, onItemSelected }) => {
  return (
    <FlatList 
      style={styles.listContainer}
      data={places}
      renderItem={info => 
        <ListItem
          place={ info.item }
          handleClick={() => onItemSelected(info.item.key)}
        />
      }
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    width: '100%'
  }
});

export default ListContainer;