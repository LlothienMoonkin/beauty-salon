import React from "react";
import {View, Keyboard, StyleSheet, Platform, ScrollView, ToastAndroid, DeviceEventEmitter} from "react-native";
import {Box, HStack, Icon, IconButton, Select, Spinner, Text} from "native-base";
import constants from "../../config/styles";
import {ButtonSpinner, FormTextInput} from "../../components";
import {Ionicons} from "@expo/vector-icons";
import axios from "../../helpers/axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default class AddMaster extends React.Component {
    listeners = [];

    constructor(props, content) {
        super(props, content);

        this.state = {
            firstName: '',
            lastName: '',
            patronymic: '',
            description: '',
            email: '',
            jobTitle: '',
            phone: '',

            services: [],
            serviceId: null,

            loading: false,
        };
    }

    async componentDidMount() {
        await this.getToken();
        this.getServices();

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
                description: '',
                email: '',
                jobTitle: '',
                phone: '',

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

    onTextChange = (name, text) => {
        this.setState({[name]: text}, () => {
            if (this.props.onValueChange) {
                this.props.onValueChange(this.state);
            }
        })
    };

    handleFirstNameBlur = () => {
        this.setState({firstNameTouched: true});
    };

    handleLastNameBlur = () => {
        this.setState({lastNameTouched: true});
    };

    handleJobTitleBlur = () => {
        this.setState({jobTitleTouched: true});
    };

    goToMasters = () => {
        this.setState({
            update: true,
        })

        this.props.navigation.navigate('Мастера')
    };

    addMaster = () => {
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

        axios.post(`http://app-langosh.wf2jtbscmm-eqg35n2o83xn.p.runcloud.link/api/masters`, null, {params})
            .then(res => {
                let master = res.data.data ? res.data.data : res.data;
                console.log('master id ', master.id)
                this.attachMaster(this.state.serviceId, master.id);
            })
            .catch(error => {
                console.log(error);
            })
    };

    getServices = () => {
        let params = {
            api_token: this.state.token,
        };

        axios.get('http://app-langosh.wf2jtbscmm-eqg35n2o83xn.p.runcloud.link/api/services', {params})
            .then(res => {

                this.setState({
                    services: res.data.data ? res.data.data : res.data,
                    refreshing: false,
                })
            })
            .catch(error => {
                console.log(error);
            })
    };

    setService = (value) => {
        console.log('service id ', value)
        this.setState({
            serviceId: value,
        })
    };

    attachMaster = (serviceId, masterId) => {
        let params = {
            api_token: this.state.token,
            master_id: masterId,
            service_id: serviceId,
        };

        console.log('params ', params)

        axios.post('http://app-langosh.wf2jtbscmm-eqg35n2o83xn.p.runcloud.link/api/master-service', null, {params})
            .then(res => {
                ToastAndroid.show('Мастер упешно создан', ToastAndroid.SHORT);
                DeviceEventEmitter.emit('reloadMastersPage');
                this.goToMasters();
            })
            .catch(error => {
                console.log(error);
            })
    };

    renderHeader = () => {
        return(
            <HStack bg={constants.colors.PINK} py="3" justifyContent="space-between" alignItems="center" w="100%" h="55" position="absolute">
                <Box flexDirection="row" alignItems="center">
                    <IconButton icon={<Icon size="lg" as={Ionicons} name="arrow-back-outline" color="white" />} onPress={this.goToMasters}/>
                    <Text color="white" fontSize="20" style={styles.latoHeader}>
                        Добавить мастера
                    </Text>
                </Box>
            </HStack>
        )
    };

    render() {
        const {firstName, lastName, patronymic, description, email, jobTitle, phone, services, serviceId, loading, firstNameTouched, lastNameTouched, jobTitleTouched} = this.state;

        const firstNameError = !firstName && firstNameTouched
            ? 'Обязательное поле'
            : undefined;

        const lastNameError = !lastName && lastNameTouched
            ? 'Обязательное поле'
            : undefined;

        const jobTitleError = !jobTitle && jobTitleTouched
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
                            onBlur={this.handleJobTitleBlur}
                            error={jobTitleError}
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
                    <Select
                        placeholder="Услуга"
                        selectedValue={serviceId}
                        width={"70%"}
                        onValueChange={(value) => this.setService(value)}
                        marginBottom={2}
                    >
                        {services.map((item, index) => (
                            <Select.Item key={index} label={item.title} value={item.id}/>
                        ))}
                    </Select>
                </ScrollView>

                <ButtonSpinner
                    label={'СОЗДАТЬ'}
                    onPress={this.addMaster}
                    disabled={!firstName || !lastName || !jobTitle || !serviceId}
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