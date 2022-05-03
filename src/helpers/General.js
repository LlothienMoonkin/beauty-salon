import {
  DeviceEventEmitter,
} from "react-native";

export default class General {

  static setSnack = ({text, type, delay = 5000, position = 'bottom'}) => {
    console.log('setSnack', text);
    let snack = '';
    if (typeof text === 'string') {
      snack = text;
    } else {
      let string = '';
      for (let [key, value] of Object.entries(text)) {
        if (typeof value === 'string') {
          string = `${string} ${key === 'message' || key === 'Error' ? value : ''}`
        } else if (value.length && Array.isArray(value) && typeof value !== 'string') {
          if (value.length > 10) {
            string = string + ''
          } else {
            value.forEach((val) => {
              if (typeof val === 'string') {
                string = string + val + ' '
              } else {
                for (let [k, v] of Object.entries(val)) {
                  if (typeof v === 'string' && k === 'message') {
                    string = string + v + ' '
                  }
                }
              }
            })
          }
        } else {
          for (let [name, str] of Object.entries(value)) {
            if (str.length && Array.isArray(str) && typeof str !== 'string') {
              str.forEach((s) => {
                if (typeof s === 'string') {
                  string = string + s + ' '
                } else {
                  for (let [k, v] of Object.entries(s)) {
                    if (typeof v === 'string' && k === 'message') {
                      string = string + v + ' '
                    }

                  }
                }
              })
            } else {
              if (name === 'message') string = string + str + ' '
            }
          }
        }
      }
      snack = string;
    }

    DeviceEventEmitter.emit('SnackBarOpen', {text: snack, type: type, duration: delay, position: position})
  };
}
