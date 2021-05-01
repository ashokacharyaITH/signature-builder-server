import { Field, InputType, ObjectType } from "type-graphql";
import { FieldError } from "./error.graphs.types";
import {
    CompanyEntities,
    SignatureEntities,
    SubscriptionEntities,
    TeamEntities,
    TemplateEntities,
    UsersEntities
} from "../../entities";
import { IsEmail, IsString } from "class-validator";


@ObjectType()
export class AccountInfo {

    @Field(() =>String,{nullable:true})
    name?:String;
    @Field(() =>String,{nullable:true})
    email?:String;
    @Field(() =>String,{nullable:true})
    id?:String;
    @Field(() =>String,{nullable:true})
    status?:String;
    @Field(() =>String,{nullable:true})
    terms_accepted?:String;
}
@ObjectType()
export class AccountResponse {
    @Field(() =>[FieldError],{nullable:true})
    errors?:FieldError[]|null;
    @Field(() =>[TeamEntities],{nullable:true})
    teams?:TeamEntities[]|null;
    @Field(() =>[SignatureEntities],{nullable:true})
    signatures?:SignatureEntities[]|null;
    @Field(() =>[UsersEntities],{nullable:true})
    users?:UsersEntities[]|null;
    @Field(() =>CompanyEntities,{nullable:true})
    company?:CompanyEntities|null;
    @Field(() =>SubscriptionEntities,{nullable:true})
    subscription?:SubscriptionEntities|null;
    @Field(() =>[TemplateEntities],{nullable:true})
    template?:TemplateEntities[]|null;
    @Field(() =>AccountInfo,{nullable:true})
    account?:AccountInfo|null;
    @Field(() =>String,{nullable:true})
    accessToken?:String|null;
    @Field(() =>String,{nullable:true})
    billing?:String|null;
}
//AccountPasswordChangeInput

@InputType()
export class AccountPasswordChangeInput {
    @Field()
    @IsString()
    token!:string

    @Field()
    @IsString()
    password!:string

}
@InputType()
export class AccountLoginInput {
    @Field()
    @IsEmail()
    email!:string
    @Field()
    @IsString()
    password!:string
}