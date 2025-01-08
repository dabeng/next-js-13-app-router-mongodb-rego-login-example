import joi from 'joi';
import { z, ZodError } from "zod";

export { validateMiddleware };

async function validateMiddleware<T extends z.ZodTypeAny>(req: Request, schema: T) {
	if (!schema) return;

	const options = {
		abortEarly: false, // include all errors
		allowUnknown: true, // ignore unknown props
		stripUnknown: true // remove unknown props
	};

	const body = await req.json();
	const result = schema.safeParse(body);

	if (!result.success) {
		/* error.issues
		[
	        {
	        	"code": "invalid_type",
	        	"expected": "string",
	        	"received": "number",
	        	"path": [ "name" ],
	        	"message": "Expected string, received number"
	        }
    ] */
		throw `Validation error: ${result.error.issues.map(x => x.message + ' at "' + x.path + '"').join(', ')}`;
	}

	// update req.json() to return sanitized req body
	req.json = () => result.data;
}