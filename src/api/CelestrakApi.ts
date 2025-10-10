import { APIRequestContext } from "@playwright/test";

export interface CelestrakSpaceObject {
    OBJECT_NAME: string,
    OBJECT_ID: string,
    EPOCH: string,
    MEAN_MOTION: number,
    ECCENTRICITY: number,
    INCLINATION: number,
    RA_OF_ASC_NODE: number,
    ARG_OF_PERICENTER: number
    MEAN_ANOMALY: number,
    EPHEMERIS_TYPE: number,
    CLASSIFICATION_TYPE: string,
    NORAD_CAT_ID: number,
    ELEMENT_SET_NO: number,
    REV_AT_EPOCH: number,
    BSTAR: number,
    MEAN_MOTION_DOT: number,
    MEAN_MOTION_DDOT: number
};

export class CelestrakApi {
    private request: APIRequestContext;
    private baseUrl: string;

    constructor(request: APIRequestContext) {
        this.request = request;
        this.baseUrl = 'https://celestrak.org/NORAD/elements/gp.php';
    }

    async getSpaceObjects() {
        const url = `${this.baseUrl}?GROUP=last-30-days&FORMAT=json`;
        return await this.request.fetch(url);
    }
}
