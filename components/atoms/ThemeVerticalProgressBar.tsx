import React from 'react'
import { View, StyleSheet, Animated, StyleProp, ViewStyle } from 'react-native'
import { theme } from '../../styles/Theme'
import ThemeText from './ThemeText'

const ThemeVerticalProgressBar = ({
    progress,
    height = 150,
    color,
    text,
    textBold,
    textColor,
    innerTextOffset = 0,
    style
}: verticalProgressBarProps) => {

    return (
        <View style={[styles.container, style, { height }]}>
            <Animated.View
                style={[
                    styles.subContainer,
                    color ? { backgroundColor: color } : undefined,
                    { height: `${progress ?? 0}%` }
                ]}
            />

            <ThemeText style={[
                styles.verticalText,
                {
                    left: -(height * 0.454) + innerTextOffset,
                    width: height,
                    bottom: (height / 2) - 10,
                }
            ]}
                color={textColor}
                bold={textBold}
            >
                {text}
            </ThemeText>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: 15,
        backgroundColor: theme.colors.progressBarBackground,
        borderRadius: 30,
        justifyContent: 'flex-end',
        zIndex: 0,
    },
    subContainer: {
        width: '100%',
        backgroundColor: theme.colors.progressBar,
        borderRadius: 30,
    },
    verticalText: {
        position: "absolute",
        textAlign: 'center',
        fontSize: 10,
        transform: [{ rotate: '-90deg' }],
        textAlignVertical: "center",
    }
})

interface verticalProgressBarProps {
    progress: number | null | undefined,
    height: number,
    color: string,
    text?: string,
    textBold?: boolean,
    innerTextOffset?: number,
    textColor?: string,
    style?: StyleProp<ViewStyle>,
}



export default ThemeVerticalProgressBar
