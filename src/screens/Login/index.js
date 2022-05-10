import * as React from "react";
import {
    StyleSheet,
    Keyboard,
    View,
    DeviceEventEmitter,
    Platform, TouchableWithoutFeedback,
    Image, ToastAndroid,
} from "react-native";
import constants from "../../config/styles";
import {
    Icon,
    KeyboardAvoidingView,
    Text,
} from "native-base";
import {StatusBar} from "expo-status-bar";
import {ButtonSpinner, FormTextInput} from "../../components";
import imageLogo from "../../../assets/logo.png";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {CommonActions} from "@react-navigation/native";
import axios from "../../helpers/axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default class Login extends React.Component {
    passwordInputRef = React.createRef();

    constructor(props, content) {
        super(props, content);

        this.state = {
            email: "",
            password: "",
            emailTouched: false,
            passwordTouched: false,
            secureText: true,
            loading: false,

            role: 'admin',
            isKeyboadVisible: false,
        };
    }

    async componentDidMount() {
        this.keyboardDidShowListener = Keyboard.addListener(
            "keyboardDidShow",
            this._keyboardDidShow
        );
        this.keyboardDidHideListener = Keyboard.addListener(
            "keyboardDidHide",
            this._keyboardDidHide
        );
    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    _keyboardDidShow = () => {
        this.setState({
            isKeyboadVisible: true
        });
    };

    _keyboardDidHide = () => {
        this.setState({
            isKeyboadVisible: false
        });
    };

    getUsers = async () => {

    };

    handleEmailChange = (email) => {
        this.setState({email: email});
    };

    handlePasswordChange = (password) => {
        this.setState({password: password});
    };

    handleEmailSubmitPress = () => {
        if (this.passwordInputRef.current) {
            this.passwordInputRef.current.focus();
        }
    };

    handleEmailBlur = () => {
        this.setState({emailTouched: true});
    };

    handlePasswordBlur = () => {
        this.setState({passwordTouched: true});
    };

    handleLoginPress = (role) => {
        this.props.navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{
                    name: 'TabBar',
                    params: {
                        screen: 'Главная',
                        userRole: role,
                    },
                }]
            })
        )
    };

    login = async () => {
        try {
            let params = {
                email: this.state.email,
                password: this.state.password,
            };

            let res = await axios.post(`http://app-langosh.wf2jtbscmm-eqg35n2o83xn.p.runcloud.link/api/login`, null, {params})

            console.log('user ', res.data.data ? res.data.data : res.data)
            await this.setUser(res.data.data ? res.data.data : res.data)

            this.handleLoginPress(res.data.role);
        } catch (error) {
            console.log('error ', error)
        }
    };

    setUser = async (user) => {
        try {
            await AsyncStorage.multiSet([
                ['userId', JSON.stringify(user.id)],
                ['userRole', user.role,],
                ['token', user.api_token,],
            ]);
        } catch (error) {
            console.log('error ', error)
            ToastAndroid.show('Пользователя не существует', ToastAndroid.SHORT);
            this.setState({
                email: "",
                password: "",
            })
        }
    };

    render() {
        const {
            email,
            password,
            emailTouched,
            passwordTouched,
            loading,
        } = this.state;

        const emailError = !email && emailTouched
                ? 'Обязательное поле'
                : undefined;

        const passwordError = !password && passwordTouched
                ? 'Обязательное поле'
                : undefined;

        return(
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <StatusBar
                    barStyle="dark-content"
                    backgroundColor={constants.colors.white}
                />
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.form}>
                        {!this.state.isKeyboadVisible &&
                            <Image source={imageLogo} style={styles.logo}/>
                        }
                        <View style={styles.block}>
                            <FormTextInput
                                value={this.state.email}
                                onChangeText={this.handleEmailChange}
                                onSubmitEditing={this.handleEmailSubmitPress}
                                placeholder={'Email'}
                                autoCorrect={false}
                                keyboardType="email-address"
                                returnKeyType="next"
                                onBlur={this.handleEmailBlur}
                                error={emailError}
                                blurOnSubmit={Platform.OS === "ios"}
                                autoCompleteType={"email"}
                                style={{marginBottom: 15}}
                            />

                            <FormTextInput
                                ref={this.passwordInputRef}
                                value={this.state.password}
                                onChangeText={this.handlePasswordChange}
                                placeholder={'Password'}
                                w={{
                                    base: "100%",
                                    md: "25%"
                                }}
                                type={this.state.secureText ? 'password' : 'text'}
                                InputRightElement={
                                    <Icon name={this.state.secureText ? "eye-off" : "eye"}
                                          as={MaterialCommunityIcons}
                                          onPress={() => this.setState(state => {
                                              return {secureText: !state.secureText};
                                          })}
                                          style={{
                                              color: constants.colors.PINK,
                                              marginBottom: 3
                                          }}
                                          size={7}
                                    />}
                                returnKeyType="done"
                                onBlur={this.handlePasswordBlur}
                                error={passwordError}
                                autoCompleteType={"password"}
                                onSubmitEditing={() => {if (!(!email || !password)) this.handleLoginPress()}}
                            />

                            <ButtonSpinner
                                label={'ВОЙТИ'}
                                onPress={this.login}
                                disabled={!email || !password}
                                loading={loading}
                            />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: constants.colors.white,
        alignItems: "center",
        justifyContent: "space-between"
    },
    logo: {
        flex: 1,
        width: "80%",
        resizeMode: "contain",
        alignSelf: "center",
        justifyContent: "center",
    },
    block: {
        flex: 1,
        justifyContent: "flex-end",
        marginBottom: 50
    },
    form: {
        flex: 1,
        justifyContent: "flex-end",
        alignSelf: "center",
        width: "90%",
    },
    signUpContainer: {
        marginTop: 10,
        flexDirection: "row",
        justifyContent: "center",
    },
});