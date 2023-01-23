import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { getTodosForUser } from '../../businessLogic/todos';
import { getUserId } from '../utils';
import { createLogger } from '../../utils/logger';

// TODO: Get all TODO items for a current user
const logger = createLogger(`Fetching All Todos`)

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Write your code here
    const userId = getUserId(event)
    let todos = await getTodosForUser(userId)
    
    
    if(todos.length === 0 || todos !== undefined) {
      logger.error(`No Todos to fetch`)
      todos = []
      
    }
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        items: [
                ...todos
        ]
      })
    }
  },
 
  
  )

handler.use(
  cors({
    credentials: true
  })
)
