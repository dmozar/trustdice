import { FC, memo } from 'react';

interface Props {
    confirm: () => void
    cancel: () => void,
    text: string,
    icon: any
}

const InlineConfirm:FC<Props> = (props) => {

    const I = props.icon;

    const Icon:any = <I />;

    return <div className='inline-modal prevent-highlight'>
        <div className='inline-content'>
            <span className='inline-icon'>{Icon}</span>
            <span>{props.text}</span>
        </div>
        <div className='buttons flex flex-row flex-ai-end flex-jc-end'>
            <button className="btn" onClick={props.cancel}>Cancel</button>
            <button className="btn btn-primary" onClick={props.confirm}>OK</button>
        </div>
    </div>

}

export default memo(InlineConfirm);