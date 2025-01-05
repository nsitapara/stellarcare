/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Treatment } from '../models/Treatment';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class TreatmentsService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Retrieves a single treatment by ID.
     * @param id
     * @returns Treatment
     * @throws ApiError
     */
    public treatmentsRetrieve(
        id: number,
    ): CancelablePromise<Treatment> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/treatments/{id}/',
            path: {
                'id': id,
            },
        });
    }
}
