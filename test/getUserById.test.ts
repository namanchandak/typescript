const lambdaHandler = require('../backend/lambda/getById'); 

describe('Lambda Function Tests', () => {
    

    test('Test Case 1: Retrieving Data for a Specific User', async () => {
        const mockScanOutput = {
            Items: [
                { id: { N: '1' }, name: { S: 'User1' } },
                { id: { N: '2' }, name: { S: 'User2' } },
            ]
        };

        const event = {
            routeKey: 'test',
            pathParameters: { id: '1' }, 
            body: ''
        };
        const response = await lambdaHandler.handler(event);

        expect(response.statusCode).toBe(200);
        expect(response.body).not.toBeUndefined();
        const responseBody = JSON.parse(response.body);

        expect(responseBody).toEqual({
            "id": {
              "N": "1"
            },
            "name": {
              "S": "chris"
            }
          });
    });
});
