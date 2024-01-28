import Tabs from "@/components/tabs"

type Props = {
    active: number,
    onClick: (index: number) => void
}

export default function CatalogTabs({active, onClick}:Props){
        
        return <div className="catalog-tabs">
            <Tabs active={active} onClick={onClick}>
                <button>Hot</button>
                <button>New</button>
                <button>Recommended</button>
                <button>All</button>
            </Tabs>
        </div>
}