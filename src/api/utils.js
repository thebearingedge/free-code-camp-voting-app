
import slug from 'slug'
import { formatKeys } from 'deep-clone'
import { snakeCase, camelCase } from 'lodash'
import { validate as joiValidate } from 'joi'
import { ValidationError } from './errors'


export const snakeKeys = formatKeys(snakeCase)


export const camelKeys = formatKeys(camelCase)


export const lowerSlug = string => slug(string).toLowerCase()


export const validate = (data, schema, message) =>

  new Promise((resolve, reject) =>

    joiValidate(data, schema, (err, valid) => {

      if (!err) return resolve(valid)

      const details = err.details.map(({ message, path }) => ({
        message, path
      }))

      reject(new ValidationError(message, details))
    })
  )
