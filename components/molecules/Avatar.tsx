import React from "react";
import { StyleProp, StyleSheet, View } from "react-native";
import { ImageStyle } from "react-native-fast-image";
import { useSelector } from "react-redux";
import { userSelectors } from "../../../store/slices/UserSlice";
import commonStyles from "../../../styles/Common";
import { theme } from "../../../styles/Theme";
import ThemeImage from "../../atoms/ThemeImage";

const Avatar = ({ userID, size = 32, useDefaultStyling = true, style }: AvatarProps) => {

    const { url, sid, avatarSignature } = useSelector(userSelectors.selectAvatarProps)

    const [showPlaceholder, setShowPlaceholder] = React.useState(false)

    const onError = () => {
        setShowPlaceholder(true)
    }

    React.useEffect(() => {
        setShowPlaceholder(false)
    }, [avatarSignature])

    // avatarSignature is not a parameter used by the service
    // we change the url used by the FastImage library
    // so it will not load the image that was cached in the disk again
    return (
        showPlaceholder == false ?
            <ThemeImage
                source={{
                    uri: `${url}?userid=${userID}&avatarSignature=${avatarSignature}`,
                    headers: {
                        Cookie: `sid=${sid};`
                    },
                    cache: "web",
                }}
                resizeMode="contain"
                onError={onError}
                style={[
                    styles.imageStyle,
                    useDefaultStyling && commonStyles.avatar,
                    { width: size, height: size, borderRadius: size / 2 },
                    style
                ]}

            />
            :
            <View
                style={[
                    useDefaultStyling && commonStyles.avatar,
                    size ? { width: size, height: size, borderRadius: size / 2 } : undefined,
                ]}
            >
                <ThemeImage
                    source={require("../../../../assets/images/avatar_default.png")}
                    resizeMode="contain"
                    style={[
                        { padding: size * 0.25 },
                        style
                    ]}
                />
            </View>
    )
}

const styles = StyleSheet.create({
    imageStyle: {
        height: 32,
        width: 32,
        backgroundColor: theme.colors.primary
    },
});

interface AvatarProps {
    userID: string | null | undefined,
    useDefaultStyling?: boolean,
    size?: number,
    style?: StyleProp<ImageStyle>,
}

export default Avatar;