import test, { expect } from "@playwright/test";
import { SpaceObject, SpaceObjectApi } from "../api/SpaceObjectApi";

const payload: SpaceObject =  {
    cosparId: "8410-TVN1",
    noradId: "68956",
    name: "Koepp",
    objectType: "Debris",
    launchCountry: "Saint Martin",
    launchDate: "1968-06-10T19:37:52.6546971",
    launchSite: "Florianfurt",
    decay: "1957-11-25T14:08:34.4295382",
    period: 69,
    inclination: 352,
    apogee: 792004,
    perigee: 575014,
    launchMass: 220878,
    dryMass: 10
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

    test.afterEach('Try to delete created space object', async () => {
        try {
            const response = await spaceObjectApi.getSpaceObject(payload.cosparId);
            
            if (response.headers()['content-length'] === '0')
                return;
            
            const spaceObject = await response.json();

            await spaceObjectApi.deleteSpaceObject(spaceObject.id);
        } catch (error) {
            console.log('Warning: Clean up error, unable to delete space object');
        }   
    });
});