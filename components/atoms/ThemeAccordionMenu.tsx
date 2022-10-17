import { useSpring, animated as Animated } from "@react-spring/native";
import React from "react";
import { StyleProp, TextStyle, ViewStyle } from "react-native";
import { View, StyleSheet, TouchableOpacity, Platform, LayoutAnimation } from "react-native";
import { TouchableRipple } from "react-native-paper";
import commonStyles from "../../styles/Common";
import { theme } from "../../styles/Theme";
import { SafeLayoutAnimation } from "../../util/util";
import ThemeIcon from "./ThemeIcon";
import ThemeText from "./ThemeText";

export interface ThemeAccordionMenuRef {
    openTabAt(index: number): void,
}

const Menu = ({ items, startIndex, style, flexItems = false, openTabAt, headerBG, headerColor, onPressedEvent }: MenuProps) => {
    const [index, setIndex] = React.useState<number | null>(startIndex ?? null)

    const onItemPressed = React.useCallback((newIndex: number) => {
        SafeLayoutAnimation.easeOut(600)

        if (newIndex === index)
            setIndex(null)
        else
            setIndex(newIndex)
    }, [index])

    React.useEffect(() => {
        if (openTabAt != null && openTabAt < items.length)
            setIndex(openTabAt)
    }, [openTabAt])

    return (
        <View style={[menuStyles.containerStyle, style]}>
            {
                items.map((item, i) => {
                    const onPress = () => {
                        if (onPressedEvent && i !== index) {
                            onPressedEvent(item, i)
                        }
                        onItemPressed(i)
                    }

                    return <Item title={item.title} expanded={index === i} onPress={onPress} key={item.title + i} index={i} flexSelf={flexItems} headerBackGroundColor={headerBG} headerColor={headerColor}>
                        {item.content}
                    </Item>
                })
            }
        </View>
    )
}

const menuStyles = StyleSheet.create({
    containerStyle: {
        alignItems: "stretch",
        flex: 1,
        overflow: "hidden",
    }
})

interface MenuProps {
    items: Array<AccordionItem>
    startIndex?: number,
    /** Should the items fill the entire menu when open? */
    flexItems?: boolean,
    /** Set this to programmatically open a tab */
    openTabAt?: number | null,
    style?: StyleProp<ViewStyle>,
    headerBG?: string;
    headerColor?: string;
    onPressedEvent?: (item: AccordionItem, index: number) => void
}

export interface AccordionItem {
    title: string,
    content: React.ReactNode,
}

// ---------------------- ITEM ----------------------


const Item = ({ title, expanded, children, onPress, index, flexSelf = false, headerBackGroundColor, headerColor }: ItemProps) => {

    const arrowAnim = useSpring({
        to: { rotate: expanded ? "180deg" : "0deg" },
    })

    const headerBG: StyleProp<ViewStyle> = {
        backgroundColor: headerBackGroundColor ? headerBackGroundColor : (index % 2 == 0 ? "white" : "#F7F7F7")
    }

    const headerTextColor: StyleProp<TextStyle> = {
        color: headerColor ? headerColor : theme.colors.text
    }

    const headerContent = <View style={itemStyles.headerTitleContainer}>
        <ThemeText style={[itemStyles.headerTitle, headerTextColor]}>{title}</ThemeText>
        <Animated.View style={[{ transform: [{ rotate: arrowAnim.rotate }] }]}>
            <ThemeIcon
                name="chevron-down"
                size={30}
                color={theme.colors.accent}
                style={{
                    marginHorizontal: 8,
                }}
            />
        </Animated.View>
    </View>

    let header: JSX.Element

    if (Platform.OS == "android" && Platform.Version < 28)
        header = <TouchableOpacity style={[itemStyles.headerStyle, commonStyles.iosShadow2, headerBG]} activeOpacity={theme.activeOpacity} onPress={onPress}>
            {headerContent}
        </TouchableOpacity>
    else
        header = <TouchableRipple style={[itemStyles.headerStyle, commonStyles.iosShadow2, headerBG]} onPress={onPress}>
            {headerContent}
        </TouchableRipple>

    return (
        <View style={expanded && flexSelf && { flex: 1 }}>
            {header}
            {/* 
                This view fixes the child not disappearing when current layout animation is cancelled,
                elevation: -1 makes it draw under the header, so the header does not appear below the child during animation
            */}
            <View style={{ opacity: expanded ? 1 : 0, flex: 1 }}>
                {
                    expanded && children
                }
            </View>
        </View >
    )
}

const itemStyles = StyleSheet.create({
    headerStyle: {
        padding: 10,
        flexDirection: "row",
        backgroundColor: "white",
        justifyContent: "center",
        elevation: 2,
        zIndex: 1,
    },
    headerTitleContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",      
    },
    headerTitle: {
        flex: 1,
        textAlignVertical: "center",
    }
})

interface ItemProps {
    title: string,
    index: number,
    expanded: boolean,
    onPress: () => void,
    flexSelf?: boolean,
    children?: React.ReactNode | React.ReactNodeArray,
    headerBackGroundColor?: string,
    headerColor?: string
}

export default Menu