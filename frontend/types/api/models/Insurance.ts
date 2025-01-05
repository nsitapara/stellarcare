/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type Insurance = {
    readonly id: number;
    provider: string;
    policy_number: string;
    group_number: string;
    primary_holder: string;
    relationship: string;
    authorization_status?: string | null;
    authorization_expiry?: string | null;
};
