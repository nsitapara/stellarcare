/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { VisitStatusEnum } from './VisitStatusEnum';
import type { VisitTypeEnum } from './VisitTypeEnum';
export type Visit = {
    readonly id: number;
    date: string;
    time: string;
    type: VisitTypeEnum;
    status: VisitStatusEnum;
    notes?: string | null;
    zoom_link?: string | null;
};
