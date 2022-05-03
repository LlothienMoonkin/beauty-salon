import { NavigationContainer } from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {
    Login,
} from "../screens/index";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import constants from "../config/styles";
import TabBar from './tabBar'

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
    const config = {
        animation: 'spring',
        config: {
            stiffness: 1000,
            damping: 500,
            mass: 3,
            overshootClamping: true,
            restDisplacementThreshold: 0.01,
            restSpeedThreshold: 0.01,
        },
    };

    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Login" component={Login} options={{
                    headerShown: false,
                    transitionSpec: {
                        open: config,
                        close: config,
                    },
                }}/>
                <Stack.Screen name="TabBar" component={TabBar} options={{
                    transitionSpec: {
                        open: config,
                        close: config,
                    },
                    headerShown: false,
                    cardStyle: {backgroundColor: constants.colors.PINK},
                }}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
}