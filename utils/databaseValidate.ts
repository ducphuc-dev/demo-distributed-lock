
/**
 * 
 * @param type The type of error
 * @param fieldName Field error
 * @param model Model error
 */
export const databaseValidate = (type: String, fieldName: String, model: String) : String => {
    switch (type) {
        case "missing":
            return `DB - Missing field: ${fieldName} on model ${model}`
        case "invalid":
            return `DB - Invalid field: ${fieldName} on model ${model}`
        default:
            return `DB - Error field: ${fieldName} on model ${model}`
    }
}