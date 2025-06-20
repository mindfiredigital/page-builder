import axios from 'axios';
import {
  AppraisalAPIProps,
  LoginAPIProps,
  AuditLogAPIProps,
  PeopleAPIProps,
  FilterAPIProps,
  UserAPIProps,
  PaydataAPIProps,
  PaydataTypeAPIProps,
  PaydataUserProps,
  LogoutAPIProps,
  AppraisalUserProps,
  AppraisalReasonProps,
  AppraisalPeopleAPIProps,
  AppraisalRevisionProps,
  filterCtcTemplateProps,
  filterCtcProps,
  createCtcTemplateProps,
  filterCtcDefinitionsProps,
  createCtcDefinitionProps,
} from '../types/types';
import { LOCAL_STORAGE, ROUTE, STATUS_CODE, COMMON } from '../utils/constant';
import { toast } from 'sonner';

/***  ---------------------- AXIOS INSTANCE ------------------------------***/

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL + '/api/v1',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem(LOCAL_STORAGE.SESSION_TOKEN);
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

/***  ---------------------- HANDLE ERROR ------------------------------***/

const handleError = (error: any) => {
  if (
    error &&
    error.response &&
    error.response.data &&
    error.response.data.message
  ) {
    if (
      error.response.status === STATUS_CODE.UNAUTHORIZE ||
      error.response.status === STATUS_CODE.ACCESS_DENIED
    ) {
      localStorage.clear();
      window.location.replace(ROUTE.LOGIN);
    } else {
      toast.error(error.response.data.message, { duration: 3000 });
      return;
    }
  } else {
    toast.error(error.message);
    return;
  }
};

/***  ---------------------- APPRAISAL SERVICE ------------------------------***/

export const appraisalCreate = async (payload: AppraisalAPIProps) => {
  try {
    const response = await axiosInstance.post(`appraisal/create`, payload);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const appraisalList = async (
  page: number,
  limit: number,
  search_key: string,
  stage: number[],
  id?: number
) => {
  try {
    const params: Record<string, any> = {
      page,
      limit,
      search_key,
      appraisal_stage_id: stage,
      id,
    };

    if (search_key) {
      delete params.page;
      delete params.limit;
    }

    const response = await axiosInstance.get(`appraisal/list`, { params });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const appraisalUpdate = async (
  id: number,
  payload: AppraisalAPIProps
) => {
  try {
    const response = await axiosInstance.put(`appraisal/update/${id}`, payload);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

/***  ---------------------- APPRAISAL LEVEL SERVICE ------------------------------***/

export const appraisalLevelCreate = async (payload: AppraisalReasonProps) => {
  try {
    const response = await axiosInstance.post(
      `appraisal/level/create`,
      payload
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const appraisalLevelList = async ({
  id,
  page,
  limit,
  search_key,
  is_active,
}: FilterAPIProps) => {
  try {
    const params: Record<string, any> = {
      page,
      limit,
      search_key,
      is_active,
    };

    if (search_key) {
      delete params.page;
      delete params.limit;
    }

    const response = await axiosInstance.get(`appraisal/level/list/${id}`, {
      params,
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const appraisalLevelUpdate = async (
  id: number,
  payload: AppraisalReasonProps
) => {
  try {
    const response = await axiosInstance.put(
      `appraisal/level/update/${id}`,
      payload
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const appraisalLevelImport = async (payload: AppraisalReasonProps) => {
  try {
    const response = await axiosInstance.post(
      `appraisal/level/import`,
      payload
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const appraisalLevelReorder = async ({
  drag_id,
  drop_id,
}: AppraisalReasonProps) => {
  try {
    const response = await axiosInstance.post(`appraisal/level/reorder`, {
      drag_id,
      drop_id,
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

/***  ---------------------- APPRAISAL PEOPLE SERVICE ------------------------------***/

export const appraisalPeopleCSV = async (
  file: File,
  payload: AppraisalPeopleAPIProps
) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    Object.keys(payload).forEach(key => {
      const value = payload[key as keyof AppraisalPeopleAPIProps];
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    const response = await axiosInstance.post(
      `appraisal/people/csv`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const appraisalPeopleList = async ({
  id,
  page,
  limit,
  search_key,
  account,
  is_final,
  column,
  direction,
  doj_from,
  doj_to,
  experience_from,
  experience_to,
  eligible,
  leads,
}: FilterAPIProps) => {
  try {
    const params: Record<string, any> = {
      page,
      limit,
      search_key,
      account,
      is_final,
      key: column,
      order: direction,
      doj_from,
      doj_to,
      experience_from,
      experience_to,
      leads,
      eligible,
    };

    if (search_key) {
      delete params.page;
      delete params.limit;
    }

    if (experience_from === COMMON.ZERO && experience_to === COMMON.ZERO) {
      delete params.experience_from;
      delete params.experience_to;
    }

    if (account) {
      const response = await axiosInstance.get(`appraisal/people/list/${id}`, {
        params,
        responseType: 'blob',
      });
      return response.data as Blob;
    }

    const response = await axiosInstance.get(`appraisal/people/list/${id}`, {
      params,
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const appraisalPeopleLeadList = async () => {
  try {
    const response = await axiosInstance.get(`appraisal/people/lead/list`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const appraisalPeopleUpdate = async (
  payload: AppraisalPeopleAPIProps
) => {
  try {
    const response = await axiosInstance.put(
      `appraisal/people/update`,
      payload
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const appraisalPeopleFinalCSV = async (
  file: File,
  appraisal_id: string
) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('appraisal_id', appraisal_id);

    const response = await axiosInstance.post(
      `appraisal/people/import`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

/***  ---------------------- APPRAISAL REASON SERVICE ------------------------------***/

export const appraisalReasonCreate = async (payload: AppraisalReasonProps) => {
  try {
    const response = await axiosInstance.post(
      `appraisal/reason/create`,
      payload
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const appraisalReasonList = async ({
  id,
  page,
  limit,
  search_key,
  is_active,
}: FilterAPIProps) => {
  try {
    const params: Record<string, any> = {
      page,
      limit,
      search_key,
      is_active,
    };

    if (search_key) {
      delete params.page;
      delete params.limit;
    }

    const response = await axiosInstance.get(`appraisal/reason/list/${id}`, {
      params,
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const appraisalReasonUpdate = async (
  id: number,
  payload: AppraisalReasonProps
) => {
  try {
    const response = await axiosInstance.put(
      `appraisal/reason/update/${id}`,
      payload
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const appraisalReasonImport = async (payload: AppraisalReasonProps) => {
  try {
    const response = await axiosInstance.post(
      `appraisal/reason/import`,
      payload
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

/***  ---------------------- APPRAISAL REVISION SERVICE ------------------------------***/

export const appraisalRevisionCreate = async (
  payload: AppraisalRevisionProps
) => {
  try {
    const response = await axiosInstance.post(
      `appraisal/revision/create`,
      payload
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const appraisalRevisionList = async ({
  id,
  page,
  limit,
  search_key,
  level_id,
  column,
  direction,
  doj_from,
  doj_to,
  experience_from,
  experience_to,
  leads,
}: FilterAPIProps) => {
  try {
    const params: Record<string, any> = {
      page,
      limit,
      search_key,
      level_id,
      key: column,
      order: direction,
      doj_from,
      doj_to,
      experience_from,
      experience_to,
      leads,
    };

    if (search_key) {
      delete params.page;
      delete params.limit;
    }

    if (experience_from === COMMON.ZERO && experience_to === COMMON.ZERO) {
      delete params.experience_from;
      delete params.experience_to;
    }

    const response = await axiosInstance.get(`appraisal/revision/list/${id}`, {
      params,
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const appraisalRevisionUpdate = async (
  id: number,
  payload: AppraisalRevisionProps
) => {
  try {
    const response = await axiosInstance.put(
      `appraisal/revision/update/${id}`,
      payload
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const appraisalRevisionPublishAll = async (
  payload: AppraisalRevisionProps
) => {
  try {
    const response = await axiosInstance.put(
      `appraisal/revision/update/publish/all`,
      payload
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const appraisalRevisionUnPublish = async (
  payload: AppraisalRevisionProps
) => {
  try {
    const response = await axiosInstance.put(
      `appraisal/revision/update/unpublish`,
      payload
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const appraisalRevisionNote = async (id: number) => {
  try {
    const response = await axiosInstance.get(
      `appraisal/revision/list/note/${id}`
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

/***  ---------------------- APPRAISAL USER SERVICE ------------------------------***/

export const appraisalUserCreate = async (payload: AppraisalUserProps) => {
  try {
    const response = await axiosInstance.post(`appraisal/user/create`, payload);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const appraisalUserList = async ({
  id,
  page,
  limit,
}: FilterAPIProps) => {
  try {
    const params: Record<string, any> = { page, limit };
    const response = await axiosInstance.get(`appraisal/user/list/${id}`, {
      params,
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const appraisalUserUpdate = async (payload: AppraisalUserProps) => {
  try {
    const response = await axiosInstance.put(`appraisal/user/update`, payload);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const appraisalUserDelete = async (payload: AppraisalUserProps) => {
  try {
    const response = await axiosInstance.put(`appraisal/user/delete`, payload);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

/***  ---------------------- AUDIT LOG SERVICE ------------------------------***/

export const auditLogList = async (
  page: number,
  limit: number,
  payload: AuditLogAPIProps
) => {
  try {
    const response = await axiosInstance.post(
      `log/list?page=${page}&limit=${limit}`,
      payload
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

/***  ---------------------- LOGIN & LOGOUT SERVICE ------------------------------***/

export const login = async (payload: LoginAPIProps) => {
  try {
    const response = await axiosInstance.post(`auth/login`, payload);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const logout = async (payload: LogoutAPIProps) => {
  try {
    const response = await axiosInstance.post(`auth/logout`, payload);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

/***  ---------------------- PAYDATA SERVICE ------------------------------***/

export const paydataCreate = async (payload: PaydataAPIProps) => {
  try {
    const response = await axiosInstance.post(`paydata/create`, payload);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const paydataList = async (
  page: number,
  limit: number,
  search_key: string,
  stage: number[],
  id?: number
) => {
  try {
    const params: Record<string, any> = {
      page,
      limit,
      search_key,
      paydata_stage_id: stage,
      id,
    };

    if (search_key) {
      delete params.page;
      delete params.limit;
    }

    const response = await axiosInstance.get(`paydata/list`, { params });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const paydataUpdate = async (id: number, payload: PaydataAPIProps) => {
  try {
    const response = await axiosInstance.put(`paydata/update/${id}`, payload);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

/***  ---------------------- PAYDATA PEOPLE SERVICE ------------------------------***/

export const paydataPeopleCreate = async (payload: any) => {
  try {
    const response = await axiosInstance.post(
      `paydata/transaction/create`,
      payload
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const paydataPeopleList = async (
  id: number,
  { page, limit, search_key, is_published, is_archive, account }: FilterAPIProps
) => {
  try {
    const params: Record<string, any> = {
      page,
      limit,
      search_key,
      account,
    };

    if (search_key) {
      delete params.page;
      delete params.limit;
    }

    if (is_published !== undefined) {
      params.is_published = is_published;
    }

    if (is_archive !== undefined) {
      params.is_archive = is_archive;
    }

    if (account) {
      const response = await axiosInstance.get(
        `paydata/transaction/list/${id}`,
        {
          params,
          responseType: 'blob',
        }
      );
      return response.data as Blob;
    }

    const response = await axiosInstance.get(`paydata/transaction/list/${id}`, {
      params,
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const paydataPeopleCodeList = async () => {
  try {
    const response = await axiosInstance.get(`paydata/transaction/code`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const paydataPeopleTypeList = async () => {
  try {
    const response = await axiosInstance.get(`paydata/transaction/type`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const paydataPeopleUpdate = async (id: number, payload: any) => {
  try {
    const response = await axiosInstance.put(
      `paydata/transaction/update/${id}`,
      payload
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

/***  ---------------------- PAYDATA SCHEDULE SERVICE ------------------------------***/

export const paydataScheduleCreate = async (payload: any, id: number) => {
  try {
    const response = await axiosInstance.post(
      `paydata/schedule/create?paydata_id=${id}`,
      payload
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const paydataScheduleList = async ({
  page,
  limit,
  search_key,
  is_expired,
  is_archive,
}: FilterAPIProps) => {
  try {
    const params: Record<string, any> = {
      page,
      limit,
      search_key,
    };

    if (search_key) {
      delete params.page;
      delete params.limit;
    }

    if (is_expired !== undefined) {
      params.is_expired = is_expired;
    }

    if (is_archive !== undefined) {
      params.is_archive = is_archive;
    }

    const response = await axiosInstance.get(`paydata/schedule/list`, {
      params,
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const paydataScheduleUpdate = async (id: number, payload: any) => {
  try {
    const response = await axiosInstance.put(
      `paydata/schedule/update/${id}`,
      payload
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

/***  ---------------------- PAYDATA TYPE SERVICE ------------------------------***/

export const paydataTypeCreate = async (payload: PaydataTypeAPIProps) => {
  try {
    const response = await axiosInstance.post(`paydata/type/create`, payload);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const paydataTypeList = async ({
  page,
  limit,
  search_key,
  is_active,
}: FilterAPIProps) => {
  try {
    const params: Record<string, any> = {
      page,
      limit,
      search_key,
    };

    if (search_key) {
      delete params.page;
      delete params.limit;
    }

    if (is_active !== undefined) {
      params.is_active = is_active;
    }

    const response = await axiosInstance.get(`paydata/type/list`, { params });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const paydataTypeUpdate = async (
  id: number,
  payload: PaydataTypeAPIProps
) => {
  try {
    const response = await axiosInstance.put(
      `paydata/type/update/${id}`,
      payload
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

/***  ---------------------- PAYDATA USER SERVICE ------------------------------***/

export const paydataUserCreate = async (payload: PaydataUserProps) => {
  try {
    const response = await axiosInstance.post(`paydata/user/create`, payload);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const paydataUserList = async ({ page, limit }: FilterAPIProps) => {
  try {
    const params: Record<string, any> = { page, limit };
    const response = await axiosInstance.get(`paydata/user/list`, { params });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const paydataUserUpdate = async (
  id: number | undefined,
  payload: PaydataUserProps
) => {
  try {
    const response = await axiosInstance.put(
      `paydata/user/update/${id}`,
      payload
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const paydataUserDelete = async (id: number | undefined) => {
  try {
    const response = await axiosInstance.delete(`paydata/user/delete/${id}`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

/***  ---------------------- PEOPLE SERVICE ------------------------------***/

export const leadCSV = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axiosInstance.post(`people/csv/lead`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const peopleCSV = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axiosInstance.post(`people/csv/people`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const peopleCreate = async (payload: PeopleAPIProps) => {
  try {
    const response = await axiosInstance.post(`people/create`, payload);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const peopleList = async ({
  page,
  limit,
  search_key,
  is_active,
}: FilterAPIProps) => {
  try {
    const params: Record<string, any> = {
      page,
      limit,
      search_key,
    };

    if (search_key) {
      delete params.page;
      delete params.limit;
    }

    if (is_active !== undefined) {
      params.is_active = is_active;
    }

    const response = await axiosInstance.get(`people/list`, { params });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const sync = async () => {
  try {
    const response = await axiosInstance.get(`people/sync`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

/***  ---------------------- ROLE SERVICE ------------------------------***/

export const roleList = async () => {
  try {
    const response = await axiosInstance.get(`role/list`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

/***  ---------------------- TASK SERVICE ------------------------------***/

export const taskList = async (user_id: number) => {
  try {
    const response = await axiosInstance.get(`task/list/${user_id}`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

/***  ---------------------- USER SERVICE ------------------------------***/

export const userList = async ({
  page,
  limit,
  search_key,
  is_active,
  id,
}: FilterAPIProps) => {
  try {
    const params: Record<string, any> = {
      page,
      limit,
      search_key,
    };

    if (search_key) {
      delete params.page;
      delete params.limit;
    }

    if (is_active !== undefined) {
      params.is_active = is_active;
    }

    if (id) {
      params.id = id;
    }

    const response = await axiosInstance.get(`user/list`, { params });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const userCreate = async (payload: UserAPIProps) => {
  try {
    const response = await axiosInstance.post(`user/create`, payload);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const userUpdate = async (id: number, payload: UserAPIProps) => {
  try {
    const response = await axiosInstance.put(`user/update/${id}`, payload);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const resetPassword = async (payload: UserAPIProps) => {
  try {
    const response = await axiosInstance.post(`/user/reset/password`, payload);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const verifyPassword = async (payload: UserAPIProps) => {
  try {
    const response = await axiosInstance.post(`/user/verify/password`, payload);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

/***  ----------------------  CTC SERVICE ------------------------------***/

export const fetchCtc = async ({
  page,
  limit,
  search_key,
  object_type_id,
  is_latest_ctc,
  object_reference_id,
  id,
}: filterCtcProps) => {
  try {
    const params: Record<string, any> = {
      page,
      limit,
      search_key,
    };

    if (search_key) {
      delete params.page;
      delete params.limit;
    }

    if (object_type_id) {
      params.object_type_id = object_type_id;
    }

    if (is_latest_ctc) {
      params.is_latest_ctc = is_latest_ctc;
    }

    if (object_reference_id) {
      params.object_reference_id = object_reference_id;
    }

    if (id) {
      params.id = id;
    }

    const response = await axiosInstance.get(`/ctc`, { params });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

/***  ----------------------  CTC TEMPLATE SERVICE ------------------------------***/

export const fetchCtcTemplate = async ({
  page = 1,
  limit = 100,
  search_key,
  is_published,
  is_active,
  id,
}: filterCtcTemplateProps) => {
  try {
    const params: Record<string, any> = {
      page,
      limit,
      search_key,
    };

    if (search_key) {
      delete params.page;
      delete params.limit;
    }

    if (is_active !== undefined) {
      params.is_active = is_active;
    }

    if (is_published !== undefined) {
      params.is_published = is_published;
    }

    if (id) {
      params.id = id;
    }

    const response = await axiosInstance.get(`/ctc-templates`, { params });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const createCtcTemplate = async (data: createCtcTemplateProps) => {
  try {
    const response = await axiosInstance.post(`/ctc-templates`, data);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const updateCtcTemplate = async (
  id: number,
  data: createCtcTemplateProps
) => {
  try {
    const response = await axiosInstance.put(`/ctc-templates/${id}`, data);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

/***  ----------------------  CTC TEMPLATE SERVICE ------------------------------***/

export const fetchCtcDefinitions = async ({
  page = 1,
  limit = 100,
  search_key,
  ctc_definition_type_id,
  ctc_value_type_id,
  is_ctc_attribute,
  template_id,
  id,
}: filterCtcDefinitionsProps) => {
  try {
    const params: Record<string, any> = {
      page,
      limit,
      search_key,
    };

    if (search_key) {
      delete params.page;
      delete params.limit;
    }

    if (ctc_definition_type_id !== undefined) {
      params.ctc_definition_type_id = ctc_definition_type_id;
    }

    if (ctc_value_type_id !== undefined) {
      params.ctc_value_type_id = ctc_value_type_id;
    }
    if (is_ctc_attribute !== undefined) {
      params.is_ctc_attribute = is_ctc_attribute;
    }
    if (template_id !== undefined) {
      params.template_id = template_id;
    }

    if (id) {
      params.id = id;
    }

    const response = await axiosInstance.get(`/ctc-definitions`, { params });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const createCtcDefinition = async (data: createCtcDefinitionProps) => {
  try {
    const response = await axiosInstance.post(`/ctc-definitions`, data);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const updateCtcDefinition = async (
  id: number,
  data: createCtcDefinitionProps
) => {
  try {
    const response = await axiosInstance.put(`/ctc-definitions/${id}`, data);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const deleteCtcDefinition = async (id: number) => {
  try {
    const response = await axiosInstance.put(`/ctc-definitions/${id}`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};
