/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Address } from './Address';
import type { StatusEnum } from './StatusEnum';
export type PatchedPatient = {
    readonly id?: number;
    readonly addresses?: Array<Address>;
    first?: string;
    middle?: string | null;
    last?: string;
    date_of_birth?: string;
    status?: StatusEnum;
    readonly created_at?: string;
    readonly modified_at?: string;
    custom_fields?: Array<number>;
    studies?: Array<number>;
    treatments?: Array<number>;
    insurance?: Array<number>;
    appointments?: Array<number>;
};
