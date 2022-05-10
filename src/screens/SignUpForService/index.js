import React from "react";
import {
    View,
    Keyboard,
    StyleSheet,
    Platform,
    TouchableWithoutFeedback,
    ToastAndroid, DeviceEventEmitter,
} from "react-native";
import {Button, HStack, Icon, IconButton, KeyboardAvoidingView, Text, Select} from "native-base";
import constants from "../../config/styles";
import {ButtonSpinner} from "../../components"
import {Ionicons, MaterialCommunityIcons} from "@expo/vector-icons";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import axios from "../../helpers/axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {totalSize} from "react-native-dimension";

export default class SignUpForService extends React.Component {
    listeners = [];

    constructor(props, content) {
        super(props, content);

        this.state = {
            date: new Date(),
            dateTime: null,
            master: null,

            masters: [],
            mastersFilter: [],

            id: this.props.route.params.id,
            name: this.props.route.params.name,
            description: this.props.route.params.description,
            price: this.props.route.params.price,

            showDatePicker: false,
            showTimePicker: false,
            mode: 'date',

            selectValue: null,
            loading: false,
        }
    }

    async componentDidMount() {
        await this.getToken();
        await this.getService();

        this.listeners.push(
            Keyboard.addListener('keyboardDidShow', this._keyboardDidShow),
            Keyboard.addListener('keyboardDidHide', this._keyboardDidHide),
        )
    }

    async componentDidUpdate(prevProps, prevState) {
        if(prevProps.route.params.id !== this.props.route.params.id) {
            await this.getToken();

            this.setState({
                date: new Date(),
                dateTime: null,
                master: null,

                masters: [],
                mastersFilter: [],

                id: this.props.route.params.id,
                name: this.props.route.params.name,
                description: this.props.route.params.description,
                price: this.props.route.params.price,

                showDatePicker: false,
                showTimePicker: false,
                mode: 'date',

                selectValue: null,
                loading: false,
            })

            await this.getService();
        }
    }

    _keyboardDidShow = () => {

    };

    _keyboardDidHide = () => {
        //if (this.textInput?._root) this.textInput._root.blur();
    };

    getToken = async () => {
        let token = await AsyncStorage.getItem('token');
        let userId = await AsyncStorage.getItem('userId');

        this.setState({
            token: token,
            userId: userId,
        });
    };

    getMasters = async () => {
        let params = {
            api_token: this.state.token,
        };

        axios.get('http://app-langosh.wf2jtbscmm-eqg35n2o83xn.p.runcloud.link/api/masters', {params})
            .then(res => {
                let masters = res.data.data ? res.data.data : res.data;

                let mastersFilter = masters.filter(item => {
                    if (this.state.name === 'Маникюр' && item.job_title === 'Мастер маникюра') return item
                    else if (this.state.name === 'Педикюр' && item.job_title === 'Мастер педикюра') return item
                    else if (this.state.name === 'Наращивание ресниц' && item.job_title === 'Мастер наращивания ресниц') return item
                    else if (this.state.name === 'Массаж' && item.job_title === 'Массажист') return item
                    else if (this.state.name === 'Инъекции' && item.job_title === 'Косметолог') return item
                })

                mastersFilter.map(item => {
                    item.fullName = item.last_name + ' ' + item.first_name;
                })

                this.setState({
                    masters: masters,
                    mastersFilter: mastersFilter,
                    refreshing: false,
                })
            })
            .catch(error => {
                console.log(error);
            })
    };

    getService = async () => {
        let id = this.state.id;

        let params = {
            api_token: this.state.token,
        };

        console.log('id ', id)
        axios.get('http://app-langosh.wf2jtbscmm-eqg35n2o83xn.p.runcloud.link/api/services/' + id, {params})
            .then(res => {
                let service = res.data.data ? res.data.data : res.data;
                let masters = service[0].master;

                masters.map(item => {
                    item.fullName = item.last_name + ' ' + item.first_name;
                })

                this.setState({
                    masters: masters,
                    refreshing: false,
                })
            })
            .catch(error => {
                console.log(error);
            })
    };

    formatDate = (date) => {
        let formattedDate = `${date.getFullYear()}-${("0"+(date.getMonth()+1)).slice(-2)}-${("0" + date.getDate()).slice(-2)}T${("0" + date.getHours()).slice(-2)}:${("0" + date.getMinutes()).slice(-2)}:${("0" + date.getSeconds()).slice(-2)}.000000Z`
        return formattedDate;
    }

    createOrder = () => {
        let params = {
            api_token: this.state.token,
            user_id: this.state.userId,
            master_id: this.state.selectValue,
            service_id: this.state.id,
            time: this.state.dateTime,
        };

        console.log('PARAMS ', params)

        axios.post(`http://app-langosh.wf2jtbscmm-eqg35n2o83xn.p.runcloud.link/api/orders`, null, {params})
            .then(res => {
                ToastAndroid.show('Запись упешно создана', ToastAndroid.SHORT);
                DeviceEventEmitter.emit('reloadRecordsPage');
                this.props.navigation.goBack()
            })
            .catch(error => {
                console.log(error);
            })
    };

    onChangeDateTime = (event, selectedDate) => {
        const currentDate = selectedDate || this.state.date;
        const formattedDate = format(currentDate, "yyyy-MM-dd HH:mm:00");

        if (this.state.showDatePicker && Platform.OS === 'android') {
            this.setState({
                date: currentDate,
                dateTime: formattedDate,
                showDatePicker: false,
                showTimePicker: true,
            })
        } else if (this.state.showTimePicker && Platform.OS === 'android') {
            this.setState({
                date: currentDate,
                dateTime: formattedDate,
                showTimePicker: false,
            })
        } else if (this.state.showDatePicker && Platform.OS === 'ios') {
            this.setState({
                date: currentDate,
                dateTime: formattedDate,
            })
        }
    };

    onTextChange = (text) => {
        console.log('On change ', text)
        this.setState({
            dateTime: text,
        })
    };

    showDatePicker = () => {
        this.setState({
            showDatePicker: true,
        })
    };

    setMaster = (value) => {
        this.setState({
            selectValue: value,
        })
    };

    renderHeader = () => {
        const {name} = this.props.route.params;

        return(
            <HStack bg={constants.colors.PINK} py="3" justifyContent="flex-start" alignItems="center" w="100%" h="55" position="absolute">
                <IconButton icon={<Icon size="lg" as={Ionicons} name="arrow-back-outline" color="white" />} onPress={() => this.props.navigation.goBack()}/>
                <Text color="white" fontSize={totalSize(2.5)} style={styles.latoHeader}>
                    {name}
                </Text>
            </HStack>
        )
    };

    render() {
        const {name, description, price} = this.props.route.params;
        const {showDatePicker, showTimePicker, dateTime, selectValue, loading, masters} = this.state;

        return(
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.containerSmall}>
                        {this.renderHeader()}
                        <View style={styles.containerTop}>
                            <Text style={styles.textHeader}>
                                ЗАПИСЬ НА ПРОЦЕДУРУ:
                            </Text>
                            <Text style={styles.description}>
                                {description}
                            </Text>
                            <Text style={styles.description}>
                                Цена: {price}
                            </Text>

                            <View style={styles.inputContainer}>
                                <View style={styles.inputFormContainer}>
                                    {dateTime !== null
                                        ? <Text style={styles.input}>
                                            {dateTime}
                                        </Text>
                                        : <Text style={styles.inputText}>
                                            Дата/время
                                        </Text>
                                    }
                                    <Button style={styles.roundButton} onPress={this.showDatePicker}>
                                        <Icon size="5" as={MaterialCommunityIcons} name="calendar" color={constants.colors.white} style={{marginHorizontal: 10}}/>
                                    </Button>
                                </View>

                                {showDatePicker && Platform.OS === 'android' && (
                                    <RNDateTimePicker
                                        testID="datePicker"
                                        value={this.state.date}
                                        mode={'date'}
                                        is24Hour={true}
                                        display="default"
                                        onChange={this.onChangeDateTime}
                                    />
                                )}

                                {showTimePicker && Platform.OS === 'android' && (
                                    <RNDateTimePicker
                                        testID="timePicker"
                                        value={this.state.date}
                                        mode={'time'}
                                        is24Hour={true}
                                        display="default"
                                        onChange={this.onChangeDateTime}
                                    />
                                )}

                                {showDatePicker && Platform.OS === 'ios' && (
                                    <RNDateTimePicker
                                        testID="datePicker"
                                        value={this.state.date}
                                        mode={'datetime'}
                                        is24Hour={true}
                                        display="default"
                                        onChange={this.onChangeDateTime}
                                        style={{width: '100%', marginBottom: 20}}
                                    />
                                )}
                                <Select
                                    placeholder="Мастер"
                                    selectedValue={selectValue}
                                    width={"100%"}
                                    onValueChange={(value) => this.setMaster(value)}
                                >
                                    {masters.map((item, index) => (
                                        <Select.Item key={index} label={item.fullName} value={item.id}/>
                                    ))}
                                </Select>
                            </View>
                        </View>

                        <View style={styles.buttonContainer}>
                            <ButtonSpinner
                                label={'ЗАПИСАТЬСЯ'}
                                onPress={this.createOrder}
                                disabled={!dateTime || !selectValue}
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
        backgroundColor: constants.colors.background,
    },
    containerSmall: {
        flex: 1,
        backgroundColor: constants.colors.background,
        alignItems: "center",
        justifyContent: "space-between",
    },
    containerTop: {
        width: "100%",
        alignItems: "center",
        marginTop: 65,
    },
    containerPicker: {
        flex: .90,
        backgroundColor: constants.colors.white,
        height: 45,
        borderBottomWidth: 1,
        borderBottomColor: constants.colors.GREY,
        marginBottom: 35,
    },
    description: {
        width: "100%",
        fontFamily: "Mulish-Regular",
        fontSize: totalSize(2),
        //textAlign: "center",
        paddingHorizontal: 20,
        marginBottom: 10,
    },
    latoHeader: {
        fontFamily: "Lato-Regular",
    },
    textHeader: {
        fontFamily: "Mulish-Regular",
        fontSize: totalSize(2.5),
        marginTop: 20,
        marginBottom: 20,
    },
    inputText: {
        paddingHorizontal: 10,
        color: constants.colors.GREY,
    },
    input: {
        paddingHorizontal: 10,
    },
    inputContainer: {
        width: "80%",
        paddingVertical: 20,
    },
    buttonContainer: {
        width: "80%",
        paddingVertical: 20,
    },
    inputFormContainer: {
        height: 45,
        borderBottomWidth: 1,
        borderRadius: 5,
        borderColor: constants.colors.GREY,
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
        flexDirection: "row",
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
    roundButton: {
        backgroundColor: constants.colors.PINK,
        width: 30,
        height: 30,
        borderRadius: 15,
    },
})