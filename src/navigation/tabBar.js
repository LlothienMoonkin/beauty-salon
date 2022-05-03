import React, {useState} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import constants from "../config/styles";
import {
    Main,
    Records,
    Profile,
    Masters,
    Clients,
    About,
    SignUpForService,
    EditMaster,
    EditClients,
    AddMaster,
    AddClients,
    EditServices,
    AddServices,
} from "../screens";
import {MaterialCommunityIcons} from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

export default function TabBar({route, navigation}) {
    let {userRole} = route.params;

    return(
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Главная') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Записи') {
                        iconName = focused ? 'calendar-month' : 'calendar-month-outline';
                    } else if (route.name === 'Профиль') {
                        iconName = focused ? 'account' : 'account-outline';
                    } else if (route.name === 'Услуги') {
                        iconName = focused ? 'hair-dryer' : 'hair-dryer-outline';
                    } else if (route.name === 'Мастера') {
                        iconName = focused ? 'badge-account' : 'badge-account-outline';
                    } else if (route.name === 'Клиенты') {
                        iconName = focused ? 'human-male-female' : 'human-male-female';
                    }

                    return <MaterialCommunityIcons name={iconName} color={color} size={size} />;
                },
                tabBarStyle: { height: 50, paddingBottom: 3 },
                headerShown: false,
                tabBarActiveTintColor: constants.colors.PINK,
                tabBarInactiveTintColor: constants.colors.GREY,
                tabBarActiveBackgroundColor: constants.colors.background,
                tabBarInactiveBackgroundColor: constants.colors.background,
                tabBarKeyboardHidesTabBar: true,
                tabBarShowLabel: true,
                tabBarLabelStyle: { fontSize: 12 }
            })}

            backBehaviour={'initialRoute'}
            initialRouteName="Main"
            keyboardHidesTabBar={true}
        >
            {userRole === 'user' &&
                <>
                    <Tab.Screen name="Главная" component={Main} options={{}}/>
                    <Tab.Screen name="Записи" component={Records} options={{}}/>
                    <Tab.Screen name="Профиль" component={Profile} options={{}}/>

                    <Tab.Screen name="Инфо" component={About} options={{
                        tabBarStyle: { display: 'none' },
                        tabBarButton: () => null
                    }}/>
                    <Tab.Screen name="Запись" component={SignUpForService} options={{
                        tabBarStyle: { display: 'none' },
                        tabBarButton: () => null
                    }}/>
                </>
            }
            {userRole === 'admin' &&
            <>
                <Tab.Screen name="Услуги" component={Main} options={{}}/>
                <Tab.Screen name="Мастера" component={Masters} options={{}}/>
                <Tab.Screen name="Клиенты" component={Clients} options={{}}/>
                <Tab.Screen name="Профиль" component={Profile} options={{}}/>

                <Tab.Screen name="Инфо" component={About} options={{
                    tabBarStyle: { display: 'none' },
                    tabBarButton: () => null
                }}/>

                <Tab.Screen name="EditMaster" component={EditMaster} options={{
                    tabBarStyle: { display: 'none' },
                    tabBarButton: () => null
                }}/>

                <Tab.Screen name="EditClients" component={EditClients} options={{
                    tabBarStyle: { display: 'none' },
                    tabBarButton: () => null
                }}/>

                <Tab.Screen name="EditServices" component={EditServices} options={{
                    tabBarStyle: { display: 'none' },
                    tabBarButton: () => null
                }}/>

                <Tab.Screen name="AddMaster" component={AddMaster} options={{
                    tabBarStyle: { display: 'none' },
                    tabBarButton: () => null
                }}/>

                <Tab.Screen name="AddClients" component={AddClients} options={{
                    tabBarStyle: { display: 'none' },
                    tabBarButton: () => null
                }}/>

                <Tab.Screen name="AddServices" component={AddServices} options={{
                    tabBarStyle: { display: 'none' },
                    tabBarButton: () => null
                }}/>
            </>
            }
        </Tab.Navigator>
    )
}