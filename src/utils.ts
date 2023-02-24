export function isValidError(error: unknown): error is Error {
    return error instanceof Error;
}
