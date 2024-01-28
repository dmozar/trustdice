interface InputFieldProps {
    label: string;
    name: string;
    type: string;
    placeholder?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

const InputField = ({ label, name, ...rest }: InputFieldProps) => {

    return (
        <div className="form-group">
            <label htmlFor={name} className="prevent-highlight">{label}</label>
            <input
                className="form-control"
                id={name}
                name={name}
                {...rest}
            />
        </div>
    );
}

export default InputField;