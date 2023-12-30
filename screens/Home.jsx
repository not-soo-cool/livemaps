import { StatusBar } from 'expo-status-bar';
import React, { PureComponent, useEffect, useState } from 'react'
import { StyleSheet, Text, View, ScrollView, SafeAreaView, Platform, TouchableOpacity } from 'react-native'
import MapView, { Callout, Marker, Polyline } from 'react-native-maps'
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import { useLowPowerMode } from 'expo-battery';
import { Dialog, TextInput, Button } from 'react-native-paper';

const Home = () => {

    const lowPower = useLowPowerMode();

    const [activLocation, setActivLocation] = useState({});

    const [openDialog, setOpenDialog] = useState(false);

    const [currentLocation, setCurrentLocation] = useState({ latitude: 0, longitude: 0 });

    const [coordinates, setCoordinates] = useState([
        {latitude: 26.8025259, longitude: 79.4351431, op: false},
        {latitude: 26.7896386, longitude: 79.421646, op: false},
        {latitude: 26.7665248, longitude: 79.4161628, op: false},
        {latitude: 26.7734153, longitude: 79.4577787, op: false},
        {latitude: 26.7948605, longitude: 79.4596065, op: false},
    ]);

    const requestLocationPermissions = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
        console.error('Background location permission not granted!');
        return;
        }

        const { status: backgroundStatus} = await Location.requestBackgroundPermissionsAsync();
        if(backgroundStatus !== 'granted'){
        console.error('Background location permission not granted!');
        return;
        }
    }

    const fetchLocation = async () => {
        try {
          const location = await Location.getCurrentPositionAsync({});

          if(currentLocation.latitude !== location.coords.latitude || currentLocation.longitude !== location.coords.longitude){

              setCurrentLocation({'latitude': location.coords.latitude, 'longitude': location.coords.longitude});

              setCoordinates([...coordinates, {'latitude': location.coords.latitude, 'longitude': location.coords.longitude, 'op': false }]);
          }


        } catch (error) {
          console.error('Error fetching location:', error);
        }
    };

    setTimeout(() => {
        fetchLocation();
    }, 6000);

    useEffect(() => {
        requestLocationPermissions();
    }, []);

    const openCall = async (coord) => {
        await setActivLocation({'lat': coord.latitude, 'long': coord.longitude});
        setOpenDialog(!openDialog)
    }

    const hideDialog = () => {
        setOpenDialog(!openDialog);
    }

    const calculateMidpoint = (coord1, coord2) => {
        return {
          latitude: (coord1.latitude + coord2.latitude) / 2,
          longitude: (coord1.longitude + coord2.longitude) / 2,
        };
    };

    const calculateRotation = (coord1, coord2) => {
        const angle =
        (Math.atan2(coord1.longitude - coord2.longitude, coord1.latitude - coord2.latitude) * 180) / Math.PI;
        return angle;
    };


    return (
        <>
        <View
        style={{ backgroundColor: "#fff", flex: 1, paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0 }}
        >
            <TouchableOpacity style={lowPower ? styles.lowStat : styles.highStat}>
                    <Text>
                        {lowPower ? "Low Power Mode On" : "Low Power Mode Off"}
                    </Text>
            </TouchableOpacity>
            <MapView 
                style={styles.okay}
                region={{
                    latitude: 26.78825,
                    longitude: 79.4324,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            >
                <Polyline coordinates={coordinates} strokeWidth={3} 
                strokeColor='red' />

                {coordinates.map((coord, index) => (
                    <Marker
                        key={index}
                        coordinate={coord}
                        title={`Location ${index + 1}`}
                    >
                        <Callout onPress={() => openCall(coord, index)}>
                        </Callout>
                    </Marker>
                ))}

                {coordinates.map((coord, index) => {

                    const nextCoord = coordinates[index + 1];
                    if (nextCoord) {
                        const midpoint = calculateMidpoint(coord, nextCoord);
                        const rotation = calculateRotation(coord, nextCoord);

                        return (
                            
                            <Marker
                                key={index}
                                coordinate={midpoint}
                                // title={`Arrow ${index + 1}`}
                                // description="Direction Arrow"
                                anchor={{ x: 0.5, y: 0.5 }}
                                rotation={rotation}
                            >
                                <View style={styles.triangleMarker}>
                                </View>
                            </Marker>
                            
                        );
                    }
                    return null;
                })}
            </MapView>
        </View>

        <Dialog visible={openDialog} onDismiss={hideDialog} >
        <Dialog.Title>LOCATION INFO</Dialog.Title>
            <Dialog.Content>
                <View>
                    <Text>Latitude : {activLocation.lat}</Text>
                </View>
                <View>
                    <Text>Longitude : {activLocation.long}</Text>
                </View>

                <View style={styles.view}>
                    <TouchableOpacity onPress={hideDialog} style={styles.dialog}>
                        <Text>CLOSE</Text>
                    </TouchableOpacity>
                </View>
            </Dialog.Content>
        </Dialog>
</>


    )
}

export default Home

const styles = StyleSheet.create({
    okay:{
        flex: 0.99,
    },
    btn: {
        color: 'aqua',
        borderRadius: '5px'
    },
    directionMarker: {
        backgroundColor: 'red',
        borderRadius: 15,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    markerText: {
        color: 'white',
        fontWeight: 'bold',
    },
    lowStat: {
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        padding: 10,
        backgroundColor: 'yellow',
        backgroundColor: 'rgba(0, 0, 0, 0.4)'
    },
    highStat: {
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        padding: 10,
        backgroundColor: 'yellow',
    },
    arrowMarker: {
        backgroundColor: 'blue',
        borderRadius: 15,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    markerText: {
        color: 'white',
        fontWeight: 'bold',
    },
    triangleMarker: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderTopWidth: 15,
        borderTopColor: 'red',
        borderRightWidth: 10,
        borderRightColor: 'transparent',
        borderBottomWidth: 0,
        borderBottomColor: 'transparent',
        borderLeftWidth: 10,
        borderLeftColor: 'transparent',
    },
    dialog: {
        justifyContent: 'center',
        alignItems: 'center',
        // borderWidth: 2,
        // borderColor: 'red'
    },
    view: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 5
    }
})