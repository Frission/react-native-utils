import React, { useImperativeHandle } from "react";
import { View, StyleSheet, StyleProp, ViewStyle, TextStyle, TextInput, PixelRatio, InteractionManager, Platform } from "react-native";
import { ImageStyle } from "react-native-fast-image";
import TextInputMask, { TextInputMaskProps } from "react-native-text-input-mask";
import { theme } from "../../../styles/Theme";
import ThemeIcon from "../../atoms/ThemeIcon";
import ThemeText from "../../atoms/ThemeText";
import ThemeTouchable from "../../atoms/ThemeTouchable";

// https://github.com/react-native-text-input-mask/react-native-text-input-mask
// for masked text

export type ThemeFancyTextInputRef = { focus: () => void, blur: () => void }

const ThemeFancyTextInput = React.forwardRef<ThemeFancyTextInputRef, ThemeFancyTextInputProps>((props, ref) => {

    const {
        disabled = false,
        label,
        icon,
        iconColor = theme.colors.secondary,
        iconBackgroundColor = "white",
        onValidate,
        onValidationChange,
        hidden = false,
        editExternally = false,
        editExternallyIcon = "pencil-outline",
        onEditPressed,
        showInfo,
        onInfoPressed,
        labelStyle,
        containerStyle,
        iconContainerStyle,
        iconStyle,
        useIonicons,
        mask,
        focusable = !disabled && !editExternally,
        editable = !disabled && !editExternally,
        placeholderTextColor = theme.colors.secondaryLight,
        autoCapitalize = "none",
        autoCorrect = false,
    } = props

    //
    //  only focus() and blur() functions are defined for TextInputMask 
    //
    const inputRef = React.useRef<TextInput>(null)

    useImperativeHandle(ref, () => {
        return {
            focus: () => inputRef.current?.focus(),
            blur: () => inputRef.current?.blur()
        }
    })

    const [textHidden, setTextHidden] = React.useState(hidden)
    const [warning, setWarning] = React.useState<string | undefined>(undefined)

    const onHidePressed = () => setTextHidden(b => !b)

    React.useEffect(() => {
        if (onValidate && !editExternally && !disabled) {
            let validation = onValidate(props.value)

            if (onValidationChange)
                onValidationChange(validation === undefined)

            setWarning(validation)
        } else {
            setWarning(undefined)
        }
    }, [onValidate, onValidationChange, disabled, editExternally, props.value])

    React.useLayoutEffect(() => {
        if (props.autoFocus)
            InteractionManager.runAfterInteractions(() => inputRef.current?.focus())
    }, [])

    let style: StyleProp<ViewStyle> = [
        styles.input,
        hidden ? { paddingRight: 48 } : undefined,
        props.multiline && Platform.OS == "ios" && { paddingTop: 14 },
        props.style,
        disabled ? { opacity: 0.6 } : undefined
    ]

    return (
        <View style={containerStyle}>

            <ThemeTouchable disabled={!showInfo} onPress={onInfoPressed} style={styles.labelContainer}>
                {
                    label &&
                    <ThemeText style={[styles.label, labelStyle]} >
                        {label}
                    </ThemeText>
                }
                {
                    showInfo &&
                    <ThemeIcon
                        name="information"
                        color="white"
                        size={20}
                        style={{ marginLeft: 6 }}
                    />
                }
            </ThemeTouchable>

            {
                warning && <ThemeText style={styles.warning}>
                    <ThemeIcon name="alert-circle" size={12} />
                    {" "}{warning}
                </ThemeText>
            }

            <View style={[
                styles.inputContainer,
                icon ? { borderTopLeftRadius: 24, borderBottomLeftRadius: 24 } : undefined
            ]}
            >
                {
                    icon && <View style={[styles.iconContainer, iconContainerStyle, { backgroundColor: warning ? theme.colors.warning : iconBackgroundColor }]}>
                        <ThemeIcon
                            name={icon}
                            size={27}
                            color={warning ? "white" : iconColor}
                            style={iconStyle}
                            useIonicons={useIonicons}
                        />
                        <View style={styles.iconBorder} />
                    </View>
                }

                {
                    // Text Input Component
                    // if a mask exists, use the heavier TextInputMask  component
                    // otherwise stick to the default react native one
                    mask ?
                        <TextInputMask
                            ref={inputRef}
                            secureTextEntry={textHidden}
                            focusable={focusable}
                            editable={editable}
                            placeholderTextColor={placeholderTextColor}
                            autoCapitalize={autoCapitalize}
                            autoCorrect={autoCorrect}

                            {...props}

                            // fix index out of bounds crash
                            maxLength={Math.max(mask.length, props.maxLength ?? 0)}

                            autoFocus={false}
                            style={style}
                        />
                        :
                        <TextInput
                            ref={inputRef}
                            secureTextEntry={textHidden}
                            focusable={focusable}
                            editable={editable}
                            placeholderTextColor={placeholderTextColor}
                            autoCapitalize={autoCapitalize}
                            autoCorrect={autoCorrect}

                            {...props}

                            autoFocus={false}
                            style={style}
                        />
                }

                {
                    hidden && <ThemeIcon
                        name={textHidden ? "eye-outline" : "eye-off-outline"}
                        size={24}
                        color={theme.colors.lightGray}
                        style={styles.hideIcon}
                        onPress={onHidePressed}
                    />
                }

                {
                    editExternally && <ThemeIcon
                        name={editExternallyIcon}
                        size={24}
                        color={theme.colors.lightGray}
                        style={styles.hideIcon}
                        onPress={onEditPressed}
                    />
                }
            </View>
        </View>
    )
})

const iconBorderPadding = PixelRatio.roundToNearestPixel(0.8)

const styles = StyleSheet.create({
    label: {
        color: "white",
        fontSize: 12,
        marginLeft: 16,
    },

    labelContainer: {
        flexDirection: "row",
        alignItems: "center",
    },

    inputContainer: {
        flexDirection: "row",
        marginTop: 4,
        alignItems: "flex-start",
        backgroundColor: theme.colors.tertiary,
        borderRadius: 12,
        paddingRight: 6,
    },

    iconContainer: {
        left: -1,
        backgroundColor: "white",
        borderRadius: 30,
        width: PixelRatio.roundToNearestPixel(48),
        height: PixelRatio.roundToNearestPixel(48),
        alignItems: "center",
        justifyContent: "center",
    },

    iconBorder: {
        position: "absolute",
        left: iconBorderPadding, right: iconBorderPadding,
        top: iconBorderPadding, bottom: iconBorderPadding,
        borderRadius: 30,
        borderWidth: PixelRatio.roundToNearestPixel(1),
        borderColor: theme.colors.tertiary
    },

    hideIcon: {
        shadowColor: "transparent",
        paddingHorizontal: 8,
        paddingVertical: 10,
    },

    input: Platform.select({
        ios: {
            flex: 1,
            color: "white",
            paddingHorizontal: 10,
            alignSelf: "stretch",
        },
        default: {
            flex: 1,
            color: "white",
            paddingHorizontal: 10,        
        },
    }),

    warning: {
        backgroundColor: theme.colors.warning,
        overflow: "hidden",
        color: "white",
        borderRadius: 8,
        fontSize: 11,
        paddingRight: 16,
        paddingLeft: 12,
        paddingVertical: 2,
        marginTop: 2,
        marginBottom: 2,
    }
})

interface ThemeFancyTextInputProps extends TextInputMaskProps {
    disabled?: boolean,
    label?: string,
    icon?: string,
    iconColor?: string,
    iconBackgroundColor?: string,
    /** If this is true, the text input will be uninteractable, instead an edit button will be shown, which can be listened to */
    editExternally?: boolean,
    editExternallyIcon?: string,
    onEditPressed?: () => void,
    showInfo?: boolean,
    onInfoPressed?: () => void,
    hidden?: boolean,
    labelStyle?: StyleProp<TextStyle>,
    containerStyle?: StyleProp<ViewStyle>,
    iconContainerStyle?: StyleProp<ViewStyle>,
    iconStyle?: StyleProp<ImageStyle>,
    useIonicons?: boolean,

    /** If this function return a string, a warning will be shown to the user */
    onValidate?: (text: string | undefined) => string | undefined,
    /** input validation state to be exposed to outside */
    onValidationChange?: (valid: boolean) => void,
}

export default ThemeFancyTextInput
