import test, { expect } from "@playwright/test";
import dayjs from 'dayjs';
import { CelestrakApi, CelestrakSpaceObject } from "../api/CelestrakApi";

test.describe('Celestrak space-objects API validation', () => {
    let spaceObjects: CelestrakSpaceObject[] = [];
    
    test.beforeAll('Fetch space objects from last 30 days', async ({ request }) => {
        const celestrakApi = new CelestrakApi(request);

        try {
            const response = await celestrakApi.getSpaceObjects();

            if (!response.ok()) {
                throw new Error(`Request was not successful`);
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