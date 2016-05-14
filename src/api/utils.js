
import slug from 'slug'
import { formatKeys } from 'deep-clone'
import { promisify } from 'bluebird'
import { snakeCase, camelCase } from 'lodash'
import { validate as joiValidate } from 'joi'


export const snakeKeys = formatKeys(snakeCase)


export const camelKeys = formatKeys(camelCase)


export const lowerSlug = string => slug(string).toLowerCase()


export const validate = promisify(joiValidate)
