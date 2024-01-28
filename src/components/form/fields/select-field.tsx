import  { ReactComponent as DropIcon } from '@/components/form/assets/down.svg';
import { ReactComponent as CheckIcon} from '@/components/form/assets/check.svg';
import { useCallback, useEffect, useRef, useState } from 'react';

type SelectValue = string | number;

type ItemValue = {text:string, value: SelectValue}

interface SelectFieldProps {
    label: string;
    name: string;
    value: SelectValue | SelectValue[] | undefined;
    placeholder?: string;
    className?: string;
    items: {
        text: string;
        value: SelectValue;
    }[];
    onChange: (e: any) => void;
    onBlur?: (e: any) => void;
}


/**
 * Select field
 * 
 * @description Select field component. This component is used to create select field
 * 
 * Main features:
 * - Select field can be single or multiple
 * - Select field can be searchable
 * 
 * Use shortkeys to navigate through select options:
 * - ArrowDown - select next option
 * - ArrowUp - select previous option
 * - Enter - select option
 * - Escape - close select
 * - Delete - clear selected value
 * 
 * 
 * 
 * @param {SelectFieldProps} props
 * @returns JSX.Element
 **/
const SelectField = ({ label, name, ...rest }: SelectFieldProps) => {

    const ref = useRef<HTMLDivElement>(null);
    const refOptions = useRef<HTMLDivElement>(null);
    const refInput = useRef<HTMLInputElement>(null);

    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');

    let initiated = false;
    let openTimeout:any = null;



    /**
     * Get items
     * 
     * @description Get items by search value
     * @returns ItemValue[]
     */
    const getItems = useCallback(() => {
        if(!search) return rest.items;
        return rest.items.filter(item => item.text.toLowerCase().includes(search.toLowerCase()));
    }, [search, rest.items]);




    /**
     * Worked items
     * 
     * @description Get items by search value, stored in items to avoid multiple calls of getItems 
    **/
    const items = getItems();




    /**
     * Handle open
     * 
     * @description Handle open select
     * @param {boolean} o
     * @returns void
     **/
    const handleOpen = (o:boolean) => {
        // set open state
        setOpen(o);

        if(o) manageDropdownPosition();
        
        // clear timeout
        if(openTimeout) clearTimeout(openTimeout);

        // wait state change and scroll to selected item
        openTimeout = setTimeout(() => {

            // scroll to selected item only if value is set and open is true
            if(o && rest.value){
                // find item
                const item = items.find(item => item.value == rest.value);
                if(item){
                    scrollToSelectedElement(item);
                }
            }
        }, 300);

    }




    /**
     * Handle select option click
     * 
     * @description Handle select option click. Selected value can be single or array, so we need to check if value is array and add or remove value from array
     * @param {React.MouseEvent<HTMLDivElement, MouseEvent>} e
     * @param {ItemValue} item
     * @returns void
     **/
    const handleSelectOptionClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, item: ItemValue | undefined) => {
        // prevent bubbling
        e.stopPropagation();
        // define value
        let value = item?.value || '';
        // create event
        const event:any = {
            target: {
                name,
                value: item?.value || ''
            }
        }
        // define is selected
        const is_selected = isSelected(item?.value || '')
        // if value is array, add or remove value from array
        if(Array.isArray(rest.value)){
            if(!is_selected) {
                event.target.value = rest.value.push(item?.value || '')
            } else {
                event.target.value = rest.value.filter(v => value !== value)
            }
            // return onChange to prevent next code execution
            return rest.onChange(event);
        }
        // if value is not array, set value or empty string
        event.target.value = !is_selected ? value : '';
        // call onChange
        rest.onChange(event);
        // close select, no need to be open
        handleOpen(false);
    }



    /**
     * Is selected
     * 
     * @description Check if value is selected. Keep in mind that value can be single or array
     * @param {SelectValue} val
     * @returns boolean
     **/
    const isSelected = (val:SelectValue):boolean => {

        // if value is undefined, return false. That means that value is not selected
        if(val === undefined) return false;

        // if value is array, check if array includes value
        if(Array.isArray(rest.value)){
            return rest.value.includes(val)
        }
        
        // if value is not array, check if value is equal to value
        return rest.value === val;
    }



    /**
     * Get selected value
     * 
     * @description Get selected value. Keep in mind that value can be single or array
     * @returns string
     **/
    const getSelectedValue = useCallback(() => {
        const values = Array.isArray(rest.value) ? rest.value : [rest.value];

        const __items = items.filter(item=> values.includes(item.value));

        const names:string[] = [];

        __items.map(item =>  names.push(item.text))

        return names.join(',')
    }, [rest.value, rest.items]);



    /**
     * Handle click select
     * 
     * @description Handle click select. Open or close select. This function is called when user click on select
     * @param {React.MouseEvent<HTMLDivElement, MouseEvent>} e
     * @returns void
     **/
    const handleClickSelect = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation();
        handleOpen(!open);
    }



    /**
     * Handle on key down
     * 
     * @description Handle on key down. Handle key events. This function is called when user press key on select
     * @param {React.KeyboardEvent<HTMLDivElement>} e
     * @returns void
     **/
    const handleOnKeyDowd = (e: React.KeyboardEvent<HTMLDivElement>) => {
        // prevent bubbling
        e.preventDefault();

        // if select is not open, open it
        if(!open) handleOpen(true);
     
        // get items
        const index = items.findIndex(item => item.value === rest.value);

        // define selected index
        let selectedIndex = index === -1 ? -1 : index;

        // switch key
        switch(e.key){
            case 'ArrowDown':
                if(open){
                    selectedIndex++;
                }
            break;
            case 'ArrowUp':
                if(open){
                    selectedIndex--;
                }
            
            break;
            case 'Enter':
            case 'Escape':
                setSearch('');

                // remove focus from input
                if(refInput.current) refInput.current.blur();

                return handleOpen(false);
            case 'Delete':
            case 'Backspace':
                selectedIndex = -1;
                handleOpen(false)
            break;
            default:
                if(refInput.current) refInput.current.focus();
            break;
        }

        // correct selected index
        if(selectedIndex < -1) selectedIndex = -1;
        if(selectedIndex >= items.length) selectedIndex = items.length - 1;

        // get selected item
        const item = items[selectedIndex];

        // if item is undefined, return empty string
        const event:any = {
            target: {
                name,
                value: item?.value || ''
            }
        }

        // call onChange
        rest.onChange(event);

        // scroll to selected item
        scrollToSelectedElement(item);
    }




    /**
     * Scroll to selected element
     * 
     * @description Scroll to selected element. This function is called when user select item with mouse or keyboard
     * Function scroll to selected item and keep it in view
     * Arguments used to calculate scroll position: 
     * - containerHeight - height of container
     * - selectedHeight - height of selected item
     * - scrollTop - scroll position
     * - selectedTop - top position of selected item
     * 
     * 
     * @param {ItemValue} item
     * @returns void
     **/
    const scrollToSelectedElement = (item:ItemValue) => {
        const options:any = refOptions.current;

        if(options){

            // find item and set selected class
            const optionsChildren = options.children;
            if(!optionsChildren) return;


            // This code used to avoid state update delay
            // We neet to manually add selected class to selected item
            // ------------------------------------------------
            const optionsChildrenArray = Array.from(optionsChildren);
            if(!optionsChildrenArray) return;

            optionsChildrenArray.map((child:any) => {
                if(child.dataset.value == item?.value){
                    child.classList.add('selected');
                } else {
                    child.classList.remove('selected');
                }
            });
            // ------------------------------------------------

            // get selected item
            const selected = options.querySelector('.select__option.selected');
            // if selected item is not found, return
            if(!selected) return;

            // define variables
            const containerHeight = options.clientHeight;
            const selectedHeight = selected.clientHeight;
            const scrollTop = options.scrollTop;

            let selectedTop = selected.offsetTop + selectedHeight;
            // correct selected top
            if(selectedTop < 0) selectedTop = 0;

            // scroll to selected item
            if(selectedTop > containerHeight){
                options.scrollTop = selectedTop - containerHeight;
                return;
            }
            if(scrollTop - selectedHeight < 0){
                options.scrollTop = 0;
            }
        }
    }




    /**
     * Events
     * 
     * @description Initiate events. This function is called when component is mounted
     */
    const events = () => {
        if(!initiated)
        document.addEventListener('click', (e) => {
            if(open === true)
                handleOpen(false);
        });
        initiated = true;
    }




    /**
     * Destroy events
     * 
     * @description Destroy events. This function is called when component is unmounted
     */
    const destroyEvents = () => {
        document.removeEventListener('click', () => {});
        initiated = false;

    }




    /** 
     * Handle search
     * 
     * @description Handle search. This function is called when user type in input
     * @param {React.ChangeEvent<HTMLInputElement>} e
     * @returns void
     * */
    const handleSearch = (e:React.ChangeEvent<HTMLInputElement>) => {
        e.stopPropagation();
        e.preventDefault();
        setSearch(e.target.value);
        if(!open) handleOpen(true);
    }


    /**
     * Manage dropdown position
     * 
     * @description Manage dropdown position.
     * check if dropdown is out of screen and move it to the top or bottom
     * @returns void
     * */
    const manageDropdownPosition = () => {

        const options = refOptions.current;
        const select = ref.current;


        if(!options || !select) return;

        options.classList.add('select__options__opened_temporary');

        const optionsHeight = options.clientHeight;
        const selectHeight = select.clientHeight;
        const selectTop = select.offsetTop;
        const selectBottom = selectTop + selectHeight;

        const windowHeight = window.innerHeight;
        const scrollTop = document.documentElement.scrollTop;

        const optionsTop = selectBottom - scrollTop;
        const optionsBottom = optionsTop + optionsHeight;

        if(optionsBottom > windowHeight){
            options.style.top = `-${optionsHeight + 20}px`;
        } else {
            options.style.top = `${selectHeight}px`;
        }

        options.classList.remove('select__options__opened_temporary');
    }


    /**
     * Use effect
     * 
     * @description Use effect. This function is called when component is mounted or updated
     */
    useEffect(() => {
        if(!initiated){
            events();
        }

        return () => {
            destroyEvents();
            if(openTimeout) clearTimeout(openTimeout);
        }
    }, [ref.current, refOptions.current, rest.items, rest.value, open]);



    
    return (
        <div className="form-group prevent-highlight">
            <label htmlFor={name}>{label}</label>
            <div className="select" ref={ref} tabIndex={0} onKeyDown={handleOnKeyDowd}>
                <div className={["select__content", (open?'active':'')].join(' ')} onClick={handleClickSelect}>
                    <input 
                        ref={refInput}
                        autoComplete="off"
                        className={["form-control", (!rest.value ? 'form-control-editable':''), (rest.className ? rest.className : '')].join(' ')}
                        id={name}
                        name={name}
                        placeholder={rest.placeholder || ''}
                        value={getSelectedValue() || search}
                        onChange={handleSearch}
                        onKeyDownCapture={(e) => {
                            switch(e.key){
                                case 'ArrowDown':
                                case 'ArrowUp':
                                    
                                break;
                                case 'Delete':
                                    setSearch('');
                                    e.stopPropagation()
                                    refInput.current?.focus();
                                break;
                                default:
                                    if(!rest.value){
                                        e.stopPropagation();
                                    }
                                break;
                            }
                            
                        }}
                    />
                    <div className="select__dropdown">
                        <DropIcon />
                    </div>
                </div>
                <div className={["select__options", (open ? 'select__options__opened':'')].join(' ')} ref={refOptions}>
                    {items.map((item, index) => { 
                        const is_selected = isSelected(item.value);
                        return (<div 
                            key={`${name}-${index}`} 
                            className={["select__option", (is_selected ? 'selected':'')].join(' ')} 
                            onClick={(e) => handleSelectOptionClick(e, item)}
                            data-value={item.value}>
                                {item.text}
                                {is_selected && <div className='select__options__icon'><CheckIcon /></div>}
                            </div>
                    )})}
                </div>
            </div>
        </div>
    );
}

export default SelectField;