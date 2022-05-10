import React from "react";
import {Image, StyleSheet, TouchableOpacity, View} from "react-native";
import constants from "../../config/styles";
import logo from "../../../assets/user-avatar.jpg";
import {Text} from "native-base";
import {totalSize} from "react-native-dimension";


export default class MasterCard extends React.Component {
    render() {
        const {firstName, lastName, patronymic, jobTitle, onPress} = this.props;

        return(
            <TouchableOpacity style={styles.container} onPress={onPress}>
                <Image style={styles.userImage} source={logo}/>
                <View style={styles.containerText}>
                    <Text style={styles.textSemiBold}>
                        {lastName} {firstName}{"\n"}{patronymic}
                    </Text>
                    <Text style={styles.textSemiBoldGrey}>
                        {jobTitle}
                    </Text>
                </View>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        height: 125,
        backgroundColor: constants.colors.background,
        flexDirection: "row",
        borderBottomWidth: 0.8,
        borderColor: constants.colors.GREY,
        alignItems: "center",
        paddingHorizontal: 10,
        marginTop: 1,
    },
    containerText: {
        justifyContent: "center",
        marginLeft: 10
    },
    userImage: {
        width: 100,
        height: 100,
        borderRadius: 20,
    },
    textSemiBold: {
        fontFamily: "Mulish-SemiBold",
        fontSize: totalSize(2),
        marginVertical: 5,
    },
    textSemiBoldGrey: {
        fontFamily: "Mulish-SemiBold",
        fontSize: totalSize(1.9),
        marginVertical: 5,
        color: constants.colors.GREY,
    },
})