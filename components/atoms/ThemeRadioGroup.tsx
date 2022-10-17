import React from "react";
import { StyleSheet } from "react-native";
import { RadioButton } from "react-native-paper";

const ThemeRadioGroup = ({ onValueChanged, value, children }: ThemeRadioGroupProps) => {
    return (
        <RadioButton.Group onValueChange={onValueChanged} value={value}>
            {children}
        </RadioButton.Group>
    )
}

interface ThemeRadioGroupProps {
    onValueChanged: (value: string) => void,
    value: string,
    children: React.ReactNode | React.ReactNodeArray,
}

export default ThemeRadioGroup