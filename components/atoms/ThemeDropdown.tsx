import React from 'react';
import { StyleProp, StyleSheet, TextStyle, View, ViewStyle } from 'react-native';
import { theme } from '../../styles/Theme';
import ModalSelector from "react-native-modal-selector";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { TouchableOpacity } from 'react-native-gesture-handler';
import ThemeText from './ThemeText';
import { ActivityIndicator } from 'react-native-paper';

/*
	https://github.com/peacechen/react-native-modal-selector
*/

const ThemeDropdown = (props: CustomDropdownInterface) => {
	const {
		dropdownContainerStyle,
		dropdownStyle,
		textStyle,
		placeholderText,
		value = {
			label: placeholderText,
			key: "placeholder",
		},
		setValue,
		items,
		keyExtractor,
		disabled = false,
		loading = false,
		onValueChange,
		closeCancelButton
	} = props;

	var initValue = value;
	var isDisabled = loading ? true : disabled;

	if (initValue === null)
		initValue = {
			label: placeholderText,
			key: "placeholder",
		};

	const modalData: DropdownItem[] = items.map(item => ({
		component: <ThemeText style={styles.optionTextStyle}>{item.label}</ThemeText>,
		...item
	}))

	return (
		<ModalSelector
			data={modalData}
			onChange={(v) => {
				setValue({ key: v.key, label: v.label });
				if (onValueChange)
					onValueChange({ key: v.key, label: v.label });
			}}
			initValue={placeholderText}
			keyExtractor={keyExtractor}
			disabled={isDisabled}
			childrenContainerStyle={{
				alignItems: "stretch",
			}}
			optionContainerStyle={{
				backgroundColor: "white",
				borderRadius: theme.roundness,
				maxHeight: 500,
				marginHorizontal: 20,
			}}
			backdropPressToClose
			cancelContainerStyle={closeCancelButton ? { width: 0, height: 0, opacity: 0 } : {
				backgroundColor: "white",
				borderRadius: theme.roundness,
				marginHorizontal: 10,
			}}
			touchableActiveOpacity={theme.activeOpacity}
			cancelText="İptal"
			style={dropdownContainerStyle}
		>
			<View style={[styles.dropdownContainer,
			{
				opacity: isDisabled ? theme.disabledOpacity : 1,
				borderColor: isDisabled ? theme.colors.secondaryDisabled : theme.colors.secondary
			},
				dropdownStyle
			]}>
				{value === null ?
					<ThemeText
						style={[styles.placeholderStyle, textStyle]}>
						{initValue.label}
					</ThemeText>
					:
					<ThemeText
						style={[styles.textStyle, textStyle]}
						numberOfLines={1}
						ellipsizeMode="tail"
					>
						{value.label}
					</ThemeText>
				}

				<TouchableOpacity style={[styles.iconContainerStyle, props.iconContainerStyle]}>
					{
						loading ?
							<ActivityIndicator color={"white"} />
							:
							<MaterialCommunityIcons name="chevron-down" style={styles.iconStyle} />
					}
				</TouchableOpacity>
			</View>
		</ModalSelector>
	);
};

const styles = StyleSheet.create({
	dropdownContainer: {
		flexDirection: 'row',
		borderColor: theme.colors.secondary,
		borderRadius: theme.roundness,
		borderWidth: 1,
		backgroundColor: '#ffffff',
		height: 40,
		alignItems: 'center',
		paddingLeft: 8,
	},
	placeholderStyle: {
		flex: 1,
		color: theme.colors.textLightGray,
	},
	textStyle: {
		flex: 1,
		color: theme.colors.textPrimary,
		paddingHorizontal: 4,
	},
	iconStyle: {
		fontSize: 24,
		color: "white",
	},
	iconContainerStyle: {
		height: 39,
		width: 38,
		backgroundColor: theme.colors.secondary,
		borderTopRightRadius: theme.roundness,
		borderBottomRightRadius: theme.roundness,
		alignItems: 'center',
		justifyContent: 'center',
	},

	optionTextStyle: {
		textAlign: "center",
	}
});

export interface DropdownItem {
	label: string | null,
	key: any,
	component?: React.ReactNode,
	testID?: string,
}

interface CustomDropdownInterface {
	placeholderText: string,
	value: DropdownItem,
	setValue: (value: DropdownItem) => void,
	items: Array<DropdownItem>,
	keyExtractor: (item: DropdownItem) => React.Key,
	onValueChange?: (value: DropdownItem) => void
	loading?: boolean,
	disabled?: boolean,
	dropdownContainerStyle?: ViewStyle,
	dropdownStyle?: StyleProp<ViewStyle>,
	textStyle?: StyleProp<TextStyle>,
	iconContainerStyle?: StyleProp<ViewStyle>,
	closeCancelButton?: boolean;
}

export default ThemeDropdown;
