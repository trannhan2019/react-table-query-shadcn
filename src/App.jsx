import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { apiGetListProduct } from "./apis/product";
import {
  getCoreRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  TableHead,
} from "@/components/ui/table";
import { DataTablePagination } from "./components/ui/pagination/pagination";
import { Button } from "./components/ui/button";

export const columns = [
  {
    accessorKey: "name",
    header: "Tên sản phẩm",
  },
  {
    accessorKey: "quantity",
    header: "Số lượng",
  },
];

function App() {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const {
    isLoading,
    isFetching,
    data: productsData,
  } = useQuery({
    queryKey: ["products", pagination],
    queryFn: () => {
      return apiGetListProduct({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize || 10,
      });
    },
  });

  // console.log(productsData?.data.data.products);

  const table = useReactTable({
    data: productsData?.data?.data.products || [],
    columns,
    state: { pagination },
    onPaginationChange: setPagination,
    pageCount: 50, //data.total
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
    // autoResetPageIndex:true, //reset page sau khi search, pagination...
    debugTable: true,
  });

  return (
    <>
      {isLoading && "loading..."}
      {productsData && productsData.data.data.products.length > 0 ? (
        <div className="p-2">
          <div className="h-2" />
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder ? null : (
                          <div>
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                          </div>
                        )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => {
                return (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <div className="h-2" />
          <DataTablePagination table={table} />
          <div className="flex items-center gap-2">
            <button
              className="border rounded p-1"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              {"<<"}
            </button>
            <button
              className="border rounded p-1"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              {"<"}
            </button>
            <button
              className="border rounded p-1"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              {">"}
            </button>
            <button
              className="border rounded p-1"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              {">>"}
            </button>
            <span className="flex items-center gap-1">
              <div>Page</div>
              <strong>
                {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
              </strong>
            </span>
            <span className="flex items-center gap-1">
              | Go to page:
              <input
                type="number"
                defaultValue={table.getState().pagination.pageIndex + 1}
                onChange={(e) => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0;
                  table.setPageIndex(page);
                }}
                className="border p-1 rounded w-16"
              />
            </span>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value));
              }}
            >
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
            {isFetching ? "Loading..." : null}
          </div>
          <div>{table.getRowModel().rows.length} Rows</div>
          <div>
            <button onClick={() => rerender()}>Force Rerender</button>
          </div>
          <pre>{JSON.stringify(pagination, null, 2)}</pre>
        </div>
      ) : (
        "None results"
      )}
      <Button className="btn btn-primary">Test Button voi daisy UI</Button>
    </>
  );
}

export default App;
