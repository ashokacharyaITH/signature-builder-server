import { Field, InputType, ObjectType } from "type-graphql";
import relayTypes from "../../service/pagination.service/relay.types";
import { UsersEntities } from "../../entities";
import { FieldError } from "./error.graphs.types";
import { IsString } from "class-validator";
import { SocialInput } from "./social.graphs.types";


@ObjectType()
export // @ts-ignore
class UserSearchResponseTypes extends relayTypes<UsersEntities>(UsersEntities) {
    @Field(() =>[FieldError],{nullable:true})
    errors?:FieldError[]|null;
}
@InputType()
class TeamUserInput {
    @Field()
    id?:string
}
@InputType()
export class UserSearchInput {
    @Field()
    orderBy?:string

    @Field()
    sort?:string

    @Field()
    keyword?:string

    @Field(()=>[TeamUserInput])
    teams?:TeamUserInput[]
}
@InputType()
export class UserIdInput {
    @Field(() =>String,{nullable:true})
    @IsString()
    id?:string
}

@InputType()
export class UserDetachInput {
    @Field(() =>[UserIdInput],{nullable:true})
    users?:UserIdInput[]
}

@ObjectType()
export class UserDetachResponse {
    @Field(() =>[FieldError],{nullable:true})
    errors?:FieldError[]|null;
    @Field(() =>[UsersEntities],{nullable:true})
    users?:UsersEntities[];
}
@InputType()
export class UserUpdateInput {

    @Field()
    @IsString()
    accountId?:string

    @Field()
    @IsString()
    passcode?:string

    @Field()
    @IsString()
    userId!:string

    @Field()
    @IsString()
    name!:string

    @Field()
    @IsString()
    role!:string

    @Field()
    @IsString()
    phone!:string

    @Field()
    @IsString()
    mobile!:string

    @Field(() =>[SocialInput],{nullable:true})
    socials?: [SocialInput]|null;

}
@ObjectType()
export class UserResponse {
    @Field(() =>[FieldError],{nullable:true})
    errors?:FieldError[]|null;
    @Field(() =>UsersEntities,{nullable:true})
    users?:UsersEntities;
}