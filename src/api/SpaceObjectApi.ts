import { APIRequestContext } from "@playwright/test";

export interface SpaceObject {
    cosparId?: string,
    noradId?: string,
    name?: string,
    objectType?: string,
    launchCountry?: string,
    launchDate: string,
    launchSite?: string,
    decay: string,
    period: number,
    inclination: number,
    apogee: number,
    perigee: number,
    launchMass: number,
    dryMass: number
};

export class SpaceObjectApi {
    private request: APIRequestContext;
    private baseUrl: string;

    constructor(request: APIRequestContext) {
        this.request = request;
        this.baseUrl = 'https://neuraspacedummyrsoapiappservicelinux-hyayfbdrg3gea6fd.westeurope-01.azurewebsites.net';
    }

    async createSpaceObject(data: SpaceObject) {
        const url = `${this.baseUrl}/space_objects`;
        return await this.request.post(url, { data });
    }
}