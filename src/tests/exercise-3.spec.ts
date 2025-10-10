import test, { expect } from "@playwright/test";
import { SpaceObject, SpaceObjectApi } from "../api/SpaceObjectApi";

const payload: SpaceObject = {
    name: "Test Satellite",
    objectType: "Payload",
    launchCountry: "USA",
    launchDate: "2023-12-08T04:06:32.929Z",
    launchSite: "Cape Canaveral",
    decay: "2023-12-08T04:06:32.929Z",
    period: 90,
    inclination: 51.6,
    apogee: 400,
    perigee: 350,
    launchMass: 2000,
    dryMass: 1200
};

test.describe('Neuraspace - SpaceObjectApi validations', () => {
    let spaceObjectApi: SpaceObjectApi;

    test.beforeEach(({ request }) => {
        spaceObjectApi = new SpaceObjectApi(request);
    });

    test('Should be able to create a valid space object', async () => {
        const response = await spaceObjectApi.createSpaceObject(payload);

        expect(response.status()).toBe(200);
        expect(await response.text()).toBe('');
    });

    test('Should reject invalid cosparId format', async () => {
        const invalidPayload = { ...payload, cosparId: '20A5001' };
        const response = await spaceObjectApi.createSpaceObject(invalidPayload);

        expect(response.status()).toBe(400);
        expect(await response.text()).toBe('Invalid format');
    });

    test('Should reject invalid cosparId format: less then five digits', async () => {
        const invalidPayload = { ...payload, noraId: '1234' };
        const response = await spaceObjectApi.createSpaceObject(invalidPayload);

        expect(response.status()).toBe(400);
        expect(await response.text()).toBe('Must be 5 digits');
    });

    test('Should reject invalid cosparId format: more then five digits', async () => {
        const invalidPayload = { ...payload, noraId: '123456' };
        const response = await spaceObjectApi.createSpaceObject(invalidPayload);

        expect(response.status()).toBe(400);
        expect(await response.text()).toBe('Must be 5 digits');
    });

    const attributes = ['period', 'apogee', 'perigee', 'launchMass', 'dryMass'];
    
    for (const attribute of attributes) {
        test(`Should reject negative ${attribute}`, async () => {
            const invalidPayload = { ...payload };
            invalidPayload[attribute] = -1;

            const response = await spaceObjectApi.createSpaceObject(invalidPayload);
            
            expect(response.status()).toBe(400);
            expect(await response.text()).toBe('Must be positive');
        });
    }
});