import React from "react";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { theme } from "../../styles/Theme";

const ThemeIndicator = ({ size = 32, color, style }: ThemeIndicatorProps) => {
    return (
        <ActivityIndicator
            color={color ? color : theme.colors.accent}
            size={size}
            style={[
                {
                    backgroundColor: "white",
                    borderRadius: (size / 2 + 12),
                    padding: 6,
                    alignSelf: "center"
                },
                style
            ]}
        />
    );
};

interface ThemeIndicatorProps {
    size?: number,
    color?: string,
    style?: StyleProp<ViewStyle>,
}

export default ThemeIndicator;