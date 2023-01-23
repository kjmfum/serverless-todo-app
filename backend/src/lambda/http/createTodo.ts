import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../utils';
import { createTodoForUser } from '../../businessLogic/todos';
import { createLogger } from '../../utils/logger'

const logger = createLogger(`CreateTodo`)
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newTodo: CreateTodoRequest = JSON.parse(event.body)
    // TODO: Implement creating a new TODO item
    const userId = await getUserId(event);
 

    const item = await createTodoForUser(userId, newTodo)


  // await docClient.put({
  //   TableName: todosTable,
  //   Item: newTodoItem
  // }).promise();
  if(item) {
    logger.info(`Item exists`)
    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        item: item
      })
    }
  } else {
    logger.info(`Item Not exist`)
  }
}
)

handler.use(
  cors({
    credentials: true
  })
)
