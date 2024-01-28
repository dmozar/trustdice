import { CatalogItem, Country } from "@/types"

export const DatabaseService = {

    loadData: async (): Promise<{items: CatalogItem[], countries: Country[]}> => {
        return new Promise((resolve: any, rejected: any) => {
            fetch('/api/mock_data_load.json')
                .then(response => response.json())
                .then((data) => {
                    resolve({items: data.stock as CatalogItem[], countries: data.countries as Country[]});
                }).catch((err: any) => {
                    rejected(err)
                })
        })
    },

    get: async (index: number, items: CatalogItem[]): Promise<CatalogItem[]> => {

        return new Promise((resolve: any) => {

            const filteredItems = items.filter((item: CatalogItem) => {
                switch (index) {
                    case -1:
                        return false;
                    case 0:
                        return item.attributes.filter.hot;
                    case 1:
                        return item.attributes.filter.new;
                    case 2:
                        return item.attributes.filter.recommended;
                    default:
                        return true;
                }
            });

            const result = filteredItems.sort((a: CatalogItem, b: CatalogItem) => {
                return a.title.localeCompare(b.title);
                //return a.price - b.price;
            });

            resolve(result);

        })
    }
}

