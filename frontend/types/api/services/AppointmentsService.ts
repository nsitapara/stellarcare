/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Visit } from '../models/Visit';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class AppointmentsService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Retrieves a single appointment by ID.
     * @param id
     * @returns Visit
     * @throws ApiError
     */
    public appointmentsRetrieve(
        id: number,
    ): CancelablePromise<Visit> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/appointments/{id}/',
            path: {
                'id': id,
            },
        });
    }
}
