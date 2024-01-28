import { FC, useEffect, useState } from 'react';
import SectionTitle from './section-title';

interface ModalProps {
    title: string;
    children: React.ReactNode;
    open: boolean;
    buttons?: React.ReactNode;
    closeIcon?: boolean;
    onClose?: () => void;
}

const Modal: FC<ModalProps> = (props) => {

    const [open, setOpen] = useState(false);

    const getCloseIcon = () => {

        if(props.closeIcon === true) return (<div className="modal__close" onClick={() => {
            setOpen(false);
            if(props.onClose) props.onClose();
        }}>✕</div>);

        return null;
    }

    useEffect(() => {
        setOpen(props.open);
    }, [props.open])

    if (props.open === false) return null;

    return (<div className={`modal ${open !== false ? 'modal-active' : ''}`}>
        <div className="modal__content">
            <div className="modal__title"><SectionTitle title={props.title} />{getCloseIcon()}</div>
            <div className="modal__body">{props.children}</div>
            <div className="modal__footer">{props.buttons || null}</div>
        </div>
    </div>);
}

export default Modal;