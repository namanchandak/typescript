const lambdaHandler = require('../backend/lambda/getAllUsers'); 

describe('Lambda Function Tests', () => {
    
    test('Test Case 1: Retrieving Data for All Users', async () => {

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
