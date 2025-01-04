/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CustomFieldDefinition } from '../models/CustomFieldDefinition';
import type { PaginatedCustomFieldDefinitionList } from '../models/PaginatedCustomFieldDefinitionList';
import type { PatchedCustomFieldDefinition } from '../models/PatchedCustomFieldDefinition';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class CustomFieldDefinitionsService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Handles listing all custom field definitions and creating new ones.
     * @param page A page number within the paginated result set.
     * @returns PaginatedCustomFieldDefinitionList
     * @throws ApiError
     */
    public customFieldDefinitionsList(
        page?: number,
    ): CancelablePromise<PaginatedCustomFieldDefinitionList> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/custom-field-definitions/',
            query: {
                'page': page,
            },
        });
    }
    /**
     * Handles listing all custom field definitions and creating new ones.
     * @param requestBody
     * @returns CustomFieldDefinition
     * @throws ApiError
     */
    public customFieldDefinitionsCreate(
        requestBody: CustomFieldDefinition,
    ): CancelablePromise<CustomFieldDefinition> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/custom-field-definitions/',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Handles retrieving, updating, and deleting a single custom field definition.
     * @param id
     * @returns CustomFieldDefinition
     * @throws ApiError
     */
    public customFieldDefinitionsRetrieve(
        id: number,
    ): CancelablePromise<CustomFieldDefinition> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/custom-field-definitions/{id}/',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Handles retrieving, updating, and deleting a single custom field definition.
     * @param id
     * @param requestBody
     * @returns CustomFieldDefinition
     * @throws ApiError
     */
    public customFieldDefinitionsUpdate(
        id: number,
        requestBody: CustomFieldDefinition,
    ): CancelablePromise<CustomFieldDefinition> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/custom-field-definitions/{id}/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Handles retrieving, updating, and deleting a single custom field definition.
     * @param id
     * @param requestBody
     * @returns CustomFieldDefinition
     * @throws ApiError
     */
    public customFieldDefinitionsPartialUpdate(
        id: number,
        requestBody?: PatchedCustomFieldDefinition,
    ): CancelablePromise<CustomFieldDefinition> {
        return this.httpRequest.request({
            method: 'PATCH',
            url: '/api/custom-field-definitions/{id}/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Handles retrieving, updating, and deleting a single custom field definition.
     * @param id
     * @returns void
     * @throws ApiError
     */
    public customFieldDefinitionsDestroy(
        id: number,
    ): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/custom-field-definitions/{id}/',
            path: {
                'id': id,
            },
        });
    }
}