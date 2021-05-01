import { Cascade, Collection, Entity, Enum, Filter, OneToMany, OneToOne, Property, Unique } from "@mikro-orm/core";
import {Field, ObjectType} from "type-graphql";
import {BaseEntities} from "./base.entities";
import {SubscriptionEntities} from "./subscription.entities";
import {CompanyEntities} from "./company.entities";
import { TokenEntities } from "./token.entities";
import { UsersEntities } from "./users.entities";
import { SignatureEntities } from "./signature.entities";
import { PasswordHistoryEntities } from "./passwordHistory";
import { TeamEntities } from "./team.entities";

@ObjectType()
@Entity()
@Filter({ name: 'id', cond: args => ({ id: args.id}) })
export class AccountEntities extends BaseEntities{

    @Field()
    @Unique()
    @Property()
    email: string;

    @Field()
    @Property()
    name?: string;

    @Field()
    @Property()
    status?: string;


    @Field()
    @Property()
    stripe_customer_id?: string;

    @Field()
    @Property()
    password?: string;

    @Property()
    forgot_password_token: string | undefined;

    @Field()
    @Property()
    refresh_token_version?: number=0;

    @Field(type =>Boolean)
    @Property()
    terms_accepted? = false;

    @Field(() => [TeamEntities], { nullable: true })
    @OneToMany(() => TeamEntities, (u:TeamEntities) => u.account, { cascade: [Cascade.ALL] })
    teams? = new Collection<TeamEntities>(this);

    @Field(() => [UsersEntities], { nullable: true })
    @OneToMany(() => UsersEntities, (u:UsersEntities) => u.account)
    users? = new Collection<UsersEntities>(this);

    @Field(() => [SignatureEntities], { nullable: true })
    @OneToMany(() => SignatureEntities, (u:SignatureEntities) => u.account, { cascade: [Cascade.ALL] })
    signatures? = new Collection<SignatureEntities>(this);

    @Field(() => [PasswordHistoryEntities], { nullable: true })
    @OneToMany(() => PasswordHistoryEntities, (p:PasswordHistoryEntities) => p.account, { cascade: [Cascade.ALL] })
    password_history? = new Collection<PasswordHistoryEntities>(this);

    @Field(() => TokenEntities, { nullable: true })
    @OneToOne(() => TokenEntities, token => token.account,{owner: true, orphanRemoval: true,nullable:true})
    hub_token?: TokenEntities;

    @Field(() => CompanyEntities, { nullable: true })
    @OneToOne(() => CompanyEntities, company => company.account,{owner: true, orphanRemoval: true,nullable:true})
    company?: CompanyEntities;

    @Field(() => SubscriptionEntities, { nullable: true })
    @OneToOne(() => SubscriptionEntities, subscription => subscription.account,{owner: true, orphanRemoval: true,nullable:true})
    subscription?: SubscriptionEntities;

    @Field()
    @Property()
    buffer?: string;

    constructor(account: any,status:any) {
        super();
        if(status=="hubspot"){
            this.email = account.email;
            this.status=status;
        }else{
            this.email = account.name;
            this.name = account.email;
            this.terms_accepted = account.terms_accepted;
            this.password=account.password
        }

    }



}
