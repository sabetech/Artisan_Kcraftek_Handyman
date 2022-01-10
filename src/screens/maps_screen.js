import React, {useState, useEffect} from "react";
import { View } from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';

export default function MapScreen({route, navigation}) {

    const [clientLocation, setClientLocation] = useState();
    const [artisanLocation, setArtisanLocation] = useState();

    useEffect(() => {

        //setClientLocation(route.params.clientInfo.)

    },[])

    return (
        <View>

            {/* <MapView initialRegion={…}>
                <MapViewDirections
                    origin={origin}
                    destination={destination}
                    apikey={GOOGLE_MAPS_APIKEY}
                />
            </MapView> */}
            
        </View>
    );
}