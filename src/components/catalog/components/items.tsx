import { CatalogGroup, CatalogItem } from "@/types";
import { memo, FC, useEffect, useState, Fragment } from "react"
import Item from "./item";
import Loader from "@/components/loader";
import Empty from "./empty";
import NoItems from "./no-items";
import Error from "./error";
import { useCatalog } from "@/app/context/catalog-context";

interface Props {
    index: CatalogGroup
}

const Items:FC<Props> = (props) => {

    const { busy, isLoaded, error, loadIndex, getItems, removeBusy } = useCatalog();

    const [items, setItems] = useState<CatalogItem[]>([] as CatalogItem[]);

    const load = async () => {

        if(!isLoaded) return;

        const res = await getItems(props.index);
        removeBusy().then(() => {
            setItems(res as CatalogItem[]);
        });
    }

    const getView = () => {

        if(error) return <Error msg={error} />

        if(busy && !items.length) return <Loader />

        // if(!isLoaded) return <Empty />

        if(items.length === 0) return <NoItems />

        if(busy && items.length) return (
            <Fragment>
                <Loader className="abs-position"/>
                {items.map((item:CatalogItem, index:number) => <Item key={'cat-'+index} item={item} />)}
            </Fragment>
        )

        return  items.map((item:CatalogItem, index:number) => <Item key={'cat-'+index} item={item} />)
    }


    useEffect(() => {
        load();
    }, [loadIndex, props.index]);

    const key = 'cat-' + props.index + '-' + loadIndex;

    return (
        <div className={["catalog-list", (busy ? "catalog-list-overlay" : ''), (isLoaded ? '' : 'catalog-list-disabled')].join(' ')} data-key={key}>
            {getView()}
        </div>
    )
}

export default memo(Items);
