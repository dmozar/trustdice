export function validateRequired(value: any): boolean {
    return validateEmptyTrimBlank(value);

}

export function validateEmptyTrimBlank(value: any): boolean {
    if (value === undefined) {
        return false;
    }
    if (value === null) {
        return false;
    }
    if (value === '') {
        return false;
    }

    if (typeof value !== 'string') {
        return true;
    }

    try {
        if (value.trim() === '') {
            return false;
        }
    } catch (error) {
        console.log('validateEmptyTrimBlank error', error, 'value', value)
        return false;
    }
    return true;
}


export function validateEmail(email: string | undefined): boolean {
    if (!validateEmptyTrimBlank(email)) {
        return true;
    }
    const re = /\S+@\S+\.\S+/;
    const is_basic_valid = re.test(email || '');

    if(!is_basic_valid){
        return false;
    }

    // more strict validation
    const re2 = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const is_strict_valid = re2.test(email || '');

    if(!is_strict_valid){
        return false;
    }

    return true;
}


export const validateUrl = (url: string | undefined): boolean => {

    if (!validateEmptyTrimBlank(url)) {
        return true;
    }

    const re = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w.-]*)*\/?$/;
    return re.test(url || '');

}


export function validatePassword(password: string | undefined): boolean {
    if (!validateEmptyTrimBlank(password)) {
        return true;
    }

    if (password?.length && password.length < 8) {
        return false;
    }

    if (password?.length && password.length > 50) {
        return false;
    }

    if (password?.includes(' ')) {
        return false;
    }

    // test if password contains at least one digit
    const reDigit = /\d/;
    if (!reDigit.test(password || '')) {
        return false;
    }

    // test if password contains at least one lowercase letter
    const reLowercase = /[a-z]/;
    if (!reLowercase.test(password || '')) {
        return false;
    }

    // test if password contains at least one uppercase letter
    const reUppercase = /[A-Z]/;
    if (!reUppercase.test(password || '')) {
        return false;
    }

    // test if password contains at least one special character
    const reSpecial = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    if (!reSpecial.test(password || '')) {
        return false;
    }

    return true;
}



export function validatePhoneNumber(phone: string | undefined): boolean {
    if (!validateEmptyTrimBlank(phone)) {
        return true;
    }

    const allowedChars = [' ', '/', '-', '(', ')', '+', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

    let v = true;

    phone?.split('').forEach((char) => {
        if (!allowedChars.includes(char)) {
            v = false;
        }
    });

    const onlyNumbers = phone?.replace(/[^0-9]/g, '');

    if (onlyNumbers?.length && onlyNumbers.length < 8) {
        v = false;
    }

    if (onlyNumbers?.length && onlyNumbers.length > 15) {
        v = false;
    }

    const allowedFormatsPatterns = [
        /^\+\d{1,3}\s\d{3}\s\d{2,3}\s\d{1,5}$/, // +CC NPA NXX XXXX
        /^\+\d{1,3}-\d{3}-\d{2,3}-\d{2,5}$/, // +CC-NPA-NXX-XXXX
        /^\d{3}\s\d{2,4}\s\d{2,5}$/, // NPA NXX XXXX
        /^\d{3,6}\s\d{2,6}\s\d{2,5}$/, // NPA NXX XXXX
        /^\d{5,7}\s\d{2,4}\s\d{2,5}$/, // NPA NXX XXXX
        /^\d{4}\s\d{2,4}$/, // NPA NXX XXXX
        /^\d{3}-\d{2,5}-\d{2,5}$/, // NPA-NXX-XXXX
        /^\+\d{1,3}\s\(\d{3}\)\s\d{2,3}-\d{2,5}$/, // +CC (NPA) NXX-XXXX
        /^\+\d{1,3}\(\d{3}\)\s\d{2,3}\s\d{2,5}$/, // +CC (NPA) NXX-XXXX
        /^\+\d{1,3}\.\d{3}\.\d{2,3}\.\d{2,5}$/, // +CC.NPA.NXX.XXXX
        /^\+\d{1,3}\d{3}\d{2,3}\d{2,5}$/, // +CCNPANXXXXXX
        /^\d{8,10}$/, // NPANXXXXXX
        /^\+\d{1,3}[-\s]?\(?\d{2,3}\)?[-\s]?\d{3,4}[-\s]?\d{2,5}$/, // +CC NPA NXX XXXX or +CC (NPA) NXX-XXXX
        /^\d{3}[-\s]?\d[-\s]?\d{2}[-\s]?\d{2}[-\s]?\d{2}$/, // 060 5 11 99 14
        /^\d{3}[-/]\d{3}[-/]\d{2}[-/]\d{2}$/, // 060/511-99-14
        /^\d{3}[-\s]?\d{3}[-\s]?\d{2}$/, // 060 511 99 1
        /^\(\d{3}\)[-\/\s]?\d{3}[-\s]?\d{2}$/, // (060) 511 99 or (060) 511-99
        /^\+?\d{1,3}[-\s]?\(?\d{2,3}\)?[-\s]?\d{3}[-\s]?\d{2}[-\s]?\d{2}$/, // +CC NPA NXX XX XX or +CC (NPA) NXX-XX-XX
        /^\+?\d{1,3}\s?\(\d{2,3}\)[-\/\s]?\d{3}[-\/\s]?\d{2,3}$/, // +381 (60)-511-9914 or +381 (60)-511-991
        /^\+?\d{1,3}\s?\(\d{2,3}\)[-\/\s]?\d{3}[-\s]?\d{2}[-\s]?\d{2}$/, // +381 (60)-511-9914 or +381 (60) 511-9914
        /^\+?\d{1,3}[-\/]\d{2}[-\s]?\d{2}[-\s]?\d{2}$/, // 065/11-99-14 or 065/11 99 14
        /^00\s?\d{3}\s?\d{2,3}[-\s]?\d{3}[-\s]?\d{2}[-\s]?\d{2}$/, // 00 381 60 511 99 14 or 00 381 (60) 511 99 14
        /^\+?\d{1,3}\s?\(\d{2,3}\)[-\/\s]?\d{3}[-\s]?\d{2,4}$/, // +381 (60)-511991 or +381 (60) 511-991
        /^\+?\d{1,3}\s?\(\d{2,3}\)[-\/\s]?\d{3}[-\s]?\d{2,4}$/, // +381 (60)-511-99 or +381 (60) 511 99
        /^\+?\d{1,3}\s?\(\d{2,3}\)[-\/\s]?\d{3}[-\s]?\d{2}[-\s]?\d{2}$/, // +381 (60)-511-9914 or +381 (60) 511-9914
        /^\+\d{1,3}[-\/]\(\d{2,3}\)[-\/\s]?\d{3}[-\/\s]?\d{2,3}$/, // +381/(60)-511-991
        /^\+?\d{1,3}[-\s]?\/?\(\d{2,3}\)[-\/\s]?\d{3}[-\s]?\d{2}[-\s]?\d{2}$/, // +381/(60)-511-9914 or +381/(60) 511-9914
    ];

    let isValidFormat = false;
    for (const pattern of allowedFormatsPatterns) {
        if (pattern.test(phone || '')) {
            isValidFormat = true;
            break;
        }
    }

    return v && isValidFormat;
}

export function validatePostalCode(postalCode: string | undefined): boolean {
    if (!validateEmptyTrimBlank(postalCode)) {
        return true;
    }
    const re = /^[0-9]{5,10}$/;
    return re.test(postalCode || '');
}

// allow all alphabets, numbers, spaces, dashes, underscores, dots and min 3 chars for all languages
export function validateAddress(address: string | undefined): boolean {
    if (!validateEmptyTrimBlank(address)) {
        return true;
    }
    const re = /^[\p{L}\p{N}():\-,.\/\s]+$/u;
    let isValid = re.test(address || '');

    const bannedChars = ['\\', '<', '>', '!', '@', '#', '$', '%', '^', '&', '*', '+', '=', '[', ']', '{', '}', '|', ':', ';', '?'];

    bannedChars.forEach((char) => {
        if (address?.includes(char)) {
            isValid = false;
        }
    });

    if (isValid && address?.length && address.length < 3) {
        isValid = false;
    }

    return isValid;
}


export function validateNumber(value:any){
    if(!validateEmptyTrimBlank(value)){
        return true;
    }

    if(typeof value === 'number'){
        return true;
    }

    if(isNaN(value)){
        return false;
    }

    return true;
}


export function validateName(name: string | undefined): boolean {
    if (!validateEmptyTrimBlank(name)) {
        return true;
    }
    const re = /^[\p{L}\-\s']{2,}$/u;
    let isValid = re.test(name || '');

    const bannedChars = ['\\', '<', '>', '!', '@', '#', '$', '%', '^', '&', '*', '+', '=', '[', ']', '{', '}', '|', ':', ';', '?'];

    bannedChars.forEach((char) => {
        if (name?.includes(char)) {
            isValid = false;
        }
    });

    if (isValid && name?.length && name.length < 2) {
        isValid = false;
    }

    // if has more space continously then 1
    if (isValid && name?.length && name.includes('  ')) {
        isValid = false;
    }

    return isValid;
}


export function validateText(text: string | undefined): boolean {
    if (!validateEmptyTrimBlank(text)) {
        return true;
    }
    const re = /^[\p{L}\p{N}():;\-,.\/\s%$@&#!?|"'`>_\-+=*£€¥¢₢₣₤₥₦₧₨₩₪₫₭₮₯₱₲₳₴₵₶₷₸₹₺₻₼₽₾₿\[\]]+$/u;
    let isValid = re.test(text || '');

    const bannedChars = ['\\', '<', '^'];


    bannedChars.forEach((char) => {
        if (text?.includes(char)) {
            isValid = false;
        }
    });

    if (isValid && text?.length && text.length < 3) {
        isValid = false;
    }

    return isValid;
}


export function validateTitle(title: string | undefined): boolean {

    if (!validateEmptyTrimBlank(title)) {
        return true;
    }
    const re = /^[\p{L}\p{N}():;\-,.\/\s%$@&#!?|"'`>_\-+=*£€¥¢₢₣₤₥₦₧₨₩₪₫₭₮₯₱₲₳₴₵₶₷₸₹₺₻₼₽₾₿\[\]]+$/u;
    let isValid = re.test(title || '');

    const bannedChars = ['\\', '<', '^'];

    bannedChars.forEach((char) => {
        if (title?.includes(char)) {
            isValid = false;
        }
    });

    if (isValid && title?.length && title.length < 3) {
        isValid = false;
    }

    return isValid;
}


export function validateMinLength(text: string | undefined, a: string): boolean {

    const minLength = parseInt(a);

    if (!validateEmptyTrimBlank(text)) {
        return true;
    }

    if (text?.length && text.length < minLength) {
        return false;
    }

    return true;

}


export function validateMaxLength(text: string | undefined, a: string): boolean {

    const maxLength = parseInt(a);

    if (!validateEmptyTrimBlank(text)) {
        return true;
    }

    if (text?.length && text.length > maxLength) {
        return false;
    }

    return true;
}


export function validateMinValue(text: string | number | undefined, a: string): boolean {

    const minValue = parseInt(a);

    const t:any = {text:text};

    let txt = t.text;

    if(typeof text === 'string') {
        if (!validateEmptyTrimBlank(text)) {
            return true;
        }
    }

    if(isNaN(text as number)) {
        return false;
    }

    if(typeof text !== 'number' && typeof text === 'string'){
        txt = parseInt(txt as string);
    }

    if (txt < minValue) {
        return false;
    }

    return true;
}


export function validateMaxValue(text: string | number | undefined, a: string): boolean {
    
    const maxValue = parseInt(a);

    const t:any = {text:text};

    let txt = t.text;

    if(typeof text === 'string') {
        if (!validateEmptyTrimBlank(text)) {
            return true;
        }
    }

    if(isNaN(text as number)) {
        return false;
    }

    if(typeof text !== 'number' && typeof text === 'string'){
        txt = parseInt(txt as string);
    }

    if (txt > maxValue) {
        return false;
    }

    return true;
}



export function validateStreetNumber(streetNumber: string | undefined): boolean {


    if (!validateEmptyTrimBlank(streetNumber)) {
        return true;
    }

    if (streetNumber?.length && streetNumber.length < 1) {
        return false;
    }

    if (streetNumber?.length && streetNumber.length > 20) {
        return false;
    }

    return true;


}


export function validatePrice(price: string | number | undefined | null): boolean {
    if (!validateEmptyTrimBlank(price)) {
        return true;
    }
    const re = /^[0-9]+(\.[0-9]{1,2})?$/;
    return re.test(price?.toString() || '');
}


export function validateSlug(slug: string | undefined): boolean {
    if (!validateEmptyTrimBlank(slug)) {
        return true;
    }

    // allow all lowerkace alphabets, numbers, dashes and min 3 chars and slash
    const re = /^[a-z0-9\-\/]{3,}$/;
    return re.test(slug || '');
}


export function validateString(string: string | undefined): boolean {
    if (!validateEmptyTrimBlank(string)) {
        return true;
    }

    // allow all alphabets, numbers, spaces, dashes, underscores, dots and min 3 chars for all languages
    const re = /^[\p{L}\p{N}():;\-,.\/\s%$@&#!?|"'`>_\-+=*£€¥¢₢₣₤₥₦₧₨₩₪₫₭₮₯₱₲₳₴₵₶₷₸₹₺₻₼₽₾₿\[\]]{3,}$/u;
    let isValid = re.test(string || '');

    const bannedChars = ['\\', '<', '^'];

    bannedChars.forEach((char) => {
        if (string?.includes(char)) {
            isValid = false;
        }
    });

    if (isValid && string?.length && string.length < 3) {
        isValid = false;
    }

    return isValid;
}