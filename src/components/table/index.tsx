import { FC, memo } from 'react';
import { TableCell, TableColumn, TableRow } from '@/types';
import '@/styles/simple-table.scss'

interface TableProps {
    columns: TableColumn[];
    rows: TableRow[];
    className?: string;
    rest: any
}

const Table:FC<TableProps> = (props) => {

    const getCell = (row:any, column:TableColumn):any => {

        const key = column.key as string;
        const value = row[key];

        if(typeof value === 'function') return value(row, props.rest)

        if(column.render) return column.render(key, value, row, props.rest);

        return row[column.key as keyof TableRow] as TableCell;
    }


    return (
        <div className="simple-table">
            <table>
                <thead>
                    <tr>
                        {props.columns.map((column:TableColumn, index:number) => (
                            <th key={index}>{column.title}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {props.rows.map((row:TableRow, index:number) => (
                        <tr key={index}>
                            {props.columns.map((column:TableColumn, index2:number) => (
                                <td key={index + '-' + index2}>
                                    {getCell(row, column)}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )

}


export default memo(Table);