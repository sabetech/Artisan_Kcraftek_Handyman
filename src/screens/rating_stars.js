import React, {useState} from "react";
import { StyleSheet, TouchableOpacity, Image, View } from 'react-native';    

const Stars = () => {

    const [rating, setRating] = useState(0);
    const [max_rating, setMaxRating] = useState(5);

    const star = 'https://raw.githubusercontent.com/AboutReact/sampleresource/master/star_filled.png';
    const star_empty = 'https://raw.githubusercontent.com/AboutReact/sampleresource/master/star_corner.png';
    let ReactRatingBar = [];

    for (var i = 1; i <= max_rating; i++) {
        ReactRatingBar.push(
          <TouchableOpacity
            activeOpacity={0.7}
            key={i}
            onPress={null}>
            <Image
              style={styles.StarImage}
              source={
                i <= rating
                  ? { uri: star }
                  : { uri: star_empty }
              }
            />
          </TouchableOpacity>
        );
      }

    return (
        <View style={styles.childView}>
            {ReactRatingBar}
        </View>
    );
}

const styles = StyleSheet.create({
    MainContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: Platform.OS === 'ios' ? 20 : 0,
    },
    StarImage: {
        width: 40,
        height: 40,
        resizeMode: 'cover',
    },
    childView: {
        justifyContent: 'center',
        flexDirection: 'row',
        marginTop: 30,
      },
});

export default Stars;