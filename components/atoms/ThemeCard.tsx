import React from "react";
import { View, StyleSheet, ViewStyle, StyleProp, Platform, TextStyle } from "react-native";
import commonStyles from "../../styles/Common";
import { TouchableRipple } from "react-native-paper";
import { theme } from "../../styles/Theme";
import ThemeImage from "./ThemeImage";
import { ImageStyle, ResizeMode, Source } from "react-native-fast-image";
import ThemeTouchable from "./ThemeTouchable";
import ThemeText from "./ThemeText";

/**
 * Creates a CardView, you can pass in a background image, which will be positioned absolutely
 * 
 */
const ThemeCard = ({ children,
    bgImageSource,
    bgImageStyle,
    bgImageTint,
    bgImageResizeMode = "contain",
    cardStyle,
    cardContentStyle,
    outerContainerStyle,
    title,
    titleStyle,
    onPressed,
    disabled,
    useTouchableOpacity }: CardInterface) => {

    const press = () => {
        if (onPressed && !disabled)
            onPressed()
    }

    let card

    if ((Platform.OS === "android" && Platform.Version < 28) || useTouchableOpacity === true)
        card = (
            <View
                style={[
                    disabled ? commonStyles.disabledCardViewStyle : commonStyles.cardViewStyle,
                    styles.cardStyle,
                    cardStyle,
                ]}
            >
                {/* Inner Container */}
                <ThemeTouchable
                    style={[styles.contentStyle, cardContentStyle]}
                    onPress={press}
                    disabled={disabled || onPressed == null}
                    activeOpacity={theme.activeOpacity}
                    accessibilityLabel="card"
                >
                    {bgImageSource ? <ThemeImage source={bgImageSource} style={[styles.imageStyle, bgImageStyle]} tintColor={bgImageTint} resizeMode={bgImageResizeMode} /> : null}
                    {children}
                </ThemeTouchable>
            </View>
        )
    else
        card = (
            <TouchableRipple
                style={[
                    disabled ? commonStyles.disabledCardViewStyle : commonStyles.cardViewStyle,
                    styles.cardStyle,
                    cardStyle
                ]}
                onPress={press}
                borderless
                disabled={disabled || onPressed == null}
                accessibilityLabel="card"
            >
                {/* Inner Container */}
                <View style={[styles.contentStyle, cardContentStyle]} >
                    {bgImageSource ? <ThemeImage source={bgImageSource} style={[styles.imageStyle, bgImageStyle]} tintColor={bgImageTint} resizeMode="contain" /> : null}
                    {children}
                </View>
            </TouchableRipple>
        )

    return (
        <View style={[styles.containerStyle, outerContainerStyle]}>
            {title && <ThemeText style={[styles.cardTitleStyle, titleStyle]}>{title}</ThemeText>}
            {
                Platform.OS === "android" ?
                    card
                    :
                    <View style={commonStyles.iosShadow4}>
                        {card}
                    </View>
            }
        </View>
    )
};

const styles = StyleSheet.create({
    containerStyle: {
        justifyContent: "center",
        backgroundColor: "#00000000",
    },
    cardStyle: {
        justifyContent: "center",
        backgroundColor: "#ffffffff",
        overflow: "hidden",
    },
    contentStyle: {
        alignSelf: "stretch",
        borderRadius: theme.roundness,
        backgroundColor: "#ffffff",
    },
    cardTitleStyle: {
        color: theme.colors.textSecondary,
        marginHorizontal: 26,
        marginBottom: 4,
        alignItems: "center",
        textAlignVertical: "center",
    },
    imageStyle: {
        position: "absolute",
    },
    
});

interface CardInterface {
    children?: React.ReactNode,
    bgImageSource?: Source,
    bgImageStyle?: StyleProp<ImageStyle>,
    bgImageTint?: string,
    bgImageResizeMode?: ResizeMode,
    cardStyle?: StyleProp<ViewStyle>,
    cardContentStyle?: StyleProp<ViewStyle>,
    outerContainerStyle?: StyleProp<ViewStyle>,
    titleStyle?: StyleProp<TextStyle>,
    title?: string,
    onPressed?: Function,
    disabled?: boolean,
    useTouchableOpacity?: boolean,
}

export default ThemeCard;