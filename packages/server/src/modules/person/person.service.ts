import type { PaginationInputType, PaginatoinResultsType } from '../../types/pagination.types'
import type { ObjectId } from '../../types/mongo.types'
import { PersonModel, type Person } from './person.schema'

export const PersonService = {
    getPersonById,
    searchPeopleByCompanyPublicIdPaginated,
}

async function getPersonById(id: ObjectId): Promise<Person> {
    const person = await PersonModel.findById(id).lean()
    if (!person) {
        throw new Error(`Person with id: ${id} not found`)
    }
    return person
}

async function searchPeopleByCompanyPublicIdPaginated(
    companyPublicId: string,
    { skip, limit }: PaginationInputType,
): Promise<PaginatoinResultsType<Person>> {
    const filter = {
        experiences: {
            $elemMatch: {
                company_public_id: companyPublicId,
            },
        },
    }
    const [total, results] = await Promise.all([
        await PersonModel.countDocuments(filter),
        await PersonModel.find(filter).skip(skip).limit(limit).lean(),
    ])
    return {
        total,
        size: limit,
        results,
    }
}
