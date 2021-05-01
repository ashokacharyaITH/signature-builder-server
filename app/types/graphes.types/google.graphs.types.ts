import { Field, InputType, ObjectType } from "type-graphql";
import { IsBoolean, IsEmail, IsString } from "class-validator";
import { AccountEntities, CompanyEntities, SubscriptionEntities, UsersEntities } from "../../entities";
import { FieldError } from "./error.graphs.types";
import { StripeCardType } from "./subscriptions.graphs.types";


@InputType()
export class GoogleVerifyInput {
    @Field()
    @IsString()
    code!:string

    @Field()
    @IsString()
    state?:string

}


@ObjectType()
export class GoogleVerifyResponseTypes {
    @Field(() =>[FieldError],{nullable:true})
    errors?:FieldError[]|null;
    @Field(() =>UsersEntities,{nullable:true})
    user?:UsersEntities;
}

