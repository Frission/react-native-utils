import React from "react"
import { PixelRatio, StyleProp, StyleSheet, TextStyle, View, ViewStyle } from "react-native"
import { theme } from "../../../styles/Theme"
import ThemeIcon from "../../atoms/ThemeIcon"
import ThemeText, { ThemeTextProps } from "../../atoms/ThemeText"

const ThemeFancyInfoText = (props: ThemeFancyInfoTextProps) => {
    
    return (
        <View style={[
            styles.container,
            props.style,           
        ]}
        >
            <ThemeText {...props} style={[styles.text, props.textStyle, { backgroundColor: props.backgroundColor ?? theme.colors.active }]} />

            <View style={[styles.iconContainer, props.iconContainerStyle]}>
                <ThemeIcon
                    name={props.icon ?? "chatbubble-outline"}
                    size={30}
                    color={theme.colors.tertiary}
                    style={props.iconStyle}
                    useIonicons={props.useIonicons ?? true}
                />
                <View style={styles.iconBorder} />
            </View>
        </View>
    )
}


const iconBorderPadding = PixelRatio.roundToNearestPixel(0.8)

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
    },

    text: {
        paddingVertical: 8,
        paddingRight: 10,
        paddingLeft: 30,
        marginLeft: 25,
        borderRadius: theme.roundness,
    },

    iconContainer: {
        position: "absolute",

        backgroundColor: "white",
        borderRadius: 30,
        width: PixelRatio.roundToNearestPixel(48),
        height: PixelRatio.roundToNearestPixel(48),
        alignItems: "center",
        justifyContent: "center",
    },

    iconBorder: {
        position: "absolute",
        left: iconBorderPadding, right: iconBorderPadding,
        top: iconBorderPadding, bottom: iconBorderPadding,
        borderRadius: 30,
        borderWidth: PixelRatio.roundToNearestPixel(1),
        borderColor: theme.colors.tertiary
    },
})

interface ThemeFancyInfoTextProps extends ThemeTextProps {
    children?: React.ReactNode | React.ReactNodeArray,
    iconStyle?: StyleProp<TextStyle>,
    iconContainerStyle?: StyleProp<ViewStyle>,
    style?: StyleProp<ViewStyle>,
    textStyle?: StyleProp<TextStyle>,
    backgroundColor?: string,
    icon?: string,
    useIonicons?: boolean,
    warning?: boolean,
}

export default ThemeFancyInfoText
