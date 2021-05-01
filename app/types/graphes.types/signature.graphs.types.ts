import { Field, InputType, ObjectType } from "type-graphql";
import relayTypes from "../../service/pagination.service/relay.types";
import { CompanyEntities, SignatureEntities, TemplateEntities, UsersEntities } from "../../entities";
import { FieldError } from "./error.graphs.types";
import { IsString } from "class-validator";
import { Property } from "@mikro-orm/core";
import { UserIdInput } from "./user.graphs.types";

@ObjectType()
export // @ts-ignore
class SignatureListResponseTypes extends relayTypes<SignatureEntities>(SignatureEntities) {
    @Field(() =>[FieldError],{nullable:true})
    errors?:FieldError[]|null;
}

@InputType()
export class fontSignatureProperty{
    @Field()
    fontFamily!: string;
    @Field()
    fontSize!: string;
    @Field()
    fontWeight!: string;
    @Field()
    lineHeight!: string;
    @Field()
    color!: string;
}
@InputType()
export class iconSignatureStyle{
    @Field()
    shape!: string;
}

@InputType()
export class iconSignatureProperty{
    @Field()
    social!: iconSignatureStyle;
    @Field()
    contact!: iconSignatureStyle;
}
@InputType()
export class dividerSignatureProperty{
    @Field()
    style!: string;
    @Field()
    thickness!: string;
    @Field()
    color!: string;
}

@InputType()
export class propertyInput{
    @Field()
    heading!: fontSignatureProperty;
    @Field()
    body!: fontSignatureProperty;
    @Field()
    link!: fontSignatureProperty;
    @Field()
    icons!: iconSignatureProperty;
    @Field()
    dividers!: dividerSignatureProperty;
}
@InputType()
export class SignatureInput {
    @Field(() =>String,{nullable:true})
    @IsString()
    campaign?:string

    @Field(() =>String,{nullable:true})
    @IsString()
    name?:string

    @Field(() =>String,{nullable:true})
    @IsString()
    template?:string

    @Field(() =>propertyInput,{nullable:true})
    properties?:propertyInput
}

@InputType()
export class SignatureAssignInput {
    @Field(() =>[UserIdInput],{nullable:true})
    users?:UserIdInput[]

    @Field(() =>String,{nullable:true})
    @IsString()
    signature!:string

}
@InputType()
export class SignaturePublishInput {
    @Field(() =>String,{nullable:true})
    @IsString()
    signature!:string

    @Field(() =>String,{nullable:true})
    name?:string

    @Field(() =>String,{nullable:true})
    campaign?:string

    @Field(() =>String,{nullable:true})
    template?:string

    @Field(() =>Boolean,{nullable:true})
    hasDraft:Boolean=false

    @Field(() =>propertyInput,{nullable:true})
    properties?:propertyInput
}

@InputType()
export class SignatureDeleteInput {
    @Field(() =>String,{nullable:true})
    @IsString()
    signature?:string
}
@InputType()
export class SignatureCopyInput {
    @Field(() =>String,{nullable:true})
    @IsString()
    signature!:string
    @Field(() =>String,{nullable:true})
    @IsString()
    user!:string
}
@InputType()
export class SignatureDetachInput {
    @Field(() =>String,{nullable:true})
    @IsString()
    signature!:string
    @Field(() =>[UserIdInput],{nullable:true})
    users?:UserIdInput[]
}

@ObjectType()
export class SignatureCopyResponseTypes {
    @Field(() =>[FieldError],{nullable:true})
    errors?:FieldError[]|null;
    @Field(() =>SignatureEntities,{nullable:true})
    signature?:SignatureEntities;
    @Field(() =>UsersEntities,{nullable:true})
    user?:UsersEntities;
    @Field(() =>String,{nullable:true})
    html?:string
}
@ObjectType()
export class SignatureResponse {
    @Field(() =>[FieldError],{nullable:true})
    errors?:FieldError[]|null;
    @Field(() =>SignatureEntities,{nullable:true})
    signature?:SignatureEntities;
}

@ObjectType()
export class SignatureDeleteResponse {
    @Field(() =>[FieldError],{nullable:true})
    errors?:FieldError[]|null;
    @Field(() =>String,{nullable:true})
    signature?:string
}

