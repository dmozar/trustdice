import { CatalogItem } from "@/types";

export class FormService {

    static parseDefaultValues = (item: any):any => {

        let d:any = {};

        Object.keys(item).forEach((key: string) => {

            const value = item[key];

            if(typeof value === 'object') {
                const values = FormService.parseDefaultValues(value);
                d = {...d, ...values};
            } else {
                d[key] = value;
            }

        });
        return d;
    }


    static formatValuesToCatalogItem = (values: any): CatalogItem => {

        for(let key in values) {
            if(values[key] === null) {
                values[key] = '';
            }
            if(values[key] === undefined) {
                values[key] = '';
            }
            if(values[key] === 'null') {
                values[key] = '';
            }
            if(values[key] === 'undefined') {
                values[key] = '';
            }
            if(values[key] === 'NaN') {
                values[key] = '';
            }
            if(values[key] === 'false') {
                values[key] = false;
            }
            if(values[key] === 'true') {
                values[key] = true;
            }
            if(typeof values[key] === 'string' && !isNaN(Number(values[key]))) {
                values[key] = Number(values[key]);
            }
        }

        const item: CatalogItem = {
            id: values.id,
            title: values.title,
            price: values.price,
            image: values.image,
            description: values.description,
            category: values.category,
            country: values.country,
            attributes: {
                filter: {
                    hot: values.hot,
                    new: values.new,
                    recommended: values.recommended
                },
                details: {
                    color: values.color,
                    size: values.size,
                    material: values.material,
                    weight: values.weight,
                    count: values.count,
                    rating: values.rating,
                    available: values.available
                }
            }
        }
        return item;
    }
}