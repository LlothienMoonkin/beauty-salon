import React from "react";
import {View, Keyboard, StyleSheet, Image, SafeAreaView} from "react-native";
import {Button, HStack, Icon, IconButton, ScrollView, Text} from "native-base";
import constants from "../../config/styles";
import imageLogo from "../../../assets/logo.png";
import {ServiceCard} from "../../components"
import {FontAwesome, Ionicons, MaterialCommunityIcons} from "@expo/vector-icons";
import {height, totalSize} from "react-native-dimension";

export default class About extends React.Component {
    listeners = [];

    constructor(props, content) {
        super(props, content);
    }

    async componentDidMount() {
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

    renderHeader = () => {
        return(
            <HStack bg={constants.colors.PINK} py="3" justifyContent="flex-start" alignItems="center" w="100%" h="55" position="absolute">
                <IconButton icon={<Icon size="lg" as={Ionicons} name="arrow-back-outline" color="white" />} onPress={() => this.props.navigation.goBack()}/>
                <Text color="white" fontSize={totalSize(2.5)} style={styles.latoHeader}>
                    О салоне
                </Text>
            </HStack>
        )
    };

    render() {
        return(
            <View style={styles.container}>
                {this.renderHeader()}
                <ScrollView style={{}} contentContainerStyle={{paddingHorizontal: 20}}>
                    <Image source={imageLogo} style={styles.logo}/>
                    <Text style={styles.latoText}>
                        Красота, комплименты, уверенность в себе — разве не каждый стремится к этим прекрасным вещам?
                        Все они станут для вас реальностью с салоном красоты и профессиональной косметики Beauty Line!
                        Наши косметологи, массажисты и nail-мастера — настоящие художники своего дела, которые помогут вам преобразиться внешне и внутренне.
                    </Text>
                    <Text style={styles.latoTextSmall}>
                        Время работы:{"\n"}
                        Пн-Вс: 10:00-20:00
                    </Text>
                    <Text style={styles.latoTextSmall}>
                        Адрес:{"\n"}
                        Орловская область, Орел, Комсомольская, 89
                        Район Заводской
                    </Text>
                    <Text style={styles.latoTextSmall}>
                        Телефон:{"\n"}
                        +91 99999 00000
                    </Text>
                    <View style={styles.social}>
                        <Icon size="10" as={MaterialCommunityIcons} name="instagram" color={constants.colors.PINK} style={{marginHorizontal: 10}}/>
                        <Icon size="10" as={FontAwesome} name="telegram" color={constants.colors.PINK} style={{marginHorizontal: 10}}/>
                        <Icon size="10" as={FontAwesome} name="whatsapp" color={constants.colors.PINK} style={{marginHorizontal: 10}}/>
                    </View>
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: constants.colors.background,
        paddingTop: 55,
        justifyContent: "space-between",
    },
    scrollView: {
        flex: 1,
        marginHorizontal: 20,
    },
    logo: {
        height: height(15),
        maxHeight: height(15),
        resizeMode: "contain",
        alignSelf: "center",
        marginVertical: 30,
    },
    latoText: {
        fontFamily: "Lato-LightItalic",
        fontSize: totalSize(2),
        marginVertical: 10,
    },
    latoTextSmall: {
        fontFamily: "Lato-LightItalic",
        fontSize: totalSize(1.8),
        marginVertical: 10,
    },
    latoHeader: {
        fontFamily: "Lato-Regular",
    },
    social: {
        flexDirection: "row",
        alignSelf: "center",
        marginBottom: 10,
        marginTop: 20,
    },
})