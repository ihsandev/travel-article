"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  Table as ReactTable,
  Row,
  useReactTable,
} from "@tanstack/react-table";
import React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useVirtualizer } from "@tanstack/react-virtual";
import { Loader, RefreshCw, X } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { SelectField } from "../form/select-field";

interface CategoryOptions {
  value: string;
  label: string;
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: any;
  isLoading?: boolean;
  paginationType?: "pagination" | "infinite-scroll" | "load-more";
  infiniteOptions?: {
    hasNextPage: boolean;
    fetchNextPage: () => void;
    isFetchingNextPage: boolean;
  };
  isShowFilter?: boolean;
  filterOption?: {
    search: string;
    setSearch: (search: string) => void;
    category?: string;
    categories?: CategoryOptions[];
    setCategory?: (originalValue: string, filterValue: string) => void;
  };
}

function TableRows<TData, TValue>({
  table,
  columns,
  isInfiniteScroll,
  rowVirtualizer,
  rows,
}: {
  table: ReactTable<TData>;
  columns: ColumnDef<TData, TValue>[];
  isInfiniteScroll?: boolean;
  rowVirtualizer?: any;
  rows?: any;
}) {
  if (isInfiniteScroll) {
    return rowVirtualizer.getVirtualItems().map((virtualRow: any) => {
      const row = rows[virtualRow.index] as Row<TData>;
      return (
        <TableRow
          data-index={virtualRow.index} //needed for dynamic row height measurement
          ref={(node) => rowVirtualizer.measureElement(node)} //measure dynamic row height
          key={row.id}
          style={{
            display: "flex",
            position: "absolute",
            transform: `translateY(${virtualRow.start}px)`, //this should always be a `style` as it changes on scroll
            width: "100%",
          }}
        >
          {row.getVisibleCells().map((cell) => {
            return (
              <TableCell
                key={cell.id}
                style={{
                  display: "flex",
                  width: cell.column.getSize(),
                }}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            );
          })}
        </TableRow>
      );
    });
  } else
    return table.getRowModel().rows?.length ? (
      table.getRowModel().rows.map((row) => (
        <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
          {row.getVisibleCells().map((cell) => (
            <TableCell key={cell.id}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </TableCell>
          ))}
        </TableRow>
      ))
    ) : (
      <TableRow>
        <TableCell colSpan={columns.length} className="h-24 text-center">
          No results.
        </TableCell>
      </TableRow>
    );
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading,
  paginationType = "pagination",
  infiniteOptions,
  isShowFilter,
  filterOption,
}: Readonly<DataTableProps<TData, TValue>>) {
  const tableContainerRef = React.useRef<HTMLTableElement>(null);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const isInfiniteScroll = paginationType === "infinite-scroll";
  const isLoadMore = paginationType === "load-more";
  const { hasNextPage, fetchNextPage, isFetchingNextPage } =
    infiniteOptions ?? {};

  const flatData = React.useMemo(
    () => data?.pages?.flatMap((page: any) => page.data) ?? [],
    [data]
  );
  const totalDBRowCount = data?.pages?.[0]?.total ?? 0;
  const totalFetched = flatData.length;

  //called on scroll and possibly on mount to fetch more data as the user scrolls and reaches bottom of table
  const fetchMoreOnBottomReached = React.useCallback(
    (containerRefElement?: HTMLDivElement | null) => {
      if (containerRefElement) {
        const { scrollHeight, scrollTop, clientHeight } = containerRefElement;
        if (
          scrollHeight - scrollTop - clientHeight < 100 &&
          !isFetchingNextPage &&
          totalFetched < totalDBRowCount
        ) {
          fetchNextPage?.();
        }
      }
    },
    [fetchNextPage, isFetchingNextPage, totalFetched, totalDBRowCount]
  );

  //a check on mount and after a fetch to see if the table is already scrolled to the bottom and immediately needs to fetch more data
  React.useEffect(() => {
    if (isInfiniteScroll) {
      fetchMoreOnBottomReached(tableContainerRef.current);
    }
  }, [fetchMoreOnBottomReached]);

  const infiniteTable = useReactTable({
    data: flatData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    debugTable: true,
  });

  const { rows } = infiniteTable.getRowModel();

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () => 33, //estimate row height for accurate scrollbar dragging
    getScrollElement: () => tableContainerRef.current,
    //measure dynamic row height, except in firefox because it measures table border height incorrectly
    measureElement:
      typeof window !== "undefined" &&
      navigator.userAgent.indexOf("Firefox") === -1
        ? (element: any) => element?.getBoundingClientRect().height
        : undefined,
    overscan: 5,
  });

  return (
    <>
      {isShowFilter && (
        <div className="mb-4 flex items-center space-x-2">
          <Input
            placeholder="Search"
            value={filterOption?.search}
            onChange={(e) => filterOption?.setSearch?.(e.target.value)}
          />
          {filterOption?.categories && (
            <>
              <SelectField
                value={filterOption?.category}
                items={filterOption?.categories}
                placeholder="Filter by category"
                onValueChange={(value) =>
                  filterOption?.setCategory?.(value, value?.split("-")[1])
                }
              />
              {(filterOption?.search || filterOption?.category) && (
                <Button
                  startContent={<X />}
                  size="sm"
                  variant="destructive"
                  onClick={() => {
                    filterOption?.setSearch?.("");
                    filterOption?.setCategory?.("", "");
                  }}
                >
                  Clear
                </Button>
              )}
            </>
          )}
        </div>
      )}
      <div className="rounded-sm border overflow-hidden">
        {isInfiniteScroll ? (
          <>
            <Table
              className="grid"
              ref={tableContainerRef}
              onScroll={(e) =>
                isInfiniteScroll
                  ? fetchMoreOnBottomReached(e.currentTarget)
                  : {}
              }
              style={{
                overflow: "auto", //our scrollable table container
                position: "relative", //needed for sticky header
                height: isFetchingNextPage ? "450px" : "490px", //should be a fixed height
              }}
            >
              <TableHeader className="grid sticky top-0 z-[1] bg-sky-900 text-sky-50 h-10">
                {infiniteTable.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="flex w-full">
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead
                          key={header.id}
                          className={`flex text-sky-50 items-center`}
                          style={{
                            width: header.getSize(),
                          }}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody
                className={`relative grid bg-sky-50`}
                style={{
                  height:
                    filterOption?.search || filterOption?.category
                      ? "inherit"
                      : `${rowVirtualizer.getTotalSize()}px`,
                }}
              >
                {isLoading ? (
                  <TableRow className="flex items-center justify-center">
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      <Loader className="animate-spin h-5 w-5" />
                    </TableCell>
                  </TableRow>
                ) : (
                  <TableRows
                    table={infiniteTable}
                    columns={columns}
                    isInfiniteScroll={isInfiniteScroll}
                    rows={rows}
                    rowVirtualizer={rowVirtualizer}
                  />
                )}
              </TableBody>
            </Table>
            {isFetchingNextPage && (
              <div className="flex items-center justify-center space-x-2 bg-sky-50 py-2 w-full box-border">
                <Loader className="animate-spin h-5 w-5" />
                <p>Loading more...</p>
              </div>
            )}
            {isLoadMore && hasNextPage && !isFetchingNextPage && (
              <div className="flex items-center justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  startContent={<RefreshCw />}
                  onClick={() => fetchNextPage?.()}
                >
                  Load More
                </Button>
              </div>
            )}
          </>
        ) : (
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              <TableRows columns={columns} table={table} />
            </TableBody>
          </Table>
        )}
      </div>
    </>
  );
}
