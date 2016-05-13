
import { snakeCase, camelCase } from 'lodash'
import { formatKeys } from 'deep-clone'


export const snakeKeys = formatKeys(snakeCase)


export const camelKeys = formatKeys(camelCase)
