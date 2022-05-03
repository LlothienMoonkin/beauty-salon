import React from "react";
import {
    View,
    Keyboard,
    StyleSheet,
    ToastAndroid,
    DeviceEventEmitter,
    Platform,
    TouchableWithoutFeedback, ScrollView
} from "react-native";
import {Box, Button, HStack, Icon, IconButton, KeyboardAvoidingView, Modal, Select, Spinner, Text} from "native-base";
import constants from "../../config/styles";
import {Ionicons} from "@expo/vector-icons";
import axios from "../../helpers/axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {ButtonSpinner, FormTextInput} from "../../components";

export default class AddServices extends React.Component {
    listeners = [];

    constructor(props, content) {
        super(props, content);

        this.state = {
            title: '',
            description: '',
            price: '',

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
                title: '',
                description: '',
                price: '',

                update: false,
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

    addService = () => {
        let params = {
            api_token: this.state.token,
            title: this.state.title,
            description: this.state.description,
            price: parseInt(this.state.price),
        };

        axios.post(`http://app-langosh.wf2jtbscmm-eqg35n2o83xn.p.runcloud.link/api/services`, null, {params})
            .then(res => {
                ToastAndroid.show('Услуга упешно создана', ToastAndroid.SHORT);
                DeviceEventEmitter.emit('reloadServicesPage');
                this.props.navigation.goBack();
            })
            .catch(error => {
                console.log(error);
            })
    };

    onTextChange = (name, text) => {
        this.setState({[name]: text})
    };

    handleTitleBlur = () => {
        this.setState({titleTouched: true});
    };

    handleDescriptionBlur = () => {
        this.setState({descriptionTouched: true});
    };

    handlePriceBlur = () => {
        this.setState({priceTouched: true});
    };

    goToMain = () => {
        this.setState({
            update: true,
        })

        this.props.navigation.goBack();
    };

    renderHeader = () => {
        return(
            <HStack bg={constants.colors.PINK} py="3" justifyContent="space-between" alignItems="center" w="100%" h="55" position="absolute">
                <Box flexDirection="row" alignItems="center">
                    <IconButton icon={<Icon size="lg" as={Ionicons} name="arrow-back-outline" color="white" />} onPress={this.goToMain}/>
                    <Text color="white" fontSize="20" style={styles.latoHeader}>
                        Услуги
                    </Text>
                </Box>
            </HStack>
        )
    };

    render() {
        const {title, description, price, titleTouched, descriptionTouched, priceTouched, loading} = this.state;

        const titleError = !title && titleTouched
            ? 'Обязательное поле'
            : undefined;

        const descriptionError = !description && descriptionTouched
            ? 'Обязательное поле'
            : undefined;

        const priceError = !price && priceTouched
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
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                {this.renderHeader()}
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.form}>
                        <FormTextInput
                            value={title}
                            onChangeText={(text) => this.onTextChange('title', text)}
                            placeholder={'Название'}
                            autoCorrect={false}
                            keyboardType="default"
                            returnKeyType="next"
                            onBlur={this.handleTitleBlur}
                            error={titleError}
                            blurOnSubmit={Platform.OS === "ios"}
                            style={{marginBottom: 5, width: "70%"}}
                        />

                        <FormTextInput
                            value={price}
                            onChangeText={(text) => this.onTextChange('price', text)}
                            placeholder={'Цена'}
                            autoCorrect={false}
                            keyboardType="default"
                            returnKeyType="next"
                            onBlur={this.handlePriceBlur}
                            error={priceError}
                            blurOnSubmit={Platform.OS === "ios"}
                            style={{marginBottom: 5, width: "70%"}}
                        />

                        <FormTextInput
                            value={description}
                            onChangeText={(text) => this.onTextChange('description', text)}
                            placeholder={'Описание'}
                            autoCorrect={false}
                            keyboardType="default"
                            returnKeyType="next"
                            onBlur={this.handleDescriptionBlur}
                            error={descriptionError}
                            blurOnSubmit={Platform.OS === "ios"}
                            style={{marginBottom: 5, width: "70%"}}
                            styleInput={{height: 80}}
                            multiline={true}
                        />
                    </View>
                </TouchableWithoutFeedback>

                <ButtonSpinner
                    label={'СОЗДАТЬ'}
                    onPress={this.addService}
                    disabled={!title || !description || !price}
                    loading={loading}
                    style={{width: "80%", marginBottom: 50}}
                />
            </KeyboardAvoidingView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: constants.colors.background,
        alignItems: "center",
        paddingTop: 75,
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
    form: {
        flex: 1,
        width: "100%",
        alignItems: "center"
    },
})