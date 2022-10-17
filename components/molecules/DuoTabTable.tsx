import React from "react";
import { View, StyleSheet, useWindowDimensions, StyleProp, ViewStyle } from "react-native";
import { NavigationState, SceneRendererProps, TabBar, TabView } from "react-native-tab-view";
import { Route, Scene } from "react-native-tab-view/lib/typescript/src/types";
import { theme } from "../../../styles/Theme";
import ThemeText from "../../atoms/ThemeText";
import ThemeTable, { ThemeTableProps } from "./ThemeTable";

const DuoTabTable = ({ firstTableProps, secondTableProps, style }: DuoTabTableProps) => {
    const layout = useWindowDimensions()

    const [index, setIndex] = React.useState(0)
    const [routes] = React.useState([
        { key: 'avg', title: firstTableProps.title },
        { key: 'avgall', title: secondTableProps.title },
    ])

    const renderScene = (props: SceneRendererProps & { route: { key: string, title: string, } }) => {
        return RenderTables({ ...props, firstTableProps, secondTableProps })
    }

    return (
        <View style={[styles.container, style]}>
            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={{ width: layout.width }}
                style={styles.tabView}
                renderTabBar={CustomTabBar}
            />
        </View>
    )
}

const CustomTabBar = (props: SceneRendererProps & { navigationState: NavigationState<any> }) => {
    return <TabBar
        {...props}
        indicatorStyle={styles.indicator}
        style={styles.tabBar}
        renderLabel={CustomLabel}
        pressColor={theme.colors.accentFaint}
        pressOpacity={theme.activeOpacity}
    />
}

const CustomLabel = (props: Scene<any> & { focused: boolean, color: string }) => {
    return <ThemeText style={[styles.label, { color: props.focused ? theme.colors.textWhite : theme.colors.lightGray }]}>
        {props.route.title}
    </ThemeText>
}

const FirstTable = (props: ThemeTableProps) => {
    return <ThemeTable
        {...props}
    />
}

const SecondTable = (props: ThemeTableProps) => (
    <ThemeTable
        {...props}        
    />
)

const RenderTables = ({ firstTableProps, secondTableProps, route }: { firstTableProps: ThemeTableProps, secondTableProps: ThemeTableProps, route: Route, }) => {
    switch (route.key) {
        case "avg":
            return <FirstTable {...firstTableProps} />
        case "avgall":
            return <SecondTable {...secondTableProps} />
    }
}

const TAB_BAR_HEIGHT = 60

const styles = StyleSheet.create({
    container: {
        borderRadius: theme.roundness,
        borderWidth: 1,
        borderColor: theme.colors.secondary,
        overflow: "hidden",
    },
    tabView: {
        alignSelf: "stretch",
    },
    tabBar: {
        backgroundColor: theme.colors.secondary,
        height: TAB_BAR_HEIGHT,
        borderTopLeftRadius: theme.roundness,
        borderTopRightRadius: theme.roundness,
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
    },
})

interface DuoTabTableProps {
    firstTableProps: ThemeTableProps & { title: string },
    secondTableProps: ThemeTableProps & { title: string },
    style?: StyleProp<ViewStyle>,
}

export default DuoTabTable