import { Field, InputType, ObjectType } from "type-graphql";
import { IsBoolean, IsEmail, IsString } from "class-validator";
import { AccountEntities, CompanyEntities, SubscriptionEntities, UsersEntities } from "../../entities";
import { FieldError } from "./error.graphs.types";
import { StripeCardType } from "./subscriptions.graphs.types";
import { SocialInput } from "./social.graphs.types";


@ObjectType()
export class metaData {
    @Field(type=>String,{nullable:true})
    key!:  String
}


@InputType()
export class onBoardFormInput {
    @Field()
    @IsString()
    status!:string

    @Field()
    @IsString()
    name?:string

    @Field()
    @IsEmail()
    email?:string

    @Field()
    @IsBoolean()
    terms_accepted?:boolean

    @Field()
    @IsString()
    password?:string
}


@InputType()
export class onBoardAddressInput {
    @Field()
    @IsString()
    street?:string

    @Field()
    @IsString()
    post_code?:string

    @Field()
    @IsString()
    state?:string

    @Field()
    @IsString()
    country?:string

    @Field()
    @IsString()
    isDefault?:boolean
}

@InputType()
export class onBoardCompanyInput {
    @Field()
    @IsString()
    name!:string

    @Field()
    @IsString()
    url!:string

    @Field()
    @IsString()
    phone!:string

    @Field()
    @IsString()
    footnote!:string

    @Field(() =>[SocialInput],{nullable:true})
    socials?: [SocialInput]|null;

    @Field(() =>[onBoardAddressInput],{nullable:true})
    address?: [onBoardAddressInput]|null;
}

@InputType()
export class onBoardSubscriptionInput {
    @Field()
    @IsString()
    quantity!:string

    @Field()
    @IsString()
    paymentmethodId!:string
}



@InputType()
export class onBoardHubspotInput {
    @Field()
    @IsString()
    hubspot_code?:string
}
@InputType()
export class TeamInput {
    @Field()
    @IsString()
    name?:string
    @Field()
    @IsString()
    id?:string
}

@InputType()
export class onBoardHubspotImportInput {
    @Field(() =>String,{nullable:true})
    hub_id?:String|null;

    @Field(() =>String,{nullable:true})
    name?:String|null;

    @Field()
    @IsEmail()
    email?:string

    @Field(() =>[TeamInput],{nullable:true})
    teams?:TeamInput[]|null;

    @Field(() =>Boolean,{nullable:true})
    linked_google:Boolean=false;

    @Field(() =>Boolean,{nullable:true})
    has_owner:Boolean=false;

    @Field(() =>String,{nullable:true})
    owner?:String|null;
}
@InputType()
export class onBoardImportInput {
    @Field(() =>[onBoardHubspotImportInput],{nullable:true})
    users?:onBoardHubspotImportInput[]|null;
}


@InputType()
export class OnBoardProfileInput {

    @Field()
    @IsString()
    role?:string

    @Field()
    @IsString()
    phone?:string

    @Field()
    @IsString()
    mobile?:string

    @Field(() =>[SocialInput],{nullable:true})
    socials?: [SocialInput]|null;

}




@ObjectType()
export class OnBoardFormResponseTypes {
    @Field(() =>[FieldError],{nullable:true})
    errors?:FieldError[]|null;
    @Field(() =>String,{nullable:true})
    accessToken?:String|null;
    @Field(() =>AccountEntities,{nullable:true})
    account?:AccountEntities|null;
}
@ObjectType()
export class OnBoardProfileResponseTypes {
    @Field(() =>[FieldError],{nullable:true})
    errors?:FieldError[]|null;
    @Field(() =>AccountEntities,{nullable:true})
    account?:AccountEntities|null;
}
@ObjectType()
export class OnBoardHubspotResponseTypes {
    @Field(() =>[FieldError],{nullable:true})
    errors?:FieldError[]|null;
    @Field(() =>String,{nullable:true})
    email?:String|null;
}

@ObjectType()
export class OnBoardCompanyResponseTypes {
    @Field(() =>[FieldError],{nullable:true})
    errors?:FieldError[]|null;
    @Field(() =>CompanyEntities,{nullable:true})
    company?:CompanyEntities;
    @Field(() =>AccountEntities,{nullable:true})
    account?:AccountEntities|null;

}

@ObjectType()
export class OnBoardSubscriptionResponseTypes {
    @Field(() =>[FieldError],{nullable:true})
    errors?:FieldError[]|null;
    @Field(() =>SubscriptionEntities,{nullable:true})
    subscription?:SubscriptionEntities;
    @Field(() =>StripeCardType,{nullable:true})
    billing?:StripeCardType;
    @Field(() =>AccountEntities,{nullable:true})
    account?:AccountEntities|null;
}

@ObjectType()
export class OnBoardImportResponseTypes {
    @Field(() =>[FieldError],{nullable:true})
    errors?:FieldError[]|null;
    @Field(() =>[UsersEntities],{nullable:true})
    users?:UsersEntities[];
    @Field(() =>AccountEntities,{nullable:true})
    account?:AccountEntities|null;
    @Field(() =>SubscriptionEntities,{nullable:true})
    subscription?:SubscriptionEntities;
}

