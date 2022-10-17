import React from "react";
import { TouchableOpacity, StyleSheet, TouchableOpacityProps } from "react-native";
import { theme } from "../../styles/Theme";
import devlog from "../../util/devlog";

const ThemeTouchable = (props: ThemeTouchableProps) => {

    return (
        <TouchableOpacity
            {...props}
            activeOpacity={(props.activeOpacity ? props.activeOpacity : theme.activeOpacity)}
        >
            {props.children}
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({})

interface ThemeTouchableProps extends TouchableOpacityProps {
    children?: React.ReactNode | React.ReactNodeArray,
}

export default ThemeTouchable