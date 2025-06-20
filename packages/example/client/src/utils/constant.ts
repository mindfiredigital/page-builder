import mindfireLogo from '../assets/images/logo.webp';
import mindfireLogoIcon from '../assets/icons/minf_icon.png';

/***  ---------------------- ROUTE CONSTANTS ------------------------------***/

export const ROUTE = {
  APPRAISAL: '/appraisal',
  APPRAISAL_PEOPLE: '/appraisal/:id/people',
  APPRAISAL_SETTING: '/appraisal/:id/setting',
  APPRAISAL_USER: '/appraisal/:id/user',
  AUDIT_LOG: '/log',
  HOME: '/',
  LOGIN: '/login',
  PAYDATA: '/paydata',
  TRANSACTION: '/transaction',
  SCHEDULE: '/schedule',
  SETTING: '/setting',
  PAYDATA_PEOPLE: '/paydata/:id/transaction',
  PAYDATA_SCHEDULE: '/paydata/:id/schedule',
  PAYDATA_SETTING: '/paydata/:id/setting',
  PAYDATA_USER: '/paydata/:id/user',

  CTC: '/ctc',
  VIEW_CTC_TEMPLATE: '/ctc-template/:id',
  CTC_TEMPLATE: '/ctc-template',
  PEOPLE: '/people',
  FORGOT_PASSWORD: '/forgot/password',
  VERIFY_PASSWORD: '/verify/password',
  TASK_CHECK: '/task/check',
  USER: '/user',
};

/***  ---------------------- COMPONENT CONSTANTS ------------------------------***/

export const APP_MENU = {
  APPRAISAL: 'appraisal',
  BOLD: 'bold',
  NORMAL: 'normal',
  APPRAISAL_TITLE: 'Appraisal',
  PAYDATA: 'paydata',
  PAYDATA_TITLE: 'Paydata',
  TRANSACTION_TITLE: 'Transaction',
  USERS: 'users',
  USER_TITLE: 'Users',
  PEOPLE: 'people',
  PEOPLE_TITLE: 'People',
  AUDIT_LOG: 'auditLog',
  AUDIT_LOG_TITLE: 'Audit Log',
  SETTING_TITLE: 'Setting',
  SCHEDULE_TITLE: 'Schedule',
  BACK_TITLE: 'Back to Main Menu',
  DASHBORD: 'Dashboard',
  CTC: 'CTC',
  CTC_TEMPLATE: 'CTC Template',
};

export const APPRAISAL_MENU = {
  APPRAISAL_PEOPLE: 'appraisal_people',
  APPRAISAL_USER: 'appraisal_user',
  APPRAISAL_SETTING: 'appraisal_setting',
  APPRAISAL_USER_TITLE: 'Appraisal User',
  APPRAISAL_SETTING_TITLE: 'Appraisal Setting',
  APPRAISAL_BACK_MENU: 'Main menu',
  BACK_TO_MENU: 'back_to_main',
};

export const CTC_MENU = {
  CTC_TEMPLATE: 'ctc_template',
};

export const COPYRIGHT_MENU = {
  COPYRIGHT: 'Copyright © ',
};

export const PAYDATA_MENU = {
  PAYDATA_PEOPLE: 'paydata_people',
  PAYDATA_SCHEDULE: 'paydata_schedule',
  PAYDATA_USER: 'paydata_user',
  PAYDATA_SETTING: 'paydata_setting',
  BACK_TO_MAIN: 'back_to_main',
  PAYDATA_SCHEDULE_TITLE: 'Paydata Schedule',
  PAYDATA_USER_TITLE: 'Paydata User',
  PAYDATA_SETTING_TITLE: 'Paydata Setting',
};

export const SIDEBAR = {
  APPRAISAL_SETTING: 'Appraisal Setting',
  APPRAISAL_USER: 'Appraisal User',
  PAYDATA_SCHEDULE: 'Paydata Schedule',
  PAYDATA_USER: 'Paydata User',
  PAYDATA_SETTING: 'Paydata Setting',
};

/***  ---------------------- MODULE CONSTANTS ------------------------------***/

export const COMMON = {
  CANCEL: 'Cancel',
  SAVE_CHANGE: 'Save Changes',
  FILTER: 'Filter',
  RESET: 'Reset',
  SAVE: 'Save',
  CREATE: 'Create',
  ADD: 'Add',
  IMPORT: 'Import',
  SAVE_PUBLISH: 'Save & Publish',
  ZERO: 0,
};

export const APPRAISAL = {
  CREATE: 'Create New Appraisal',
  EDIT: 'Edit Appraisal',
  TITLE: 'Appraisal Title',
  NOTE: 'Note',
};

export const APPRAISAL_TABLE_TYPE = {
  ORIGINAL: 1,
  REVISION: 2,
  FINAL: 3,
};

export const APPRAISAL_REASON = {
  CREATE: 'Create New Reason',
  EDIT: 'Edit Reaosn',
  TITLE: 'Reason Title',
};

export const APPRAISAL_LEVEL = {
  CREATE: 'Create New Level',
  EDIT: 'Edit Level',
  TITLE: 'Level Title',
};

export const APPRAISAL_REVISION = {
  NOTE: '',
};

export const PAYDATA = {
  CREATE: 'Create New Paydata',
  MONTH: 'Month',
  YEAR: 'Year',
};

export const PAYDATA_TYPE = {
  CREATE: 'Create New Paydata Type',
  EDIT: 'Edit Paydata Type',
  PARENT: 'Parent',
  TITLE: 'Title',
  PAYMENT_TYPE: 'Payment Type',
  RECURRING: 'Recurring',
};

export const USER = {
  CREATE: 'Create New User',
  EDIT: 'Edit User',
  NAME: 'Name',
  USERNAME: 'Username',
  ROLE: 'ROLE',
  EMAIL: 'Email',
};

export const LOGIN = {
  MINDFIRE_SOLUTIONS: 'Mindfire Solutions',
  FORGOT_PASSWORD: 'Forgot password?',
  LOGIN: 'Login?',
  COPYRIGHT: 'Copyright ©',
};

export const ROLE = {
  ADMIN: 1,
  MANAGER: 2,
  CONTRIBUTOR: 3,
  ACCOUNT: 4,
};

/***  ---------------------- ICON CONSTANTS ------------------------------***/

export const ICON = {
  MINDFIRE_LOGO: mindfireLogo,
  MINDFIRE_FIRE_ICON: mindfireLogoIcon,
};

/***  ---------------------- URL AND LINK CONSTANTS ------------------------------***/

export const URL = {
  MINDFIRE_SOLUTIONS_URL: 'https://www.mindfiresolutions.com/',
  MINDFIRE_LOGO_LINK:
    'https://www.mindfiresolutions.com/home-assets/images/logo.webp',
  BG_AUTH: 'https://www.mindfiresolutions.com/home-assets/images/bg-home.webp',
  INVALID_TOKEN_IMAGE:
    'https://img.freepik.com/free-vector/400-error-bad-request-concept-illustration_114360-1921.jpg',
};

/***  ---------------------- LOCAL STORAGE CONSTANTS ------------------------------***/

export const LOCAL_STORAGE = {
  DISPLAY_NAME: 'displayName',
  ROLE_ID: 'role_id',
  SESSION_TOKEN: 'session_token',
  ACTIVE_TAB: 'active_tab',
  ACTIVE_TABLE: 'active_table',
  USER_ID: 'user_id',
  ACTIVE_LEVEL: 'active_level',
  TITLE: 'title',
};

/***  ---------------------- APPRAISAL STAGE ----------------------***/

export const STAGE = {
  DRAFT: 1,
  OPEN: 2,
  CLOSED: 3,
  ARCHIVED: 4,
};

/***  ---------------------- STATUS CODE ----------------------***/

export const STATUS_CODE = {
  UNAUTHORIZE: 401,
  ACCESS_DENIED: 403,
};

export const REGEX = {
  VALID_NUMBER: /^\d*\.?\d*$/,
};

export const PERMISSIONS = {
  Appraisal: [
    { key: 'appraisal_draft', label: 'Draft' },
    { key: 'appraisal_open', label: 'Open' },
    { key: 'appraisal_closed', label: 'Closed' },
    { key: 'appraisal_archived', label: 'Archived' },
    { key: 'appraisal_import_salary', label: 'Import Salary' },
    { key: 'appraisal_export', label: 'Export' },
    { key: 'appraisal_import', label: 'Import' },
  ],
  Paydata: [
    { key: 'paydata_draft', label: 'Draft' },
    { key: 'paydata_open', label: 'Open' },
    { key: 'paydata_closed', label: 'Closed' },
    { key: 'paydata_archived', label: 'Archived' },
  ],
};

export const CTC_DEFINITION_TYPE = [
  {
    id: 1,
    title: 'Constant',
  },
  {
    id: 2,
    title: 'Formula',
  },
  {
    id: 3,
    title: 'Input',
  },
  {
    id: 4,
    title: 'Image',
  },
];

export const CTC_VALUE_TYPE = [
  {
    id: 1,
    title: 'Integer',
  },
  {
    id: 2,
    title: 'Float',
  },
  {
    id: 3,
    title: 'Text',
  },
  {
    id: 4,
    title: 'Boolean',
  },
];
