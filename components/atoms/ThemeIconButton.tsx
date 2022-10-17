import React from "react";
import { StyleProp, StyleSheet, TextStyle, View, ViewStyle } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { theme } from "../../styles/Theme";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import Ionicons from "react-native-vector-icons/Ionicons"
import devlog from "../../util/devlog";

const ThemeIconButton = ({ iconName,
    onPress,
    disabled = false,
    size = 24,
    color = "white",
    useIonicons = false,
    activeOpacity = theme.activeOpacity,
    visible = true,
    style,
    iconStyle
}: ThemeIconButtonProps) => {

    if (!visible)
        return null

    return (
        <TouchableOpacity
            style={[
                styles.buttonStyle,
                { borderRadius: size / 2 + 8 },
                style,
            ]}
            containerStyle={{ opacity: disabled ? theme.disabledOpacity : 1 }}
            activeOpacity={activeOpacity}
            onPress={onPress}
            disabled={disabled}
        >
            { useIonicons ?
                <Ionicons
                    name={iconName}
                    size={size}
                    color={color}
                    style={iconStyle}
                />
                :
                <MaterialCommunityIcons
                    name={iconName}
                    size={size}
                    color={color}
                    style={iconStyle}
                />}
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    buttonStyle: {
        padding: 8,
        backgroundColor: theme.colors.accent,
        alignItems: "center",
        justifyContent: "center",
    },
});

interface ThemeIconButtonProps {
    iconName: string,
    onPress?: () => void,
    disabled?: boolean,
    size?: number,
    color?: string,
    useIonicons?: boolean,
    activeOpacity?: number,
    visible?: boolean,
    style?: StyleProp<ViewStyle>
    iconStyle?: StyleProp<TextStyle>
}

export default ThemeIconButton;