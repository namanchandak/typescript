const lambdaHandler = require('../backend/lambda/getById'); 
const { DynamoDBClient, ScanCommand } = require("@aws-sdk/client-dynamodb");

jest.mock("@aws-sdk/client-dynamodb", () => ({
    DynamoDBClient: jest.fn(() => ({
        send: jest.fn(),
    })),
    ScanCommand: jest.fn(),
}));

describe('Lambda Function Tests', () => {
    test('Test Case 1: Checking Database Connection', async () => {
        const response = await lambdaHandler.handler({ routeKey: 'test', pathParameters: { id: '1' }, body: 'testBody' });

        expect(response.statusCode).toBe(200);
        expect(response.body).not.toBeUndefined();
    });

    // test('Test Case 2: Retrieving Data for a Specific User', async () => {
    //     const mockScanOutput = {
    //         Items: [
    //             { id: { N: '1' }, name: { S: 'User1' } },
    //             { id: { N: '2' }, name: { S: 'User2' } },
    //             // Add more test data as needed
    //         ]
    //     };
    //     DynamoDBClient.prototype.send.mockResolvedValue({ 
    //         $metadata: { httpStatusCode: 200 }, 
    //         Items: mockScanOutput.Items 
    //     });

    //     const event = {
    //         routeKey: 'test',
    //         pathParameters: { id: '1' }, 
    //         body: 'testBody'
    //     };
    //     const response = await lambdaHandler.handler(event);

    //     expect(response.statusCode).toBe(200);
    //     expect(response.body).not.toBeUndefined();
    // });
});
