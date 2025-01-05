/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Insurance } from '../models/Insurance';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class InsuranceService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Retrieves a single insurance record by ID.
     * @param id
     * @returns Insurance
     * @throws ApiError
     */
    public insuranceRetrieve(
        id: number,
    ): CancelablePromise<Insurance> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/insurance/{id}/',
            path: {
                'id': id,
            },
        });
    }
}
