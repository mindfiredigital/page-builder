// src/pages/CtcDefinitionManager.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  Grid,
  Tooltip,
  Alert,
  CircularProgress,
  TableRow,
  TableCell,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  ArrowUpward,
  ArrowDownward,
  Warning, // Added for custom dialog icon
} from '@mui/icons-material';

// Assuming these services are available in a 'services' directory
import {
  fetchCtcDefinitions,
  createCtcDefinition,
  updateCtcDefinition,
  deleteCtcDefinition,
} from '../../../services/services';
import { CTC_DEFINITION_TYPE, CTC_VALUE_TYPE } from '../../../utils/constant'; // Ensure these constants are defined
import AppTable from '../../../components/AppTable'; // Import AppTable
import { ColumnProps } from '../../../types/types'; // Import ColumnProps interface

// Types - Exported for use in CtcStore and View.tsx
export interface CtcDefinition {
  id?: number;
  template_id: number;
  ctc_definition_type_id: number;
  ctc_value_type_id: number;
  is_ctc_attribute: boolean;
  key: string;
  title: string;
  value: string;
  priority_order_of_evaluation: number;
  component_json_path?: string | null; // Can be null now
  created_at?: string;
  updated_at?: string;
}

interface Props {
  templateId: number;
  templateTitle: string;
  onDefinitionsChange?: (definitions: CtcDefinition[]) => void;
}

// Define column configurations for CtcDefinitionManager table
const definitionColumns: ColumnProps[] = [
  {
    id: 'priority_order_of_evaluation',
    label: 'Priority',
    width: 8,
    align: 'center',
  },
  { id: 'title', label: 'Title', width: 20, align: 'left' },
  { id: 'ctc_definition_type_id', label: 'Type', width: 10, align: 'center' },
  { id: 'ctc_value_type_id', label: 'Value Type', width: 10, align: 'center' },
  { id: 'key', label: 'Key', width: 15, align: 'left' },
  { id: 'value', label: 'Value', width: 15, align: 'left' },
  {
    id: 'is_ctc_attribute',
    label: 'Input Attr.', // Shortened label for display
    width: 7,
    align: 'center',
  },
  {
    id: 'component_json_path',
    label: 'Comp. Path', // Shortened label for display
    width: 10,
    align: 'left',
  },
  { id: 'actions', label: 'Actions', width: 15, align: 'center' },
];

const CtcDefinitionManager: React.FC<Props> = ({
  templateId,
  templateTitle,
  onDefinitionsChange,
}) => {
  const [definitions, setDefinitions] = useState<CtcDefinition[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingDefinition, setEditingDefinition] =
    useState<CtcDefinition | null>(null);
  // const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Confirmation dialog state
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: '',
    message: '',
    onConfirm: () => {}, // Placeholder function
  });

  // Pagination state for AppTable (client-side pagination assumed if backend doesn't support)
  const [page, setPage] = useState(0);
  // Changed initial limit to 100 to match common AppTable options and avoid MUI warning
  const [limit, setLimit] = useState(100);
  const count = definitions.length; // Total count is the length of all fetched definitions

  const [formData, setFormData] = useState<Partial<CtcDefinition>>({
    template_id: templateId,
    ctc_definition_type_id: 1,
    ctc_value_type_id: 1,
    is_ctc_attribute: false,
    key: '',
    title: '',
    value: '',
    priority_order_of_evaluation: 0,
    component_json_path: '',
  });

  const getDefinitionTypeTitle = (typeId: number) => {
    return (
      CTC_DEFINITION_TYPE.find(type => type.id === typeId)?.title || 'Unknown'
    );
  };

  const getValueTypeTitle = (typeId: number) => {
    return CTC_VALUE_TYPE.find(type => type.id === typeId)?.title || 'Unknown';
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Input':
        return 'primary';
      case 'Constant':
        return 'secondary';
      case 'Formula':
        return 'warning';
      case 'Image':
        return 'info';
      default:
        return 'default';
    }
  };

  // Helper function to show confirmation dialog
  const showConfirmDialog = (
    title: string,
    message: string,
    onConfirm: () => void
  ) => {
    setConfirmDialog({
      open: true,
      title,
      message,
      onConfirm,
    });
  };

  // Helper function to close confirmation dialog
  const closeConfirmDialog = () => {
    setConfirmDialog({
      open: false,
      title: '',
      message: '',
      onConfirm: () => {},
    });
  };

  const loadInitialData = useCallback(async () => {
    // setLoading(true);
    setError(null);
    try {
      const ctcDefsRes = await fetchCtcDefinitions({ template_id: templateId });

      if (
        ctcDefsRes &&
        ctcDefsRes.data &&
        Array.isArray(ctcDefsRes.data.definitions)
      ) {
        const sortedDefs = ctcDefsRes.data.definitions.sort(
          (a: CtcDefinition, b: CtcDefinition) =>
            a.priority_order_of_evaluation - b.priority_order_of_evaluation
        );
        setDefinitions(sortedDefs);
        onDefinitionsChange?.(sortedDefs); // Notify parent (View.tsx) about updated definitions
      } else {
        setDefinitions([]);
        onDefinitionsChange?.([]); // Notify parent even if no definitions
      }
      setPage(0); // Reset page to 0 on data load
    } catch (err: any) {
      console.error('Error loading initial data:', err);
      setError(`Failed to load definitions: ${err.message || 'Unknown error'}`);
      setDefinitions([]);
      onDefinitionsChange?.([]); // Notify parent on error too
    }
    // finally {
    //   setLoading(false);
    // }
  }, [templateId]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const handleOpenDialog = (definition?: CtcDefinition) => {
    if (definition) {
      setEditingDefinition(definition);
      // Ensure component_json_path is treated as a string for the form
      setFormData({
        ...definition,
        component_json_path: definition.component_json_path || '',
      });
    } else {
      setEditingDefinition(null);
      const defaultDefTypeId =
        CTC_DEFINITION_TYPE.length > 0 ? CTC_DEFINITION_TYPE[0].id : 1;
      const defaultValueTypeId =
        CTC_VALUE_TYPE.length > 0 ? CTC_VALUE_TYPE[0].id : 1;

      setFormData({
        template_id: templateId,
        ctc_definition_type_id: defaultDefTypeId,
        ctc_value_type_id: defaultValueTypeId,
        is_ctc_attribute: false,
        key: '',
        title: '',
        value: '',
        priority_order_of_evaluation:
          definitions.length > 0
            ? Math.max(
                ...definitions.map(d => d.priority_order_of_evaluation || 0)
              ) + 1
            : 1,
        component_json_path: '',
      });
    }
    setOpenDialog(true);
    setError(null);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingDefinition(null);
    const defaultDefTypeId =
      CTC_DEFINITION_TYPE.length > 0 ? CTC_DEFINITION_TYPE[0].id : 1;
    const defaultValueTypeId =
      CTC_VALUE_TYPE.length > 0 ? CTC_VALUE_TYPE[0].id : 1;
    setFormData({
      template_id: templateId,
      ctc_definition_type_id: defaultDefTypeId,
      ctc_value_type_id: defaultValueTypeId,
      is_ctc_attribute: false,
      key: '',
      title: '',
      value: '',
      priority_order_of_evaluation: 0,
      component_json_path: '',
    });
    setError(null);
  };

  const handleSaveDefinition = async () => {
    if (!formData.key || !formData.title) {
      setError('Key and Title are required.');
      return;
    }
    // Basic validation for component_json_path if provided
    if (formData.component_json_path) {
      try {
        const parsedPath = JSON.parse(formData.component_json_path);
        if (!parsedPath.componentId || !parsedPath.propertyPath) {
          setError(
            'component_json_path must be a valid JSON with "componentId" and "propertyPath".'
          );
          return;
        }
      } catch (error) {
        console.log(error);
        setError('component_json_path must be a valid JSON string.');
        return;
      }
    }

    // setLoading(true);
    setError(null);

    try {
      const dataToSave = {
        ...formData,
        is_ctc_attribute: formData.is_ctc_attribute ? true : false,
        // Convert empty string component_json_path to null for backend
        component_json_path: formData.component_json_path || null,
      };

      if (editingDefinition) {
        await updateCtcDefinition(
          editingDefinition.id!,
          dataToSave as CtcDefinition
        );
      } else {
        await createCtcDefinition(dataToSave as CtcDefinition);
      }
      await loadInitialData();
      handleCloseDialog();
    } catch (err: any) {
      console.error('Error saving definition:', err);
      setError(`Failed to save definition: ${err.message || 'Unknown error'}`);
    }
    //  finally {
    //   setLoading(false);
    // }
  };

  const handleDeleteDefinition = async (definitionId: number) => {
    const definitionToDelete = definitions.find(def => def.id === definitionId);
    const definitionTitle = definitionToDelete?.title || 'this definition';

    showConfirmDialog(
      'Delete Definition',
      `Are you sure you want to delete "${definitionTitle}"? This action cannot be undone.`,
      async () => {
        // setLoading(true);
        setError(null);
        try {
          await deleteCtcDefinition(definitionId);
          await loadInitialData();
        } catch (err: any) {
          console.error('Error deleting definition:', err);
          setError(
            `Failed to delete definition: ${err.message || 'Unknown error'}`
          );
        }
        // finally {
        //   setLoading(false);
        // }
        closeConfirmDialog();
      }
    );
  };

  const handleReorder = async (
    definition: CtcDefinition,
    direction: 'up' | 'down'
  ) => {
    // setLoading(true);
    setError(null);

    const currentIndex = definitions.findIndex(d => d.id === definition.id);
    if (currentIndex === -1) {
      // setLoading(false);
      return;
    }

    const newDefinitionsArray = [...definitions];
    const targetIndex =
      direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    if (targetIndex >= 0 && targetIndex < newDefinitionsArray.length) {
      const currentDef = newDefinitionsArray[currentIndex];
      const targetDef = newDefinitionsArray[targetIndex];

      const currentPriority = currentDef.priority_order_of_evaluation;
      const targetPriority = targetDef.priority_order_of_evaluation;

      const updatedCurrentDef = {
        ...currentDef,
        priority_order_of_evaluation: targetPriority,
      };
      const updatedTargetDef = {
        ...targetDef,
        priority_order_of_evaluation: currentPriority,
      };

      try {
        // Perform updates in parallel
        await Promise.all([
          updateCtcDefinition(updatedCurrentDef.id!, updatedCurrentDef),
          updateCtcDefinition(updatedTargetDef.id!, updatedTargetDef),
        ]);
        await loadInitialData(); // Reload to get the correct sorted order from backend
      } catch (err: any) {
        console.error('Error reordering definitions:', err);
        setError(`Failed to reorder: ${err.message || 'Unknown error'}`);
      }
      //  finally {
      //   setLoading(false);
      // }
    } else {
      // setLoading(false);
    }
  };

  // Custom render function for AppTable rows
  const renderDefinitionRow = (
    definition: CtcDefinition,
    columns: ColumnProps[]
  ) => (
    <TableRow hover role="checkbox" tabIndex={-1} key={definition.id}>
      {columns.map(column => {
        let value: React.ReactNode;
        const commonCellStyle = {
          width: `${column.width}%`,
          maxWidth: `${column.width}%`,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        };

        const cellStyle = { ...commonCellStyle };
        // Allow wrapping and prevent ellipsis for certain columns like 'Priority' and 'Actions'
        if (
          column.id === 'priority_order_of_evaluation' ||
          column.id === 'actions'
        ) {
          cellStyle.whiteSpace = 'normal';
          cellStyle.overflow = 'visible';
          cellStyle.textOverflow = 'clip';
        }
        // Specific max-widths for value and component path if needed for consistent display
        if (column.id === 'value') {
          cellStyle.maxWidth = '200px';
        } else if (column.id === 'component_json_path') {
          cellStyle.maxWidth = '150px';
        }

        switch (column.id) {
          case 'priority_order_of_evaluation':
            value = (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body2">
                  {definition.priority_order_of_evaluation}
                </Typography>
                <Box sx={{ ml: 1 }}>
                  <Tooltip title="Move Up">
                    <IconButton
                      size="small"
                      onClick={() => handleReorder(definition, 'up')}
                      disabled={
                        // loading ||
                        definitions.findIndex(d => d.id === definition.id) === 0
                      }
                    >
                      <ArrowUpward fontSize="inherit" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Move Down">
                    <IconButton
                      size="small"
                      onClick={() => handleReorder(definition, 'down')}
                      disabled={
                        // loading ||
                        definitions.findIndex(d => d.id === definition.id) ===
                        definitions.length - 1
                      }
                    >
                      <ArrowDownward fontSize="inherit" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            );
            break;
          case 'key':
            value = (
              <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                {definition.key}
              </Typography>
            );
            break;
          case 'title':
            value = definition.title;
            break;
          case 'ctc_definition_type_id':
            value = (
              <Chip
                label={getDefinitionTypeTitle(
                  definition.ctc_definition_type_id
                )}
                size="small"
                color={
                  getTypeColor(
                    getDefinitionTypeTitle(definition.ctc_definition_type_id)
                  ) as any
                }
              />
            );
            break;
          case 'ctc_value_type_id':
            value = (
              <Chip
                label={getValueTypeTitle(definition.ctc_value_type_id)}
                size="small"
                variant="outlined"
              />
            );
            break;
          case 'value':
            value = (
              <Tooltip title={definition.value || 'No value'}>
                <Typography variant="body2" sx={{ ...cellStyle }}>
                  {definition.value || '-'}
                </Typography>
              </Tooltip>
            );
            break;
          case 'is_ctc_attribute':
            value = (
              <Chip
                label={definition.is_ctc_attribute ? 'Yes' : 'No'}
                size="small"
                color={definition.is_ctc_attribute ? 'success' : 'default'}
              />
            );
            break;
          case 'component_json_path':
            value = (
              <Tooltip title={definition.component_json_path || 'Not mapped'}>
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: 'monospace',
                    fontSize: '0.75rem',
                    ...cellStyle,
                  }}
                >
                  {definition.component_json_path || '-'}
                </Typography>
              </Tooltip>
            );
            break;
          case 'actions':
            value = (
              <Box>
                <Tooltip title="Edit Definition">
                  <IconButton
                    onClick={() => handleOpenDialog(definition)}
                    size="small"
                    color="primary"
                    // disabled={loading}
                  >
                    <Edit />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete Definition">
                  <IconButton
                    onClick={() => handleDeleteDefinition(definition.id!)}
                    size="small"
                    color="error"
                    // disabled={loading}
                  >
                    <Delete />
                  </IconButton>
                </Tooltip>
              </Box>
            );
            break;
          default:
            value = (definition as any)[column.id];
        }

        return (
          <TableCell
            key={String(column.id)}
            align={column.align}
            style={cellStyle}
          >
            {value}
          </TableCell>
        );
      })}
    </TableRow>
  );

  return (
    <Box>
      <Paper elevation={2} sx={{ p: 3 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <Typography variant="h6" component="h2">
            CTC Definitions for "{templateTitle}"
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
            // disabled={loading}
          >
            Add Definition
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Alert severity="info" sx={{ mb: 2 }}>
          Define salary components, formulas, and constants that will be used in
          your CTC template. Each definition can be referenced in your page
          builder components. Ensure correct priority order for formula
          evaluation.
        </Alert>

        <AppTable
          columns={definitionColumns}
          rows={definitions}
          page={page}
          setPage={setPage}
          limit={limit}
          setLimit={setLimit}
          count={count}
          renderRow={renderDefinitionRow}
          loading={false} // loading={loading}
          // The empty state message is handled by AppTable based on rows.length
        />
      </Paper>

      {/* Add/Edit Definition Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingDefinition ? 'Edit Definition' : 'Add New Definition'}
        </DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ my: 2 }}>
              {error}
            </Alert>
          )}
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Key"
                value={formData.key}
                onChange={e =>
                  setFormData(prev => ({ ...prev, key: e.target.value }))
                }
                helperText="Unique identifier for this definition (e.g., basic-salary)"
                required
                // disabled={loading}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Title"
                value={formData.title}
                onChange={e =>
                  setFormData(prev => ({ ...prev, title: e.target.value }))
                }
                helperText="Display name for this definition"
                required
                // disabled={loading}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl
                fullWidth
                // disabled={loading}
              >
                <InputLabel>Definition Type</InputLabel>
                <Select
                  value={formData.ctc_definition_type_id}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      ctc_definition_type_id: e.target.value as number,
                    }))
                  }
                  label="Definition Type"
                >
                  {CTC_DEFINITION_TYPE.map(type => (
                    <MenuItem key={type.id} value={type.id}>
                      {type.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl
                fullWidth
                //  disabled={loading}
              >
                <InputLabel>Value Type</InputLabel>
                <Select
                  value={formData.ctc_value_type_id}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      ctc_value_type_id: e.target.value as number,
                    }))
                  }
                  label="Value Type"
                >
                  {CTC_VALUE_TYPE.map(type => (
                    <MenuItem key={type.id} value={type.id}>
                      {type.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Value"
                value={formData.value}
                onChange={e =>
                  setFormData(prev => ({ ...prev, value: e.target.value }))
                }
                multiline
                rows={3}
                helperText="For formulas: use {key} to reference other definitions (e.g., {basic-salary} * 0.4)"
                // disabled={loading}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Priority Order"
                type="number"
                value={formData.priority_order_of_evaluation}
                onChange={e =>
                  setFormData(prev => ({
                    ...prev,
                    priority_order_of_evaluation: Number(e.target.value),
                  }))
                }
                helperText="Lower numbers are evaluated first (important for formulas)"
                required
                // disabled={loading}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Component JSON Path"
                value={formData.component_json_path}
                onChange={e =>
                  setFormData(prev => ({
                    ...prev,
                    component_json_path: e.target.value,
                  }))
                }
                helperText='JSON: {"componentId": "abc", "propertyPath": "props.data.value"}'
                // disabled={loading}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.is_ctc_attribute || false}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        is_ctc_attribute: e.target.checked,
                      }))
                    }
                    // disabled={loading}
                  />
                }
                label="Is an Input Attribute (requires user input)"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDialog}
            // disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveDefinition}
            variant="contained"
            disabled={
              !formData.key || !formData.title
              // || loading
            }
          >
            {
              // loading ? (
              //   <CircularProgress size={24} color="inherit" />
              // ) :
              editingDefinition ? 'Update' : 'Create'
            }
          </Button>
        </DialogActions>
      </Dialog>

      {/* Custom Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={closeConfirmDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
          <Warning color="warning" sx={{ mr: 1 }} />
          {confirmDialog.title}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">{confirmDialog.message}</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={closeConfirmDialog}
            //  disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmDialog.onConfirm}
            variant="contained"
            color="error"
            // disabled={loading}
            startIcon={<CircularProgress size={16} />}
            // {loading ? <CircularProgress size={16} /> : <Delete />}
          >
            Delecte
            {/* {loading ? 'Deleting...' : 'Delete'} */}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CtcDefinitionManager;
