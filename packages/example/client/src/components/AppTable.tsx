import {
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";
import { AppTableProps } from "../types/types";
import { useState } from "react";
import "./AppTable.css";

const AppTable = <T extends object>({
  columns,
  rows,
  page,
  setPage,
  limit,
  setLimit,
  count,
  emptyMessage = "No Records Found",
  sX = {},
  renderRow,
  loading,
  showPagination = true,
  rearrangeCheck = false,
  onRowReorder,
  onSort,
}: AppTableProps<T>) => {
  const [rowsPerPage, setRowsPerPage] = useState(limit);
  const [draggedRowIndex, setDraggedRowIndex] = useState<number | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    [key: string]: "asc" | "desc";
  }>({});

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newLimit = +event.target.value;
    setRowsPerPage(newLimit);
    setLimit(newLimit);
    setPage(0);
  };

  const handleDragStart = (index: number) => {
    setDraggedRowIndex(index);
  };

  const handleDragOver = (event: React.DragEvent<HTMLTableRowElement>) => {
    event.preventDefault();
  };

  const handleDrop = (
    event: React.DragEvent<HTMLTableRowElement>,
    dropIndex: number
  ) => {
    event.preventDefault();
    if (
      draggedRowIndex !== null &&
      draggedRowIndex !== dropIndex &&
      onRowReorder
    ) {
      onRowReorder(rows[draggedRowIndex].id, rows[dropIndex].id);
    }
    setDraggedRowIndex(null);
  };

  const handleSort = (columnId: string) => {
    setSortConfig((prevConfig) => ({
      ...prevConfig,
      [columnId]: prevConfig[columnId] === "asc" ? "desc" : "asc",
    }));

    if (onSort) {
      onSort(columnId, sortConfig[columnId] === "asc" ? "desc" : "asc");
    }
  };

  return (
    <div>
      <TableContainer sx={{ ...sX }} className="table">
        <Table aria-label="common table1" size="small">
          <TableHead className="tableheaders">
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={String(column.id)}
                  align={column.headerAlign || column.align}
                  style={{
                    minWidth: column.minWidth,
                    width: column.width ? `${column.width}%` : "auto",
                    cursor: column.arrow ? "pointer" : "default",
                    position: "relative",
                  }}
                  onClick={() => column.arrow && handleSort(column.id)}
                >
                  {column.label}
                  {column.arrow && (
                    <span
                      style={{
                        marginLeft: "5px",
                        display: "inline-flex",
                        alignItems: "center",
                        verticalAlign: "middle",
                      }}
                    >
                      {sortConfig[column.id] === "desc" ? (
                        <ArrowDownward fontSize="small" />
                      ) : sortConfig[column.id] === "asc" ? (
                        <ArrowUpward fontSize="small" />
                      ) : (
                        <ArrowDownward
                          fontSize="small"
                          style={{ opacity: 0.5 }}
                        />
                      )}
                    </span>
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  align="center"
                  style={{ padding: "20px" }}
                >
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : rows.length !== 0 ? (
              rows.map((row, index) =>
                rearrangeCheck ? (
                  <TableRow
                    key={index}
                    draggable={rearrangeCheck}
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={handleDragOver}
                    onDrop={(event) => handleDrop(event, index)}
                  >
                    {renderRow(row, columns)}
                  </TableRow>
                ) : (
                  renderRow(row, columns)
                )
              )
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {showPagination && (
        <TablePagination
          rowsPerPageOptions={[100, 200, 500]}
          component="div"
          count={count}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}
    </div>
  );
};

export default AppTable;
