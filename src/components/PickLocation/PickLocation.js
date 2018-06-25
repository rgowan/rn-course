import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  Button,
  Dimensions
} from 'react-native';

import MapView from 'react-native-maps';

class PickLocation extends Component {
  UNSAFE_componentWillMount() {
    this.reset();
  }
  
  reset = () => {
    this.setState({
      focusedLocation: {
        latitude: 51.5074,
        longitude: 0.1278,
        latitudeDelta: 0.0122,
        longitudeDelta: 
          Dimensions.get('window').width /
          Dimensions.get('window').height *
          0.0122
      },
      locationChosen: false
    });
  }

  pickLocationHandler = event => {
    const coords = event.nativeEvent.coordinate;
    
    this.map.animateToRegion({
      ...this.state.focusedLocation,
      latitude: coords.latitude,
      longitude: coords.longitude
    });

    this.setState(prevState => {
      return {
        focusedLocation: {
          ...prevState.focusedLocation,
          latitude: coords.latitude,
          longitude: coords.longitude
        },
        locationChosen: true
      };
    });

    this.props.onLocationPick({
      latitude: coords.latitude,
      longitude: coords.longitude
    });
  }

  getLocationHandler = () => {
    navigator.geolocation.getCurrentPosition(pos => {
      const coordsEvent = {
        nativeEvent: {
          coordinate: {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude
          }
        }
      };
      this.pickLocationHandler(coordsEvent);
    }, () => {
      alert('Fetching the position failed, please pick one manually.');
    });
  }

  render () {
    let marker = null;

    if (this.state.locationChosen) {
      marker = <MapView.Marker coordinate={this.state.focusedLocation} />;
    }

    return (
      <View style={styles.container}>
        <MapView 
          initialRegion={this.state.focusedLocation}
          region={
            !this.state.locationChosen ?
              this.state.focusedLocation :
              null
          }
          style={styles.map}
          onPress={this.pickLocationHandler}
          ref={node => this.map = node}
        >
          {marker}
        </MapView>
        <View style={styles.button}>
          <Button 
            title="Locate Me"
            onPress={this.getLocationHandler}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center'
  },
  map: {
    width: '100%',
    height: 250
  },
  button: {
    margin: 8
  }
});

export default PickLocation;