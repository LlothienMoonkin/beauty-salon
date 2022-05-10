import * as React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View
} from "react-native";
import {Box, Input} from 'native-base';
import constants from "../../config/styles";
import {totalSize} from "react-native-dimension";


class FormTextInput extends React.Component {
  state = {
    isFocused: false
  };

  focus = () => {
    if (this.textInputRef._root) {
      this.textInputRef._root.focus();
    }
  };

  handleFocus = (e) => {
    this.setState({isFocused: true});
    if (this.props.onFocus) {
      this.props.onFocus(e);
    }
  };

  handleBlur = (e) => {
    this.setState({isFocused: false});
    if (this.props.onBlur) {
      this.props.onBlur(e);
    }
  };

  render() {
    const {
      error,
      onFocus,
      onBlur,
      style,
      placeholder,
      render,
      value,
      styleInput,
      ...otherProps
    } = this.props;

    const {isFocused} = this.state;

    return (
      <View style={[styles.container, style]}>
        <Box style={{
          borderColor: isFocused ? constants.colors.PINK : constants.colors.GREY,
          borderBottomWidth: 1
        }}>
          <Input
              getRef={input => {
                this.textInputRef = input;
              }}
              style={[styles.textInput, styleInput]}
              onFocus={this.handleFocus}
              onBlur={this.handleBlur}
              variant={"unstyled"}
              placeholder={placeholder}
              value={value}
              {...otherProps}
          />
        </Box>
        <Text style={styles.errorText}>{error || ""}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 10
  },
  placeholder: {
    marginTop: -10,
    marginLeft: 6,
    fontFamily: 'Mulish-Regular',
    color: constants.colors.GREY_DARK,
  },
  textInput: {
    height: 40,
    fontSize: totalSize(1.8),
    ...Platform.select({
      ios: {
        borderColor: constants.colors.GREY,
        borderBottomWidth: StyleSheet.hairlineWidth
      },
      android: {
        paddingLeft: 6
      }
    })
  },
  errorText: {
    height: 20,
    fontFamily: 'Mulish-Regular',
    color: constants.colors.RED,
    ...Platform.select({
      android: {
        paddingLeft: 6
      }
    })
  }
});

export default FormTextInput;