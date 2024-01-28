import { FileType } from "@/types";
import { useRef, useState } from "react";
import { ReactComponent as Icon } from '@/components/form/assets/frame.svg';
import ItemImage from "@/components/catalog/components/image";
import { getImageUrl } from "@/helpers/img-helper";

interface UploadFieldProps {
    label: string;
    name: string;
    placeholder?: string;
    value: string | File | undefined;
    extensions: FileType[];
    className?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

const UploadField = ({ label, name, ...rest }: UploadFieldProps) => {

    const ref = useRef<HTMLInputElement>(null);


    const [url, setUrl] = useState<string>('');


    const createObjectURL = async (file: File | string) => {
        return new Promise<string>((resolve, reject) => {
            if (typeof file === 'string') {
                resolve(file);
            } else {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = error => reject(error);
            }
        });
    }


    const sendEvent = (file: string) => {
        if (rest.onChange) rest.onChange({
            target: {
                name: name,
                value: file
            }
        } as any);
    }


    const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {

        setUrl('');

        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];

            createObjectURL(file).then((url) => {
                sendEvent(url);
            }).catch((err) => {
                console.log('error img');
                sendEvent('');
            });
        } else {
            if (ref.current) ref.current.value = '';
            sendEvent('');
        }
    }



    const onUrlChange = async (e: React.ChangeEvent<HTMLInputElement>) => {

        const urlstr = e.target.value;
        if(urlstr){
            const validateImageURL = (url: string) => {
                return (url.match(/\.(jpeg|jpg|gif|png)$/) != null);
            }

            if(validateImageURL(urlstr)){
                sendEvent(urlstr);
            }
        }

        setUrl(urlstr);
    }



    const props = {
        onChange: onFileChange,
        placeholder: rest.placeholder || 'Select file',
    }

    return (
        <div className="form-group">
            <label className="prevent-highlight">{label}</label>
            <div className="form-file">
                <div className="form-file__button">
                    <input
                        className="form-control"
                        type="file"
                        id={name}
                        name={name}
                        {...props}
                    />
                    <div className="form-file__button__text">
                        {rest.value ? 'Change file' : 'Select file'}
                    </div>
                </div>
                <div className={["form-file__preview prevent-highlight", (rest.className || '')].join(' ')}>
                    <figure>
                        {rest.value && <ItemImage src={getImageUrl(rest.value as string)} alt={rest.value as string} />}
                        {!rest.value && <div className="flex flex-column gap-10 flex-ai-center flex-js-center">
                            <Icon />
                            <small>icon preview</small>
                        </div>}
                    </figure>
                </div>
                <div className="form-file__url">
                    <input
                        className="form-control"
                        type="text"
                        placeholder="if you don’t have local picture, please input icon URL."
                        onChangeCapture={onUrlChange}
                        value={url}
                        onChange={()=>{}}
                    />
                </div>
            </div>
            
        </div>
    );
}

export default UploadField;