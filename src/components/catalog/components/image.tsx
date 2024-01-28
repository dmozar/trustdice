import { CONFIG } from "@/app/config";
import { getImageUrl } from "@/helpers/img-helper";
import { memo, FC, useEffect, useState } from "react"

type ImageProps = {
    alt: string,
    src: string,
    width?: number | string,
    height?: number | string,
    className?: string,
    defaultSrc?: string,
    errorSrc?: string,
    onClick?: (e: Event) => void,
    style?: React.CSSProperties
}

const ItemImage:FC<ImageProps> = (props) => {

    const [src, setSrc] = useState<string>(props.defaultSrc || CONFIG.ITEM_IMAGE_URL + 'blank.png');

    useEffect(() => {

        const src = getImageUrl( props.src );

        const img = new Image();
        img.src = src;

        img.onload = () => {
            setSrc(props.src);
        }

        img.onerror = () => {
            setSrc(props.errorSrc || props.defaultSrc || CONFIG.ITEM_IMAGE_URL + 'blank.png');
        }

    }, [props.src]);

    const imageProps:any = {
        alt: props.alt,
        src: src,
        className: props.className ? props.className : '',
        style: props.style ? props.style : {},
        onClick: props.onClick ? props.onClick : () => {}
    }

    if(props.width) imageProps.style.width = props.width;
    if(props.height) imageProps.style.height = props.height;

    return <figure className="catalog-item__image"><img {...imageProps} /></figure>
}

export default memo(ItemImage);