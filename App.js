import { StyleSheet } from 'react-native';
import {Component} from "react";
import {NativeBaseProvider} from 'native-base';
import RootNavigator from "./src/navigation";
import * as Font from "expo-font";

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      type: null,
      isInternetReachable: null,
      isConnected: null,
    };
  }

  async componentDidMount() {
    await Font.loadAsync({
      'Lato-Regular': require('./assets/fonts/Lato-Regular.ttf'),
      'Lato-LightItalic': require('./assets/fonts/Lato-LightItalic.ttf'),
      'Lato-ThinItalic': require('./assets/fonts/Lato-ThinItalic.ttf'),
      'Lato-Italic': require('./assets/fonts/Lato-Italic.ttf'),
      'Mulish-Bold': require('./assets/fonts/Mulish-Bold.ttf'),
      'Mulish-Regular': require('./assets/fonts/Mulish-Regular.ttf'),
      'Mulish-SemiBold': require('./assets/fonts/Mulish-SemiBold.ttf'),
    });
  };

  render() {
    return (
        <NativeBaseProvider>
          <RootNavigator/>
        </NativeBaseProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
