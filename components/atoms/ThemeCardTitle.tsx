import React from "react";
import { View, StyleSheet, StyleProp, TextStyle } from "react-native";
import useDialog from "../../hooks/useDialog";
import commonStyles from "../../styles/Common";
import { theme } from "../../styles/Theme";
import ThemeDialog from "../dialogs/ThemeDialog";
import ThemeIcon from "./ThemeIcon";
import ThemeText from "./ThemeText";

const ThemeCardTitle = ({ children, info, onInfoPressed, style, white = false }: ThemeCardTitleProps) => {

    const [visible, showDialog, hideDialog] = useDialog()

    if (info == null)
        return (
            <ThemeText style={[styles.cardTitleStyle, style]} color={white ? "white" : undefined} >
                {children}
            </ThemeText>
        )
    else {

        const onIconPress = () => {
            showDialog()
            if(onInfoPressed)
                onInfoPressed()
        }

        return (
            <View style={commonStyles.flexDirRow}>

                <ThemeDialog 
                    hideDialog={hideDialog}
                    visible={visible}
                    description={info}
                    title="Bilgi"
                />

                <ThemeText style={[styles.cardTitleStyle, commonStyles.flex, style]} color={white ? "white" : undefined} >
                    {children}
                </ThemeText>
                {info && <ThemeIcon name="information" size={24} color={white ? "white" : theme.colors.primary} style={styles.icon} onPress={onIconPress} />}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    cardTitleStyle: {
        color: theme.colors.textSecondary,
        marginHorizontal: 26,
        marginBottom: 4,
        alignItems: "center",
        textAlignVertical: "center",
    },
    icon: {
        paddingRight: 16,
        paddingLeft: 16,
    }
})

interface ThemeCardTitleProps {
    children?: string | React.ReactNode | React.ReactNodeArray,
    info?: string,
    onInfoPressed?: () => void,
    style?: StyleProp<TextStyle>,
    white?: boolean,
}

export default ThemeCardTitle