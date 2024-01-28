import React, { memo, FC } from "react";

interface Props {
    children: React.ReactNode
}

const Header:FC<Props> = (props) => {
    return (
        <header>
            {props.children}
        </header>
    )
}

export default memo(Header)