import { useCatalog } from "@/app/context/catalog-context";
import Modal from "@/components/modal";
import Table from "@/components/table";
import { CatalogItem, TableRow } from "@/types";
import { useCallback, useState } from "react";
import ConfirmDelete from "./confirm-delete";
import { useMessage } from "@/app/context/message-context";


function renderCountryCell(key:string, value:string, countries: any) {
    const country = countries.find((item:any) => item.id == value);
    if(country) return country.title;
    return value;
}


const DeleteList = () => {

    const { deleteList, closeDeleteList, displayedList, countries, deleteItem, removedItems } = useCatalog();

    const { setPageLoad, showMessage } = useMessage();

    const [activeDelete, setActiveDelete] = useState<number|null>(null)

    const columns = [
        {title: 'Tab', key: 'tab', render: (key:string, value:any) => <span>{value}</span>},
        {title: 'Country', key: 'country', render: (key:string, value:any) => renderCountryCell(key, value, countries)},
        {title: 'Fruit', key: 'fruit'},
        {title: 'Action', key: 'action'}
    ];

    const handleDeleteClick = (item:CatalogItem) => {
        setActiveDelete(item.id)
    }

    const onCancelDelete = () => {
        setActiveDelete(null);
    }

    const onConfirmDelete = (item: CatalogItem, rest:any) => {
        rest.setActiveDelete(null);
        setPageLoad(true);
        deleteItem(item).then((res) => {
            setPageLoad(false);
            if(!res) {
                const messageOpt = {
                    closeText: 'Close',
                }
                showMessage('Error', 'There was an error while deleting the item. Please try again', 'error', messageOpt);
            } 
        })
    }

    const getRows = useCallback(() => {
        return displayedList.map((item) => {
            const tab = {
                id: item.id,
                fruit: item.title,
                country: item.country,
                tab: '',
                action: (row:TableRow, rest:any) => {
                    return (<div style={{position:'relative'}}>
                        <span className="table-txt-click prevent-highlight" onClick={() => handleDeleteClick(item)}>Delete</span>
                        {rest.activeDelete === item.id && <ConfirmDelete item={item} cancel={onCancelDelete} confirm={() => onConfirmDelete(item, rest)} />}
                    </div>)
                }
            }

            const t = [];
            if(item.attributes.filter.hot) t.push('Hot');
            if(item.attributes.filter.recommended) t.push('Recommended');
            if(item.attributes.filter.new) t.push('New');

            if(t.length) tab.tab = t.join(', ');

            return tab;
        }).filter((item) => !removedItems.find((i) => i.id === item.id));
    }, [displayedList, removedItems])

    const rows:TableRow[] = getRows() as unknown as TableRow[];
   
    return (
            <Modal
                title={'Delete fruits'}
                open={deleteList}
                closeIcon={true}
                onClose={closeDeleteList}    
            >
                <div className="form-page" style={{padding: '10px 20px'}}>
                    <Table rows={rows} columns={columns} key={`active-${activeDelete}`} rest={{activeDelete, setActiveDelete}} />
                </div>
            </Modal>
    )
}

export default DeleteList;