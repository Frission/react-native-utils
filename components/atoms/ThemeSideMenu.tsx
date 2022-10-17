import React from "react";
import { Easing, View } from "react-native";
import { Animated, useWindowDimensions } from "react-native";
import SideMenu, { ReactNativeSideMenuProps } from "react-native-side-menu-updated";
import DrawerLayout, { DrawerState } from 'react-native-gesture-handler/DrawerLayout';
import { theme } from "../../styles/Theme";
import devlog from "../../util/devlog";

export interface ThemeSideMenuRef {
    openDrawer(): void,
    closeDrawer(): void,
}

const ThemeSideMenu = React.forwardRef<ThemeSideMenuRef, ThemeSideMenuProps>(({
    menu,
    menuPosition,
    disabled,
    fullscreen,
    children,
    drawerRelativeWidth,
    onChange
}, ref) => {

    const dimensions = useWindowDimensions()
    const drawerRef = React.useRef<DrawerLayout>(null)

    React.useImperativeHandle(ref, () => ({
        openDrawer() {
            drawerRef.current?.openDrawer()
        },
        closeDrawer() {
            drawerRef.current?.closeDrawer()
        }
    }))

    const [blockChildTouches, setBlockChildTouches] = React.useState(false)

    const drawMenu = React.useCallback(() => {
        return menu
    }, [menu])

    const onDrawerClose = React.useCallback(() => {
        setBlockChildTouches(false)
        if (onChange)
            onChange(false)
    }, [onChange])

    const onDrawerOpen = React.useCallback(() => {
        setBlockChildTouches(true)
        if (onChange)
            onChange(true)
    }, [onChange])

    const onDrawerSlide = React.useCallback((position: number) => {
        setBlockChildTouches(position > 0)
    }, [])

    let drawerWidth = dimensions.width

    if(drawerRelativeWidth != null && drawerRelativeWidth > 0 && drawerRelativeWidth <= 1)
        drawerWidth *= drawerRelativeWidth
    else if(fullscreen == true)
        drawerWidth *= 1
    else
        drawerWidth *= 0.6

    return (
        <DrawerLayout
            ref={drawerRef}
            drawerWidth={drawerWidth}
            renderNavigationView={drawMenu}
            drawerType="front"
            drawerBackgroundColor={theme.colors.background}
            drawerPosition={menuPosition}
            onDrawerClose={onDrawerClose}
            onDrawerOpen={onDrawerOpen}
            onDrawerSlide={onDrawerSlide}
        >
            <View style={{ flex: 1 }} pointerEvents={blockChildTouches ? "box-only" : "auto"}>
                {children}
            </View>
        </DrawerLayout>
    )
})

interface ThemeSideMenuProps {
    menu: React.ReactNode | React.ReactNodeArray,
    menuPosition: "right" | "left",
    isOpen?: boolean,
    onChange?: (open: boolean) => void,
    children?: React.ReactNode | React.ReactNodeArray,
    fullscreen?: boolean,
    /** a range between 0 and 1, 1 means drawer will ocuupy the whole screen */
    drawerRelativeWidth?: number,
    disabled?: boolean,
}

export default ThemeSideMenu