import React from "react";
import { StyleSheet, StyleProp, TextStyle, ViewStyle, TouchableOpacity, View } from "react-native";
import { RadioButton } from "react-native-paper";
import { theme } from "../../styles/Theme";
import ThemeText from "./ThemeText";

const ThemeRadioButton = (props: ThemeRadioButtonProps) => {

    const onPress = () => {
        if (props.onPressed)
            props.onPressed(props.value)
    }

    return (
        <TouchableOpacity
            style={[styles.containerStyle, props.style]}
            activeOpacity={theme.activeOpacity}
            onPress={onPress}
            disabled={props.disabled}
        >
            {
                typeof props.label === "string" ?
                    <ThemeText style={[styles.labelStyle, props.labelStyle]}>
                        {props.label}
                    </ThemeText>
                    :
                    <View style={[styles.labelStyle, props.labelStyle]}>
                        {props.label}
                    </View>
            }
            <RadioButton
                {...props}
            />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    containerStyle: {
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "stretch",
    },
    labelStyle: {
        flex: 1,
    },
})

interface ThemeRadioButtonProps {
    value: string,
    label: string | React.ReactChild,
    status?: "checked" | "unchecked",
    disabled?: boolean,
    onPressed?(value: string): void,
    uncheckedColor?: string,
    color?: string,
    style?: StyleProp<ViewStyle>,
    labelStyle?: StyleProp<TextStyle>,
}

export default ThemeRadioButton