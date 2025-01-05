/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PaginatedPatientCustomFieldList } from '../models/PaginatedPatientCustomFieldList';
import type { PaginatedPatientList } from '../models/PaginatedPatientList';
import type { PatchedPatient } from '../models/PatchedPatient';
import type { Patient } from '../models/Patient';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class PatientsService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Handles listing all patients and creating a new patient.
     * @param page A page number within the paginated result set.
     * @param pageSize Number of results to return per page.
     * @returns PaginatedPatientList
     * @throws ApiError
     */
    public patientsList(
        page?: number,
        pageSize?: number,
    ): CancelablePromise<PaginatedPatientList> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/patients/',
            query: {
                'page': page,
                'page_size': pageSize,
            },
        });
    }
    /**
     * Handles listing all patients and creating a new patient.
     * @param requestBody
     * @returns Patient
     * @throws ApiError
     */
    public patientsCreate(
        requestBody: Patient,
    ): CancelablePromise<Patient> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/patients/',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Handles listing all custom field values for a specific patient.
     * @param patientId
     * @param page A page number within the paginated result set.
     * @returns PaginatedPatientCustomFieldList
     * @throws ApiError
     */
    public patientsCustomFieldsList(
        patientId: number,
        page?: number,
    ): CancelablePromise<PaginatedPatientCustomFieldList> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/patients/{patient_id}/custom-fields/',
            path: {
                'patient_id': patientId,
            },
            query: {
                'page': page,
            },
        });
    }
    /**
     * Handles retrieving, updating, and deleting a single patient.
     * @param id
     * @returns Patient
     * @throws ApiError
     */
    public patientsRetrieve(
        id: string,
    ): CancelablePromise<Patient> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/patients/{id}/',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Handles retrieving, updating, and deleting a single patient.
     * @param id
     * @param requestBody
     * @returns Patient
     * @throws ApiError
     */
    public patientsUpdate(
        id: string,
        requestBody: Patient,
    ): CancelablePromise<Patient> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/patients/{id}/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Handles retrieving, updating, and deleting a single patient.
     * @param id
     * @param requestBody
     * @returns Patient
     * @throws ApiError
     */
    public patientsPartialUpdate(
        id: string,
        requestBody?: PatchedPatient,
    ): CancelablePromise<Patient> {
        return this.httpRequest.request({
            method: 'PATCH',
            url: '/api/patients/{id}/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Handles retrieving, updating, and deleting a single patient.
     * @param id
     * @returns void
     * @throws ApiError
     */
    public patientsDestroy(
        id: string,
    ): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/patients/{id}/',
            path: {
                'id': id,
            },
        });
    }
    /**
     * API endpoint for searching patients by name or ID.
     * Supports:
     * - Exact ID match for numeric queries
     * - Case-insensitive partial name match for text queries
     * @returns any No response body
     * @throws ApiError
     */
    public patientsSearchRetrieve(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/patients/search/',
        });
    }
}
