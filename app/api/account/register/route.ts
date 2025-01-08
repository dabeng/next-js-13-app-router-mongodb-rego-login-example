import { z } from "zod";

import { NextRequest, NextResponse } from "next/server";
import { usersRepo } from "_helpers/server";
import {
	errorHandler,
	jwtMiddleware,
	validateMiddleware
} from "_helpers/server/api";

export async function POST(req: NextRequest) {
	try {
		// global middleware
		await jwtMiddleware(req);
		const schema = z.object({
			firstName: z.string(),
			lastName: z.string(),
			username: z.string(),
			password: z.string().min(6)
		});
		await validateMiddleware(req, schema);

		// route handler
		const body = await req.json();
		await usersRepo.create(body);
		return NextResponse.json({});
	} catch (err: any) {
		// global error handler
		return errorHandler(err);
	}
}
