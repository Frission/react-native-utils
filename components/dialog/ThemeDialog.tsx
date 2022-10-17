import React, { ReactChild, ReactChildren } from "react";
import { StyleProp, StyleSheet, TextStyle, View, ViewStyle } from "react-native";
import { ImageStyle, Source } from "react-native-fast-image";
import { Divider, Modal, Portal } from "react-native-paper";
import commonStyles from "../../styles/Common";
import { theme } from "../../styles/Theme";
import { scale } from "../../util/scalingUtil";
import ThemeCard from "../atoms/ThemeCard";
import ThemeCloseButton from "../atoms/ThemeCloseButton";
import ThemeIcon from "../atoms/ThemeIcon";
import ThemeText from "../atoms/ThemeText";

const ThemeDialog = ({ visible,
    hideDialog,
    onDismiss,
    onClosePressed,
    title,
    description,
    dismissable = true,
    closeable = true,
    landscape = false,
    iconName,
    children,
    bgImageSource,
    bgImageTint,
    bgImageStyle,
    outerStyle,
    cardStyle,
    style,
    descriptionStyle }: ThemeDialogProps) => {

    return (
        <Portal>
            <Modal
                visible={visible}
                onDismiss={() => {
                    if (onDismiss)
                        onDismiss()
                    hideDialog()
                }}
                style={landscape && styles.landscapeStyle}
                contentContainerStyle={[styles.contentStyle, outerStyle]}
                dismissable={dismissable}
            >
                {
                    iconName &&
                    <View>
                        <View style={styles.infoIconContainer}>
                            <ThemeIcon name={iconName} size={35} color="white" />
                        </View>
                    </View>
                }

                <ThemeCard
                    cardStyle={[styles.card, cardStyle]}
                    cardContentStyle={[styles.cardContentStyle, style]}
                    bgImageSource={bgImageSource}
                    bgImageStyle={bgImageStyle}
                    bgImageTint={bgImageTint}
                >

                    <View style={styles.header}>
                        <ThemeText style={commonStyles.flex}>{title ? title : ""}</ThemeText>
                        {
                            closeable &&
                            <ThemeCloseButton onPressed={() => {
                                if (onClosePressed)
                                    onClosePressed()
                                hideDialog()
                            }} iconStyle={styles.closeIconStyle} />
                        }
                    </View>
                    {
                        (title != null && title != "") &&
                        <Divider style={styles.divider} />
                    }
                    {
                        (description != null && description != "")  &&
                        <ThemeText style={[descriptionStyle]}>
                            {description}
                        </ThemeText>
                    }
                    {children}

                </ThemeCard>
            </Modal>
        </Portal>
    );
};

export interface ThemeDialogProps {
    visible: boolean,
    hideDialog: () => void,
    onDismiss?: () => void,
    onClosePressed?: () => void,
    title?: string,
    description?: string,
    dismissable?: boolean,
    closeable?: boolean,
    landscape?: boolean,
    iconName?: string,
    children?: React.ReactNode | React.ReactNodeArray | null | undefined,
    style?: StyleProp<ViewStyle>,
    cardStyle?: StyleProp<ViewStyle>,
    outerStyle?: StyleProp<ViewStyle>,
    descriptionStyle?: StyleProp<TextStyle>,
    bgImageSource?: Source,
    bgImageStyle?: StyleProp<ImageStyle>,
    bgImageTint?: string,
}

const styles = StyleSheet.create({
    landscapeStyle: {
        justifyContent: "center",
        paddingBottom: scale(20),
    },
    card: {
        elevation: 0
    },
    contentStyle: {
        marginHorizontal: 40,
    },
    header: { 
        flexDirection: "row", 
        alignItems: "center" 
    },
    cardContentStyle: {
        paddingHorizontal: 20,
        paddingBottom: 16,
        paddingTop: 8
    },
    closeIconStyle: {
        margin: 4,
        marginRight: 0,
    },
    infoIconContainer: {
        width: 60,
        height: 50,
        backgroundColor: theme.colors.accent,
        marginLeft: 20,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },

    divider: { marginVertical: 8, backgroundColor: theme.colors.secondary, height: 1.4 },
});

export default ThemeDialog;
