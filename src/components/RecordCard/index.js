import React from "react";
import {StyleSheet, View} from "react-native";
import constants from "../../config/styles";
import {Icon, IconButton, Text} from "native-base";
import {Ionicons, MaterialCommunityIcons} from "@expo/vector-icons";


export default class RecordCard extends React.Component {
    render() {
        const {firstName, lastName, patronymic, title, time, onPress} = this.props;

        return(
            <View style={styles.container}>
                <View style={styles.containerText}>
                    <Text style={styles.textBold}>
                        {lastName} {firstName}{"\n"}{patronymic}
                    </Text>
                    <Text style={styles.textRegular}>
                        {title}
                    </Text>
                    <Text style={styles.textRegularGrey}>
                        {time}
                    </Text>
                </View>
                <IconButton icon={<Icon size="8" as={MaterialCommunityIcons} name="delete-forever" color={constants.colors.PINK} />} onPress={onPress}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "90%",
        height: 125,
        backgroundColor: constants.colors.white,
        borderRadius: 10,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
        elevation: 3,
        alignSelf: "center",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    containerText: {
        justifyContent: "center",
        marginLeft: 10
    },
    textBold: {
        fontFamily: "Mulish-Bold",
        fontSize: 16,
        marginBottom: 5,
    },
    textRegular: {
        fontFamily: "Mulish-Regular",
        fontSize: 14,
        marginBottom: 5,
    },
    textRegularGrey: {
        fontFamily: "Mulish-Regular",
        fontSize: 14,
        color: constants.colors.GREY,
    },
})