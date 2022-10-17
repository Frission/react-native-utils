import React from 'react'
import { View } from 'react-native'

const ThemeSliderDot = ({ state, size, activeColor, passiveColor }: SliderDotProps) => {
    return (
        <View style={{ width: state === 'passive' ? size : size + 2, height: state === 'passive' ? size : size + 2, borderRadius: state === 'passive' ? size : size + 2 / 2, backgroundColor: state === 'active' ? activeColor : passiveColor,margin:3 }} />


    )
}

interface SliderDotProps {
    state: 'active' | 'passive';
    size: number;
    activeColor: string;
    passiveColor: string;
}

export default ThemeSliderDot
