import React from "react";
import {View, Keyboard, StyleSheet, Platform, ScrollView, ToastAndroid, DeviceEventEmitter} from "react-native";
import {Box, HStack, Icon, IconButton, Select, Spinner, Text} from "native-base";
import constants from "../../config/styles";
import {ButtonSpinner, FormTextInput} from "../../components";
import {Ionicons} from "@expo/vector-icons";
import axios from "../../helpers/axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default class AddClients extends React.Component {
    listeners = [];

    constructor(props, content) {
        super(props, content);

        this.state = {
            firstName: '',
            lastName: '',
            patronymic: '',
            role: '',
            email: '',
            password: '',
            phone: '',

            loading: false,
        };
    }

    async componentDidMount() {
        await this.getToken();

        this.listeners.push(
            Keyboard.addListener('keyboardDidShow', this._keyboardDidShow),
            Keyboard.addListener('keyboardDidHide', this._keyboardDidHide),
        )
    }

    async componentDidUpdate(prevProps, prevState) {
        if(prevState.update === true) {
            this.setState({
                firstName: '',
                lastName: '',
                patronymic: '',
                role: null,
                email: '',
                password: '',
                phone: '',

                update: false,
                errors: {},
            })

            await this.getToken();
        }
    }

    _keyboardDidShow = () => {

    };

    _keyboardDidHide = () => {
        //if (this.textInput?._root) this.textInput._root.blur();
    };

    getToken = async () => {
        let token = await AsyncStorage.getItem('token');

        this.setState({
            token: token,
        });
    };

    onTextChange = (name, text) => {
        this.setState({[name]: text})
    };

    handleFirstNameBlur = () => {
        this.setState({firstNameTouched: true});
    };

    handleLastNameBlur = () => {
        this.setState({lastNameTouched: true});
    };

    handlePatronymicBlur = () => {
        this.setState({patronymicTouched: true});
    };

    handleEmailBlur = () => {
        this.setState({emailTouched: true});
    };

    handlePasswordBlur = () => {
        this.setState({passwordTouched: true});
    };

    handlePhoneBlur = () => {
        this.setState({phoneTouched: true});
    };

    setClients = (value) => {
        this.setState({
            role: value,
        })
    };

    goToClients = () => {
        this.setState({
            update: true,
        })

        this.props.navigation.navigate('Клиенты')
    };

    addClient = () => {
        let params = {
            api_token: this.state.token,
            first_name: this.state.firstName,
            last_name: this.state.lastName,
            patronymic: this.state.patronymic,
            role: this.state.role,
            email: this.state.email,
            password: this.state.password,
            phone: this.state.phone,
        };

        axios.post(`http://app-langosh.wf2jtbscmm-eqg35n2o83xn.p.runcloud.link/api/users`, null, {params})
            .then(res => {
                ToastAndroid.show('Клиент упешно создан', ToastAndroid.SHORT);
                DeviceEventEmitter.emit('reloadClientsPage');
                this.goToClients();
            })
            .catch(error => {
                console.log(error.response.data);
            })
    };

    renderHeader = () => {
        return(
            <HStack bg={constants.colors.PINK} py="3" justifyContent="space-between" alignItems="center" w="100%" h="55" position="absolute">
                <Box flexDirection="row" alignItems="center">
                    <IconButton icon={<Icon size="lg" as={Ionicons} name="arrow-back-outline" color="white" />} onPress={this.goToClients}/>
                    <Text color="white" fontSize="20" style={styles.latoHeader}>
                        Добавить клиента
                    </Text>
                </Box>
            </HStack>
        )
    };

    render() {
        const {firstName, lastName, patronymic, email, password, phone, loading, role,
            firstNameTouched, lastNameTouched, patronymicTouched, emailTouched, passwordTouched, phoneTouched,} = this.state;

        const firstNameError = !firstName && firstNameTouched
            ? 'Обязательное поле'
            : undefined;

        const lastNameError = !lastName && lastNameTouched
            ? 'Обязательное поле'
            : undefined;

        const patronymicError = !patronymic && patronymicTouched
            ? 'Обязательное поле'
            : undefined;

        const emailError = !email && emailTouched
            ? 'Обязательное поле'
            : undefined;

        const passwordError = !password && passwordTouched
            ? 'Обязательное поле'
            : undefined;

        const phoneError = !phone && phoneTouched
            ? 'Обязательное поле'
            : undefined;

        if (this.state.refreshing) {
            return(
                <View style={styles.container}>
                    {this.renderHeader()}
                    <Spinner color={constants.colors.PINK} size="lg" py="3"/>
                </View>
            )
        }

        return(
            <View style={styles.container}>
                {this.renderHeader()}
                <ScrollView style={{width: "100%", paddingTop: 35}} contentContainerStyle={{alignItems: "center"}}>
                    <View style={styles.form}>
                        <FormTextInput
                            value={lastName}
                            onChangeText={(text) => this.onTextChange('lastName', text)}
                            placeholder={'Фамилия'}
                            autoCorrect={false}
                            keyboardType="default"
                            returnKeyType="next"
                            onBlur={this.handleLastNameBlur}
                            error={lastNameError}
                            blurOnSubmit={Platform.OS === "ios"}
                            style={{marginBottom: 5}}
                        />

                        <FormTextInput
                            value={firstName}
                            onChangeText={(text) => this.onTextChange('firstName', text)}
                            placeholder={'Имя'}
                            autoCorrect={false}
                            keyboardType="default"
                            returnKeyType="next"
                            onBlur={this.handleFirstNameBlur}
                            error={firstNameError}
                            blurOnSubmit={Platform.OS === "ios"}
                            style={{marginBottom: 5}}
                        />

                        <FormTextInput
                            value={patronymic}
                            onChangeText={(text) => this.onTextChange('patronymic', text)}
                            placeholder={'Отчество'}
                            autoCorrect={false}
                            keyboardType="default"
                            returnKeyType="next"
                            onBlur={this.handlePatronymicBlur}
                            error={patronymicError}
                            blurOnSubmit={Platform.OS === "ios"}
                            style={{marginBottom: 5}}
                        />

                        <Select
                            placeholder="Роль"
                            selectedValue={role}
                            width={"100%"}
                            onValueChange={(value) => this.setClients(value)}
                            marginBottom={2}
                        >
                            <Select.Item label={'Администратор'} value={'admin'}/>
                            <Select.Item label={'Клиент'} value={'user'}/>
                        </Select>

                        <FormTextInput
                            value={phone}
                            onChangeText={(text) => this.onTextChange('phone', text)}
                            placeholder={'Телефон'}
                            autoCorrect={false}
                            keyboardType="phone-pad"
                            returnKeyType="next"
                            onBlur={this.handlePhoneBlur}
                            error={phoneError}
                            blurOnSubmit={Platform.OS === "ios"}
                            style={{marginBottom: 5}}
                        />

                        <FormTextInput
                            value={email}
                            onChangeText={(text) => this.onTextChange('email', text)}
                            placeholder={'email'}
                            autoCorrect={false}
                            keyboardType="default"
                            returnKeyType="next"
                            onBlur={this.handleEmailBlur}
                            error={emailError}
                            blurOnSubmit={Platform.OS === "ios"}
                            style={{marginBottom: 5}}
                        />

                        <FormTextInput
                            value={password}
                            onChangeText={(text) => this.onTextChange('password', text)}
                            placeholder={'Пароль'}
                            autoCorrect={false}
                            keyboardType="default"
                            returnKeyType="next"
                            onBlur={this.handlePasswordBlur}
                            error={passwordError}
                            blurOnSubmit={Platform.OS === "ios"}
                            style={{marginBottom: 5}}
                        />
                    </View>
                </ScrollView>

                <ButtonSpinner
                    label={'СОЗДАТЬ'}
                    onPress={this.addClient}
                    disabled={!firstName || !lastName || !patronymic || !role || !phone || !email || !password}
                    loading={loading}
                    style={{width: "80%", marginBottom: 50}}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: constants.colors.background,
        alignItems: "center",
        paddingTop: 55,
    },
    latoHeader: {
        fontFamily: "Lato-Regular",
    },
    text: {
        fontFamily: "Mulish-Regular",
        fontSize: 16,
        marginTop: 10,
        marginBottom: 20,
        color: constants.colors.GREY,
    },
    button: {
        backgroundColor: constants.colors.PINK,
        width: 250,
        height: 40,
        marginBottom: 20,
    },
    textButton: {
        color: constants.colors.white,
        fontFamily: "Mulish-Bold",
        fontSize: 16,
    },
    userImage: {
        width: 125,
        height: 125,
        borderRadius: 25,
        marginBottom: 20,
        alignSelf: "center",
        marginTop: 10,
    },
    form: {
        flex: 1,
        width: "70%",
    },
    modalWrapper: {
        flex: 1,
        alignItems: "flex-end",
        justifyContent: "flex-start",
        marginTop: 40,
        marginRight: 20,
    },
    modal: {
        //height: height(30),
        width: "85%",
        backgroundColor: constants.colors.white,
        padding: 5,
        borderRadius: 3,
    },
})