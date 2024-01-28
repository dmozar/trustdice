import { CatalogItem } from '@/types';
import { FC, memo } from 'react';
import { ReactComponent as Icon } from './assets/warning.svg';
import InlineConfirm from '@/components/inline-confirm';

interface Props {
    item: CatalogItem,
    confirm: () => void
    cancel: () => void
}

const ConfirmDelete:FC<Props> = (props) => {

    return <InlineConfirm 
        icon={Icon}
        text="Are you sure to delete this Fruit?"
        confirm={props.confirm}
        cancel={props.cancel}
    />
}

export default memo(ConfirmDelete);