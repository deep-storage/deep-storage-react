import { DeepStorage, deepStorage } from "deep-storage";
import * as React from "react";

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
  fields: { [key: string]: DeepFormField };
  validating: boolean;
  pristine: boolean;
  valid: boolean;
}

export interface DeepFormErrors {
  globalErrors?: string[];
  errors?: { [key: string]: string };
}

export interface DeepValidator<Data = {}> {
  validate(
    form: DeepForm<Data>,
    fieldChange: FieldChange
  ): DeepFormErrors | Promise<DeepFormErrors>;
}

export interface DeepForm<Data = {}> extends DeepFormState {
  changeField(fieldChange: FieldChange): Promise<any>;
  changeEvent(event: React.ChangeEvent<any>): Promise<any>;
  blurEvent(event: React.FocusEvent<any>): Promise<any>;
  data<Data1 = Data>(): Data1;
  reset(): Promise<any>;
}

export class DefaultDeepForm<Data> implements DeepForm<Data> {
  constructor(
    public storage: DeepStorage<DeepFormState>,
    private validator: DeepValidator<Data>,
    private initialState?: Data | (() => Data | Promise<Data>)
  ) {}

  get globalErrors() {
    return this.storage.state.globalErrors;
  }
  get fields() {
    return this.storage.state.fields || {};
  }
  get validating() {
    return this.storage.state.validating;
  }
  get pristine() {
    return this.storage.state.pristine;
  }
  get valid() {
    return this.storage.state.valid;
  }

  public reset = async () => {
    if (this.initialState) {
      const state: any =
        typeof this.initialState === "function"
          ? await this.initialState()
          : this.initialState;
      const fields = {} as any;
      for (const key of Object.keys(state)) {
        fields[key] = { value: state[key], touched: false };
      }
      return await this.storage.set({
        validating: false,
        pristine: true,
        valid: false,
        fields
      });
    } else {
      return await this.storage.set({
        validating: false,
        pristine: true,
        valid: false,
        fields: {}
      });
    }
  };

  public changeField = async (fieldChange: FieldChange) => {
    try {
      await this.storage.update(prevState => {
        const fields = { ...prevState.fields };
        if (fields[fieldChange.name]) {
          fields[fieldChange.name] = {
            ...fields[fieldChange.name],
            value: fieldChange.value
          };
        } else {
          fields[fieldChange.name] = {
            value: fieldChange.value,
            touched: false
          };
        }
        return {
          ...prevState,
          fields,
          validating: true,
          pristine: false
        };
      });
      const result = await this.validator.validate(this, fieldChange);
      if (
        (result.globalErrors && result.globalErrors.length > 0) ||
        (result.errors && Object.keys(result.errors).length > 0)
      ) {
        await this.storage.update(prevState => {
          const fields = { ...prevState.fields };
          for (const key of Object.keys(fields)) {
            if (result.errors && result.errors[key]) {
              fields[key] = {
                ...fields[key],
                error: result.errors[key],
                valid: false
              };
            } else {
              fields[key] = { ...fields[key], error: undefined, valid: true };
            }
          }
          return {
            ...prevState,
            fields,
            valid: false,
            globalErrors: result.globalErrors
          };
        });
      } else {
        await this.storage.update(prevState => {
          const fields = { ...prevState.fields };
          for (const key of Object.keys(fields)) {
            fields[key] = { ...fields[key], error: undefined, valid: true };
          }
          return {
            ...prevState,
            fields,
            valid: true
          };
        });
      }
    } finally {
      await this.storage.deep("validating").set(false);
    }
  };
  public changeEvent = async (event: React.ChangeEvent<any>) => {
    const {
      currentTarget: { name, value }
    } = event;
    return this.changeField({
      name,
      value
    });
  };
  public blurEvent = async (event: React.FocusEvent<any>) => {
    const {
      currentTarget: { name }
    } = event;
    await this.storage.deep("fields").update(fields => {
      const newFields = { ...fields };
      if (newFields[name]) {
        newFields[name] = { ...newFields[name], touched: true };
      } else {
        newFields[name] = { touched: false, value: "" };
      }
      return newFields;
    });
  };
  get form() {
    return this.storage.state;
  }
  public data<Data1>() {
    const fields: any = this.storage.deep("fields").state;
    const result: any = {};
    for (const key of Object.keys(fields)) {
      result[key] = fields[key].value;
    }
    return result as Data1;
  }
}

export function deepForm<Data = {}>(
  validator: DeepValidator<Data>,
  initialState?: Data | (() => Data | Promise<Data>)
) {
  const storage = deepStorage<DeepFormState>({
    validating: false,
    pristine: true,
    valid: false,
    fields: initialState || {}
  });
  return new DefaultDeepForm<Data>(storage, validator, initialState);
}

export default deepForm;
