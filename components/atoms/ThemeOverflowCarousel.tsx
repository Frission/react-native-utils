import { debounce } from 'lodash';
import React from 'react'
import { Platform, StyleProp, StyleSheet, useWindowDimensions, View, ViewStyle } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler';
import devlog from '../../util/devlog';

const ThemeOverflowCarousel = ({
    pages,
    pageIndex = 0,
    setPageIndex,
    pageMargin = 60,
    width: componentWidth,
    animate = true,
    style,
    pageStyle }: ThemeOverflowCarouselProps) => {


    const scrollViewRef = React.useRef<ScrollView>(null)

    const { width } = useWindowDimensions()

    const pageWidth = componentWidth ? componentWidth - pageMargin : width - pageMargin

    React.useEffect(() => {
        if (pageIndex >= 0 && pageIndex < pages.length && scrollViewRef.current != null) {
            // used a timeout here because calling scroll immediately doesn't work
            // on ios for some reason
            setTimeout(() => scrollViewRef.current?.scrollTo({
                x: pageIndex * pageWidth,
                animated: animate,
            }), 50)
        }
    }, [pageIndex, scrollViewRef])

    const setIndex = React.useCallback(debounce((index: number) => {
        if (setPageIndex && pages.length > 1)
            setPageIndex(index)
    }, 700, { trailing: true, leading: false, }), [setPageIndex, pages])

    const onScrollEnd = (position: number) => {
        setIndex.cancel()
        setIndex(Math.round(position / pageWidth))
    }

    return (
        <View>
            <ScrollView
                ref={scrollViewRef}
                horizontal
                onMomentumScrollEnd={(e) => onScrollEnd(e.nativeEvent.contentOffset.x)}
                style={[styles.scrollView, style, { width: componentWidth ?? width }]}
                contentContainerStyle={{ paddingHorizontal: pageMargin / 2 }}
                snapToInterval={pageWidth}
                decelerationRate={Platform.select({ default: 0.9, ios: 0.99 })}
                showsHorizontalScrollIndicator={false}
            >
                {
                    pages?.map((item, index) => (
                        <View key={index} style={[styles.page, pageStyle, { width: pageWidth }]}>
                            {item}
                        </View>
                    ))
                }
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    scrollView: {
        alignSelf: 'stretch',
    },

    page: {
        alignItems: "stretch",
    },
})

export interface ThemeOverflowCarouselProps {
    pages: Array<React.ReactNode>,
    pageIndex?: number,
    setPageIndex?: (index: number) => void,
    pageMargin?: number,
    width?: number,
    animate?: boolean,
    style?: StyleProp<ViewStyle>,
    pageStyle?: StyleProp<ViewStyle>,
}

export default ThemeOverflowCarousel;