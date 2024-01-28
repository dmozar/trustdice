import AdminButtons from "@/components/admin-buttons";
import Catalog from "@/components/catalog";
import Header from "@/components/header";
import Title from "@/components/title";
import { Fragment } from "react";

function Home() {
    return <Fragment>
        <Header>
            <Title title="Fruit Store" />
            <AdminButtons />
        </Header>
        <Catalog />
    </Fragment>;
}

export default Home;