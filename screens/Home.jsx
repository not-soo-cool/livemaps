import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, Platform, TouchableOpacity } from 'react-native'
import MapView, { Callout, Marker, Polyline } from 'react-native-maps'
import * as Location from 'expo-location';
import { useLowPowerMode } from 'expo-battery';
import { Dialog } from 'react-native-paper';

const Home = () => {

    const [currentLocation, setCurrentLocation] = useState({ latitude: 0, longitude: 0 });

    // if(currentLocation.latitude === 0 && currentLocation.longitude === 0){
    //     console.log("Current Location is 0");
    //     Location.getCurrentPositionAsync({})
    //     .then(result => {
    //         console.log(result);
    //         setCurrentLocation({'latitude': result.coords.latitude, 'longitude': result.coords.longitude})
    //     })
    //     // fetchLocation();
    // }

    const lowPower = useLowPowerMode();

    const [activLocation, setActivLocation] = useState({});

    const [openDialog, setOpenDialog] = useState(false);

    const [coordinates, setCoordinates] = useState([]);

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
        console.log(coordinates.length)
    }, 100);

    useEffect(() => {
        requestLocationPermissions();
        if(currentLocation.latitude === 0 && currentLocation.longitude === 0){
            fetchLocation();
        }
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
                    latitude: currentLocation.latitude !== 0 ? currentLocation.latitude : 26.7845 ,
                    longitude: currentLocation.latitude !== 0 ? currentLocation.longitude : 79.4324,
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

                {coordinates.length > 1 && 
                (coordinates.map((coord, index) => {

                    const nextCoord = coordinates[index + 1];
                    if (nextCoord) {
                        const midpoint = calculateMidpoint(coord, nextCoord);
                        const rotation = calculateRotation(coord, nextCoord);

                        return (
                            
                            <Marker
                                key={index}
                                coordinate={midpoint}
                                anchor={{ x: 0.5, y: 0.5 }}
                                rotation={rotation}
                            >
                                <View style={styles.triangleMarker}>
                                </View>
                            </Marker>
                            
                        );
                    }
                    return null;
                }))}
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