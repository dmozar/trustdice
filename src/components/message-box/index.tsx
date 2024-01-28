import { useMessage } from "@/app/context/message-context"

import { ReactComponent as SuccesIcon } from './assets/success.svg';
import { ReactComponent as InfoIcon } from './assets/info.svg';
import { ReactComponent as ErrorIcon } from './assets/error.svg';
import { ReactComponent as WarningIcon } from './assets/warning.svg';

export default function MessageBox(){
    
    const {open, closeMessage, data} = useMessage()

    const show = open && data;

    const getIcon = () => {
        switch(data?.type){
            case 'error':
                return <ErrorIcon />
            case 'info':
                return <InfoIcon />
            case 'success':
                return <SuccesIcon />
            case 'warning':
                return <WarningIcon />
            default:
                return <InfoIcon />
        }
    }

    return <div className={['message-box', (show ? 'message-show' : 'message-hide')].join(' ')} onClick={closeMessage}>
        <div className={['message-box-box', (show ? 'message-box-show' : 'message-box-hide')].join(' ')} onClick={(e)=>e.stopPropagation()}>
            <div className="message-header">
                <h3>{data?.title || ''}</h3>
            </div>
            <div className={`message-icon ${data?.type || 'info'}`}>
                {getIcon()}
            </div>
            <div className="message-content">{data?.text || ''}</div>
            <div className="message-footer">
                <button onClick={closeMessage}>{data?.options?.closeText || 'Close'}</button>
            </div>
        </div>
    </div>

}