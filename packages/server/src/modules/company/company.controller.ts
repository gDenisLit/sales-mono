import { Hono } from 'hono'
import { CompanyRepo } from '../../repos/company/company.repo'
import type { Company } from '../../repos/company/company.schema'
import { toObjectId } from '../../helpers/mongo.helpers'
import { createLogger } from '../../tools/logger'

export const CompanyController = new Hono()
const Logger = createLogger('CompanyController')

CompanyController.get('/:id', async (c) => {
    try {
        const id = c.req.param('id')
        const company = await CompanyRepo.findCompanyById(toObjectId(id))
        if (!company) {
            return c.json({ error: 'Company not found' }, 404)
        }
        return c.json(company, 200)
    } catch (error: any) {
        Logger.error('Had error getting company by id', error.stack, {
            message: error.message,
        })
        return c.json({ error: 'Internal server error' }, 500)
    }
})

CompanyController.post('/', async (c) => {
    try {
        const body = await c.req.json()
        const company = await CompanyRepo.createCompany(body as Company)
        return c.json(company, 201)
    } catch (error: any) {
        Logger.error('Had error creating new company', error.stack, {
            message: error.message,
        })
        return c.json({ error: 'Internal server error' }, 500)
    }
})
