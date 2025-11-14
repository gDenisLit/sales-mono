import { Hono } from 'hono'
import { toObjectId } from '../../helpers/mongo.helpers'
import { createLogger } from '../../tools/logger'
import type { PaginationInputType } from '@shared/types/pagination.types'
import { PersonService } from './person.service'
import { CompanyService } from '../company/company.service'

export const PersonController = new Hono()
const Logger = createLogger('PersonController')

PersonController.get('/company/:companyId/employees', async (c) => {
    try {
        const { companyId } = c.req.param()
        const skip = c.req.query('skip')
        const limit = c.req.query('limit')

        if (!companyId) {
            return c.json({ error: 'Missing company id parameter' }, 400)
        }
        if (skip === null || typeof skip === 'undefined') {
            return c.json({ error: 'Missing skip parameter' }, 400)
        }
        if (limit === null || typeof limit === 'undefined') {
            return c.json({ error: 'Missing limit parameter' }, 400)
        }

        const parsedSkip = parseInt(skip, 10)
        const parsedLimit = parseInt(limit, 10)

        if (Number.isNaN(parsedSkip) || Number.isNaN(parsedLimit)) {
            return c.json({ error: 'Skip and limit must be numbers' }, 400)
        }

        const company = await CompanyService.findCompanyById(toObjectId(companyId))
        if (!company) {
            return c.json({ error: 'Company not found' }, 404)
        }

        const companyPublicId = company.publicIdentifier ?? company.prevPublicIdentifiers?.[0]
        if (!companyPublicId) {
            return c.json({ error: 'Company is missing a public identifier' }, 422)
        }

        const paginationInput: PaginationInputType = {
            skip: parsedSkip,
            limit: parsedLimit,
        }

        const paginatedResults = await PersonService.searchPeopleByCompanyPublicIdPaginated(
            companyPublicId,
            paginationInput,
        )
        return c.json(paginatedResults, 200)
    } catch (error: any) {
        Logger.error('Had error getting company employees', error.stack, {
            message: error.message,
        })
        return c.json({ error: 'Internal server error' }, 500)
    }
})

PersonController.get('/:id', async (c) => {
    try {
        const id = c.req.param('id')
        const company = await PersonService.getPersonById(toObjectId(id))
        if (!company) {
            return c.json({ error: 'Person not found' }, 404)
        }
        return c.json(company, 200)
    } catch (error: any) {
        Logger.error('Had error getting person by id', error.stack, {
            message: error.message,
        })
        return c.json({ error: 'Internal server error' }, 500)
    }
})

PersonController.get('/list/search', async (c) => {
    try {
        const skip = c.req.query('skip')
        const limit = c.req.query('limit')
        const companyPublicId = c.req.query('company_public_id')

        if (!skip) {
            return c.json({ error: 'Missing skip parameter' }, 400)
        }
        if (!limit) {
            return c.json({ error: 'Missing limit parameter' }, 400)
        }
        if (!companyPublicId) {
            return c.json({ error: 'Missing companyPublicId parameter' }, 400)
        }
        const paginationInput: PaginationInputType = {
            skip: parseInt(skip),
            limit: parseInt(limit),
        }
        const paginatedResults = await PersonService.searchPeopleByCompanyPublicIdPaginated(
            companyPublicId,
            paginationInput,
        )
        return c.json(paginatedResults, 200)
    } catch (error: any) {
        Logger.error('Had error searching people', error.stack, {
            message: error.message,
        })
        return c.json({ error: 'Internal server error' }, 500)
    }
})
