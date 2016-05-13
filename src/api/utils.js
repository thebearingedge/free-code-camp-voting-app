
import slug from 'slug'
import { formatKeys } from 'deep-clone'
import { snakeCase, camelCase } from 'lodash'


export const snakeKeys = formatKeys(snakeCase)


export const camelKeys = formatKeys(camelCase)


export const lowerSlug = string => slug(string).toLowerCase()
