import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { CompanyController } from './modules/company/company.controller'
import { createLogger } from './tools/logger'

export const ApiController = new Hono().basePath('/api')
const ApiLogger = createLogger('API')

ApiController.use(logger(ApiLogger.info))

ApiController.route('/', CompanyController)
