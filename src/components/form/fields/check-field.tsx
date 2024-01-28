interface CheckFieldProps {
    label: string;
    name: string;
    value: string | boolean;
    className?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CheckField = ({ label, name, ...rest }: CheckFieldProps) => {

    const props:any = {...rest};
    if(props.value === true) props.value = 'true';
    if(props.value === false) props.value = 'false';

    props.value = props.value as string;

    return (
        <div className="form-group form-checkbox">
            <div className="form-checkbox__holder">
                <input
                    className="form-control"
                    id={name}
                    name={name}
                    type="checkbox"
                    checked={rest.value === 'true' || rest.value === true}
                    {...props}
                />
                <div className={["form-checkbox__icon", (rest.value === true || rest.value === 'true' ? 'checked' : '')].join(' ')}></div>
            </div>
           <label htmlFor={name} className="prevent-highlight">{label}</label>
        </div>
    );
}

export default CheckField;