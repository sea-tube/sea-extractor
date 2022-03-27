import Ajv from 'ajv'
import addFormats from 'ajv-formats'

const COMPILE_SCHEMAS = true
const AJV_OPTIONS = { 
    allowUnionTypes: true
}

const schemas = {
    thumbs: "@utils/schemas/thumbs",
}

const validator : any = {}

function renderSchemas (schemas : any, validator: any) {
    Object.entries(schemas).forEach(([key, schemaPath] : any) => {

        // If schema key is a object with sub keys, render it
        if (typeof schemaPath === "object") {
            validator[key] = {}
            return renderSchemas(schemaPath, validator[key])
        }

        const schema = require(schemaPath)

        const ajv = new Ajv(AJV_OPTIONS)
        addFormats(ajv);
        const validate : any = COMPILE_SCHEMAS ? ajv.compile(schema) : (data : Object) => ajv.validate(schema, data)
        validator[key] = (data : Object ) => {
            const valid = validate(data)
            if (valid) {
                return true
            } else {
                const ajvErrors = COMPILE_SCHEMAS ? validate.errors : ajv.errors
                let errors : any = []
                console.log(ajvErrors)
                ajvErrors.forEach((err : any ) => errors.push(`${err.instancePath ? err.instancePath + ' ' : ''}${err.message}${err.params?.additionalProperty ? ': ' + err.params.additionalProperty : ''}`))
                return {errors: errors}
            }
        }
    })
}

renderSchemas(schemas, validator)

export default validator