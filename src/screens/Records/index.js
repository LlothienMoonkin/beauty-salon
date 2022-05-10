import React from "react";
import {
    View,
    Keyboard,
    StyleSheet,
    RefreshControl,
    FlatList,
    ScrollView,
    DeviceEventEmitter,
    ToastAndroid
} from "react-native";
import {Button, HStack, Modal, Text} from "native-base";
import constants from "../../config/styles";
import axios from "../../helpers/axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RecordCard from "../../components/RecordCard";
import {totalSize} from "react-native-dimension";

export default class Records extends React.Component {
    listeners = [];

    constructor(props, content) {
        super(props, content);

        this.state = {
            records: [],

            visibleDelete: false,
        };
    }

    async componentDidMount() {
        await this.getToken();
        this.getRecords();

        this.listeners.push(
            DeviceEventEmitter.addListener('reloadRecordsPage', () => {
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

    getRecords = () => {
        let params = {
            api_token: this.state.token,
        };

        axios.get('http://app-langosh.wf2jtbscmm-eqg35n2o83xn.p.runcloud.link/api/orders', {params})
            .then(res => {
                let records = res.data.data ? res.data.data : res.data;

                this.setState({
                    records: records,
                    refreshing: false,
                })
            })
            .catch(error => {
                console.log(error);
            })
    };

    deleteRecord = () => {
        this.closeModalDelete();

        let id = this.state.idToDelete;

        let params = {
            api_token: this.state.token,
        };

        axios.delete('http://app-langosh.wf2jtbscmm-eqg35n2o83xn.p.runcloud.link/api/orders/' + id, {params})
            .then(res => {
                ToastAndroid.show('Запись удалена', ToastAndroid.SHORT);
                DeviceEventEmitter.emit('reloadRecordsPage');
            })
            .catch(error => {
                console.log(error);
            })
    };

    openModalDelete = (id) => {
        this.setState({
            visibleDelete: true,

            idToDelete: id,
        })
    };

    closeModalDelete = () => {
        this.setState({
            visibleDelete: false,
        })
    };

    _onRefresh = () => {
        this.setState({
            refreshing: true,
            records: [],
        }, () => {
            this.getRecords();
        });
    };

    renderHeader = () => {
        return(
            <HStack bg={constants.colors.PINK} px="5" py="3" justifyContent="space-between" alignItems="center" w="100%" h="55" position="absolute">
                <Text color="white" fontSize={totalSize(2.5)} style={styles.latoHeader}>
                    Записи
                </Text>
            </HStack>
        )
    };

    render() {
        const {records, visibleDelete} = this.state;

        return(
            <View style={styles.container}>
                {this.renderHeader()}
                {records.length === 0 &&
                    <Text style={styles.text}>
                        У вас нет текущих записей
                    </Text>
                }
                <FlatList
                    data={records}
                    onEndReached={this.onEndReached}
                    onEndReachedThreshold={2}
                    keyExtractor={(item, key) => key.toString()}
                    overScrollMode={'never'}
                    style={{width: "100%"}}
                    renderItem={({ item, index }) => (
                        <RecordCard
                            key={index}
                            firstName={item.master.first_name}
                            lastName={item.master.last_name}
                            patronymic={item.master.patronymic}
                            title={item.service.title}
                            time={item.time}
                            onPress={() => this.openModalDelete(item.id)}
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

                <Modal isOpen={visibleDelete} onClose={this.closeModalDelete} size="lg">
                    <Modal.Content maxH="212">
                        <Modal.Header>Отменить запись?</Modal.Header>
                        <Modal.Body>
                            <ScrollView>
                                <Text>
                                    Это действие нельзя отменить. Вам нужно будет записаться снова
                                </Text>
                            </ScrollView>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button.Group space={2}>
                                <Button variant="ghost" colorScheme='rgb(239,97,145)' onPress={this.closeModalDelete}>
                                    Отмена
                                </Button>
                                <Button colorScheme='rgb(239,97,145)' onPress={this.deleteRecord}>
                                    Да
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
        paddingTop: 75,
    },
    containerItems: {
        alignItems: "center",
        marginTop: 65,
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
    }
})