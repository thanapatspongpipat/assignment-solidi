import { CalendarDate } from "@nextui-org/react";

export interface User {
     email: string;
     phone: string;
     password: string;
     confirmPassword?: string;
     firstName: string;
     lastName: string;
     gender: number;
     birthDate: CalendarDate;
}

export type UserWithActions = User & { actions: undefined };
