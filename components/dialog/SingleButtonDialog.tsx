import React from "react";
import { StyleSheet } from "react-native";
import commonStyles from "../../../styles/Common";
import ThemeButton from "../../atoms/ThemeButton";
import ThemeDialog, { ThemeDialogProps } from "../ThemeDialog";

const SingleButtonDialog = (props: SingleButtonDialogProps) => {

    const onPositiveButtonPressed = () => {
        if(props.onPositiveButtonPressed)
            props.onPositiveButtonPressed()

        props.hideDialog()
    }

    return (
        <ThemeDialog closeable={false} descriptionStyle={styles.description} {...props}>
            <ThemeButton
                text={props.buttonText ? props.buttonText : "Tamam"}
                onPress={onPositiveButtonPressed}
                disabled={props.disabled}
                style={[commonStyles.roundedAccentStretchButtonStyle, { marginTop: 20 }]}
            />
        </ThemeDialog>
    )
}

 const styles = StyleSheet.create({
    description: { 
        textAlign: "center",
        paddingTop: 4,
     }
 })

interface SingleButtonDialogProps extends ThemeDialogProps {
    buttonText?: string,
    disabled?: boolean,
    onPositiveButtonPressed?(): void,
}


export default SingleButtonDialog