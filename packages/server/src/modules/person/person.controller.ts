import { Hono } from 'hono'
import { PersonRepo } from '../../repos/person/person.repo'
import { toObjectId } from '../../helpers/mongo.helpers'
import { createLogger } from '../../tools/logger'
import type { PaginationInputType } from '../../types/pagination.types'

export const PersonController = new Hono()
const Logger = createLogger('PersonController')

PersonController.get('/:id', async (c) => {
    try {
        const id = c.req.param('id')
        const company = await PersonRepo.getPersonById(toObjectId(id))
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
        const paginatedResults = await PersonRepo.getPeopleByCompanyPublicIdPaginated(companyPublicId, paginationInput)
        return c.json(paginatedResults, 200)
    } catch (error: any) {
        Logger.error('Had error searching people', error.stack, {
            message: error.message,
        })
        return c.json({ error: 'Internal server error' }, 500)
    }
})
