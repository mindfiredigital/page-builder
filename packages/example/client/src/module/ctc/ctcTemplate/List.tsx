import {
  Box,
  Backdrop,
  CircularProgress,
  TableCell,
  TableRow,
  Grid,
  Paper,
  FormControlLabel,
  Checkbox,
  Chip,
  Switch,
  IconButton,
  Tooltip,
  Link,
} from '@mui/material';
import {
  CheckCircle,
  DriveFileRenameOutline,
  Publish,
} from '@mui/icons-material';
import { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import { ColumnProps, filterCtcTemplateProps } from '../../../types/types';
import {
  fetchCtcTemplate,
  updateCtcTemplate,
} from '../../../services/services';
import RouteGuard from '../../../components/RouteGuard';
import RoleGuard from '../../../components/RoleGuard';
import AppTable from '../../../components/AppTable';
import AppButton from '../../../components/Button';
import Search from '../../../components/Search';
import Dialog from '../../../components/Dialog';
import { useNavigate } from 'react-router-dom';
import Add from './Add';
import { ROUTE } from '../../../utils/constant';

// Types
interface CtcTemplate {
  id: number;
  title: string;
  metadata: string;
  is_published: boolean;
  is_active: boolean;
  is_pf_required: boolean;
  created_at?: string;
  updated_at?: string;
}

const columns: ColumnProps[] = [
  { id: 'id', label: 'ID', width: 8, align: 'left' },
  { id: 'title', label: 'Title', width: 20, align: 'left' },
  { id: 'is_published', label: 'Published', width: 10, align: 'center' },
  { id: 'is_active', label: 'Active', width: 10, align: 'center' },
  { id: 'is_pf_required', label: 'PF Required', width: 10, align: 'center' },
  { id: 'actions', label: 'Actions', width: 10, align: 'center' },
];

const List = () => {
  const navigate = useNavigate();
  const [state, setState] = useState({
    ctcTemplates: [] as CtcTemplate[],
    page: 0,
    limit: 100,
    count: 0,
    loading: false,
    search_key: '',
    showPublished: false,
    showActive: false,
    openDialog: false,
    ctcTemplateData: null as CtcTemplate | null,
    // Dialog states
    openActionDialog: false,
    openPublishDialog: false,
    actionMessage: '',
    selectedTemplate: null as CtcTemplate | null,
    actionType: '' as 'toggle' | 'publish' | 'unpublish' | '',
  });

  const fetchData = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true }));

    try {
      const filterParams: filterCtcTemplateProps = {
        page: state.page + 1,
        limit: state.limit,
        search_key: state.search_key || undefined,
        is_published: state.showPublished ? true : undefined,
        is_active: state.showActive ? true : undefined,
      };

      const response = await fetchCtcTemplate(filterParams);
      if (response?.success) {
        setState(prev => ({
          ...prev,
          ctcTemplates: response?.data?.templates || response?.data || [],
          count: response?.data?.totalCount || response?.total || 0,
          loading: false,
        }));
      } else {
        setState(prev => ({ ...prev, loading: false }));
      }
    } catch (error) {
      console.error('Error fetching CTC templates:', error);
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [
    state.page,
    state.limit,
    state.search_key,
    state.showPublished,
    state.showActive,
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData();
    }, 100);
    return () => clearTimeout(timer);
  }, [fetchData]);

  const handleSearch = (search_key: string) => {
    setState(prev => ({ ...prev, search_key, page: 0 }));
  };

  // Dialog open function for different actions
  const dialogOpen = (
    template: CtcTemplate,
    type: 'toggle' | 'publish' | 'unpublish'
  ) => {
    setState(prev => ({
      ...prev,
      selectedTemplate: template,
      actionType: type,
    }));

    let actionMessage = '';

    switch (type) {
      case 'toggle':
        if (template.is_active) {
          actionMessage =
            'Deactivating this CTC template will make it unavailable for use. Are you sure you want to deactivate this template?';
        } else {
          actionMessage =
            'Activating this CTC template will make it available for use. Are you sure you want to activate this template?';
        }
        setState(prev => ({ ...prev, actionMessage, openActionDialog: true }));
        break;
      case 'publish':
        actionMessage =
          'Publishing this CTC template will make it available for public use. Are you sure you want to publish this template?';
        setState(prev => ({ ...prev, actionMessage, openPublishDialog: true }));
        break;
      case 'unpublish':
        actionMessage =
          'Unpublishing this CTC template will remove it from public availability and automatically deactivate it. Are you sure you want to unpublish this template?';
        setState(prev => ({ ...prev, actionMessage, openPublishDialog: true }));
        break;
    }
  };

  // Handle template updates
  const handleTemplateAction = async () => {
    if (!state.selectedTemplate) return;

    setState(prev => ({ ...prev, loading: true }));
    let updateData: Partial<CtcTemplate> = {};

    switch (state.actionType) {
      case 'toggle':
        updateData = { is_active: !state.selectedTemplate.is_active };
        break;
      case 'publish':
        updateData = { is_published: true };
        break;
      case 'unpublish':
        // When unpublishing, also deactivate the template
        updateData = { is_published: false, is_active: false };
        break;
    }

    const response = await updateCtcTemplate(
      state.selectedTemplate.id,
      updateData
    );

    if (response?.success) {
      toast.success(response.message || 'Template updated successfully');
      fetchData();
    }
  };

  const renderStatusChip = (status: boolean, label: string) => (
    <Chip
      label={status ? 'Yes' : 'No'}
      color={status ? 'success' : 'default'}
      size="small"
      variant={status ? 'filled' : 'outlined'}
    />
  );

  const renderRow = (row: CtcTemplate, columns: any) => (
    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
      {columns.map((column: any) => {
        let value: any;

        switch (column.id) {
          case 'title':
            value = (
              <Link
                component="button"
                onClick={() => {
                  navigate(
                    ROUTE.VIEW_CTC_TEMPLATE.replace(':id', String(row.id))
                  );
                }}
                underline="hover"
                color="primary"
              >
                {row.title}
              </Link>
            );
            break;
          case 'is_published':
            value = (
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                {row.is_published ? (
                  <Tooltip title="Published Template">
                    <IconButton color="warning" sx={{ padding: 0 }}>
                      <CheckCircle />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <Tooltip title="Publish Template">
                    <IconButton
                      color="success"
                      onClick={() => dialogOpen(row, 'publish')}
                      sx={{ padding: 0 }}
                    >
                      <Publish />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            );
            break;
          case 'is_active':
            value = (
              <Switch
                checked={Boolean(row.is_active)}
                disabled={!row.is_published}
                onChange={() => dialogOpen(row, 'toggle')}
                inputProps={{ 'aria-label': 'active status' }}
                className={`${!row.is_published && 'cursor-not-allowed'} cu`}
              />
            );
            break;
          case 'is_pf_required':
            value = renderStatusChip(row.is_pf_required, 'PF Required');
            break;
          case 'actions':
            value = (
              <Box key={column.id}>
                <Tooltip title="Edit CTC Template">
                  <IconButton
                    color="primary"
                    onClick={() => {}}
                    sx={{ padding: 0, mx: 0.5 }}
                  >
                    <DriveFileRenameOutline />
                  </IconButton>
                </Tooltip>
              </Box>
            );
            break;
          default:
            value = row[column.id as keyof CtcTemplate];
        }

        return (
          <TableCell
            key={String(column.id)}
            align={column.align}
            style={{
              width: `${column.width}%`,
              maxWidth: `${column.width}%`,
              whiteSpace: column.id === 'metadata' ? 'normal' : 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {value}
          </TableCell>
        );
      })}
    </TableRow>
  );

  return (
    <Paper>
      <Backdrop
        open={state.loading}
        sx={{ zIndex: theme => theme.zIndex.drawer + 1, color: '#fff' }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Box sx={{ p: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Search onSearch={handleSearch} />
          </Grid>

          <Grid item xs={12} sm={4}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={state.showPublished}
                    onChange={() =>
                      setState(prev => ({
                        ...prev,
                        showPublished: !prev.showPublished,
                        page: 0,
                      }))
                    }
                    color="primary"
                  />
                }
                label="Show Published"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={state.showActive}
                    onChange={() =>
                      setState(prev => ({
                        ...prev,
                        showActive: !prev.showActive,
                        page: 0,
                      }))
                    }
                    color="primary"
                  />
                }
                label="Show Active"
              />
            </Box>
          </Grid>

          <Grid item sm={2}>
            <AppButton
              id="addNew"
              label="Add New"
              onClick={() => setState(prev => ({ ...prev, openDialog: true }))}
              textColor="primary"
              type="button"
              tabIndex={1}
            />
          </Grid>
        </Grid>
      </Box>

      {/* Action Dialog for Active/Inactive toggle */}
      <Dialog
        open={state.openActionDialog}
        onClose={() => setState(prev => ({ ...prev, openActionDialog: false }))}
        title="Toggle Template Status"
        description={state.actionMessage}
        onConfirm={handleTemplateAction}
      />

      {/* Publish/Unpublish Dialog */}
      <Dialog
        open={state.openPublishDialog}
        onClose={() =>
          setState(prev => ({ ...prev, openPublishDialog: false }))
        }
        title={
          state.actionType === 'publish'
            ? 'Publish Template'
            : 'Unpublish Template'
        }
        description={state.actionMessage}
        onConfirm={handleTemplateAction}
      />

      <AppTable
        columns={columns}
        rows={state.ctcTemplates}
        page={state.page}
        setPage={page => setState(prev => ({ ...prev, page }))}
        limit={state.limit}
        setLimit={limit => setState(prev => ({ ...prev, limit }))}
        count={state.count}
        renderRow={renderRow}
        loading={false}
      />

      <Add
        open={state.openDialog}
        onClose={(refresh?: boolean) => {
          setState(prev => ({
            ...prev,
            openDialog: false,
            ctcTemplateData: null,
          }));
          if (refresh) fetchData();
        }}
        data={state.ctcTemplateData}
      />
    </Paper>
  );
};

export default RoleGuard(RouteGuard(List));
