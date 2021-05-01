import {
    Entity,
    ManyToOne, OneToOne,
    Property,
} from "@mikro-orm/core";
import {Field, ObjectType} from "type-graphql";
import {BaseEntities} from "./base.entities";
import { UsersEntities } from "./users.entities";


@ObjectType()
@Entity()
export class UserSignatureHistoryEntities extends BaseEntities{

    @Field()
    @Property()
    signature_name!: string;

    @Field()
    @Property()
    signature_html!: string;

    @Field(() => UsersEntities)
    @ManyToOne(() => UsersEntities,{ nullable: true })
    user!: UsersEntities;

    constructor(options:any) {
        super();
        this.signature_name = options.signature_name;
        this.signature_html= options.signature_html;
        this.user= options.linked;
    }



}
