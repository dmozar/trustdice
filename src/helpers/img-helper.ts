import { CONFIG } from "@/app/config";

export function getImageUrl(src:string) {
    // check if image is not empty
    if(!src) return CONFIG.ITEM_IMAGE_URL + 'blank.png';

    // check if image is not full url
    if(src.indexOf('http') === 0) return src;

    // chekc if image is data url
    if(src.indexOf('data:image') === 0) return src;

    if(src.indexOf('base64') === 0) return src;

    if(src.indexOf('blob') === 0) return src;

    if(src.indexOf(CONFIG.ITEM_IMAGE_URL) === 0) return src;

    // return full url
    return CONFIG.ITEM_IMAGE_URL + src;
}