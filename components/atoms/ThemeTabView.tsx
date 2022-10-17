import React from "react"
import { Platform, StyleProp, StyleSheet, TextStyle, useWindowDimensions, View, ViewStyle } from "react-native"
import { SceneRendererProps, NavigationState, TabBar, TabView } from "react-native-tab-view"
import { Scene } from "react-native-tab-view/lib/typescript/src/types"
import { theme } from "../../styles/Theme"
import ThemeText from "./ThemeText"
import commonStyles from "../../styles/Common"
import { Props } from "react-native-tab-view/lib/typescript/src/TabBar"

const ThemeTabView = ({
    routes,
    tabViewContainerStyle,
    tabBarStyle,
    indicatorStyle,
    activeColor = theme.colors.textWhite,
    inactiveColor = theme.colors.lightGray,
    swipeEnabled = true,
    index: externalIndex,
}: ThemeTabViewProps) => {
    const layout = useWindowDimensions()

    const [index, setIndex] = React.useState(externalIndex ?? 0)
    const [tabRoutes] = React.useState(routes)

    React.useEffect(() => {
        if(externalIndex)
            setIndex(externalIndex)
    }, [externalIndex])

    const renderScene = React.useCallback((props: SceneRendererProps & { route: TabRoute }) => {
        return props.route.component
    }, [])

    const renderTabBar = React.useCallback((props: SceneRendererProps & { navigationState: NavigationState<TabRoute> }) => {
        return <ThemeTabBar
            {...props}
            style={tabBarStyle}
            indicatorStyle={indicatorStyle}
            activeColor={activeColor}
            inactiveColor={inactiveColor}
        />
    }, [])

    return <TabView
        navigationState={{ index, routes: tabRoutes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        style={[styles.tabView, tabViewContainerStyle]}
        renderTabBar={renderTabBar}
        swipeEnabled={swipeEnabled}
    />
}

export const ThemeTabBar = (props: SceneRendererProps & { navigationState: NavigationState<any> } & Partial<Props<TabRouteProps>>) => {

    const renderLabel = (labelProps: Scene<TabRouteProps> & { focused: boolean; color: string; } & LabelProps) => {
        return <CustomLabel {...labelProps} {...labelProps.route} />
    }

    return <TabBar
        {...props}
        indicatorStyle={[styles.indicator, props.indicatorStyle]}
        style={[styles.tabBar, props.style]}
        renderLabel={renderLabel}
        pressColor={theme.colors.accentFaint}
        pressOpacity={theme.activeOpacity}
    />
}

const CustomLabel = (props: Scene<TabRouteProps> & { focused: boolean, color: string } & LabelProps) => {
    return <View style={commonStyles.flexDirRow}>
        {props.labelLeft != null && props.labelLeft(props.focused)}
        <ThemeText style={[styles.label, { color: props.color }, props.labelStyle]}>
            {props.route?.title ?? props.route?.name}
        </ThemeText>
        {props.labelRight != null && props.labelRight(props.focused)}
    </View>
}

const styles = StyleSheet.create({
    tabView: {
        alignSelf: "stretch",
    },
    tabBar: {
        backgroundColor: theme.colors.secondary,
        height: Platform.select({ ios: 54, default: 58 }),
        justifyContent: "center",
    },
    indicator: {
        backgroundColor: theme.colors.accent,
        height: 3,
    },
    label: {
        fontSize: 12,
        color: theme.colors.textWhite,
        textAlignVertical: "center",
        textAlign: "center",
        marginHorizontal: 4,
     
    },
})

interface LabelProps {
    labelStyle?: StyleProp<TextStyle>,
    labelLeft?: (focused: boolean) => React.ReactNode,
    labelRight?: (focused: boolean) => React.ReactNode,
}

export interface TabRouteProps {
    key: string,
    title?: string,
    name?: string,
}

export interface TabRoute extends LabelProps, TabRouteProps {
    component: React.ReactNode,
}

interface ThemeTabViewProps {
    routes: Array<TabRoute>,
    tabViewContainerStyle?: StyleProp<ViewStyle>,
    tabBarStyle?: StyleProp<ViewStyle>,
    indicatorStyle?: StyleProp<ViewStyle>,
    activeColor?: string,
    inactiveColor?: string,
    swipeEnabled?: boolean,
    index?: number,
}

export default ThemeTabView