import { memo, FC } from "react"

interface TitleProps {
    title: string
}

const SectionTitle:FC<TitleProps> = (props) => {
    return <h3>{props.title}</h3>
}

export default memo(SectionTitle)