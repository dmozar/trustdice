import { useCatalog } from "@/app/context/catalog-context";
import InputField from "@/components/form/fields/input-field";
import SelectField from "@/components/form/fields/select-field";
import ValidateProvider, { ValidateProviderContext } from "@/components/form/validate-provider";
import { FormService } from "@/services/form.service";
import { CatalogItem } from "@/types";
import { Fragment, useEffect, useState } from "react";
import UploadField from "@/components/form/fields/upload-field";
import TextField from "@/components/form/fields/text-field";
import Modal from "@/components/modal";

import '@/styles/form.scss';
import CheckField from "@/components/form/fields/check-field";
import { useMessage } from "@/app/context/message-context";

const rules = {
    'title': ['validateRequired', 'validateMinLength:3', 'validateMaxLength:50'],
    'price': ['validateRequired', 'validateNumber'],
    'country': ['validateRequired', 'validateNumber', 'validateMinValue:1'],
    'image': ['validateRequired', 'validateString'],
    'description': ['validateRequired', 'validateMinLength:3', 'validateMaxLength:250'],
    'hot': [],
    'recommended': []
}

const detailsRules = {
    'origin': [],
    'weight': ['validateRequired', 'validateString', 'validateMaxLength:50'],
    'size': ['validateString', 'validateMaxLength:25'],
    'color': ['validateString', 'validateMaxLength:50'],
    'shape': ['validateString', 'validateMaxLength:50'],
    'taste': ['validateString', 'validateMaxLength:50'],
    'vitamins': ['validateString', 'validateMaxLength:250'],
    'minerals': ['validateString', 'validateMaxLength:250'],
    'protein': ['validateString', 'validateMaxLength:50'],
    'fat': ['validateString', 'validateMaxLength:50'],
    'carbohydrates': ['validateString', 'validateMaxLength:50'],
    'calories': ['validateString', 'validateMaxLength:50'],
    'sugar': ['validateString', 'validateMaxLength:50'],
    'fiber': ['validateString', 'validateMaxLength:50']

}

const defaultData = {
    id: 0,
    title: '',
    description: '',
    price: 0,
    image: '',
    category: 'fruit',
    country: 0,
    attributes: {
        filter: {
            hot: false,
            new: false,
            recommended: false
        },
        details: {
            origin: "",
            weight: "",
            size: "",
            color: "",
            shape: "",
            taste: "",
            vitamins: "",
            minerals: "",
            protein: "",
            fat: "",
            carbohydrates: "",
            calories: "",
            sugar: "",
            fiber: ""
        }
    }
} as CatalogItem;

const EditItemModal = () => {

    const { editItem, setEditItem, countries, addItem } = useCatalog();

    const { setPageLoad, showMessage } = useMessage();

    const [data, setData] = useState<any>(FormService.parseDefaultValues(defaultData));

    const [page, setPage] = useState(1);

    const [errors, setErrors] = useState({} as any);

    const onFieldChange = (e: any) => {

        if(e.target.type === 'checkbox') e.target.value = e.target.checked;

        setData((prev: CatalogItem) => ({ ...prev, [e.target.name]: e.target.value }));
    }


    const submit = async (isValid: boolean, _errors: { [key: string]: boolean }): Promise<boolean> => {

        const values: any = { ...data };

        if (!values.id) values.new = true;

        const item = FormService.formatValuesToCatalogItem(values);

        const options = {
            closeText: 'Close'
        }

        if (isValid) {

            closeEditor(); 

            setPageLoad(true);

            await addItem(item);
            
            setPageLoad(false);

            showMessage('Success', `Fruit is ${values.new ? 'created' : 'updated'} successfully.`, 'success', options )

            return true;
        }

        showMessage('Error', `There was an error with submiting data. Please try againg`, 'error', options )

        return false;
    }

    const getCountries = () => {
        return countries.map(c => ({ text: c.title, value: c.id }));
    }


    const closeEditor = () => {
        setData(FormService.parseDefaultValues(defaultData));
        setEditItem(false);
        setPage(1);
    }


    const handleClickNext = () => {
        ValidateProviderContext.editForm.validateForm()
        setTimeout(() => {
            if (ValidateProviderContext.editForm.validateForm()) setPage(2);
        }, 200);

    }


    const formButtons = () => {
        return <Fragment>
            {page === 1 && <button type="button" className="btn btn-secondary" onClick={closeEditor}>Cancel</button>}
            {page === 2 && <button type="button" className="btn btn-secondary" onClick={() => setPage(1)}>Back</button>}
            {page === 2 && <button type="submit" className="btn btn-primary">Save</button>}
            {page === 1 && <button type="button" className="btn btn-primary" onClick={handleClickNext}>Next</button>}
        </Fragment>

    }

    useEffect(() => {
        ValidateProviderContext.editForm.reload();
    }, [countries])

    useEffect(() => {
        if (editItem === undefined) return;
        if (editItem === false) return;
        setData(FormService.parseDefaultValues(editItem as CatalogItem));
    }, [editItem])

    return (
        <ValidateProvider
            id={'editForm'}
            rules={page === 1 ? rules : detailsRules}
            onSubmit={submit}
            state={data}
            setErrors={setErrors}
            onDataChanged={setData}
        >
            <Modal
                title={editItem === undefined ? 'Add Fruit' : 'Edit Fruit'}
                open={editItem !== false}
                buttons={formButtons()}
            >
                <div className="form-page">
                    <div className={["form-page__page", (page === 1 ? 'form-page__active' : '')].join(' ')}>
                        <InputField
                            label="Title"
                            name="title"
                            type="text"
                            placeholder="Add fruit name"
                            onChange={onFieldChange}
                            value={data.title}
                        />
                        <SelectField
                            label="Country"
                            name="country"
                            value={data.country}
                            onChange={onFieldChange}
                            placeholder="Select country"
                            items={getCountries()}
                        />
                        <InputField
                            label="Price"
                            name="price"
                            type="text"
                            placeholder="Add fruit price. Example: 1.99"
                            onChange={onFieldChange}
                            value={data.price?.toString()}
                        />
                        <UploadField
                            label="Image"
                            name="image"
                            placeholder="Upload icon"
                            onChange={onFieldChange}
                            value={data.image}
                            extensions={['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']}
                        />
                        <TextField
                            label="Description"
                            name="description"
                            placeholder="Add fruit name"
                            onChange={onFieldChange}
                            value={data.description}
                        />
                        <div className="flex flex-row gap-30">
                            <CheckField
                                label="Hot"
                                name="hot"
                                onChange={onFieldChange}
                                value={data.hot}
                            />
                            <CheckField
                                label="Recommended"
                                name="recommended"
                                onChange={onFieldChange}
                                value={data.recommended}
                            />
                        </div>
                    </div>
                    <div className={["form-page__page", (page === 2 ? 'form-page__active' : '')].join(' ')}>
                        <InputField
                            label="Origin"
                            name="origin"
                            type="text"
                            placeholder="Add fruit origin. Example: USA"
                            onChange={onFieldChange}
                            value={data.origin?.toString()}
                        />
                        <InputField
                            label="Weight"
                            name="weight"
                            type="text"
                            placeholder="Add fruit weight. Example: 100g"
                            onChange={onFieldChange}
                            value={data.weight?.toString()}
                        />
                        <InputField
                            label="Size"
                            name="size"
                            type="text"
                            placeholder="Add fruit size. Example: 10cm"
                            onChange={onFieldChange}
                            value={data.size?.toString()}
                        />
                        <InputField
                            label="Color"
                            name="color"
                            type="text"
                            placeholder="Add fruit color. Example: Red"
                            onChange={onFieldChange}
                            value={data.color?.toString()}
                        />
                        <InputField
                            label="Shape"
                            name="shape"
                            type="text"
                            placeholder="Add fruit shape. Example: Round"
                            onChange={onFieldChange}
                            value={data.shape?.toString()}
                        />
                        <InputField
                            label="Taste"
                            name="taste"
                            type="text"
                            placeholder="Add fruit taste. Example: Sweet"
                            onChange={onFieldChange}
                            value={data.taste?.toString()}
                        />
                        <InputField
                            label="Vitamins"
                            name="vitamins"
                            type="text"
                            placeholder="Add fruit vitamins. Example: A, B, C"
                            onChange={onFieldChange}
                            value={data.vitamins?.toString()}
                        />
                        <InputField
                            label="Minerals"
                            name="minerals"
                            type="text"
                            placeholder="Add fruit minerals. Example: Iron, Calcium"
                            onChange={onFieldChange}
                            value={data.minerals?.toString()}
                        />
                        <InputField
                            label="Protein"
                            name="protein"
                            type="text"
                            placeholder="Add fruit protein. Example: 10g"
                            onChange={onFieldChange}
                            value={data.protein?.toString()}
                        />
                        <InputField
                            label="Fat"
                            name="fat"
                            type="text"
                            placeholder="Add fruit fat. Example: 10g"
                            onChange={onFieldChange}
                            value={data.fat?.toString()}
                        />
                        <InputField
                            label="Carbohydrates"
                            name="carbohydrates"
                            type="text"
                            placeholder="Add fruit carbohydrates. Example: 10g"
                            onChange={onFieldChange}
                            value={data.carbohydrates?.toString()}
                        />
                        <InputField
                            label="Calories"
                            name="calories"
                            type="text"
                            placeholder="Add fruit calories. Example: 10g"
                            onChange={onFieldChange}
                            value={data.calories?.toString()}
                        />
                        <InputField
                            label="Sugar"
                            name="sugar"
                            type="text"
                            placeholder="Add fruit sugar. Example: 10g"
                            onChange={onFieldChange}
                            value={data.sugar?.toString()}
                        />
                        <InputField
                            label="Fiber"
                            name="fiber"
                            type="text"
                            placeholder="Add fruit fiber. Example: 10g"
                            onChange={onFieldChange}
                            value={data.fiber?.toString()}
                        />
                    </div>
                </div>
            </Modal>
        </ValidateProvider>
    )
}

export default EditItemModal;