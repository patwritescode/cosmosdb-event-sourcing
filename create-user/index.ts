import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { CosmosClient } from "@azure/cosmos";
import { plainToClass, classToPlain } from "class-transformer";
import { Validator } from "class-validator";
import { NewUserDTO } from "./NewUserDTO";
import { UserCreatedEvent } from "../commons/models";
import uuid = require("uuid");

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const client = new CosmosClient({
        endpoint: process.env.COSMOS_URI!,
        key: process.env.COSMOS_KEY,
    });
    const newUser = plainToClass(NewUserDTO, req.body);
    const validator = new Validator();
    const validationErrors = await validator.validate(newUser);
    if (validator.arrayNotEmpty(validationErrors)) {
        context.res = {
            status: 400,
            body: validationErrors,
        };
        return;
    }
    const event = new UserCreatedEvent();
    event.id = uuid();
    event.streamId = `users-${event.id}`;
    event.name = newUser.name;
    const result = await client.database("example").container("events").items.create(classToPlain(event));
    context.res = {
        body: result.resource,
    };
};

export default httpTrigger;
