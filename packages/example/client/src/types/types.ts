import { CSSProperties } from 'react';
import { BoxProps } from '@mui/material';
import { Dayjs } from 'dayjs';

/** ----------------------- COMPONENTS INTERFACE ------------------------   **/

export interface AppTableProps<T extends object> {
  columns: ColumnProps[];
  rows: any[];
  page: number;
  setPage: (page: number) => void;
  limit: number;
  setLimit: (limit: number) => void;
  count: number;
  emptyMessage?: string;
  sX?: { maxHeight: number } | {};
  renderRow: (row: T, columns: ColumnProps[]) => React.ReactNode;
  loading: boolean;
  showPagination?: boolean;
  rearrangeCheck?: boolean;
  onRowReorder?: (drag_id: number, drop_id: number) => void;
  onSort?: (columnId: string, direction: 'asc' | 'desc') => void;
}

export interface AppButtonProps {
  id: string;
  label: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  textColor?: string;
  sx?: object;
  variant?: 'primary' | 'text';
  disabled?: boolean;
  tabIndex?: number;
  loading?: boolean;
  type: 'submit' | 'button';
  backgroundColor?: string;
  hoverBackgroundColor?: string;
}

export interface AppBarProps {
  open?: boolean;
  showDrawer?: boolean;
}

export interface AppraisalFiltersProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  lead: LeadProps[];
}

export interface AppraisalFiltersStateProps {
  doj_from: string;
  doj_to: string;
  experience_from: string;
  experience_to: string;
  leads: string[];
  error: {
    doj_from: string;
    doj_to: string;
    experience_from: string;
    experience_to: string;
  };
  loading: boolean;
  eligible: string;
}

export interface ColumnProps {
  id: string;
  label: string;
  minWidth?: number;
  width?: number;
  align?: 'left' | 'center' | 'right';
  headerAlign?: 'left' | 'center' | 'right';
  format?: (value: any) => string;
  arrow?: boolean;
}

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export interface EditAppraisalPeopleProps {
  open: boolean;
  currentValue: boolean;
  onClose: () => void;
  onSave: (data: {
    eligible: boolean;
    reason?: number;
    basic?: number;
    hra?: number;
    other_allowances?: number;
    provident_fund?: number;
  }) => void;
  toggleValue: () => void;
  reason: AppraisalReasonProps[];
  peopleData: any;
  loading: boolean;
}

export interface EditAppraisalPeopleStateProps {
  selectedReason: string;
  basic: string;
  hra: string;
  other_allowances: string;
  provident_fund: string;
  errors: Record<string, string>;
}

export interface EditRevisionProps {
  open: boolean;
  id: number;
  name?: string;
  note: string;
  raise_amount: number;
  onClose: () => void;
  onSave: (revisionData: {
    id: number;
    raise_amount: string;
    note: string;
  }) => void;
  loading: boolean;
}

export interface ImageProps extends BoxProps {
  imageUrl?: string;
  imagePath?: string;
  sx?: object;
  className?: string;
  style?: CSSProperties;
}

export interface ImportSalaryProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  reasons: AppraisalReasonProps[];
}

export interface ImportSalaryStateProps {
  selectedReason: string;
  selectedFile: File | null;
  fileName: string;
  importOption: string;
  selectedDate: Dayjs | null;
  error: { file: string; reason: string; date: string };
  loading: boolean;
}

export interface ImportSelectionProps {
  open: boolean;
  onClose: () => void;
  onSave: (appraisal_id: number) => void;
}

export interface InputProp {
  required?: boolean;
  id: string;
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: boolean;
  errorText?: string;
  maxLength?: number;
  disabled?: boolean;
  placeholder?: string;
  tabIndex?: number;
  sx?: object;
  InputProps?: object;
  multiline?: boolean;
  rows?: number;
  inputRef?: React.RefObject<HTMLInputElement>;
}

export interface RevisionNoteProps {
  open: boolean;
  onClose: () => void;
  notes: { note: string; name: string }[];
}

export interface RoleProps {
  open: boolean;
  onClose: () => void;
  onSave: (roleIds: number[] | number | null) => void;
  selectedRoleIds?: number[];
  singleSelection?: boolean;
  id?: number;
  title?: string;
}

export interface RoleStateProps {
  role: RoleAPIProps[];
  loading: boolean;
  selectedRole: string;
  selectedRoles: number[];
  error: string;
}

export interface SearchProps {
  onSearch: (searchText: string) => void;
  placeholder?: string;
  initialSearchText?: string;
  debounceTime?: number;
}

export interface StageEllipseProps {
  stage: string;
}

/** ----------------------- VALIDATION INTERFACE ------------------------   **/

export interface DynamicFormData<T = string> {
  [key: string]: T;
}

export interface FormDataProps<T extends DynamicFormData> {
  values: T;
  errors: Partial<T>;
  loading: boolean;
  errorMessage?: string;
  snackbar?: boolean;
}

/** ----------------------- MODULE INTERFACE ------------------------   **/

export interface AppraisalProps {
  id: number;
  title: string;
  appraisal_stage_id: number;
  created_by_user_id: number;
  updated_by_user_id: number;
  created_on: Date;
  updated_on: Date;
  stage_title: string;
  created_by_display_name: string;
  validate_record_date: Date;
}

export interface AddAppraisalProps {
  open: boolean;
  onClose: (refresh?: boolean) => void;
  data: AppraisalProps | null;
}

export interface AppraisalAPIProps {
  id?: number;
  title?: string;
  appraisal_stage_id?: number;
  validate_record_date: Dayjs | null;
}

export interface AppraisalPeopleAPIProps {
  import_option?: boolean;
  date?: Dayjs | null;
  file?: File | null;
  reason?: number;
  appraisal_id?: number;
  code?: string;
  eligible: boolean;
  id?: number;
  raise_amount?: number;
  name?: string;
  note?: string;
  appraisal_revision_level_id?: number;
  appraisal_people_id?: number;
  is_published?: boolean;
  show_yellow?: boolean;
  basic?: number;
  hra?: number;
  provident_fund?: number;
  other_allowances?: number;
}

export interface LeadProps {
  code: string;
  name: string;
}

export interface AppraisalReasonProps {
  id?: number;
  title?: string;
  appraisal_id?: number;
  is_active?: boolean;
  current_appraisal_id?: number;
  import_appraisal_id?: number;
  drag_id?: number;
  drop_id?: number;
}

export interface AddAppraisalReasonProps {
  open: boolean;
  onClose: (refresh?: boolean) => void;
  data: AppraisalReasonProps | null;
}

export interface AppraisalLevelProps {
  id?: number;
  title?: string;
  appraisal_id?: number;
  is_active?: boolean;
  sort_order?: number;
  role_id: number[];
  roles: { role_id: number; role_name: string }[];
  current_appraisal_id?: number;
  import_appraisal_id?: number;
  current_sort_order_id?: number;
  current_sort_order?: number;
  shift_sort_order_id?: number;
  shift_sort_order?: number;
}

export interface AddAppraisalLevelProps {
  open: boolean;
  onClose: (refresh?: boolean) => void;
  data: AppraisalLevelProps | null;
}

export interface AppraisalUserProps {
  appraisal_id: number;
  user_id: number;
  role_id: number | string;
}

export interface AddAppraisalUserProps {
  open: boolean;
  onClose: (refresh?: boolean) => void;
  data: AppraisalUserProps | null;
}

export interface AppraisalRevisionProps {
  appraisal_id?: number;
  note?: string;
  raise_amount?: string;
  appraisal_revision_level_id?: number;
  appraisal_people_id?: number;
  id?: number;
  publish?: boolean;
  code?: string;
}

export interface AuditLogProps {
  id: number;
  table: string;
  field: string;
  record_id: number;
  previous_value: string;
  new_value: string;
  updated_by: number;
  updated_on: string;
  updated_by_username: string;
}

export interface AuditLogTableProps {
  table: string;
  field: string[];
}

export interface AuditLogAPIProps {
  start_date: string;
  end_date: string;
  table: string;
  fields: string[];
  record_id: string;
}

export interface LoginAPIProps {
  username: string;
  password: string;
}

export interface LogoutAPIProps {
  session_token: string;
}

export interface PeopleProps {
  code: string;
  name: string;
  doj: string;
  branch: string;
  gender: string;
  email: string;
  lead_names: string[];
  is_active: number;
  is_user: string;
}

export interface PeopleAPIProps {
  role_id: number;
  code: string;
}

export interface FilterAPIProps {
  page: number;
  limit: number;
  search_key?: string;
  is_active?: number;
  is_published?: number;
  is_archive?: number;
  is_expired?: number;
  id?: number;
  account?: boolean;
  is_final?: boolean;
  level_id?: number;
  column?: string;
  direction?: string;
  doj_from?: string;
  doj_to?: string;
  experience_from?: number;
  experience_to?: number;
  leads?: string[];
  eligible?: string;
}

export interface UserProps {
  id: number;
  code: string;
  username: string;
  email: string;
  display_name: string;
  name: string;
  is_active: boolean;
  role_id: number | string;
  role_title: string;
  permissions: any;
}

export interface UserAPIProps {
  id?: number;
  name?: string;
  role_id?: number | string;
  username?: string;
  email?: string;
  reset_token?: string;
  password?: string;
  is_active?: boolean;
  permissions?: any;
}

export interface AddUserProps {
  open: boolean;
  onClose: (refresh?: boolean) => void;
  data: UserProps | null;
}

export interface PaydataProps {
  id: number;
  title: string;
  year: number;
  month: number;
  stage_title: string;
  paydata_stage_id: number;
  created_by_user_id: number;
  created_on: Date;
  updated_by_user_id: number;
  updated_on?: Date;
  created_by_display_name: string;
  appraisal_stage_id?: number;
}

export interface PaydataAPIProps {
  month?: number;
  year?: number;
  paydata_stage_id?: number;
  appraisal_id?: number;
  draft?: boolean;
}

export interface AddPaydataProps {
  open: boolean;
  onClose: (refresh?: boolean) => void;
}

export interface RoleAPIProps {
  id: number;
  title: string;
}

export interface AddPaydataTypeProps {
  open: boolean;
  onClose: (refresh?: boolean) => void;
  data: PaydataTypeProps | null;
  parentOptions: PaydataTypeProps[];
}

export interface PaydataTypeProps {
  id: number;
  title: string;
  is_recurring: string;
  payment_type: string;
  is_active: boolean;
  parent: string;
  parent_title: string;
  childId: number[];
}

export interface PaydataTypeAPIProps {
  title?: string;
  is_recurring?: string;
  payment_type?: string;
  parent?: string | number;
  is_active?: boolean;
}

export interface PaydataUserProps {
  id?: number;
  user_id?: number;
  role_id: number | string;
}

export interface AddPaydataUserProps {
  open: boolean;
  onClose: (refresh?: boolean) => void;
  data: PaydataUserProps | null;
}

export interface AddPaydataPeopleProps {
  open: boolean;
  onClose: (refresh?: boolean) => void;
  data: any | null;
  onSave: () => void;
}

export interface AddPaydataScheduleProps {
  open: boolean;
  onClose: (refresh?: boolean) => void;
  data: any | null;
  onSave: () => void;
}

export interface CtcProps {
  id: number;
  object_type_id: number;
  object_refernce_id: number;
  ctc_type_id: number;
  ctc_template_id: number;
  is_latest_ctc: boolean;
  name: string;
  object_type_title: string;
  ctc_type_title: string;
}

export interface filterCtcProps {
  page: number;
  limit: number;
  search_key?: string;
  object_type_id?: number;
  is_latest_ctc?: boolean;
  object_reference_id?: number;
  id?: number;
}

export interface filterCtcTemplateProps {
  page?: number;
  limit?: number;
  search_key?: string;
  is_active?: boolean;
  is_published?: boolean;
  id?: number;
}

export interface createCtcTemplateProps {
  title?: string;
  is_published?: boolean;
  is_active?: boolean;
  is_pf_required?: boolean;
  metadata?: string;
}

export interface AddCtcTemplateProps {
  open: boolean;
  onClose: (refresh?: boolean) => void;
  data?: CtcTemplateData | null;
}

export interface CtcTemplateData {
  id: number;
  title: string;
  is_published: boolean;
  is_active: boolean;
  is_pf_required: boolean;
}

export interface CtcTemplateFormDataProps {
  values: {
    title: string;
    is_pf_required: boolean;
  };
  errors: {
    title: string;
  };
  loading: boolean;
}

export interface filterCtcDefinitionsProps {
  page?: number;
  limit?: number;
  search_key?: string;
  ctc_definition_type_id?: number;
  ctc_value_type_id?: number;
  is_ctc_attribute?: boolean;
  template_id?: number;
  id?: number;
}

export interface createCtcDefinitionProps {
  ctc_definition_type_id?: number;
  ctc_value_type_id?: number;
  is_ctc_attribute?: boolean;
  template_id?: number;
}

export const months = [
  { name: 'January', value: 1 },
  { name: 'February', value: 2 },
  { name: 'March', value: 3 },
  { name: 'April', value: 4 },
  { name: 'May', value: 5 },
  { name: 'June', value: 6 },
  { name: 'July', value: 7 },
  { name: 'August', value: 8 },
  { name: 'September', value: 9 },
  { name: 'October', value: 10 },
  { name: 'November', value: 11 },
  { name: 'December', value: 12 },
];
