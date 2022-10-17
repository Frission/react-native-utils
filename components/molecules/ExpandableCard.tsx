import React from "react";
import { View, StyleSheet, StyleProp, ViewStyle } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useSpring, animated as Animated } from "@react-spring/native";
import { theme } from "../../../styles/Theme";
import { SafeLayoutAnimation } from "../../../util/util";
import ThemeCard from "../../atoms/ThemeCard";

const ExpandableCard = ({ visibleChildren,
    children,
    arrowPosition = "right",
    useTouchableOpacity,
    cardStyle,
    cardContentStyle,
    expandedContainerStyle,
    onExpanded: expandedStatus
}: ExpandableCardProps) => {

    const [expanded, setExpanded] = React.useState(false)

    const onCardPressed = () => {
        setExpanded(!expanded);
        SafeLayoutAnimation.easeOut()
    }

    React.useEffect(() => {
        if (expandedStatus) {
            expandedStatus(expanded)
        }
    }, [expanded])

    const arrowAnim = useSpring({
        to: { rotate: expanded ? "180deg" : "0deg" },
    })

    const arrowView = (
        <Animated.View style={{ transform: [{ rotate: arrowAnim.rotate }] }}>
            <MaterialCommunityIcons
                name="chevron-down"
                size={30}
                color={theme.colors.accent}
                style={{
                    marginHorizontal: 4,
                }}
            />
        </Animated.View>
    )

    const innerStyle: StyleProp<ViewStyle> = {
        ...styles.visibleContainerStyle,
        justifyContent: arrowPosition == "right" ? "space-between" : "flex-start"
    }

    return (
        <ThemeCard cardStyle={cardStyle} cardContentStyle={[cardContentStyle]} onPressed={onCardPressed} useTouchableOpacity={useTouchableOpacity}>
            <View style={[innerStyle]}>
                {
                    arrowPosition == "right" ?
                        <>
                            {visibleChildren}
                            {arrowView}
                        </>
                        :
                        <>
                            {arrowView}
                            {visibleChildren}
                        </>
                }
            </View>

            {
                expanded ?
                    <View style={[styles.expandedStyle, expandedContainerStyle]}>
                        {children}
                    </View>
                    :
                    null
            }
        </ThemeCard>
    )
}

const styles = StyleSheet.create({
    visibleContainerStyle: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: theme.cardPadding,
    },
    expandedStyle: {
        padding: theme.cardPadding,
    },
})

interface ExpandableCardProps {
    /** these children are always visible */
    visibleChildren: React.ReactNode | React.ReactNodeArray,
    /** children are visible when expanded */
    children: React.ReactNode | React.ReactNodeArray,
    /** If true, will make sure visibleChildren and expandedChildren are aligned, only applied when arrow is on the left side */
    alignExpandedChildren?: boolean,
    arrowPosition?: "left" | "right",
    useTouchableOpacity?: boolean,
    cardStyle?: StyleProp<ViewStyle>,
    cardContentStyle?: StyleProp<ViewStyle>,
    expandedContainerStyle?: StyleProp<ViewStyle>,
    onExpanded?: Function;
}

export default ExpandableCard