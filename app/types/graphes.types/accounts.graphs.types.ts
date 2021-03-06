import { Field, InputType, ObjectType } from "type-graphql";
import { FieldError } from "./error.graphs.types";
import {
    AccountProfileEntities,
    CompanyEntities,
    SignatureEntities, SocialDetailsEntities,
    SubscriptionEntities,
    TeamEntities,
    TemplateEntities,
    UsersEntities
} from "../../entities";
import { IsEmail, IsString } from "class-validator";
import { StripeCardType } from "./subscriptions.graphs.types";


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
    @Field(() =>AccountProfileEntities,{nullable:true})
    profile?:AccountProfileEntities|null;
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
    @Field(() =>[SocialDetailsEntities],{nullable:true})
    socials?:SocialDetailsEntities[]|null;
    @Field(() =>AccountInfo,{nullable:true})
    account?:AccountInfo|null;
    @Field(() =>String,{nullable:true})
    accessToken?:String|null;
    @Field(() =>StripeCardType,{nullable:true})
    billing?:StripeCardType;
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