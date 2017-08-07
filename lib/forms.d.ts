/// <reference types="react" />
import { DeepStorage } from "deep-storage/lib";
export interface DeepFormField {
    value?: string | number;
    touched: boolean;
    valid?: boolean;
    error?: string;
}
export interface FieldChange {
    name: string;
    value: string | number;
}
export interface DeepFormState {
    globalErrors?: string[];
    fields: {
        [key: string]: DeepFormField;
    };
    validating: boolean;
    pristine: boolean;
    valid: boolean;
}
export interface DeepFormErrors {
    globalErrors?: string[];
    errors?: {
        [key: string]: string;
    };
}
export interface DeepValidator<Data = {}> {
    validate(form: DeepForm<Data>, fieldChange: FieldChange): DeepFormErrors | Promise<DeepFormErrors>;
}
export interface DeepForm<Data = {}> extends DeepFormState {
    changeField(fieldChange: FieldChange): Promise<any>;
    changeEvent(event: React.ChangeEvent<any>): Promise<any>;
    blurEvent(event: React.FocusEvent<any>): Promise<any>;
    data<Data1 = Data>(): Data1;
    reset(): Promise<any>;
}
export declare class DefaultDeepForm<Data> implements DeepForm<Data> {
    storage: DeepStorage<DeepFormState>;
    private validator;
    private initialState;
    constructor(storage: DeepStorage<DeepFormState>, validator: DeepValidator<Data>, initialState?: Data | (() => Data | Promise<Data>));
    readonly globalErrors: string[];
    readonly fields: {
        [key: string]: DeepFormField;
    };
    readonly validating: boolean;
    readonly pristine: boolean;
    readonly valid: boolean;
    reset: () => Promise<{}>;
    changeField: (fieldChange: FieldChange) => Promise<void>;
    changeEvent: (event: React.ChangeEvent<any>) => Promise<void>;
    blurEvent: (event: React.FocusEvent<any>) => Promise<void>;
    readonly form: DeepFormState;
    data<Data>(): Data;
}
export declare function deepForm<Data = {}>(storage: DeepStorage<DeepFormState>, validator: DeepValidator<Data>, initialState?: Data | (() => Data | Promise<Data>)): DefaultDeepForm<Data>;
export default deepForm;
