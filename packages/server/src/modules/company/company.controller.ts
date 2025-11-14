import { Hono } from 'hono'
import type { Company } from './company.schema'
import { toObjectId } from '../../helpers/mongo.helpers'
import { createLogger } from '../../tools/logger'
import type { PaginationInputType } from '@shared/types/pagination.types'
import { CompanyService } from './company.service'

export const CompanyController = new Hono()
const Logger = createLogger('CompanyController')

CompanyController.get('/:id', async (c) => {
    try {
        const id = c.req.param('id')
        const company = await CompanyService.findCompanyById(toObjectId(id))
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
        const company = await CompanyService.createCompany(body as Company)
        return c.json(company, 201)
    } catch (error: any) {
        Logger.error('Had error creating new company', error.stack, {
            message: error.message,
        })
        return c.json({ error: 'Internal server error' }, 500)
    }
})

CompanyController.get('/list/search', async (c) => {
    try {
        const skip = c.req.query('skip')
        const limit = c.req.query('limit')
        const name = c.req.query('name')

        if (!skip) {
            return c.json({ error: 'Missing skip parameter' }, 400)
        }
        if (!limit) {
            return c.json({ error: 'Missing limit parameter' }, 400)
        }
        if (!name) {
            return c.json({ error: 'Missing name parameter' }, 400)
        }

        const paginationInput: PaginationInputType = {
            skip: parseInt(skip, 10),
            limit: parseInt(limit, 10),
        }

        const paginatedResults = await CompanyService.searchCompaniesByNamePaginated(name, paginationInput)
        return c.json(paginatedResults, 200)
    } catch (error: any) {
        Logger.error('Had error searching companies by name', error.stack, {
            message: error.message,
        })
        return c.json({ error: 'Internal server error' }, 500)
    }
})
