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
import {Ionicons, MaterialCommunityIcons} from "@expo/vector-icons";
import axios from "../../helpers/axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {FormTextInput} from "../../components";

export default class EditServices extends React.Component {
    listeners = [];

    constructor(props, content) {
        super(props, content);

        this.state = {
            id: this.props.route.params.id,
            title: '',
            description: '',
            price: '',

            refreshing: true,

            visibleSave: false,
            visibleDelete: false,
        };
    }

    async componentDidMount() {
        await this.getToken();
        await this.getService(this.state.id);

        this.listeners.push(
            Keyboard.addListener('keyboardDidShow', this._keyboardDidShow),
            Keyboard.addListener('keyboardDidHide', this._keyboardDidHide),
        )
    }

    async componentDidUpdate(prevProps, prevState) {
        if(prevProps.route.params.id !== this.props.route.params.id) {
            const id = this.props.route.params.id;

            await this.getToken();

            this.setState({
                title: '',
                description: '',
                price: '',

                refreshing: true,
            }, () => {
                this.getService(id);
            })
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

    getService = (id) => {
        let params = {
            api_token: this.state.token,
        };

        axios.get('http://app-langosh.wf2jtbscmm-eqg35n2o83xn.p.runcloud.link/api/services/' + id, {params})
            .then(res => {
                let service = res.data.data ? res.data.data : res.data;

                this.setState({
                    title: service[0].title,
                    description: service[0].description,
                    price: service[0].price.toString(),

                    refreshing: false,
                })
            })
            .catch(error => {
                console.log(error);
            })
    };

    editService = () => {
        this.closeModalSave();

        let id = this.state.id;

        let params = {
            api_token: this.state.token,
            title: this.state.title,
            description: this.state.description,
            price: parseInt(this.state.price),
        };

        axios.put(`http://app-langosh.wf2jtbscmm-eqg35n2o83xn.p.runcloud.link/api/services/${id}`, null, {params})
            .then(res => {
                ToastAndroid.show('Изменения сохранены', ToastAndroid.SHORT);
                this._onRefresh(id);
            })
            .catch(error => {
                console.log(error);
            })
    };

    deleteService = () => {
        this.closeModalDelete();

        let id = this.state.id;

        let params = {
            api_token: this.state.token,
        };

        axios.delete(`http://app-langosh.wf2jtbscmm-eqg35n2o83xn.p.runcloud.link/api/services/${id}`, {params})
            .then(res => {
                ToastAndroid.show('Услуга удалена', ToastAndroid.SHORT);
                DeviceEventEmitter.emit('reloadServicesPage');
                this.props.navigation.goBack();
            })
            .catch(error => {
                console.log(error);
            })
    };

    _onRefresh = (id) => {
        this.setState({
            refreshing: true,
        }, () => {
            this.getService(id);
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

    openModalSave = () => {
        this.setState({
            visibleSave: true,
        })
    };

    closeModalSave = () => {
        this.setState({
            visibleSave: false,
        })
    };

    openModalDelete = () => {
        this.setState({
            visibleDelete: true,
        })
    };

    closeModalDelete = () => {
        this.setState({
            visibleDelete: false,
        })
    };

    goToMain = () => {
        this.props.navigation.goBack();
    };

    renderHeader = () => {
        return(
            <HStack bg={constants.colors.PINK} py="3" justifyContent="space-between" alignItems="center" w="100%" h="55" position="absolute">
                <Box flexDirection="row" alignItems="center">
                    <IconButton icon={<Icon size="lg" as={Ionicons} name="arrow-back-outline" color="white" />} onPress={this.goToMain}/>
                    <Text color="white" fontSize="20" style={styles.latoHeader}>
                        {this.state.title}
                    </Text>
                </Box>
                <Box flexDirection="row" alignItems="center">
                    <IconButton px="3" icon={<Icon size="lg" as={Ionicons} name="save" color="white" />} onPress={this.openModalSave}/>
                    <IconButton px="3" icon={<Icon size="7" as={MaterialCommunityIcons} name="delete-forever" color="white" />} onPress={this.openModalDelete}/>
                </Box>
            </HStack>
        )
    };

    render() {
        const {title, description, price, titleTouched, descriptionTouched, priceTouched, visibleSave, visibleDelete} = this.state;

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

                <Modal isOpen={visibleSave} onClose={this.closeModalSave} size="lg">
                    <Modal.Content maxH="212">
                        <Modal.Header>Сохранить изменения?</Modal.Header>
                        <Modal.Body>
                            <ScrollView>
                                <Text>
                                    Это действие нельзя отменить
                                </Text>
                            </ScrollView>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button.Group space={2}>
                                <Button variant="ghost" colorScheme='rgb(239,97,145)' onPress={this.closeModalSave}>
                                    Отмена
                                </Button>
                                <Button colorScheme='rgb(239,97,145)' onPress={this.editService}>
                                    Сохранить
                                </Button>
                            </Button.Group>
                        </Modal.Footer>
                    </Modal.Content>
                </Modal>

                <Modal isOpen={visibleDelete} onClose={this.closeModalDelete} size="lg">
                    <Modal.Content maxH="212">
                        <Modal.Header>Удалить услугу?</Modal.Header>
                        <Modal.Body>
                            <ScrollView>
                                <Text>
                                    Это действие нельзя отменить
                                </Text>
                            </ScrollView>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button.Group space={2}>
                                <Button variant="ghost" colorScheme='rgb(239,97,145)' onPress={this.closeModalDelete}>
                                    Отмена
                                </Button>
                                <Button colorScheme='rgb(239,97,145)' onPress={this.deleteService}>
                                    Удалить
                                </Button>
                            </Button.Group>
                        </Modal.Footer>
                    </Modal.Content>
                </Modal>
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