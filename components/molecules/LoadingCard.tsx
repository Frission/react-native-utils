import React from "react";
import { View, StyleSheet, ViewStyle, StyleProp, Text, Platform } from "react-native";
import Shimmer from "react-native-shimmer";
import commonStyles from "../../../styles/Common";
import { theme } from "../../../styles/Theme";

/**
 * Creates a CardView with a shimmer effect
 * 
 */
const LoadingCard = ({ cardStyle, shimmerStyle, style, title, height, color }: CardInterface) => {

    // fix for ios shimmer not working
    const [b, setb] = React.useState(Platform.select({ ios: false, default: true }))
    
    if(Platform.OS == "ios") {
        React.useEffect(() => {
            setTimeout(() => setb(true), 100)
        }, [])
    }

    return (
        <View style={[styles.containerStyle, style]}>
            {title ? <Text style={[commonStyles.primaryTextStyle, styles.textStyle]}>{title}</Text> : null}

            <Shimmer 
            style={[shimmerStyle, { backgroundColor: undefined }]}
            animating={b}
            >
                <View style={[
                        styles.cardStyle, 
                        { height }, 
                        cardStyle, 
                        color ? { backgroundColor: color } : undefined
                    ]} 
                />
            </Shimmer>
        </View>
    );
};

const styles = StyleSheet.create({
    containerStyle: {
        justifyContent: "center",
        borderRadius: theme.roundness,
        overflow: "hidden",
    },
    cardStyle: {
        justifyContent: "space-evenly",
        alignItems: "stretch",
        flexDirection: "row",
        backgroundColor: "#ddddddaa",
        elevation: 0,
        borderRadius: theme.roundness,
    },
    textStyle: {
        color: "#ffffff",
        marginLeft: 20,
        marginBottom: 8,
        fontSize: 14,
    },
});

interface CardInterface {
    height: number,
    color?: string,
    cardStyle?: StyleProp<ViewStyle>,
    style?: StyleProp<ViewStyle>,
    shimmerStyle?: StyleProp<ViewStyle>,
    title?: string,
}

export default LoadingCard;