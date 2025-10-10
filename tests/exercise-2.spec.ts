import test, { expect } from "@playwright/test";
import dayjs from 'dayjs';

interface SpaceObject {
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

let spaceObjects: SpaceObject[] = [];

test.describe('Celestrak space-objects API validation', () => {
    test.beforeAll('Fetch space objects from last 30 days', async ({ request }) => {
        const url = 'https://celestrak.org/NORAD/elements/gp.php?GROUP=last-30-days&FORMAT=json';

        try {
            const response = await request.fetch(url);

            if (!response.ok()) {
                throw new Error(`Request was not successfull`);
            }

            if (response.status() === 204) {
                test.skip();
            }

            spaceObjects = await response.json();

            if (!Array.isArray(spaceObjects) || spaceObjects.length < 1) {
                throw new Error('Expected response to be an array of space objects.');
            }
        } catch (error) {
            throw new Error(`Unable to fetch data from celestrak endpoint: ${error}`);
        }
    });


    test('Each space object has a valid EPOCH within last 30 days', () => {
        for (const spaceObject of spaceObjects) {
            expect(spaceObject).toHaveProperty('EPOCH');
            expect(typeof spaceObject.EPOCH).toBe('string');

            const launch = dayjs(spaceObject.EPOCH);

            expect(launch.isValid()).toBeTruthy();

            const now = dayjs();

            const diff = now.diff(launch, 'day', true);

            expect(now.isAfter(launch)).toBeTruthy();
            expect(diff).toBeLessThanOrEqual(30);
        }
    });

    test('Each OBJECT_ID should be valid', () => {
        for (const spaceObject of spaceObjects) {
            expect(spaceObject).toHaveProperty('EPOCH');
            expect(typeof spaceObject.EPOCH).toBe('string');

            expect(spaceObject).toHaveProperty('OBJECT_ID');
            expect(typeof spaceObject.OBJECT_ID).toBe('string');

            const launch = dayjs(spaceObject.EPOCH);

            expect(launch.isValid()).toBeTruthy();

            const launchYear = launch.year();

            const objRegex = new RegExp(`^${launchYear}-\d{3}[A-Z]{1,3}$`);
            expect(spaceObject.OBJECT_ID).toMatch(objRegex);
        };
    });

    test('Each NORAD_CAT_ID is a 5-digit number', () => {
        for (const spaceObject of spaceObjects) {
            expect(spaceObject).toHaveProperty('NORAD_CAT_ID');

            expect(typeof spaceObject.NORAD_CAT_ID).toBe('number');

            expect(spaceObject.NORAD_CAT_ID.toString()).toMatch(/^\d{5}$/);
        }
    });
});