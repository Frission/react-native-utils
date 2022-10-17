import { StyleSheet } from 'react-native'
import React from 'react'
import ThemeDialog from '../ThemeDialog'
import useDialog from '../../../hooks/useDialog'
import ThemeText from '../../atoms/ThemeText'

const MessageDialog = ({ message, closedDialog, visibleDialog }: MessageDialogProps,) => {

    const [visible, showDialog, hideDialog] = useDialog(visibleDialog)

    const onCloseDialog = () => {
        hideDialog()
        closedDialog()
    }

    return (
        <ThemeDialog hideDialog={onCloseDialog} visible={visible}>
            <ThemeText>{message}</ThemeText>
        </ThemeDialog>
    )
}

export default MessageDialog

interface MessageDialogProps {
    message: string;
    visibleDialog: boolean;
    closedDialog: () => void;
}
