import React from "react";
import { View, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { theme } from "../../../styles/Theme";
import ThemeButton from "../../atoms/ThemeButton";
import ThemeDialog, { ThemeDialogProps } from "../ThemeDialog";

const TwoButtonDialog = (props: YesNoDialogProps) => {

    const onPositiveButton = () => {
        if (props.onPositiveButtonPressed)
            props.onPositiveButtonPressed()
        if (props.onDismiss)
            props.onDismiss()
        props.hideDialog()
    }

    const onNegativeButton = () => {
        if (props.onNegativeButtonPressed)
            props.onNegativeButtonPressed()
        if (props.onDismiss)
            props.onDismiss()
        props.hideDialog()
    }

    return (
        <ThemeDialog {...props}>
            <View style={styles.containerStyle}>
                <ThemeButton
                    text={props.negativeButtonText ?? "Hayır"}
                    onPress={onNegativeButton}
                    style={[styles.negativeStyle, props.negativeButtonStyle]}
                />
                <ThemeButton
                    text={props.positiveButtonText ?? "Evet"}
                    onPress={onPositiveButton}
                    style={[styles.positiveStyle, props.positiveButtonStyle]}
                />
            </View>
        </ThemeDialog>
    )
}

const styles = StyleSheet.create({
    containerStyle: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        marginTop: 20,
        marginBottom: 4,
    },
    positiveStyle: {
        flex: 1,
        marginHorizontal: 10,
        borderRadius: 30,
        backgroundColor: theme.colors.accent
    },
    negativeStyle: {
        flex: 1,
        marginHorizontal: 10,
        borderRadius: 30,
        backgroundColor: theme.colors.cancel,
    }
})

interface YesNoDialogProps extends ThemeDialogProps {
    onPositiveButtonPressed?: () => void,
    onNegativeButtonPressed?: () => void,
    positiveButtonText?: string,
    negativeButtonText?: string,
    negativeButtonStyle?: StyleProp<ViewStyle>,
    positiveButtonStyle?: StyleProp<ViewStyle>,
}

export default TwoButtonDialog