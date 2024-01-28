import React, { memo, FC } from "react"

interface TabProps {
    children: React.ReactNode;
    active?: number;
    onClick?: (index: number) => void;
}

type ButtonType = {
    onClick: (e: Event) => void,
    className?: string,
    children: React.ReactNode
}

const Tabs: FC<TabProps> = (props) => {

    const [active, setActive] = React.useState(props.active || 0);

    function handleClick(e:Event, index: number) {
        setActive(index);
        if (props.onClick) {
            props.onClick(index);
        }
    }

    const renderChildren = () => {

        // map through children and add active class if active, onClick, className, etc.
        const clonedChildren = React.Children.map(props.children as React.ReactElement<ButtonType>[], (child:React.ReactElement<ButtonType>, index:number) => {

            // check if child button, if is not return child untouched
            // if active, add active class to className prop
            // onClick should call handleClick with index

            // check is button
            if (React.isValidElement(child) && child.type === 'button') {
                // clone child
                return React.cloneElement(child, {
                    key: 'tab-' + index,
                    onClick: (e:Event) => handleClick(e, index),
                    className: active === index ? 'active' : '',
                });
            }

            return child;
        });

        return clonedChildren || null;
    }

    return (
        <div className="tabs">
            {renderChildren() || null}
        </div>
    )
}

export default memo(Tabs)