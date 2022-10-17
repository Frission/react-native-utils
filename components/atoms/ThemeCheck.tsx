import { StyleProp, StyleSheet, ViewStyle } from 'react-native'
import React from 'react'
import ThemeIcon from './ThemeIcon'
import { theme } from '../../styles/Theme'
import ThemeTouchable from './ThemeTouchable'

const ThemeCheck = ({
    style,
    checked,
    onPress,
    size = 20,
    backgroundColor = theme.colors.primary,
    checkColor = 'white'
}: ThemeCheckBoxProps) => {
    return (
        <ThemeTouchable style={[{ width: size, height: size, backgroundColor: backgroundColor }, styles.container, style]} onPress={onPress}>
            {checked && <ThemeIcon name="check-bold" size={size - 3} color={checkColor} />}
        </ThemeTouchable>
    )
}

export default ThemeCheck

interface ThemeCheckBoxProps {
    checked: boolean;
    onPress: () => void;
    size?: number;
    backgroundColor?: string;
    checkColor?: string;
    style?: StyleProp<ViewStyle>
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center'
    }
})