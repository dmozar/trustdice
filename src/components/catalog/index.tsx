import { memo, useState } from "react";
import SectionTitle from "../section-title";
import CatalogTabs from "./components/tabs";
import Items from "./components/items";
import { CatalogGroup } from "@/types";
import EditItemModal from "./components/edit-item";

import "@/styles/catalog.scss";
import DeleteList from "./components/delete-list";
import { useCatalog } from "@/app/context/catalog-context";

function Catalog(){

    const { isLoaded } = useCatalog();

    const [activeTab, setActiveTab] = useState(0)

    return <main className={`catalog ${isLoaded ? '' : 'disabled-catalog'}`}>
        <SectionTitle title="Fruit list" />
        <CatalogTabs active={activeTab} onClick={setActiveTab} />
        <Items index={activeTab as CatalogGroup} />
        <EditItemModal />
        <DeleteList />
    </main>
}

export default memo( Catalog );