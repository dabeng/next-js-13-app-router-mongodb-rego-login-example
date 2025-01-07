import joi from "joi";

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
        const schema = joi.object({
            firstName: joi.string().required(),
            lastName: joi.string().required(),
            username: joi.string().required(),
            password: joi.string().min(6).required()
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
