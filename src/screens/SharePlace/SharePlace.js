import React, { Component } from 'react';
import {
  StyleSheet,
  ScrollView, 
  View,
  Button,
  ActivityIndicator
} from 'react-native';
import { connect } from 'react-redux';

import validate from '../../utility/validation';
import { addPlace, startAddPlace } from '../../store/actions/index';

import PickLocation from '../../components/PickLocation/PickLocation';
import PickImage from '../../components/PickImage/PickImage';
import PlaceInput from '../../components/PlaceInput/PlaceInput';

import MainText from '../../components/UI/MainText/MainText';
import HeadingText from '../../components/UI/HeadingText/HeadingText';

class SharePlaceScreen extends Component {
  static navigatorStyle = {
    navBarButtonColor: 'orange'
  };

  constructor(props) {
    super(props);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);

  }

  UNSAFE_componentWillMount() {
    this.reset();
  }

  componentDidUpdate() {
    if (this.props.placeAdded) {
      this.props.navigator.switchToTab({ tabIndex: 0 });
    }
  }

  reset = () => {
    this.setState({
      controls: {
        placeName: {
          value: '',
          valid: false,
          validationRules: {
            isBlank: true
          },
          touched: false
        },
        location: {
          value: null,
          valid: false
        },
        image: {
          value: null,
          valid: false
        }
      }
    });
  }

  onNavigatorEvent = event => {
    // using the react-native-navigation event to run logic whenever the screen is active, in this case, running a dispatch to reset the placeAddded value to false so that a new place can be added before the redirect happens
    if (event.type === 'ScreenChangedEvent') {
      if ( event.id === 'willAppear') {
        this.props.onStartAddPlace();
      }
    }

    if (event.type === 'NavBarButtonPress') {
      if (event.id === 'sideDrawerToggle') {
        this.props.navigator.toggleDrawer({
          side: 'left'
        });
      }
    }
  }

  placeAddedHandler = () => {
    this.props.onAddPlace(
      this.state.controls.placeName.value,
      this.state.controls.location.value,
      this.state.controls.image.value
    );

    this.reset();
    this.imagePicker.reset();
    this.locationPicker.reset();
  }

  placeNameChangeHandler = val => {
    this.setState(prevState => {
      return {
        controls: {
          ...prevState.controls,
          placeName: {
            ...prevState.controls.placeName,
            value: val,
            valid: validate(val, prevState.controls.placeName.validationRules),
            touched: true
          }
        }
      };
    });
  }

  locationPickedHandler = location => {
    this.setState(prevState => {
      return {
        controls: {
          ...prevState.controls,
          location: {
            value: location,
            valid: true
          }
        }
      };
    });
  }

  imagePickedHandler = image => {
    this.setState(prevState => {
      return {
        controls: {
          ...prevState.controls,
          image: {
            value: image,
            valid: true
          }
        }
      };
    });
  }

  render () {
    let submitButton = (
      <Button
        title="Share this Place!"
        onPress={this.placeAddedHandler}
        disabled={
          !this.state.controls.placeName.valid ||
        !this.state.controls.location.valid ||
        !this.state.controls.image.valid
        }
      />
    );

    if (this.props.isLoading) {
      submitButton = (
        <ActivityIndicator />
      );
    }

    return (
      <ScrollView>
        <View style={styles.container}>
          <MainText>
            <HeadingText>Share a Place with us!</HeadingText>
          </MainText>
          
          <PickImage 
            onImagePick={this.imagePickedHandler}
            ref={node => this.imagePicker = node}
          />

          <PickLocation 
            onLocationPick={this.locationPickedHandler}
            ref={node => this.locationPicker = node}
          />
          <PlaceInput 
            placeData={this.state.controls.placeName}
            onChangeText={this.placeNameChangeHandler}
          />

          <View style={styles.button}>
            { submitButton }
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  }
});

const mapStateToProps = state => {
  return {
    isLoading: state.ui.isLoading,
    placeAdded: state.places.placeAdded
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onAddPlace: (placeName, location, image) => dispatch(addPlace(placeName, location, image)),
    onStartAddPlace: () => dispatch(startAddPlace())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SharePlaceScreen);