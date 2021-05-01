import { Field, InputType, ObjectType } from "type-graphql";
import relayTypes from "../../service/pagination.service/relay.types";
import { TeamEntities } from "../../entities";
import { FieldError } from "./error.graphs.types";
import { IsString } from "class-validator";

@ObjectType()
export // @ts-ignore
class TeamListResponseTypes extends relayTypes<TeamEntities>(TeamEntities) {
    @Field(() =>[FieldError],{nullable:true})
    errors?:FieldError[]|null;
}

