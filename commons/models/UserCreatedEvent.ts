import { Event } from "./Event";

export class UserCreatedEvent extends Event {
    constructor() {
        super();
        this.type = "USER_CREATED";
    }
    name: string = "";
};
