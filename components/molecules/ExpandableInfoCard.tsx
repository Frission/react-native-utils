import React from "react";
import { View, StyleSheet, StyleProp, ViewStyle } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useSpring, animated as Animated } from "@react-spring/native";
import { theme } from "../../../styles/Theme";
import { SafeLayoutAnimation } from "../../../util/util";
import ThemeCard from "../../atoms/ThemeCard";
import ThemeText from "../../atoms/ThemeText";

const ExpandableInfoCard = ({ visibleText, visibleTextNumberOfLines = 2, expandableText, cardStyle, cardContentStyle }: ExpandableInfoCardProps) => {

    const [expanded, setExpanded] = React.useState(false)

    const onCardPressed = () => {
        setExpanded(!expanded);
        SafeLayoutAnimation.easeOut()
    }

    const arrowAnim = useSpring({
        to: { rotate: expanded ? "180deg" : "0deg" },
    })

    return (
        <ThemeCard cardStyle={cardStyle} cardContentStyle={[styles.cardContentStyle, cardContentStyle]} onPressed={onCardPressed}>
            <View style={styles.visibleTextContainerStyle}>
                <ThemeText
                    style={[{ flex: 1 }, styles.textStyle]}
                    numberOfLines={expanded ? undefined : visibleTextNumberOfLines}
                >
                    {visibleText}
                </ThemeText>
                <Animated.View style={{ transform: [{ rotate: arrowAnim.rotate }] }}>
                    <MaterialCommunityIcons
                        name="chevron-down"
                        size={30}
                        color={theme.colors.accent}
                        style={{
                            marginHorizontal: 8,
                        }}
                    />
                </Animated.View>
            </View>
            {
                expanded ?
                    <ThemeText style={styles.textStyle}>
                        {expandableText}
                    </ThemeText>
                    :
                    null
            }
        </ThemeCard>
    )
}

const styles = StyleSheet.create({
    visibleTextContainerStyle: {
        flexDirection: "row",
        alignItems: "flex-start"
    },
    cardContentStyle: {
        padding: theme.cardPadding,
        paddingRight: 0,
    },
    textStyle: {
        fontSize: 12,
    }
})

interface ExpandableInfoCardProps {
    visibleText: string | React.ReactNode,
    visibleTextNumberOfLines?: number,
    expandableText: string | React.ReactNode,
    cardStyle?: StyleProp<ViewStyle>,
    cardContentStyle?: StyleProp<ViewStyle>,
}

export default ExpandableInfoCard