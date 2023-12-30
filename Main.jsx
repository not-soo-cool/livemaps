import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import Home from './screens/Home'
import Battery from './screens/Battery'

const Stack = createNativeStackNavigator()

const Main = () => {
  
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName='home' >
                <Stack.Screen name='home' component={Home} />
                <Stack.Screen name='battery' component={Battery} />

            </Stack.Navigator>

        </NavigationContainer>
    )
}

export default Main
