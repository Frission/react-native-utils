import React from 'react';
import {
	View,
	StyleSheet,
	StyleProp,
	TextStyle,
	ViewStyle,
	TouchableOpacity,
} from 'react-native';
import { ImageStyle } from 'react-native-fast-image';
import { theme } from '../../styles/Theme';
import ThemeImage from './ThemeImage';
import ThemeText from './ThemeText';

const ThemeLink = ({
	text,
	children,
	textStyle,
	iconStyle,
	containerViewStyle,
	showIcon,
	noUnderline,
	onPressed,
	iconSize = 20,
	iconColor,
	accessibilityLabel = "Link Yazısı",
	disabled,
}: ClickableTextInterface) => {

	if (onPressed) {
		return (
			<TouchableOpacity
				style={[styles.containerStyle, containerViewStyle]}
				onPress={onPressed}
				activeOpacity={theme.activeOpacity}
				accessibilityLabel={accessibilityLabel}
				disabled={disabled}
			>
				{
					text ?
						<ThemeText
							style={[styles.textStyle, textStyle, { textDecorationLine: noUnderline ? "none" : "underline" }]}>
							{text}
						</ThemeText>
						:
						null
				}
				{
					children &&
					<ThemeText
						style={[styles.textStyle, textStyle, { textDecorationLine: noUnderline ? "none" : "underline" }]}>
						{children}
					</ThemeText>
				}
				{
					showIcon &&
					<ThemeImage
						source={require("../../../assets/icons/link.png")}
						style={[styles.iconStyle, iconStyle, { width: iconSize, height: iconSize }]}
						tintColor={iconColor}
					/>
				}
			</TouchableOpacity>
		);
	} else {
		return (
			<View style={[styles.containerStyle, containerViewStyle]} accessibilityLabel={accessibilityLabel}>
				{
					text != null &&
					<ThemeText
						style={[styles.textStyle, textStyle, { textDecorationLine: noUnderline ? "none" : "underline" }]}>
						{text}
					</ThemeText>
				}
				{
					children &&
					<ThemeText
						style={[styles.textStyle, textStyle, { textDecorationLine: noUnderline ? "none" : "underline" }]}>
						{children}
					</ThemeText>
				}
				{
					showIcon &&
					<ThemeImage
						source={require("../../../assets/icons/link.png")}
						style={[styles.iconStyle, iconStyle, { width: iconSize, height: iconSize }]}
						tintColor={iconColor}
					/>
				}
			</View>
		);
	}
};

const styles = StyleSheet.create({
	containerStyle: {
		flexDirection: 'row',
		alignItems: 'center',
		textAlign: 'center',
	},
	textStyle: {
		color: theme.colors.accent,
	},
	iconStyle: {
		marginLeft: 4,
	},
});

interface ClickableTextInterface {
	text?: string | JSX.Element;
	children?: string | JSX.Element,
	textStyle?: StyleProp<TextStyle>;
	iconStyle?: StyleProp<ImageStyle>;
	containerViewStyle?: StyleProp<ViewStyle>;
	showIcon?: boolean;
	noUnderline?: boolean;
	onPressed?: () => void;
	iconSize?: number,
	iconColor?: string,
	accessibilityLabel?: string,
	disabled?: boolean,
}

export default ThemeLink;
