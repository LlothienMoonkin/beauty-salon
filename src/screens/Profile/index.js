import React from "react";
import {Image, View, Keyboard, StyleSheet} from "react-native";
import {Box, Button, HStack, Icon, Spinner, Text} from "native-base";
import constants from "../../config/styles";
import logo from "../../../assets/user-avatar.jpg";
import axios from "../../helpers/axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {MaterialCommunityIcons} from "@expo/vector-icons";

export default class Profile extends React.Component {
    listeners = [];

    constructor(props, content) {
        super(props, content);

        this.state = {
            firstName: '',
            lastName: '',
            patronymic: '',
            role: '',
            email: '',
            phone: '',

            refreshing: true,
        }
    }

    async componentDidMount() {
        await this.getUser();

        this.listeners.push(
            Keyboard.addListener('keyboardDidShow', this._keyboardDidShow),
            Keyboard.addListener('keyboardDidHide', this._keyboardDidHide),
        )
    }

    _keyboardDidShow = () => {

    };

    _keyboardDidHide = () => {
        //if (this.textInput?._root) this.textInput._root.blur();
    };

    getUser = async () => {
        let token = await AsyncStorage.getItem('token');
        let id = await AsyncStorage.getItem('userId');

        let params = {
            api_token: token,
        };

        axios.get('http://app-langosh.wf2jtbscmm-eqg35n2o83xn.p.runcloud.link/api/users/' + id, {params})
            .then(res => {
                const user = res.data.data ? res.data.data : res.data;

                console.log('user ', user)
                console.log('user ', typeof user)

                if (user[0] !== undefined) {
                    this.setState({
                        firstName: user[0].first_name,
                        lastName: user[0].last_name,
                        patronymic: user[0].patronymic,
                        role: user[0].role,
                        email: user[0].email,
                        phone: user[0].phone,

                        refreshing: false,
                    })
                } else {
                    this.setState({
                        firstName: user.first_name,
                        lastName: user.last_name,
                        patronymic: user.patronymic,
                        role: user.role,
                        email: user.email,
                        phone: user.phone,

                        refreshing: false,
                    })
                }
            })
            .catch(error => {
                console.log(error);
            })
    };

    renderHeader = () => {
        return(
            <HStack bg={constants.colors.PINK} px="5" py="3" justifyContent="space-between" alignItems="center" w="100%" h="55" position="absolute">
                <Text color="white" fontSize="20" style={styles.latoHeader}>
                    Профиль
                </Text>
            </HStack>
        )
    };

    render() {
        const {firstName, lastName, patronymic, role, email, phone} = this.state;

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
                <View style={styles.containerInfo}>
                    <View style={styles.containerImage}>
                        <Image style={styles.userImage} source={logo}/>
                        {role === 'admin' &&
                            <Box
                                position="absolute"
                                right={-5}
                                bottom={-5}
                                size={6}
                                backgroundColor="#F5F5F6"
                                borderRadius={20}
                            >
                                <Icon name="crown"
                                      size={6}
                                      as={MaterialCommunityIcons}
                                      color="#FFD700"
                                      alignSelf="center"
                                />
                            </Box>
                        }
                    </View>
                    {role === 'admin' &&
                        <Text style={styles.textSemiBoldAdmin}>
                            Администратор
                        </Text>
                    }
                    <Text style={styles.textSemiBold}>
                        {lastName} {firstName} {patronymic}
                    </Text>
                    <Text style={styles.textSemiBoldGrey}>
                        {email}
                    </Text>
                    <Text style={styles.textSemiBoldDarkGrey}>
                        {phone}
                    </Text>
                </View>

                <Button style={styles.button} onPress={() => {
                    this.props.navigation.navigate('Login');
                }}>
                    <Text style={styles.textButton}>ВЫЙТИ</Text>
                </Button>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: constants.colors.background,
        alignItems: "center",
        justifyContent: "space-between",
    },
    containerLoading: {
        flex: 1,
        backgroundColor: constants.colors.background,
        alignItems: "center",
    },
    containerInfo: {
        alignItems: "center",
        marginTop: 85,
    },
    latoHeader: {
        fontFamily: "Lato-Regular",
    },
    textSemiBold: {
        fontFamily: "Mulish-SemiBold",
        fontSize: 22,
        marginVertical: 5,
        textAlign: "center",
        paddingHorizontal: 20,
    },
    textSemiBoldGrey: {
        fontFamily: "Mulish-SemiBold",
        fontSize: 16,
        marginVertical: 5,
        color: constants.colors.GREY,
    },
    textSemiBoldDarkGrey: {
        fontFamily: "Mulish-SemiBold",
        fontSize: 16,
        marginVertical: 5,
        color: constants.colors.GREY_DARK
    },
    textSemiBoldAdmin: {
        fontFamily: "Mulish-SemiBold",
        fontSize: 14,
        marginVertical: 5,
        color: constants.colors.GREY_DARK
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
        //marginBottom: 20,
    },
    containerImage: {
        width: 125,
        height: 125,
        marginBottom: 20,
    },
})