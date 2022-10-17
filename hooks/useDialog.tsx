import React from "react";

export default (initialVisibility: boolean = false): [visible: boolean, showDialog: () => void, hideDialog: () => void] => {
    const [visible, setVisible] = React.useState(initialVisibility)

	const showDialog = () => {
        setVisible(true)
    }

	const hideDialog = () => {
        setVisible(false)
    }

    return [visible, showDialog, hideDialog]
};
