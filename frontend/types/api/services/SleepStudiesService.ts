/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SleepStudy } from '../models/SleepStudy';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class SleepStudiesService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Retrieves a single sleep study by ID.
     * @param id
     * @returns SleepStudy
     * @throws ApiError
     */
    public sleepStudiesRetrieve(
        id: number,
    ): CancelablePromise<SleepStudy> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/sleep-studies/{id}/',
            path: {
                'id': id,
            },
        });
    }
}
