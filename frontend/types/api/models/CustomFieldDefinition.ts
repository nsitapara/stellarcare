/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CustomFieldDefinitionTypeEnum } from './CustomFieldDefinitionTypeEnum';
export type CustomFieldDefinition = {
    readonly id: number;
    name: string;
    type: CustomFieldDefinitionTypeEnum;
    description?: string | null;
    /**
     * For select type fields, stores the available options
     */
    options?: any;
    is_active?: boolean;
    is_required?: boolean;
    display_order?: number;
};
