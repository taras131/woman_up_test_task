export const validateInputs = (inputValues) => {
    if (inputValues.title !== ""
        && inputValues.description !== ""
        && inputValues.dateCompletion.length > 9) return true;
    return false;
};