import { CONFIG } from "@/app/config"
import { CatalogItem, Country } from "@/types"
import { memo, FC, Fragment } from "react"
import ItemImage from "@/components/catalog/components/image"
import { useCatalog } from "@/app/context/catalog-context"
import { getImageUrl } from "@/helpers/img-helper"

interface TitleProps {
    item: CatalogItem
}

const Item:FC<TitleProps> = (props) => {

    const { countries, setEditItem } = useCatalog();

    const getCountry = ():Country | null => {
        const country = countries.find((country:any) => country.id === props.item.country);
        return country || null;
    }

    const countryView = () => {
        const country = getCountry();
        if(!country) return null;

        return <div className="catalog-item__country">
            <span className="catalog-item__country-flag"><img src={CONFIG.COUNTRY_IMAGE_URL + country.icon} alt={country.title} /></span>
            <span className="catalog-item__country-name">{country.title}</span>
        </div>
    }

    return <Fragment>
        {countryView()}
        <div className="catalog-item prevent-highlight" onClick={()=>setEditItem(props.item)}>
            
            <ItemImage src={getImageUrl(props.item.image)} alt={props.item.title} errorSrc={CONFIG.ITEM_IMAGE_URL + 'blank.png'} defaultSrc={CONFIG.ITEM_IMAGE_URL + 'blank.png'} />
            <div className="catalog-item__data">
                <div className="catalog-item__name">{props.item.title}</div>
                <div className="catalog-item__description">{props.item.description}</div>
                <div className="catalog-item__price">$ {props.item.price}</div>
            </div>
        </div>
    </Fragment>
}

export default memo(Item)