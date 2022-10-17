import React from "react";
import { StyleSheet, TouchableOpacity, StyleProp, TextStyle, ViewStyle, GestureResponderEvent } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { theme } from "../../styles/Theme";

const ThemeCloseButton = ({ onPressed, iconStyle, iconContainerStyle }: ThemeCloseButtonProps) => {
    return (
        <TouchableOpacity activeOpacity={theme.activeOpacity} onPress={onPressed} style={iconContainerStyle}>
            <MaterialCommunityIcons name="close" size={24} color={theme.colors.accent} style={[styles.closeIconStyle, iconStyle]} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    closeIconStyle: {
        margin: 8,
    },
});

interface ThemeCloseButtonProps {
    onPressed: (event: GestureResponderEvent) => void,
    iconStyle?: StyleProp<TextStyle>,
    iconContainerStyle?: StyleProp<ViewStyle>,
}

export default ThemeCloseButton;