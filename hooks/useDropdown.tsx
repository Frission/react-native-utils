import React from "react";
import { DropdownItem } from "../components/atoms/ThemeDropdown";

export default (dropdownItems: Array<DropdownItem>, startingValue: DropdownItem):
    [
        value: DropdownItem,
        setValue: React.Dispatch<React.SetStateAction<DropdownItem>>,
        items: Array<DropdownItem>,
        setItems: React.Dispatch<React.SetStateAction<Array<DropdownItem>>>
    ] => {
    const [value, setValue] = React.useState<DropdownItem>(startingValue);
    const [items, setItems] = React.useState<Array<DropdownItem>>(dropdownItems);

    return [value, setValue, items, setItems];
}