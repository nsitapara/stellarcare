/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Address } from './Address';
import type { PatientCustomField } from './PatientCustomField';
import type { PatientStatusEnum } from './PatientStatusEnum';
export type PatchedPatient = {
    readonly id?: number;
    addresses?: Array<Address>;
    custom_fields?: Array<Record<string, any>>;
    readonly patient_custom_fields?: Array<PatientCustomField>;
    first?: string;
    middle?: string | null;
    last?: string;
    date_of_birth?: string;
    status?: PatientStatusEnum;
    readonly created_at?: string;
    readonly modified_at?: string;
    studies?: Array<number>;
    treatments?: Array<number>;
    insurance?: Array<number>;
    appointments?: Array<number>;
};
