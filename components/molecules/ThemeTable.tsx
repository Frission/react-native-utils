import React from 'react'
import { View, StyleSheet, ScrollView, StyleProp, ViewStyle, TextStyle } from 'react-native'
import commonStyles from '../../../styles/Common';
import { theme } from '../../../styles/Theme'
import ThemeText from '../../atoms/ThemeText';

const ThemeTable = ({
    headerData,
    tableData,
    tableBorderColor,
    tableColor,
    style,
    headerItemStyles,
    rowItemStyles,
    rowTextStyles,
}: ThemeTableProps) => {

    const backgroundColor = tableColor ? tableColor : theme.colors.tertiary


    return (
        <View style={[styles.container, style, { borderColor: tableBorderColor ? tableBorderColor : theme.colors.tertiary }]}>
            <View>
                {headerData && <View style={[styles.headerContainer, { backgroundColor }]}>
                    {
                        headerData?.map((headerItem, index) => {

                            let specificStyle = headerItemStyles?.has(index) ? headerItemStyles.get(index) : undefined

                            return <View
                                key={index}
                                style={[
                                    styles.headerSubContainer,
                                    { backgroundColor },
                                    commonStyles.flex,
                                    specificStyle,
                                ]}
                            >
                                {
                                    typeof headerItem === "string" ?
                                        <ThemeText style={styles.headerText}>{headerItem}</ThemeText>
                                        :
                                        headerItem
                                }
                            </View>
                        })
                    }
                </View>}


                {
                    tableData?.map((listItem, index) =>
                        <View key={index + "A"} style={[styles.row, { backgroundColor: index % 2 == 0 ? theme.colors.tableEven : theme.colors.tableOdd }]}>
                            {
                                listItem?.map((rowItem, listItemIndex) => {

                                    let specificStyle = rowItemStyles?.has(listItemIndex) ? rowItemStyles.get(listItemIndex) : undefined
                                    const textStyle = rowTextStyles?.has(listItemIndex) ? rowTextStyles.get(listItemIndex) : undefined
                                    
                                    return <View
                                        key={listItemIndex + "B"}
                                        style={[
                                            styles.rowItemSubContainer,
                                            commonStyles.flex,
                                            specificStyle
                                        ]}
                                    >
                                        {
                                            typeof rowItem === "string" ?
                                                <ThemeText style={textStyle}>{rowItem}</ThemeText>
                                                :
                                                rowItem
                                        }
                                    </View>
                                })
                            }
                        </View>
                    )
                }
            </View>
        </View>
    )
}

export type TableRow = Array<React.ReactNode | string>
export type TableData = Array<TableRow>

export interface ThemeTableProps {
    headerData?: TableRow,
    tableData?: TableData,
    tableColor?: string,
    tableBorderColor?: string,
    style?: StyleProp<ViewStyle>
    /** You can give specific styles to specific indexes */
    headerItemStyles?: Map<number, StyleProp<ViewStyle | TextStyle>>,
    rowItemStyles?: Map<number, StyleProp<ViewStyle | TextStyle>>,
    rowTextStyles?: Map<number, StyleProp<TextStyle>>,

}

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderRadius: 10,
        overflow: 'hidden',
    },
    headerContainer: {
        flexDirection: 'row',
        minHeight: 50,
    },
    headerSubContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    row: {
        alignSelf: "stretch",
        flexDirection: 'row'
    },
    rowItemSubContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 50
    },
    headerText: {
        textAlign: 'center',
        color: 'white',
        fontSize: 12
    },
})

export default ThemeTable;
