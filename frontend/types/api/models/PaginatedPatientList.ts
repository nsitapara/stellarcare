/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Patient } from './Patient';
export type PaginatedPatientList = {
    count: number;
    next?: string | null;
    previous?: string | null;
    results: Array<Patient>;
};
