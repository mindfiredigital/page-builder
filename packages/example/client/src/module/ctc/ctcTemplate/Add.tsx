import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { createCtcTemplate } from '../../../services/services';
import { COMMON } from '../../../utils/constant';
import { validateField } from '../../../utils/validation';
import AppButton from '../../../components/Button';
import Input from '../../../components/Input';
import {
  AddCtcTemplateProps,
  CtcTemplateFormDataProps,
} from '../../../types/types';

const initialState: CtcTemplateFormDataProps = {
  values: {
    title: '',
    is_pf_required: false,
  },
  errors: {
    title: '',
  },
  loading: false,
};

const CTC_TEMPLATE = {
  CREATE: 'Create CTC Template',
  EDIT: 'Edit CTC Template',
  TITLE: 'Template Title',
  PUBLISHED: 'Published',
  ACTIVE: 'Active',
  PF_REQUIRED: 'PF Required',
};

const Add = ({ open, onClose, data }: AddCtcTemplateProps) => {
  const [state, setState] = useState<CtcTemplateFormDataProps>(initialState);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === 'title') {
      setState(prev => {
        const error = validateField(name, value);
        return {
          ...prev,
          values: { ...prev.values, [name]: value },
          errors: { ...prev.errors, [name]: error },
        };
      });
    }
  };

  useEffect(() => {
    if (open) {
      if (data) {
        setState({
          values: {
            title: data.title,
            is_pf_required: data.is_pf_required,
          },
          errors: { title: '' },
          loading: false,
        });
      } else {
        setState(initialState);
      }
    }
  }, [data, open]);

  const handleClose = () => {
    onClose(false);
    setState(initialState);
  };

  const handleCheckboxChange =
    (field: keyof CtcTemplateFormDataProps['values']) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setState(prev => ({
        ...prev,
        values: {
          ...prev.values,
          [field]: event.target.checked,
        },
      }));
    };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors = {
      title: validateField('title', state.values.title),
    };

    if (Object.values(errors).some(error => error)) {
      setState(prev => ({ ...prev, errors }));
      return;
    }

    setState(prev => ({ ...prev, loading: true }));

    let response;
    if (data) {
      // Update logic would go here when update API is available
      // response = await updateCtcTemplate(data.id, state.values);
      // toast.error('Update functionality not implemented yet');
      setState(prev => ({ ...prev, loading: false }));
      return;
    } else {
      response = await createCtcTemplate(state.values);
    }
    if (response) {
      toast.success(response.message || 'CTC Template created successfully');
      setState(initialState);
      onClose(true);
    }
    setState(prev => ({ ...prev, loading: false }));
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth={true} maxWidth="sm">
      <DialogTitle>
        {data ? CTC_TEMPLATE.EDIT : CTC_TEMPLATE.CREATE}
      </DialogTitle>
      <DialogContent sx={{ paddingTop: '10px !important' }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Input
              id="title"
              label={CTC_TEMPLATE.TITLE}
              name="title"
              type="text"
              maxLength={100}
              value={state.values.title}
              disabled={state.loading}
              error={!!state.errors.title}
              errorText={state.errors.title}
              onChange={handleChange}
              tabIndex={1}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={state.values.is_pf_required}
                  onChange={handleCheckboxChange('is_pf_required')}
                  disabled={state.loading}
                  color="primary"
                />
              }
              label={CTC_TEMPLATE.PF_REQUIRED}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: '24px', py: 1 }}>
        <AppButton
          id="cancel-button"
          label={COMMON.CANCEL}
          onClick={handleClose}
          variant="text"
          type="button"
          tabIndex={2}
        />
        <AppButton
          id="save"
          label={data ? COMMON.SAVE_CHANGE : COMMON.CREATE}
          onClick={handleSave}
          textColor="primary"
          type="submit"
          loading={state.loading}
          disabled={state.loading}
          tabIndex={3}
        />
      </DialogActions>
    </Dialog>
  );
};

export default Add;
