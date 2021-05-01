import { Field, InputType, ObjectType } from "type-graphql";
import relayTypes from "../../service/pagination.service/relay.types";
import { CompanyEntities, TemplateEntities } from "../../entities";
import { FieldError } from "./error.graphs.types";
import { IsString } from "class-validator";

@ObjectType()
export // @ts-ignore
class TemplateListResponseTypes extends relayTypes<TemplateEntities>(TemplateEntities) {
    @Field(() =>[FieldError],{nullable:true})
    errors?:FieldError[]|null;
}

@InputType()
export class TemplateInput {
    @Field()
    @IsString()
    name!:string

    @Field()
    @IsString()
    html?:string

    @Field()
    isDefault:Boolean =false
}
@ObjectType()
export class TemplateResponse {
    @Field(() =>[FieldError],{nullable:true})
    errors?:FieldError[]|null;
    @Field(() =>TemplateEntities,{nullable:true})
    template?:TemplateEntities;
}