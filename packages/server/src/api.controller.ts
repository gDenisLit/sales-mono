import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { CompanyController } from './modules/company/company.controller'
import { createLogger } from './tools/logger'
import { PersonController } from './modules/person/person.controller'

export const ApiController = new Hono().basePath('/api')
const ApiLogger = createLogger('API')

ApiController.use(logger(ApiLogger.info))

ApiController.route('/company', CompanyController)
ApiController.route('/person', PersonController)
