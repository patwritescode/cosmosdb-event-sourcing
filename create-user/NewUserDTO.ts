import { MinLength, Min } from "class-validator";

export class NewUserDTO {
    @MinLength(1)
    name: string = "";
}
