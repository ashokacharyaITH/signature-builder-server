import {
    Entity,
    ManyToOne, OneToOne,
    Property,
} from "@mikro-orm/core";
import {Field, ObjectType} from "type-graphql";
import {BaseEntities} from "./base.entities";
import { TokenEntities } from "./token.entities";
import { UsersEntities } from "./users.entities";


@ObjectType()
@Entity()
export class LinkedPlatformEntities extends BaseEntities{

    @Field(() => TokenEntities, { nullable: true })
    @OneToOne(() => TokenEntities, token => token.linkedPlatform,{owner: true, orphanRemoval: true})
    token?: TokenEntities;

    @Field()
    @Property()
    linked!: boolean;

    @Field(() => UsersEntities)
    @ManyToOne(() => UsersEntities,{ nullable: true })
    user!: UsersEntities;

    constructor(options:any) {
        super();
        this.token = options.token;
        this.linked= options.linked;
        this.user= options.user;
    }



}
