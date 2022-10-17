import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import { StyleSheet, Platform, TouchableOpacity } from "react-native";
import { TouchableRipple } from "react-native-paper";

const ThemeRipple = ({ children, disabled, onPress, style, rippleColor }: ThemeRippleProps) => {

    if (Platform.OS === "android" && Platform.Version < 28)
        return <TouchableOpacity style={style} disabled={disabled} onPress={onPress}>
            {children}
        </TouchableOpacity>
    else
        return <TouchableRipple style={style} disabled={disabled} onPress={onPress} rippleColor={rippleColor}>
            {children}
        </TouchableRipple>
}

const styles = StyleSheet.create({})

interface ThemeRippleProps {
    children?: React.ReactChild,
    disabled?: boolean,
    onPress?(): void,
    style?: StyleProp<ViewStyle>,
    rippleColor?: string,
}

export default ThemeRipple