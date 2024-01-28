import { FC } from "react";

const Error:FC<{msg:string}> = (props) => {

    return <div className="error">{props.msg}</div>
}

export default Error