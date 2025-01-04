/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CustomField } from '../models/CustomField';
import type { PaginatedCustomFieldList } from '../models/PaginatedCustomFieldList';
import type { PatchedCustomField } from '../models/PatchedCustomField';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class CustomFieldsService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Handles listing all custom fields and creating a new custom field.
     * @param page A page number within the paginated result set.
     * @returns PaginatedCustomFieldList
     * @throws ApiError
     */
    public customFieldsList(
        page?: number,
    ): CancelablePromise<PaginatedCustomFieldList> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/custom-fields/',
            query: {
                'page': page,
            },
        });
    }
    /**
     * Handles listing all custom fields and creating a new custom field.
     * @param requestBody
     * @returns CustomField
     * @throws ApiError
     */
    public customFieldsCreate(
        requestBody: CustomField,
    ): CancelablePromise<CustomField> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/custom-fields/',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Handles retrieving, updating, and deleting a single custom field.
     * @param id
     * @returns CustomField
     * @throws ApiError
     */
    public customFieldsRetrieve(
        id: number,
    ): CancelablePromise<CustomField> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/custom-fields/{id}/',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Handles retrieving, updating, and deleting a single custom field.
     * @param id
     * @param requestBody
     * @returns CustomField
     * @throws ApiError
     */
    public customFieldsUpdate(
        id: number,
        requestBody: CustomField,
    ): CancelablePromise<CustomField> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/custom-fields/{id}/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Handles retrieving, updating, and deleting a single custom field.
     * @param id
     * @param requestBody
     * @returns CustomField
     * @throws ApiError
     */
    public customFieldsPartialUpdate(
        id: number,
        requestBody?: PatchedCustomField,
    ): CancelablePromise<CustomField> {
        return this.httpRequest.request({
            method: 'PATCH',
            url: '/api/custom-fields/{id}/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Handles retrieving, updating, and deleting a single custom field.
     * @param id
     * @returns void
     * @throws ApiError
     */
    public customFieldsDestroy(
        id: number,
    ): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/custom-fields/{id}/',
            path: {
                'id': id,
            },
        });
    }
}
