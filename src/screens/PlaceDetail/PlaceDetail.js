import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  Platform,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { connect } from 'react-redux';

import Icon from 'react-native-vector-icons/Ionicons';
import { deletePlace } from '../../store/actions/index';

import MapView from 'react-native-maps';

class PlaceDetailScreen extends Component {
  state = {
    viewMode: 'portrait'
  }

  constructor(props) {
    super(props);
    Dimensions.addEventListener('change', this.updateStyles);
  }

  componentWillUnmount() {
    Dimensions.removeEventListener('change', this.updateStyles);
  }

  updateStyles = dims => {
    this.setState({
      viewMode: dims.window.height > 500 ? 'portrait': 'landscape'
    });
  }

  placeDeletedHandler = () => {
    this.props.onDeletePlace(this.props.selectedPlace.key);
    this.props.navigator.pop();
  };

  render () {
    const location = this.props.selectedPlace.location;

    const mapLocation = {
      ...location,
      latitudeDelta: 0.0122,
      longitudeDelta: 
        Dimensions.get('window').width /
        Dimensions.get('window').height *
        0.0122
    };
    
    return (
      <View style={[
        styles.container, 
        this.state.viewMode === 'portrait' ? styles.portraitContainer : styles.landscapeContainer
      ]}>
        <View style={styles.placeDetailContainer}>
          <View style={styles.subContainer}>
            <Image
              style={styles.placeImage}
              source={ this.props.selectedPlace.image } 
            />
          </View>
          <View style={styles.subContainer}>
            <MapView
              initialRegion={mapLocation}
              style={styles.map}
            >
              <MapView.Marker coordinate={location} />
            </MapView>
          </View>
        </View>
        <View style={styles.subContainer}>
          <View>
            <Text style={styles.placeName}>
              { this.props.selectedPlace.name }
            </Text>
          </View>
          <View>
            <TouchableOpacity onPress={this.placeDeletedHandler}>
              <View style={styles.deleteButton}>
                <Icon
                  name={Platform.OS === 'android' ? 'md-trash' : 'ios-trash'}
                  color='red'
                  size={30}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View> 
      </View>
    );
  }
}
 
const styles = StyleSheet.create({
  container: {
    margin: 22,
    flex: 1
  },
  portraitContainer: {
    flexDirection: 'column'
  },
  landscapeContainer: {
    flexDirection: 'row'
  },
  placeDetailContainer: {
    flex: 2
  },
  subContainer: {
    flex: 1
  },
  map: {
    ...StyleSheet.absoluteFillObject
  },
  placeImage: {
    width: '100%',
    height: '100%'
  },
  placeName: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 28
  },
  deleteButton: {
    alignItems: 'center'
  }
});

const mapDispatchToProps = dispatch => {
  return {
    onDeletePlace: key => dispatch(deletePlace(key))
  };
};

export default connect(null, mapDispatchToProps)(PlaceDetailScreen);