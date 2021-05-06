import {
    Cascade,
    Collection,
    Entity,
    Enum,
    Filter, Index, ManyToMany,
    ManyToOne,
    OneToMany,
    OneToOne,
    Property,
    Unique
} from "@mikro-orm/core";
import {Field, ObjectType} from "type-graphql";
import {BaseEntities} from "./base.entities";
import {CompanyEntities} from "./company.entities";

import { AccountEntities } from "./account.entities";
import { SignatureEntities } from "./signature.entities";
import { LinkedPlatformEntities } from "./linkedPlatform";
import { UserSignatureHistoryEntities } from "./userSignatureHistory";
import { TeamEntities } from "./team.entities";
import { SocialsEntities } from "./socials.entities";


@ObjectType()
@Entity()
export class AccountProfileEntities extends BaseEntities{

    @Field({nullable:true})
    @Property()
    image?: string;

    @Field({nullable:true})
    @Property()
    role?: string;

    @Field({nullable:true})
    @Property()
    phone?: string;

    @Field({nullable:true})
    @Property()
    mobile?: string;


    @Field(() => AccountEntities, { nullable: true })
    @OneToOne(() => AccountEntities, account => account.profile)
    account?: AccountEntities;


    @Field(() => [SocialsEntities], { nullable: true })
    @OneToMany(() => SocialsEntities, (s:SocialsEntities) => s.profile, { cascade: [Cascade.ALL] })
    socials? = new Collection<SocialsEntities>(this);


    constructor(options:any) {
        super();
        this.account = options.account;
        this.role = options.role;
        this.phone = options.phone;
        this.mobile = options.mobile;
    }



}
