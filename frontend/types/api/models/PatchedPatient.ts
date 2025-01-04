/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { StatusEnum } from './StatusEnum';
export type PatchedPatient = {
    readonly id?: string;
    first?: string;
    middle?: string | null;
    last?: string;
    date_of_birth?: string;
    status?: StatusEnum;
    addresses?: Array<number>;
    custom_fields?: Array<number>;
    studies?: Array<number>;
    treatments?: Array<number>;
    insurance?: Array<number>;
    appointments?: Array<number>;
};
