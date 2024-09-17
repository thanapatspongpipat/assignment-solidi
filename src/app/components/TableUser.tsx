"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import {
     Table,
     TableHeader,
     TableColumn,
     TableBody,
     TableRow,
     TableCell,
     Input,
     Button,
     DropdownTrigger,
     Dropdown,
     DropdownMenu,
     DropdownItem,
     Chip,
     User,
     Pagination,
     SortDescriptor,
     CalendarDate,
} from "@nextui-org/react";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import { columns } from "../../../public/data/tableUser";
import users from "../../../public/mocks/users.json";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { User as typeUser } from "../interface/User";
import ModalUser from "./ModalUser";

const statusColorMap = {
     active: "success",
     paused: "danger",
     vacation: "warning",
};

const INITIAL_VISIBLE_COLUMNS = [
     "firstName",
     "phone",
     "email",
     "actions",
     "lastName",
     "birthDate",
     "gender",
];

function capitalize(str: string) {
     return str.charAt(0).toUpperCase() + str.slice(1);
}

const formatDate = (date: CalendarDate) => {
     if (!date || typeof date !== "object") return "";
     const { year, month, day } = date;
     return `${year}-${month.toString().padStart(2, "0")}-${day
          .toString()
          .padStart(2, "0")}`;
};

const getGenderLabel = (genderId: number) => {
     switch (genderId) {
          case 1:
               return "Male";
          case 2:
               return "Female";
          case 3:
               return "ETC.";
          default:
               return "Unknown";
     }
};

export default function TableUser() {
     const [filterValue, setFilterValue] = useState<string>("");
     const [selectedKeys, setSelectedKeys] = useState<any>();
     const [visibleColumns, setVisibleColumns] = React.useState<any>(
          INITIAL_VISIBLE_COLUMNS
     );
     const [statusFilter, setStatusFilter] = React.useState<any | "all">("all");
     const [rowsPerPage, setRowsPerPage] = React.useState<number>(5);
     const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>(
          {
               column: "gender", // or any default column
               direction: "ascending",
          }
     );
     const [selectedUser, setSelectedUser] = React.useState<typeUser | null>(
          null
     ); // Track selected user
     const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false); // Modal open state

     const [page, setPage] = React.useState<number>(1);

     const hasSearchFilter = Boolean(filterValue);

     const headerColumns = React.useMemo(() => {
          if (visibleColumns === "all") return columns;
          return columns.filter((column) =>
               Array.from(visibleColumns).includes(column.uid)
          );
     }, [visibleColumns]);

     const filteredItems = React.useMemo(() => {
          let filteredUsers = [...users];
          if (hasSearchFilter) {
               filteredUsers = filteredUsers.filter((user) =>
                    user.firstName
                         .toLowerCase()
                         .includes(filterValue.toLowerCase())
               );
          }

          return filteredUsers;
     }, [users, filterValue, statusFilter]);

     const pages = Math.ceil(filteredItems.length / rowsPerPage);

     const items = React.useMemo(() => {
          const start = (page - 1) * rowsPerPage;
          const end = start + rowsPerPage;

          return filteredItems.slice(start, end);
     }, [page, filteredItems, rowsPerPage]);

     const sortedItems = React.useMemo(() => {
          if (!sortDescriptor.column) {
               return items;
          }

          return [...items].sort((a, b) => {
               const first = a[sortDescriptor.column as keyof typeof a];
               const second = b[sortDescriptor.column as keyof typeof b];

               if (first === undefined || second === undefined) return 0;

               const cmp = first < second ? -1 : first > second ? 1 : 0;

               return sortDescriptor.direction === "descending" ? -cmp : cmp;
          });
     }, [sortDescriptor, items]);

     const renderCell = React.useCallback((user: any, columnKey: any) => {
          const cellValue = user[columnKey];

          switch (columnKey) {
               case "email":
                    return (
                         <User description={user.email} name={cellValue}>
                              {user.email}
                         </User>
                    );
               case "firstName":
                    return (
                         <div className="flex flex-col">
                              <p className="text-bold text-small capitalize">
                                   {cellValue}
                              </p>
                              <p className="text-bold text-tiny capitalize text-default-400">
                                   {user.firstName}
                              </p>
                         </div>
                    );
               case "gender":
                    return (
                         <Chip className="capitalize" size="sm" variant="flat">
                              {getGenderLabel(cellValue)}
                         </Chip>
                    );
               case "birthDate":
                    return formatDate(cellValue);
               case "actions":
                    return (
                         <div className="relative flex justify-center items-center gap-2">
                              <Button
                                   isIconOnly
                                   size="sm"
                                   variant="light"
                                   onClick={() => openUserModal(user)} // Open modal on click
                              >
                                   <VisibilityOutlinedIcon className="text-default-30 text-green-600" />
                              </Button>
                         </div>
                    );
               default:
                    return <span>{cellValue || "N/A"}</span>;
          }
     }, []);

     const onNextPage = React.useCallback(() => {
          if (page < pages) {
               setPage(page + 1);
          }
     }, [page, pages]);

     const onPreviousPage = React.useCallback(() => {
          if (page > 1) {
               setPage(page - 1);
          }
     }, [page]);

     const onRowsPerPageChange = React.useCallback(
          (e: React.ChangeEvent<HTMLSelectElement>) => {
               setRowsPerPage(Number(e.target.value));
               setPage(1);
          },
          []
     );

     const onSearchChange = React.useCallback((value: string) => {
          if (value) {
               setFilterValue(value);
               setPage(1);
          } else {
               setFilterValue("");
          }
     }, []);

     const onClear = React.useCallback(() => {
          setFilterValue("");
          setPage(1);
     }, []);

     const openUserModal = (user: typeUser) => {
          console.log(user);
          setSelectedUser(user);
          setIsModalOpen(true);
     };

     const closeUserModal = () => {
          setSelectedUser(null);
          setIsModalOpen(false);
     };

     const topContent = React.useMemo(() => {
          return (
               <div className="flex flex-col gap-4">
                    <div className="flex justify-between gap-3 items-end">
                         <Input
                              isClearable
                              className="w-full sm:max-w-[44%]"
                              placeholder="Search by name..."
                              startContent={<SearchOutlinedIcon />}
                              value={filterValue}
                              onClear={() => onClear()}
                              onValueChange={onSearchChange}
                         />
                         <div className="flex gap-3">
                              {/* <Dropdown>
                                   <DropdownTrigger className="hidden sm:flex">
                                        <Button
                                             endContent={
                                                  <ExpandMoreOutlinedIcon className="text-small" />
                                             }
                                             variant="flat"
                                        >
                                             Status
                                        </Button>
                                   </DropdownTrigger>
                                   <DropdownMenu
                                        disallowEmptySelection
                                        aria-label="Table Columns"
                                        closeOnSelect={false}
                                        selectedKeys={statusFilter}
                                        selectionMode="multiple"
                                        onSelectionChange={setStatusFilter}
                                   >
                                        {statusOptions.map((status) => (
                                             <DropdownItem
                                                  key={status.uid}
                                                  className="capitalize"
                                             >
                                                  {capitalize(status.name)}
                                             </DropdownItem>
                                        ))}
                                   </DropdownMenu>
                              </Dropdown> */}
                              <Dropdown>
                                   <DropdownTrigger className="hidden sm:flex">
                                        <Button
                                             endContent={
                                                  <ExpandMoreOutlinedIcon className="text-small" />
                                             }
                                             variant="flat"
                                        >
                                             Columns
                                        </Button>
                                   </DropdownTrigger>
                                   <DropdownMenu
                                        disallowEmptySelection
                                        aria-label="Table Columns"
                                        closeOnSelect={false}
                                        selectedKeys={visibleColumns}
                                        selectionMode="multiple"
                                        onSelectionChange={setVisibleColumns}
                                   >
                                        {columns.map((column) => (
                                             <DropdownItem
                                                  key={column.uid}
                                                  className="capitalize"
                                             >
                                                  {capitalize(column.name)}
                                             </DropdownItem>
                                        ))}
                                   </DropdownMenu>
                              </Dropdown>
                         </div>
                    </div>
                    <div className="flex justify-between items-center">
                         <span className="text-default-400 text-small">
                              Total {users.length} users
                         </span>
                         <label className="flex items-center text-default-400 text-small">
                              Rows per page:
                              <select
                                   className="bg-transparent outline-none text-default-400 text-small"
                                   onChange={onRowsPerPageChange}
                              >
                                   <option value="5">5</option>
                                   <option value="10">10</option>
                                   <option value="15">15</option>
                              </select>
                         </label>
                    </div>
               </div>
          );
     }, [
          filterValue,
          statusFilter,
          visibleColumns,
          onRowsPerPageChange,
          users.length,
          onSearchChange,
          hasSearchFilter,
     ]);

     const bottomContent = React.useMemo(() => {
          return (
               <div className="py-2 px-2 flex justify-between items-center">
                    <span className="w-[30%] text-small text-default-400">
                         {/* {selectedKeys === "all"
                              ? "All items selected"
                              : `${selectedKeys.length} of ${filteredItems.length} selected`} */}
                    </span>
                    <Pagination
                         isCompact
                         showControls
                         showShadow
                         color="primary"
                         page={page}
                         total={pages}
                         onChange={setPage}
                    />
                    <div className="hidden sm:flex w-[30%] justify-end gap-2">
                         <Button
                              isDisabled={pages === 1}
                              size="sm"
                              variant="flat"
                              onPress={onPreviousPage}
                         >
                              Previous
                         </Button>
                         <Button
                              isDisabled={pages === 1}
                              size="sm"
                              variant="flat"
                              onPress={onNextPage}
                         >
                              Next
                         </Button>
                    </div>
               </div>
          );
     }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

     return (
          <>
               <Table
                    aria-label="Example table with custom cells, pagination and sorting"
                    isHeaderSticky
                    bottomContent={bottomContent}
                    bottomContentPlacement="outside"
                    classNames={{
                         wrapper: "h-[445px]",
                    }}
                    selectedKeys={selectedKeys}
                    // selectionMode="multiple"
                    sortDescriptor={sortDescriptor}
                    topContent={topContent}
                    topContentPlacement="outside"
                    onSelectionChange={setSelectedKeys}
                    onSortChange={setSortDescriptor}
               >
                    <TableHeader columns={headerColumns}>
                         {(column: any) => (
                              <TableColumn
                                   key={column.uid}
                                   align={
                                        column.uid === "actions"
                                             ? "center"
                                             : "start"
                                   }
                                   allowsSorting={column.sortable}
                              >
                                   {column.name}
                              </TableColumn>
                         )}
                    </TableHeader>
                    <TableBody
                         emptyContent={"No users found"}
                         items={sortedItems}
                    >
                         {(item: any) => (
                              <TableRow key={item?.email}>
                                   {(columnKey: any) => (
                                        <TableCell>
                                             {renderCell(item, columnKey)}
                                        </TableCell>
                                   )}
                              </TableRow>
                         )}
                    </TableBody>
               </Table>
               <ModalUser
                    user={selectedUser}
                    isOpen={isModalOpen}
                    onClose={closeUserModal}
               />
          </>
     );
}
