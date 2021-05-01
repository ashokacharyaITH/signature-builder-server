import {
    Entity,
    ManyToOne, OneToOne,
    Property,
} from "@mikro-orm/core";
import {Field, ObjectType} from "type-graphql";
import {BaseEntities} from "./base.entities";
import { AccountEntities } from "./account.entities";


@ObjectType()
@Entity()
export class PasswordHistoryEntities extends BaseEntities{

    @Field()
    @Property()
    password!: string;

    @Field(() => AccountEntities)
    @ManyToOne(() => AccountEntities,{ nullable: true })
    account!: AccountEntities;

    constructor(options:any) {
        super();
        this.password = options.password;
        this.account= options.account;
    }



}
