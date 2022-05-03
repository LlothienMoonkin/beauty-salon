import React from "react";
import {StyleSheet, TouchableOpacity} from "react-native";
import constants from "../../config/styles";
import {Text} from "native-base";

export default class ServiceCard extends React.Component {
    render() {
        const {name, onPress} = this.props;

        return(
            <TouchableOpacity style={styles.container} onPress={onPress}>
                <Text style={styles.text}>
                    {name}
                </Text>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: constants.colors.background,
        height: 70,
        width: "30%",
        minWidth: 95,
        borderColor: constants.colors.PINK,
        borderRadius: 10,
        borderWidth: 1.5,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 2,
        marginVertical: 5,
        marginHorizontal: 5,
    },
    text: {
        color: constants.colors.PINK,
        textAlign: "center",
        fontFamily: "Mulish-Bold",
        fontSize: 12,
    }
})