import React, { FC, useState, useEffect, Fragment, useCallback } from 'react';
import * as validate from './validate-functions';
import Loader from '../loader';
import { IValidateRule } from '@/types';



type Props = {
    children: React.ReactNode;
    id: string;
    state: any;
    rules: IValidateRule;
    onSubmit: (isValid:boolean, errors:any) => Promise<boolean>;
    setErrors: (errors:any) => void;
    onDataChanged: (e:any) => void;
}

export const ValidateProviderContext:any = {
    
}

const ValidateProvider:FC<Props> = (props) => {

    const { children, id, rules } = props;

    const [errors, setErrors] = useState({} as any);

    const [loadIndex, setLoadIndex] = useState(0);

    const handleChanges = (e: any, props: any) => {

        if (props.onChange) props.onChange(e);

        validateField(props.name, e.target.value);

    }

    const handleSubmit = () => {
        if (validateForm()) if (props.onSubmit) props.onSubmit(Object.keys(errors).length === 0, errors);
    }


    const validateField = (name: string, value: string):boolean => {

        let isValid = true;

        if (rules[name]) {
            for (let key in rules[name]) {
                let rul: string = rules[name][key];

                if (!rul || rul === '' || rul === undefined || typeof rul !== 'string') continue;

                let m = rul.split(':');
                rul = m[0];

                let args: any = [];

                if (m.length > 1) {
                    args = m[1].split(',');
                }

                try {
                    // @ts-ignore
                    const fn = validate[rul] as any;
                    const res = fn(value, ...args);
                    if (!res) {
                        isValid = false;
                    }
                } catch (error) {
                    console.error(`Error on rule ${key} for ${name}`, error);
                }
            }
        }

        if(!isValid) setErrors((prev:any) => ({...prev, [name]: true}));
        if(isValid){
            // remove error
            const ers = {...errors};
            delete ers[name];
            setErrors(ers);
        }

        return isValid;

    }


    const validateForm = () => {

        let isValid = true;
        let ers = {} as any;

        for (let name in rules) {
            const value = props.state[name];
            const isValid = validateField(name, value);
            if (!isValid) {
                ers[name] = true;   
            }
        }

        setErrors(ers);

        return isValid;

    }

    const renderChildren = (_children: React.ReactNode | undefined | null): React.ReactNode => {
        if (!children) return null;

        if(_children === undefined) return null;

        return React.Children.map(_children || children, (child: any) => {

            const props: any = {};
     
             if(typeof child === 'string' || typeof child === 'number') return child;

            // if form field or button
            if (child?.props?.name || child?.props?.type === 'submit') {
                // if element is button submit, add onClick handler
                
                if (child.type === 'button' && child.props.type === 'submit') {
                    props.onClick = handleSubmit;
                } else {
                    props.onChange = (e: any) => handleChanges(e, child.props);
                    if (errors[child.props.name]) props.className = 'input-error';
                }
            }

            if(!child) return null;

            let cloned = React.cloneElement(child, { ...child.props, ...props });
  
            if (cloned?.props?.children) {
                cloned = React.cloneElement(cloned, {
                    ...cloned.props,
                    ...props,
                    children: renderChildren(cloned.props.children) // Rekurzivno pozivanje renderChildren
                });
            }

            if (cloned?.props?.buttons){
                cloned = React.cloneElement(cloned, {
                    ...cloned.props,
                    ...props,
                    buttons: renderChildren(cloned.props.buttons) // Rekurzivno pozivanje renderChildren
                });
            }

            return cloned;
        });

    };


    ValidateProviderContext[id] = {
        reload: () => {
            setLoadIndex((prev:number) => prev + 1);
        },
        validateForm: () => {
            const st = validateForm();
            return st === true && Object.keys(errors).length === 0;
        },
    }

    return (
        <Fragment>
            {renderChildren(null)}
        </Fragment>
    )

}


export default ValidateProvider;