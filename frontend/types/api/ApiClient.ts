/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseHttpRequest } from './core/BaseHttpRequest';
import type { OpenAPIConfig } from './core/OpenAPI';
import { FetchHttpRequest } from './core/FetchHttpRequest';
import { CustomFieldDefinitionsService } from './services/CustomFieldDefinitionsService';
import { PatientsService } from './services/PatientsService';
import { SchemaService } from './services/SchemaService';
import { TokenService } from './services/TokenService';
import { UsersService } from './services/UsersService';
type HttpRequestConstructor = new (config: OpenAPIConfig) => BaseHttpRequest;
export class ApiClient {
    public readonly customFieldDefinitions: CustomFieldDefinitionsService;
    public readonly patients: PatientsService;
    public readonly schema: SchemaService;
    public readonly token: TokenService;
    public readonly users: UsersService;
    public readonly request: BaseHttpRequest;
    constructor(config?: Partial<OpenAPIConfig>, HttpRequest: HttpRequestConstructor = FetchHttpRequest) {
        this.request = new HttpRequest({
            BASE: config?.BASE ?? '',
            VERSION: config?.VERSION ?? '0.0.0',
            WITH_CREDENTIALS: config?.WITH_CREDENTIALS ?? false,
            CREDENTIALS: config?.CREDENTIALS ?? 'include',
            TOKEN: config?.TOKEN,
            USERNAME: config?.USERNAME,
            PASSWORD: config?.PASSWORD,
            HEADERS: config?.HEADERS,
            ENCODE_PATH: config?.ENCODE_PATH,
        });
        this.customFieldDefinitions = new CustomFieldDefinitionsService(this.request);
        this.patients = new PatientsService(this.request);
        this.schema = new SchemaService(this.request);
        this.token = new TokenService(this.request);
        this.users = new UsersService(this.request);
    }
}
