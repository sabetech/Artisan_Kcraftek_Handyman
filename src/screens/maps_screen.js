import React, {useState, useEffect} from "react";
import { View, StyleSheet, Dimensions } from 'react-native';
import * as Location from 'expo-location';
import MapView, {Marker} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { Card, Button,Title, Paragraph, Avatar } from 'react-native-paper';
import { Icon } from 'react-native-elements'
import { acceptTask, declineTask } from "../../api/firebase_functions";

export default function MapScreen({route, navigation}) {

    const [requestInfo, setRequestInfo] = useState({});
    const [artisanLocation, setArtisanLocation] = useState();
    const [errorMsg, setErrorMsg] = useState(null);

    useEffect(() => {

        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                Alert.alert("Permission Error", errorMsg)
                return;
            }
            
            try{
                let location = await Location.getCurrentPositionAsync({ accuracy:Location.Accuracy.Lowest });
                setArtisanLocation(location);
            }catch(e){
                console.log(e.message);
            }

        })()

        setRequestInfo(route.params.requestInfo.request);
        console.log(route.params.requestInfo);

    },[]);

    
    const _acceptTask = () => {
        acceptTask(route.params.requestInfo);
    }

    const _cancelTask = () => {
        declineTask(route.params);
        navigation.goBack()
    }

    return (
        <View>
            <View style={styles.floatingCard}>
                <Card>
                    <Card.Content>
                        <Title><Icon name='rowing'/>{"Request Information"}</Title>
                        <Paragraph>{"Request Details goes here!!!"}</Paragraph>
                    </Card.Content>
                    <Card.Actions style={styles.cardActions}>
                        <Button onPress={() => _acceptTask()}>Accept</Button>
                        <Button onPress={() => _cancelTask() }>Cancel</Button>
                    </Card.Actions>
                </Card>
            </View>
            

            {/* <MapView initialRegion={{ 
                                    latitude: 0,
                                    longitude: 0,
                                    latitudeDelta: 0.0003,
                                    longitudeDelta: 0.0002
                                }}
                region={{
                    latitude: artisanLocation.coords.latitude,
                    longitude: artisanLocation.coords.latitude,
                    latitudeDelta: 0.009,
                    longitudeDelta: 0.005
                }}
                >
                <MapViewDirections
                    origin={origin}
                    destination={destination}
                    apikey={GOOGLE_MAPS_APIKEY}
                />
            </MapView> */}
            
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    floatingCard:{
        position: 'absolute',
        width: Dimensions.get('window').width * 0.9,
        alignSelf:'center',
        marginTop: 40,
        zIndex: 10
    },
    cardActions:{
        alignSelf: 'flex-end'
    },
    map: {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
      zIndex: -1
    },
  });