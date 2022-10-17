import React from "react";
import { Text, StyleProp, TextStyle, TextProps } from "react-native";
import commonStyles from "../../styles/Common";

const ThemeText = (props: ThemeTextProps) => {

    const { children, style, fontSize, bold, numberOfLines, color } = props
    
    return (
        <Text
            {...props}
            style={[
                commonStyles.primaryTextStyle,
                style,
                color ? { color } : undefined,
                bold ? { fontWeight: "bold" } : undefined,
                fontSize ? { fontSize } : undefined,
            ]}
            numberOfLines={numberOfLines}
        >

            {children}
        </Text>
    );
};

export interface ThemeTextProps extends TextProps {
    children?: React.ReactNode,
    style?: StyleProp<TextStyle>,
    color?: string,
    fontSize?: number,
    bold?: boolean,
}

export default ThemeText;
