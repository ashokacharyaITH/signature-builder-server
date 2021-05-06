import {
    Cascade,
    Collection,
    Entity,
    Index, ManyToMany,
    ManyToOne,
    OneToMany,
    Property,
} from "@mikro-orm/core";
import {Field, ObjectType} from "type-graphql";
import {BaseEntities} from "./base.entities";
import { AccountEntities } from "./account.entities";
import { SignatureEntities } from "./signature.entities";
import { LinkedPlatformEntities } from "./linkedPlatform";
import { UserSignatureHistoryEntities } from "./userSignatureHistory";
import { TeamEntities } from "./team.entities";
import { SocialsEntities } from "./socials.entities";


@ObjectType()
@Entity()
@Index({ name: 'custom_search_users', properties: ['email',"name"],type:"text" }) //text search
export class UsersEntities extends BaseEntities{
    @Field()
    @Property()
    email?: string;

    @Field()
    @Property()
    name?: string;

    @Field({nullable:true})
    @Property()
    hub_id!: string;

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

    @Field({nullable:true})
    @Property()
    passcode?: string;

    @Field({nullable:true})
    @Property()
    assigned: boolean=false;

    @Field(() => [TeamEntities],{nullable:true})
    @ManyToMany(() => TeamEntities, (s:TeamEntities) => s.users,{owner:true})
    teams? = new Collection<TeamEntities>(this);


    @Field(() => AccountEntities,{ nullable: true })
    @ManyToOne(() => AccountEntities,{ nullable: true })
    account?: AccountEntities;

    @Field(() => SignatureEntities,{nullable:true})
    @ManyToOne(() => SignatureEntities,{ nullable: true })
    signature?: SignatureEntities|null;

    @Field(() => [SocialsEntities], { nullable: true })
    @OneToMany(() => SocialsEntities, (s:SocialsEntities) => s.user, { cascade: [Cascade.ALL] })
    socials? = new Collection<SocialsEntities>(this);

    @Field({nullable:true})
    @Property()
    isLinked: boolean=false;

    @Field(() => [LinkedPlatformEntities], { nullable: true })
    @OneToMany(() => LinkedPlatformEntities, (l) => l.user, { cascade: [Cascade.ALL] })
    linkedPlatform? = new Collection<LinkedPlatformEntities>(this);

    @Field(() => [UserSignatureHistoryEntities], { nullable: true })
    @OneToMany(() => UserSignatureHistoryEntities, (l) => l.user, { cascade: [Cascade.ALL] })
    signatureHistory? = new Collection<UserSignatureHistoryEntities>(this);

    @Field({nullable:true})
    @Property()
    latestSignature?: string;

    constructor(options:any) {
        super();
        this.name = options.name;
        this.email = options.email;
        this.hub_id = options.hub_id;
        this.account = options.account;
    }



}
