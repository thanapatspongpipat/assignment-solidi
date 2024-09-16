const columns = [
     { name: "EMAIL", uid: "email" },
     { name: "FIRSTNAME", uid: "firstName", sortable: true },
     { name: "LASTNAME", uid: "lastName", sortable: true },
     { name: "PHONE", uid: "phone" },
     { name: "GENDER", uid: "gender", sortable: true },
     { name: "BIRTHDATE", uid: "birthDate" },
     { name: "ACTIONS", uid: "actions" },
];

const statusOptions = [
     { name: "Active", uid: "active" },
     { name: "Paused", uid: "paused" },
     { name: "Vacation", uid: "vacation" },
];

export { columns, statusOptions };
