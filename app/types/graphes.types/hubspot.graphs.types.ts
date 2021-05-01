import { Field, InputType, ObjectType } from "type-graphql";
import { FieldError } from "./error.graphs.types";
import { IsEmail } from "class-validator";

@ObjectType()
export class HubspotAuthTypes {
    @Field(() =>[FieldError],{nullable:true})
    errors?:FieldError[]|null;
    @Field(() =>String,{nullable:true})
    link?:String|null;
}
@ObjectType()
export class HubspotTeams {
    @Field(() =>String,{nullable:true})
    id?:String|null;
    @Field(() =>String,{nullable:true})
    name?:String|null;
}

@ObjectType()
export class HubspotListItem {
    @Field(() =>String,{nullable:true})
    firstName?:String|null;
    @Field(() =>String,{nullable:true})
    lastName?:String|null;
    @Field(() =>[HubspotTeams],{nullable:true})
    teams?:HubspotTeams[]|null;
    @Field(() =>String,{nullable:true})
    id?:String|null;
    @Field(() =>String,{nullable:true})
    email?:String|null;
    @Field(() =>String,{nullable:true})
    createdAt?:String|null;
    @Field(() =>String,{nullable:true})
    updatedAt?:String|null;
    @Field(() =>String,{nullable:true})
    userId?:String|null;
    @Field(() =>Boolean,{nullable:true})
    linked_google:Boolean=false;
    @Field(() =>Boolean,{nullable:true})
    has_owner:Boolean=false;
    @Field(() =>String,{nullable:true})
    owner?:String|null;
}
@ObjectType()
export class HubspotListTypes{
    @Field(() =>[FieldError],{nullable:true})
    errors?:FieldError[]|null;
    @Field(() =>[HubspotListItem],{nullable:true})
    list?:HubspotListItem[]|null;
    @Field(() =>String,{nullable:true})
    cursor?:String|null;
}
@InputType()
export class hubspotListInput {
    @Field(()=>Number,{nullable:true})
    limit?:Number
    @Field(()=>String,{nullable:true})
    cursor?: String
}