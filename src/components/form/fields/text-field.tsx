interface TextFieldProps {
    label: string;
    name: string;
    placeholder?: string;
    value: string;
    height?: number;
    className?: string;
    style?: any;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const TextField = ({ label, name, value, ...rest }: TextFieldProps) => {

    const props = {
        placeholder: rest.placeholder || '',
        onChange: rest.onChange || (() => { }),
        value: value || '',
        style: {...(rest.style || {}), height: rest.height || 100}
    }

    return (
        <div className="form-group">
            <label htmlFor={name} className="prevent-highlight">{label}</label>
            <textarea
                className={["form-control", (rest.className || '')].join(' ')}
                id={name}
                name={name}
                {...props}
            ></textarea>
        </div>
    );
}

export default TextField;