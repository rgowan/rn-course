import React, { Component } from 'react';

import { connect } from 'react-redux';

import { authLogout } from '../../store/actions/index';

import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  Platform,
  TouchableOpacity
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

class SideDrawer extends Component {
  render () {
    return (
      <View style={[styles.container, { width: Dimensions.get('window').width * 0.8 }]}>
        <TouchableOpacity onPress={this.props.onLogout}>
          <View style={styles.drawerItem}>
            <Icon
              name={Platform.OS === 'android' ? 'md-log-out' : 'ios-log-out'}
              color='#aaa'
              size={30}
              style={styles.drawerItemIcon}
            />
            <Text>Sign out</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: '#fff'
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#eee'
  },
  drawerItemIcon: {
    marginRight: 10
  }
});

const mapDispatchToProps = dispatch => {
  return {
    onLogout: () => dispatch(authLogout())
  };
};

export default connect(null, mapDispatchToProps)(SideDrawer);
