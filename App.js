import React from 'react';
import { Alert } from 'react-native';
import Loading from './Loading';
import * as Location from 'expo-location';
import axios from 'axios';
import Weather from './Weather';

const API_KEY = "46d891ba58426f062705656a5c28b212";

export default class extends React.Component {
  state = {
    isLoading: true
  };

  getWeather = async(latitude, longitude) => {
    const { data: {main : {temp}, weather} } = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&APPID=${API_KEY}&units=metric`
    );

    this.setState({isLoading: false, temp, condition: weather[0].main})
  }

  getLocation = async () => {

    try {
      const response = await Location.requestForegroundPermissionsAsync();
      console.log(response);
      const {
        coords : { latitude, longitude }
      } = await Location.getCurrentPositionAsync();
      this.getWeather(latitude, longitude);
      
    } catch (error) {
      console.log(error)
      Alert.alert("Can't find you.", "So sad!");
    }

  }
  componentDidMount() {
    this.getLocation();
  }
  render() {
    const { isLoading, temp, condition } = this.state;
    return (
      isLoading ? <Loading /> : <Weather temp={Math.round(temp)} condition={condition} />
    );
  }
}
