import { DatabaseService } from "@/services/database.service";
import React, { useEffect } from "react";
import { CatalogItem, CatalogGroup, Country } from "@/types"



export const CatalogContext = React.createContext({
    busy: false,
    isLoaded: false,
    error: '',
    editItem: undefined as CatalogItem | undefined | false,
    countries: [] as Country[],
    loadIndex: 0,
    deleteList: false,
    group: -1 as CatalogGroup,
    displayedList: [] as CatalogItem[],
    removedItems: [] as CatalogItem[],
    setEditItem: (item?: CatalogItem | undefined | false) => {},
    setBusy: (busy: boolean) => {},
    loadItems: () => Promise.resolve(),
    getItems: (index: CatalogGroup) => Promise.resolve([] as CatalogItem[]),
    removeBusy: () => Promise.resolve(true) as Promise<boolean>,
    addItem: (item: CatalogItem) => Promise.resolve(true) as Promise<boolean>,
    openDeleteList: () => {},
    closeDeleteList: () => {},
    deleteItem: (item: CatalogItem) => Promise.resolve(true||false) as Promise<boolean>,
});


function CatalogProvider({ children }: { children: React.ReactNode }) {

    let busyTimeout:any = null;

    const [deleteList, openDelete] = React.useState(false);

    const [items, setItems] = React.useState<CatalogItem[]>([]);

    const [countries, setCountries] = React.useState<Country[]>([]);

    const [busy, setBusy] = React.useState(false);

    const [isLoaded, setIsLoaded] = React.useState(false);

    const [error, setError] = React.useState('')

    const [editItem, setEditItem] = React.useState<CatalogItem | undefined | false>(false);

    const [newItems, setNewItems] = React.useState<CatalogItem[]>([]);

    const [loadIndex, setLoadIndex] = React.useState<number>(0);

    const [group, setGroup] = React.useState<CatalogGroup>(-1);

    const [displayedList, setDisplayedList] = React.useState<CatalogItem[]>([]);

    const [removedItems, setRemoveItems] = React.useState<CatalogItem[]>([]);


    const removeItems = (itemsCurrent:CatalogItem[], itemsRemoved:CatalogItem[]) => {
        const itms = [...itemsCurrent];

        // remove items
        const removed = [...itemsRemoved];

        // remove items from items list
        return itms.filter((item) => {
            const index = removed.findIndex((i) => i.id === item.id);
            return index === -1;
        });
    }


    const onLoaded = (data:{items:CatalogItem[], countries: Country[]}) => {

        const itms = [...data.items, ...newItems];

        setItems(removeItems(itms, removedItems));
        setNewItems([]);
        setRemoveItems([]);
        setDisplayedList([]);
        setCountries(data.countries);
        setIsLoaded(true);
        removeBusy();
        setLoadIndex((prev) => prev + 1);
    }

    const onError = (err:any) => {
        setError(err.message);
        removeBusy();
    }

    const loadItems = async():Promise<void> => {

        setBusy(true);
        setError('');

        if(items.length && countries.length) return onLoaded({items, countries});

        DatabaseService.loadData().then(onLoaded).catch(onError)
    }

    const removeBusy = async():Promise<boolean> => {
        return new Promise((resolve) => {
            busyTimeout = setTimeout(()=>{
                setBusy(false);
                resolve(true);
            }, 1000)
            
        })
    }

    const getItems = async (index: CatalogGroup):Promise<CatalogItem[]> => {
        setBusy(true);
        setGroup(index);
        const res = await DatabaseService.get(index, items);

        const filteredItems = removeItems(res, removedItems);

        setDisplayedList(filteredItems);
        return filteredItems;
    };


    const addItem = async (item: CatalogItem):Promise<boolean> => {

        setBusy(true);

        if(!item.id){
            // get max id
            const maxId = Math.max.apply(Math, items.map((item) => item.id));

            item.id = maxId + 1;

            setNewItems([...newItems, item]);
        } else {
            const index = items.findIndex((i) => i.id === item.id);
            if(index > -1) {
                const itms = [...items];
                itms[index] = item;
                setItems(itms);
            } else {
                setNewItems([...newItems, item]);
            }
        }

        

        setBusy(false);

        return new Promise((resolve)=>{
            setTimeout(()=>{
                setIsLoaded(false);
                resolve(true);
            }, 1500)
        })
    }

    const deleteItem = async (item: CatalogItem):Promise<boolean> => {

        // set random status but keep in minde that true must show in 80% of cases
        const random = Math.random();
        if(random < 0.2) return false;

        const rmid = [...removedItems];

        // check if item exists in removed items
        const index = rmid.findIndex((i) => i.id === item.id);
        if(index > -1) return true;

        setRemoveItems((prev) => [...prev, item]);

        if(busyTimeout) clearTimeout(busyTimeout);

        return new Promise((resolve)=>{
            busyTimeout = setTimeout(()=>{
                setIsLoaded(false);
                resolve(true);
            }, 1000);
        })
    }

    const openDeleteList = () => {
        openDelete(true);
    }

    const closeDeleteList = () => {
        openDelete(false);
    }


    useEffect(()=>{
        return () => {
            if(busyTimeout) clearTimeout(busyTimeout)
        }
    }, [busyTimeout])


    return <CatalogContext.Provider 
        value={
            {
                busy, 
                error, 
                isLoaded, 
                editItem, 
                countries, 
                loadIndex, 
                deleteList, 
                displayedList,
                group,
                removedItems,
                openDeleteList, 
                closeDeleteList, 
                setBusy, 
                loadItems, 
                getItems, 
                removeBusy, 
                setEditItem, 
                addItem,
                deleteItem
                }
            }>
        {children}
    </CatalogContext.Provider>;
}

export default CatalogProvider;

export const useCatalog = () => React.useContext(CatalogContext);