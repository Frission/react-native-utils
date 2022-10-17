import { propertyOf } from "lodash";
import React from "react";
import FastImage, { FastImageProps } from "react-native-fast-image";

/**
 * For tinting the image, tintColor needs to be specified as a prop, not passed inside a style.
 * 
 * FastImage does not have a "repeat" resizeMode, use React's own Image instead
 * 
 * @param props FastImage props from react-native-fast-image library
 * @returns FastImage
 */
const ThemeImage = (props: ThemeImageProps) => {

    const size = typeof props.size === "number" ? { width: props.size, height: props.size} : props.size

    return (
        <FastImage {...props} style={[size, props.style]} />
    )
}

interface ThemeImageProps extends FastImageProps {
    size?: { width: number, height: number } | number
}

export default ThemeImage;