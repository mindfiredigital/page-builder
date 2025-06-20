import { lazy } from 'react';
import { ROUTE } from './constant';

const Appraisal = lazy(() => import('../module/appraisal/List'));
const AppraisalPeople = lazy(() => import('../module/appraisal/people/List'));
const AppraisalSetting = lazy(
  () => import('../module/appraisal/setting/reason/List')
);
const AppraisalUser = lazy(() => import('../module/appraisal/user/List'));
const AuditLog = lazy(() => import('../module/auditLog/List'));
const Login = lazy(() => import('../module/login/Login'));
const ForgotPassword = lazy(() => import('../module/password/ForgotPassword'));
const Paydata = lazy(() => import('../module/paydata/List'));
const PaydataTransaction = lazy(
  () => import('../module/paydata/transaction/List')
);
const PaydataSchedule = lazy(() => import('../module/paydata/schedule/List'));
const PaydataType = lazy(() => import('../module/paydata/setting/type/List'));
const PaydataUser = lazy(() => import('../module/paydata/user/List'));
const TaskCheck = lazy(() => import('../module/taskCheck/Card'));
const People = lazy(() => import('../module/people/List'));
const User = lazy(() => import('../module/user/List'));
const VerifyPassword = lazy(() => import('../module/password/VerifyPassword'));
const CtcTemplateList = lazy(() => import('../module/ctc/ctcTemplate/List'));
const ViewCtcTemplate = lazy(() => import('../module/ctc/ctcTemplate/View'));
const CtcList = lazy(() => import('../module/ctc/List'));
export const useRoutes = () => {
  return {
    publicRoutes: [
      { path: ROUTE.HOME, element: Login, name: 'Home' },
      { path: ROUTE.LOGIN, element: Login, name: 'Login' },
      {
        path: ROUTE.FORGOT_PASSWORD,
        element: ForgotPassword,
        name: 'Forgot Password',
      },
      {
        path: ROUTE.VERIFY_PASSWORD,
        element: VerifyPassword,
        name: 'Verify Password',
      },
    ],
    privateRoutes: [
      { path: ROUTE.APPRAISAL, element: Appraisal, name: 'Appraisal' },
      {
        path: ROUTE.APPRAISAL_PEOPLE,
        element: AppraisalPeople,
        name: 'Appraisal People',
      },
      {
        path: ROUTE.APPRAISAL_SETTING,
        element: AppraisalSetting,
        name: 'Appraisal Setting',
      },
      {
        path: ROUTE.APPRAISAL_USER,
        element: AppraisalUser,
        name: 'Appraisal User',
      },
      { path: ROUTE.AUDIT_LOG, element: AuditLog, name: 'Audit Log' },
      { path: ROUTE.PAYDATA, element: Paydata, name: 'Paydata' },
      {
        path: ROUTE.PAYDATA_PEOPLE,
        element: PaydataTransaction,
        name: 'Paydata Transaction',
      },
      {
        path: ROUTE.PAYDATA_SCHEDULE,
        element: PaydataSchedule,
        name: 'Paydata Schedule',
      },
      {
        path: ROUTE.PAYDATA_SETTING,
        element: PaydataType,
        name: 'Paydata Setting (Paydata Type)',
      },
      { path: ROUTE.PAYDATA_USER, element: PaydataUser, name: 'Paydata User' },
      { path: ROUTE.PEOPLE, element: People, name: 'People' },
      { path: ROUTE.TASK_CHECK, element: TaskCheck, name: 'Task Check ' },
      { path: ROUTE.USER, element: User, name: 'User' },
      {
        path: ROUTE.CTC,
        element: CtcList,
        name: 'Ctc',
      },
      {
        path: ROUTE.CTC_TEMPLATE,
        element: CtcTemplateList,
        name: 'Ctc Template',
      },
      {
        path: ROUTE.VIEW_CTC_TEMPLATE,
        element: ViewCtcTemplate,
        name: 'Ctc Template',
      },
    ],
  };
};

export default useRoutes;
