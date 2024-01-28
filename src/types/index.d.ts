export type CatalogGroup = -1 | 0 | 1 | 2;

export type CatalogItem = {
    id: number,
    title: string,
    price: number,
    image: string,
    description: string
    category: string,
    country: number,
    attributes: {
        filter: {
            hot: boolean,
            new: boolean,
            recommended: boolean
        },
        details: {
            [key: string]: string | number | boolean
        }
    }
}


export interface IValidateRule {
    [key: string]: {
        [key: string]: any
    }
}

export type Country = {
    id: number,
    title: string,
    icon: string,
}


export type FileType = 'image/jpeg' | 'image/png' | 'image/gif' | 'image/svg+xml' | 'image/webp';

export type MessageType = 'success' | 'warning' | 'info' | 'error'

export type MessageOptions = {
    closeText: string,
}

export type Message = {
    title: string,
    text: string,
    type: MessageType,
    options: MessageOptions
}

export type TableColumn = {
    title: string,
    key: string,
    sortable?: boolean,
    render?: (key:string, value: string|number|React.ReactElement, row?: TableRow, rest?: any) => React.ReactElement
}

export type TableCell = {[key: string | number]: string | number | boolean | React.ReactElement}

export type TableRow = TableCell[]