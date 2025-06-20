import {
  Backdrop,
  CircularProgress,
  TableCell,
  TableRow,
  Grid,
  Link,
  Paper,
  Box,
  Checkbox,
  FormControlLabel,
  Tooltip,
  IconButton,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Visibility,
  Delete,
  DriveFileRenameOutline,
} from '@mui/icons-material';
import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { CtcProps, ColumnProps, filterCtcProps } from '../../types/types';
import { LOCAL_STORAGE, ROLE, ROUTE } from '../../utils/constant';
import { fetchCtc } from '../../services/services';
import AppTable from '../../components/AppTable';
import AppButton from '../../components/Button';
import Search from '../../components/Search';
import RouteGuard from '../../components/RouteGuard';
import RoleGuard from '../../components/RoleGuard';

// Define CTC table columns
const columns: ColumnProps[] = [
  { id: 'employee_name', label: 'Employee Name', width: 20, align: 'left' },
  { id: 'employee_code', label: 'Employee Code', width: 15, align: 'left' },
  { id: 'ctc_type', label: 'CTC Type', width: 15, align: 'right' },
  { id: 'is_latest_ctc', label: 'Latest', width: 8, align: 'center' },
  { id: 'object_type', label: 'Object Type', width: 10, align: 'left' },
  { id: 'actions', label: 'Actions', width: 8, align: 'center' },
];

// Object type options for filter
const OBJECT_TYPE_OPTIONS = [
  { value: '', label: 'All Types' },
  { value: 1, label: 'Member' },
  { value: 2, label: 'Candidate' },
];

const List = () => {
  const [state, setState] = useState({
    ctc: [] as CtcProps[],
    page: 0,
    limit: 100,
    count: 0,
    loading: false,
    openDialog: false,
    search_key: '',
    object_type_id: '',
    is_latest_ctc: false,
    object_reference_id: '',
    ctcData: null as CtcProps | null,
  });

  const navigate = useNavigate();
  const role = localStorage.getItem(LOCAL_STORAGE.ROLE_ID);
  const account = Number(role) === ROLE.ACCOUNT;

  const fetchData = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true }));

    const filterParams: filterCtcProps = {
      page: state.page + 1,
      limit: state.limit,
      search_key: state.search_key.trim(),
    };

    // Add optional filters
    if (state.object_type_id) {
      filterParams.object_type_id = Number(state.object_type_id);
    }

    if (state.is_latest_ctc) {
      filterParams.is_latest_ctc = state.is_latest_ctc;
    }

    if (state.object_reference_id) {
      filterParams.object_reference_id = Number(state.object_reference_id);
    }

    try {
      const response = await fetchCtc(filterParams);
      if (response?.success) {
        setState(prev => ({
          ...prev,
          ctc: response?.data?.ctc || [],
          count: response?.data?.totalCount || 0,
          loading: false,
        }));
      }
    } catch (error) {
      console.error('Error fetching CTC data:', error);
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [
    state.page,
    state.limit,
    state.search_key,
    state.object_type_id,
    state.is_latest_ctc,
    state.object_reference_id,
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

  const handleObjectTypeChange = (event: any) => {
    setState(prev => ({
      ...prev,
      object_type_id: event.target.value,
      page: 0,
    }));
  };

  const handleLatestCtcChange = () => {
    setState(prev => ({
      ...prev,
      is_latest_ctc: !prev.is_latest_ctc,
      page: 0,
    }));
  };

  const onEdit = (row: CtcProps) => {
    setState(prev => ({
      ...prev,
      ctcData: row,
      openDialog: true,
    }));
  };

  const onView = (id: number) => {
    navigate(`${ROUTE.CTC}/${id}`);
  };

  const onDelete = (id: number) => {
    // Handle delete functionality
    console.log('Delete CTC:', id);
  };

  const renderRow = (row: CtcProps, columns: any) => (
    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
      {columns.map((column: any) => {
        let value: any;

        switch (column.id) {
          case 'employee_name':
            value = (
              <Link
                component="button"
                onClick={() => onView(row.id)}
                underline="hover"
                color="primary"
              >
                {row.name}
              </Link>
            );
            break;

          case 'is_latest_ctc':
            value = (
              <Chip
                label={row.is_latest_ctc ? 'Latest' : 'Historical'}
                color={row.is_latest_ctc ? 'success' : 'default'}
                size="small"
              />
            );
            break;
          case 'ctc_type':
            value = row.ctc_type_title || '';
            break;

          case 'object_type':
            value = row.object_type_title || '';
            break;

          case 'actions':
            value = (
              <Box key={column.id}>
                <Tooltip title="View CTC Details">
                  <IconButton
                    color="primary"
                    onClick={() => onView(row.id)}
                    sx={{ padding: 0, mx: 0.5 }}
                  >
                    <Visibility />
                  </IconButton>
                </Tooltip>

                {!account && (
                  <>
                    <Tooltip title="Edit CTC">
                      <IconButton
                        color="primary"
                        onClick={() => onEdit(row)}
                        sx={{ padding: 0, mx: 0.5 }}
                      >
                        <DriveFileRenameOutline />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Delete CTC">
                      <IconButton
                        color="error"
                        onClick={() => onDelete(row.id)}
                        sx={{ padding: 0, mx: 0.5 }}
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </>
                )}
              </Box>
            );
            break;

          default:
            value = row[column.id as keyof CtcProps];
        }

        return (
          <TableCell
            key={String(column.id)}
            align={column.align}
            style={{
              width: `${column.width}%`,
              maxWidth: `${column.width}%`,
              whiteSpace: 'nowrap',
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
          {/* Search */}
          <Grid item xs={12} sm={4}>
            <Search onSearch={handleSearch} />
          </Grid>

          {/* Object Type Filter */}
          <Grid item xs={12} sm={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Type</InputLabel>
              <Select
                value={state.object_type_id}
                label="Type"
                onChange={handleObjectTypeChange}
              >
                {OBJECT_TYPE_OPTIONS.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Latest CTC Filter */}
          <Grid item xs={12} sm={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={state.is_latest_ctc}
                    onChange={handleLatestCtcChange}
                    color="primary"
                  />
                }
                label="Show Latest CTC Only"
              />
            </Box>
          </Grid>

          {/* Add New Button */}
          {!account && (
            <Grid item xs={12} sm={2}>
              <AppButton
                id="addNewCtc"
                label="Add New CTC"
                onClick={() =>
                  setState(prev => ({ ...prev, openDialog: true }))
                }
                textColor="primary"
                type="button"
                tabIndex={1}
              />
            </Grid>
          )}
        </Grid>
      </Box>

      <AppTable
        columns={columns}
        rows={state.ctc}
        page={state.page}
        setPage={page => setState(prev => ({ ...prev, page }))}
        limit={state.limit}
        setLimit={limit => setState(prev => ({ ...prev, limit }))}
        count={state.count}
        renderRow={renderRow}
        loading={false}
      />
    </Paper>
  );
};

export default RoleGuard(RouteGuard(List));
