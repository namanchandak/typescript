const lambdaHandler = require('../backend/lambda/getAllUsers'); 

describe('Lambda Function Tests', () => {
    test('Test Case 1: Checking Database Connection', async () => {
        const event = {
            routeKey: 'test',
            pathParameters: { id: 'testId' },
            body: 'testBody'
        };
        const response = await lambdaHandler.handler(event);
        
        expect(response.statusCode).toBe(200);
        expect(response.body).not.toBeUndefined();
    });

    test('Test Case 2: Retrieving Data for All Users', async () => {

        const event = {
            routeKey: 'test',
            pathParameters: { id: '' },
            body: ''
        };
        const response = await lambdaHandler.handler(event);

        expect(response.statusCode).toBe(200);
        expect(response.body).not.toBeUndefined();
    });
});