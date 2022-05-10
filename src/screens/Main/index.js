import React from "react";
import {View, Keyboard, StyleSheet, Image, TouchableOpacity, DeviceEventEmitter, ScrollView} from "react-native";
import {Button, HStack, Icon, IconButton, Spinner, Text} from "native-base";
import constants from "../../config/styles";
import imageLogo from "../../../assets/logo.png";
import {ServiceCard} from "../../components"
import axios from "../../helpers/axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Ionicons, MaterialCommunityIcons, MaterialIcons} from "@expo/vector-icons";
import {height, totalSize, width} from 'react-native-dimension'

const SERVER = 'http://app-langosh.wf2jtbscmm-eqg35n2o83xn.p.runcloud.link/api';

export default class Main extends React.Component {
    listeners = [];

    constructor(props, content) {
        super(props, content);

        this.state = {
            services: [],

            refreshing: true,
        };
    }

    async componentDidMount() {
        await this.getToken();
        await this.getServices();

        this.listeners.push(
            DeviceEventEmitter.addListener('reloadServicesPage', () => {
                this._onRefresh();
            }),
            Keyboard.addListener('keyboardDidShow', this._keyboardDidShow),
            Keyboard.addListener('keyboardDidHide', this._keyboardDidHide),
        )
    }

    _keyboardDidShow = () => {

    };

    _keyboardDidHide = () => {
        //if (this.textInput?._root) this.textInput._root.blur();
    };

    _onRefresh = () => {
        this.setState({
            refreshing: true,
            services: [],
        }, () => {
            this.getServices();
        });
    };

    getToken = async () => {
        let token = await AsyncStorage.getItem('token');
        let role = await AsyncStorage.getItem('userRole');

        this.setState({
            token: token,
            role: role,
        });
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

    renderHeader = () => {
        return(
            <HStack bg={constants.colors.PINK} px="5" py="3" justifyContent="space-between" alignItems="center" w="100%" h="55">
                <Text color="white" fontSize={totalSize(2.5)} style={styles.latoHeader}>
                    Главная
                </Text>
            </HStack>
        )
    };

    render() {
        const {services, role} = this.state;

        if (this.state.refreshing) {
            return(
                <View style={styles.containerLoading}>
                    {this.renderHeader()}
                    <Spinner color={constants.colors.PINK} size="lg" py="3"/>
                </View>
            )
        }

        return(
            <View style={styles.container}>
                {this.renderHeader()}
                <ScrollView style={{}} contentContainerStyle={{alignItems: "center", height: height(100)}}>
                    <Image source={imageLogo} style={styles.logo}/>
                    <Text style={styles.latoText}>
                        Подчеркни свою красоту в нашем салоне
                    </Text>
                    <Text style={styles.textHeader}>
                        УСЛУГИ:
                    </Text>
                    <View style={{justifyContent: "center"}}>
                        <View style={styles.segment}>
                            {services.map((item, index) => (
                                <ServiceCard key={index} name={item.title} onPress={() => {
                                    role === 'user' ?
                                        this.props.navigation.navigate('Запись', {
                                            id: item.id,
                                            name: item.title,
                                            description: item.description,
                                            price: item.price,
                                        })
                                        :
                                        this.props.navigation.navigate('EditServices', {
                                            id: item.id,
                                        });
                                }}/>
                            ))}
                            {role ==='admin' &&
                            <TouchableOpacity style={styles.buttonAdd} onPress={() => this.props.navigation.navigate('AddServices')}>
                                <Icon size="10" as={MaterialCommunityIcons} name="plus" color={constants.colors.PINK} style={{marginHorizontal: 10}}/>
                            </TouchableOpacity>
                            }
                        </View>
                    </View>
                    <Button style={styles.button} onPress={() => {
                        this.props.navigation.navigate('Инфо');
                    }}>
                        <Text style={styles.textButton}>О САЛОНЕ</Text>
                    </Button>
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: constants.colors.background,
    },
    containerLoading: {
        flex: 1,
        backgroundColor: constants.colors.background,
        alignItems: "center",
    },
    containerSmall: {
        flex: 1,
        backgroundColor: constants.colors.background,
        alignItems: "center",
    },
    logo: {
        height: height(15),
        maxHeight: height(15),
        resizeMode: "contain",
        alignSelf: "center",
        marginVertical: 30,
    },
    latoText: {
        fontFamily: "Lato-ThinItalic",
        fontSize: totalSize(2.5),
        textAlign: "center",
    },
    latoHeader: {
        fontFamily: "Lato-Regular",
    },
    textHeader: {
        fontFamily: "Mulish-Regular",
        fontSize: totalSize(2.5),
        marginTop: 50,
        marginBottom: 20,
    },
    segment: {
        flexWrap: "wrap",
        width: "100%",
        flexDirection: "row",
        //paddingHorizontal: 20,
        paddingVertical: 10,
    },
    button: {
        backgroundColor: constants.colors.PINK,
        width: 250,
        height: 40,
        marginBottom: 20,
        marginTop: 50,
    },
    textButton: {
        color: constants.colors.white,
        fontFamily: "Mulish-Bold",
        fontSize: totalSize(2),
    },
    buttonAdd: {
        backgroundColor: constants.colors.background,
        height: 70,
        width: width(28),
        borderColor: constants.colors.PINK,
        borderRadius: 10,
        borderWidth: 1.5,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 2,
        marginVertical: 5,
        marginHorizontal: 5,
    },
})