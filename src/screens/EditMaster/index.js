import React from "react";
import {View, Keyboard, StyleSheet, Image, Platform, ScrollView, ToastAndroid, DeviceEventEmitter} from "react-native";
import {Box, Button, HStack, Icon, IconButton, Modal, Spinner, Text} from "native-base";
import constants from "../../config/styles";
import logo from "../../../assets/user-avatar.jpg";
import {FormTextInput} from "../../components";
import {Ionicons, MaterialCommunityIcons} from "@expo/vector-icons";
import axios from "../../helpers/axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {totalSize} from "react-native-dimension";

export default class EditMaster extends React.Component {
    listeners = [];

    constructor(props, content) {
        super(props, content);

        this.state = {
            id: this.props.route.params.id,
            firstName: '',
            lastName: '',
            patronymic: '',
            description: '',
            email: '',
            jobTitle: '',
            phone: '',

            refreshing: true,

            visibleSave: false,
            visibleDelete: false,
        };
    }

    async componentDidMount() {
        await this.getToken();
        this.getMaster(this.state.id);

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
                id: id,
                firstName: '',
                lastName: '',
                patronymic: '',
                description: '',
                email: '',
                jobTitle: '',
                phone: '',

                refreshing: true,
            }, () => {
                this.getMaster(id);
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

    getMaster = (id) => {
        let params = {
            api_token: this.state.token,
        };

        axios.get('http://app-langosh.wf2jtbscmm-eqg35n2o83xn.p.runcloud.link/api/masters/' + id, {params})
            .then(res => {
                console.log(res.data.data ? res.data.data : res.data);
                const master = res.data.data ? res.data.data : res.data;

                this.setState({
                    firstName: master[0].first_name,
                    lastName: master[0].last_name,
                    patronymic: master[0].patronymic,
                    description: master[0].description,
                    email: master[0].email,
                    jobTitle: master[0].job_title,
                    phone: master[0].phone,

                    refreshing: false,
                })
            })
            .catch(error => {
                console.log(error);
            })
    };

    editMaster = () => {
        this.closeModalSave();

        let id = this.state.id;

        let params = {
            api_token: this.state.token,
            first_name: this.state.firstName,
            last_name: this.state.lastName,
            patronymic: this.state.patronymic,
            description: this.state.description,
            email: this.state.email,
            job_title: this.state.jobTitle,
            phone: this.state.phone,
        };

        axios.put(`http://app-langosh.wf2jtbscmm-eqg35n2o83xn.p.runcloud.link/api/masters/${id}`, null, {params})
            .then(res => {
                ToastAndroid.show('Изменения сохранены', ToastAndroid.SHORT);
                this._onRefresh(id);
            })
            .catch(error => {
                console.log(error);
            })
    };

    deleteMaster = () => {
        this.closeModalDelete();

        let id = this.state.id;

        let params = {
            api_token: this.state.token,
        };

        axios.delete(`http://app-langosh.wf2jtbscmm-eqg35n2o83xn.p.runcloud.link/api/masters/${id}`, {params})
            .then(res => {
                ToastAndroid.show('Мастер удален', ToastAndroid.SHORT);
                DeviceEventEmitter.emit('reloadMastersPage');
                this.props.navigation.navigate('Мастера');
            })
            .catch(error => {
                console.log(error);
            })
    };

    _onRefresh = (id) => {
        this.setState({
            refreshing: true,
        }, () => {
            this.getMaster(id);
        })
    };

    onTextChange = (name, text) => {
        this.setState({[name]: text})

        console.log('STATE ', this.state)
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

    renderHeader = () => {
        return(
            <HStack bg={constants.colors.PINK} py="3" justifyContent="space-between" alignItems="center" w="100%" h="55" position="absolute">
                <Box flexDirection="row" alignItems="center">
                    <IconButton icon={<Icon size="lg" as={Ionicons} name="arrow-back-outline" color="white" />} onPress={() => this.props.navigation.navigate('Мастера')}/>
                    <Text color="white" fontSize={totalSize(2.5)} style={styles.latoHeader}>
                        {this.state.lastName} {this.state.firstName}
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
        const {firstName, lastName, patronymic, description, email, jobTitle, phone, visibleSave, visibleDelete} = this.state;

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
                <ScrollView style={{width: "100%"}} contentContainerStyle={{alignItems: "center"}}>
                    <View style={styles.form}>
                        <Image style={styles.userImage} source={logo}/>
                        <FormTextInput
                            value={lastName}
                            onChangeText={(text) => this.onTextChange('lastName', text)}
                            placeholder={'Фамилия'}
                            autoCorrect={false}
                            keyboardType="default"
                            returnKeyType="next"
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
                            blurOnSubmit={Platform.OS === "ios"}
                            style={{marginBottom: 5}}
                        />
                        <FormTextInput
                            value={phone}
                            onChangeText={(text) => this.onTextChange('phone', text)}
                            placeholder={'Телефон'}
                            autoCorrect={false}
                            keyboardType="default"
                            returnKeyType="next"
                            blurOnSubmit={Platform.OS === "ios"}
                            style={{marginBottom: 5}}
                        />
                        <FormTextInput
                            value={jobTitle}
                            onChangeText={(text) => this.onTextChange('jobTitle', text)}
                            placeholder={'Должность'}
                            autoCorrect={false}
                            keyboardType="default"
                            returnKeyType="next"
                            blurOnSubmit={Platform.OS === "ios"}
                            style={{marginBottom: 5}}
                        />
                        <FormTextInput
                            value={description}
                            onChangeText={(text) => this.onTextChange('description', text)}
                            placeholder={'Описание'}
                            autoCorrect={false}
                            keyboardType="default"
                            returnKeyType="next"
                            blurOnSubmit={Platform.OS === "ios"}
                            style={{marginBottom: 5}}
                            styleInput={{height: 60}}
                            multiline={true}
                        />
                    </View>
                </ScrollView>

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
                                <Button colorScheme='rgb(239,97,145)' onPress={this.editMaster}>
                                    Сохранить
                                </Button>
                            </Button.Group>
                        </Modal.Footer>
                    </Modal.Content>
                </Modal>

                <Modal isOpen={visibleDelete} onClose={this.closeModalDelete} size="lg">
                    <Modal.Content maxH="212">
                        <Modal.Header>Удалить мастера?</Modal.Header>
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
                                <Button colorScheme='rgb(239,97,145)' onPress={this.deleteMaster}>
                                    Удалить
                                </Button>
                            </Button.Group>
                        </Modal.Footer>
                    </Modal.Content>
                </Modal>
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
        fontSize: totalSize(2),
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
        fontSize: totalSize(2),
    },
    userImage: {
        width: 125,
        height: 125,
        borderRadius: 25,
        marginBottom: 20,
        alignSelf: "center",
        marginTop: 20,
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