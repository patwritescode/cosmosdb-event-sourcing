import { AzureFunction, Context } from "@azure/functions"
import { plainToClass, classToPlain } from "class-transformer";
import { UserCreatedEvent } from "../commons/models";
import { CosmosClient } from "@azure/cosmos";
import { UserViewDTO } from "./UserViewDTO";

// Bindings: https://docs.microsoft.com/en-us/azure/azure-functions/functions-bindings-cosmosdb-v2
const cosmosDBTrigger: AzureFunction = async function (context: Context, documents: any[]): Promise<void> {
    if (!!documents && documents.length > 0) {
        const client = new CosmosClient({
            endpoint: process.env.COSMOS_URI!,
            key: process.env.COSMOS_KEY,
        })
        for (const document of documents) {
            switch(document.type) {
                case "USER_CREATED": 
                    const event = plainToClass(UserCreatedEvent, document);
                    const userView = new UserViewDTO();
                    userView.name = event.name;
                    userView.userId = event.id;
                    await client
                        .database("example")
                        .container("user-view")
                        .items
                        .create(classToPlain(userView));
                    break;
                    
            }
        }
    }
}

export default cosmosDBTrigger;
