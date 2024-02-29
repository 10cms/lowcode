import mongoose from 'mongoose'

const defaultSchemaPlugin = (schema) => {
  schema.set('timestamps', true)
  schema.set('toJSON', {
    transform: (doc, ret) => {
      const { _id, __v, ...data } = ret
      return {
        id: _id,
        ...data
      }
    }
  })
}

mongoose.plugin(defaultSchemaPlugin);