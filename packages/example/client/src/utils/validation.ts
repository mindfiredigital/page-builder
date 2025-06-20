import { SelectChangeEvent } from '@mui/material';
import { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { DynamicFormData, FormDataProps } from '../types/types';

export const validateField = (name: string, value: string): string => {
  const validationMessages: Record<string, string> = {
    title: 'Title is required',
    name: 'Name is required',
    email: 'Email is required',
    emailOrUsername: 'Username or Email is required',
    password: 'Password is required',
    username: 'Username is required',
    role_id: 'Role is required',
    payment_type: 'Payment Type is required',
    is_recurring: 'Recurring is required',
    people_code: 'People code is required',
    validate_record_date: 'Date is required',
  };

  return value.length === 0 ? validationMessages[name] || '' : '';
};

export const createHandleChange = <T extends DynamicFormData>(
  setFormData: Dispatch<SetStateAction<FormDataProps<T>>>
) => {
  return (
    e:
      | ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
      | SelectChangeEvent<string>
  ) => {
    const { name, value } = e.target;

    setFormData(prev => {
      const error = validateField(name, value);

      return {
        ...prev,
        values: { ...prev.values, [name]: value },
        errors: { ...prev.errors, [name]: error },
      };
    });
  };
};
