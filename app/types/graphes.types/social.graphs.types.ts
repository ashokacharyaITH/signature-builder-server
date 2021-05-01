import { Field, InputType, ObjectType } from "type-graphql";
import { IsBoolean, IsEmail, IsString } from "class-validator";
import { FileUpload } from "graphql-upload";
import { AccountEntities, CompanyEntities, SocialDetailsEntities } from "../../entities";
import { FieldError } from "./error.graphs.types";
@InputType()
export class SocialInput {
    @Field()
    @IsString()
    link?:string

    @Field()
    @IsString()
    id?:string
}


@InputType()
export class SocialItemInput {
    @Field()
    @IsString()
    name!:string

    @Field()
    @IsString()
    icon_round?:string

    @Field()
    @IsString()
    icon_solid?:string

    @Field()
    @IsString()
    icon_square?:string

    @Field()
    @IsBoolean()
    priority?:boolean

}



@ObjectType()
export class SocialItemResponseTypes {
    @Field(() =>[FieldError],{nullable:true})
    errors?:FieldError[]|null;
    @Field(() =>SocialDetailsEntities,{nullable:true})
    socialItem?:SocialDetailsEntities|null;
}
@ObjectType()
export class SocialItemListResponseTypes {
    @Field(() =>[FieldError],{nullable:true})
    errors?:FieldError[]|null;
    @Field(() =>[SocialDetailsEntities],{nullable:true})
    socialItem?:SocialDetailsEntities[]|null;
}