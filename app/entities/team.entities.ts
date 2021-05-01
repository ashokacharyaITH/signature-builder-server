import {
    Cascade,
    Collection,
    Entity,
    Enum,
    Filter, ManyToMany,
    ManyToOne,
    OneToMany,
    OneToOne,
    Property,
    Unique
} from "@mikro-orm/core";
import {Field, ObjectType} from "type-graphql";
import {BaseEntities} from "./base.entities";
import {SubscriptionEntities} from "./subscription.entities";
import {CompanyEntities} from "./company.entities";
import { TokenEntities } from "./token.entities";
import { UsersEntities } from "./users.entities";
import { SignatureEntities } from "./signature.entities";
import { PasswordHistoryEntities } from "./passwordHistory";
import { AccountEntities } from "./account.entities";

@ObjectType()
@Entity()
export class TeamEntities extends BaseEntities{

    @Field()
    @Property()
    name: string;

    @Field()
    @Unique()
    @Property()
    hub_id!: string;

    @Field(() => AccountEntities)
    @ManyToOne(() => AccountEntities,{ nullable: true })
    account!: AccountEntities;



    @Field(() => [UsersEntities])
    @ManyToMany(() => UsersEntities, (s:UsersEntities) => s.teams)
    users? = new Collection<UsersEntities>(this);

    constructor(options:any) {
        super();
       this.name=options.name
        this.hub_id=options.hub_id
    }



}
