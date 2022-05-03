import React from "react";
import {
  Platform,
  StyleSheet,
  View
} from "react-native";
import {Spinner, Text, Button, Icon} from 'native-base';
import constants from "../../config/styles";


export default class ButtonSpinner extends React.Component {
  render() {

    const {disabled, label, onPress, loading, style, icon, typeIcon, white} = this.props;
    const containerStyle = [
      styles.container,
      style,
      disabled || loading
        ? styles.containerDisabled
        : styles.containerEnabled
    ];

    return (
      <Button block
              style={containerStyle}
              onPress={onPress}
              disabled={disabled || loading}
      >
        {loading
          ? <Spinner color='white' style={styles.text}/>
          : <View style={styles.insideButton}>
              {icon && <Icon name={icon} type={typeIcon} style={{marginRight: 0}}/>}
              <Text style={white ? styles.textWhite : styles.text}>{label.toLocaleUpperCase()}</Text>
            </View>
        }
      </Button>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: constants.colors.PINK,
    marginBottom: 12,
    paddingVertical: 12,
    borderRadius: 4,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: constants.colors.GREY,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,
      },
    }),
  },
  containerEnabled: {
    opacity: 1
  },
  containerDisabled: {
    opacity: 0.5
  },
  text: {
    color: constants.colors.white,
    textAlign: "center",
  },
  textWhite: {
    color: constants.colors.PINK,
    textAlign: "center",
  },
  insideButton: {
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: "center",
  }
});