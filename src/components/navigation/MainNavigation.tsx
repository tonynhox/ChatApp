import { View, Text } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react'
import Login from '../screen/Login';
import Messenger from '../screen/Messenger';
import Register from '../screen/Register';
import { NavigationContainer } from '@react-navigation/native';
import ListUser from '../screen/ListUser';
const Stack = createStackNavigator();

const MainNavigation = () => {

    return(
        <NavigationContainer>
            <Stack.Navigator>
            <Stack.Screen name="login" component={Login} />
            <Stack.Screen name="messenger" component={Messenger} />
            <Stack.Screen name="register" component={Register} />
            <Stack.Screen name="listUser" component={ListUser} />
            
            </Stack.Navigator>
        </NavigationContainer>
    )   


    
}

export default MainNavigation