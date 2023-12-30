import { isLowPowerModeEnabledAsync, useBatteryLevel, useBatteryState, useLowPowerMode } from 'expo-battery'
import React, { Component } from 'react'
import { Text, View } from 'react-native'

const Battery = () => {

    const batteryLevel = useBatteryLevel();
    const batteryState = useBatteryState();
    const isLow = isLowPowerModeEnabledAsync();
    const lowPower = useLowPowerMode();
    // console.log(isLow);
    // console.log(lowPower);

    return (
      <View>
        <Text> {batteryLevel} </Text>
        <Text> {batteryState} </Text>
        <Text> {lowPower ? "Saving Mode" : "Maze me"} </Text>
        {/* <Text> {isLow} </Text> */}
      </View>
    )
}

export default Battery
