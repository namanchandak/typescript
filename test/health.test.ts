import { APIGatewayEvent } from "aws-lambda";
import { handler } from "../backend/lambda/health";

test('get okay', async () => {
  const mockEvent = {} as APIGatewayEvent;

  const result = await handler(mockEvent);
  expect(result.body).toBe("OK"); 
});
