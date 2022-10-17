import React from "react";
import { StyleSheet, StyleProp, ViewStyle, TextStyle } from "react-native";
import { theme } from "../../../styles/Theme";
import ThemeCard from "../../atoms/ThemeCard";
import ThemeText from "../../atoms/ThemeText";

const ErrorCard = ({ text, cardStyle, cardContentStyle, textStyle, defaultStyle = false }: ErrorCardProps) => {
    return (
        <ThemeCard
            cardStyle={[
                styles.cardStyle,
                cardStyle,
                defaultStyle ? { marginHorizontal: theme.pageMargin } : undefined
            ]}
            cardContentStyle={[
                styles.cardContentStyle,
                cardContentStyle
            ]}
        >
            <ThemeText style={[styles.textStyle, textStyle]}>{text}</ThemeText>
        </ThemeCard>
    );
};

const styles = StyleSheet.create({
    cardStyle: {
        padding: 20,
        marginVertical: 4,
    },
    cardContentStyle: {
        alignItems: "center",
    },
    textStyle: {
        textAlign: "center",
    }
});

interface ErrorCardProps {
    text: string,
    cardStyle?: StyleProp<ViewStyle>,
    cardContentStyle?: StyleProp<ViewStyle>,
    textStyle?: StyleProp<TextStyle>,
    defaultStyle?: boolean,
}

export default ErrorCard;