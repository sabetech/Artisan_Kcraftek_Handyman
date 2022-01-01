import React from "react";
import { View,Text,StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { acceptTask } from "../../api/firebase_functions";



const KcraftekStatus = ({isEnabled, kcraftek_color, statusOfApp}) => {

    //yes to accept
   
    return (
        <View>
            <Text style={[{marginLeft: 10, fontSize: 18}, {color: isEnabled ? 'white' :kcraftek_color}]}>{statusOfApp}</Text>
            
        </View>
    )

}

export default KcraftekStatus;
