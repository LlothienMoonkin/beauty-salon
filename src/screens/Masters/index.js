import React from "react";
import {View, Keyboard, StyleSheet, FlatList, RefreshControl, TouchableOpacity, DeviceEventEmitter} from "react-native";
import {Fab, HStack, Icon, Spinner, Text} from "native-base";
import constants from "../../config/styles";
import axios from "../../helpers/axios";
import {MasterCard} from "../../components";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {totalSize} from "react-native-dimension";

export default class Masters extends React.Component {
    listeners = [];

    constructor(props, content) {
        super(props, content);

        this.state = {
            masters: [],
            refreshing: true,
        };
    }

    async componentDidMount() {
        await this.getToken();
        this.getMasters();

        this.listeners.push(
            DeviceEventEmitter.addListener('reloadMastersPage', () => {
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

    getToken = async () => {
        let token = await AsyncStorage.getItem('token');

        this.setState({
            token: token,
        });
    };

    getMasters = () => {
        let params = {
            api_token: this.state.token,
        };

        axios.get('http://app-langosh.wf2jtbscmm-eqg35n2o83xn.p.runcloud.link/api/masters', {params})
            .then(res => {
                this.setState({
                    masters: res.data.data ? res.data.data : res.data,
                    refreshing: false,
                })
            })
            .catch(error => {
                console.log(error);
            })
    };

    _onRefresh = () => {
        this.setState({
            refreshing: true,
            masters: [],
        }, () => {
            this.getMasters();
        });
    };

    renderHeader = () => {
        return(
            <HStack bg={constants.colors.PINK} px="5" py="3" justifyContent="space-between" alignItems="center" w="100%" h="55" position="absolute">
                <Text color="white" fontSize={totalSize(2.5)} style={styles.latoHeader}>
                    Мастера
                </Text>
            </HStack>
        )
    };

    render() {
        const {masters} = this.state;

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
                {masters.length === 0 &&
                    <Text style={styles.text}>
                        У вас нет мастеров
                    </Text>
                }
                <FlatList
                    data={masters}
                    onEndReached={this.onEndReached}
                    onEndReachedThreshold={2}
                    keyExtractor={(item, key) => key.toString()}
                    overScrollMode={'never'}
                    renderItem={({ item, index }) => (
                        <MasterCard
                            key={index}
                            firstName={item.first_name}
                            lastName={item.last_name}
                            patronymic={item.patronymic}
                            jobTitle={item.job_title}
                            onPress={() => {
                                this.props.navigation.navigate('EditMaster', {
                                    id: item.id,
                                });
                            }}
                        />
                    )}
                    refreshControl={
                        <RefreshControl
                            colors={[constants.colors.PINK]}
                            progressBackgroundColor={constants.colors.white}
                            size={'large'}
                            progressViewOffset={55}
                            tintColor={constants.colors.PINK}
                            refreshing={this.state.refreshing}
                            onRefresh={this._onRefresh}
                        />
                    }
                >
                </FlatList>
                <TouchableOpacity
                    style={styles.fab}
                    onPress={() => {
                        this.props.navigation.navigate('AddMaster');
                    }}
                >
                    <Icon color="white" as={<MaterialCommunityIcons name="plus" />} size="8" />
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: constants.colors.background,
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
        alignSelf: "center",
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
    fab: {
        flex: 1,
        width: 56,
        height: 56,
        borderRadius: 28,
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: constants.colors.PINK,
        zIndex: 10,
        elevation: 3,
        alignItems: "center",
        justifyContent: "center",
    },
})