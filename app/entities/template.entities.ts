import {
    Cascade,
    Collection,
    Entity,
    ManyToMany,
    ManyToOne,
    OneToMany,
    OneToOne,
    Property,
    Unique
} from "@mikro-orm/core";
import {Field, ObjectType} from "type-graphql";
import {BaseEntities} from "./base.entities";
import {AccountEntities} from "./account.entities";
import {TokenEntities} from "./token.entities";
import {SubscriptionPlanEntities} from "./subscriptionPlan.entities";
import { SubscriptionEntities } from "./subscription.entities";
import { AddressEntities } from "./address.entities";
import { SocialsEntities } from "./socials.entities";
import { UsersEntities } from "./users.entities";
import { SignatureEntities } from "./signature.entities";
import { SignatureDraftEntities } from "./signatureDraft.entities";




@ObjectType()
@Entity()
export class TemplateEntities extends BaseEntities{
    @Field()
    @Unique()
    @Property()
    name!: string;

    @Field()
    @Property()
    html!: string;

    @Field()
    @Property()
    isDefault!: boolean;

    @Field(() => [SignatureEntities], { nullable: true })
    @OneToMany(() => SignatureEntities, (s:SignatureEntities) => s.template, { cascade: [Cascade.ALL] })
    signatures? = new Collection<SignatureEntities>(this);

    @Field(() => [SignatureDraftEntities], { nullable: true })
    @OneToMany(() => SignatureDraftEntities, (draft:SignatureDraftEntities) => draft.template, { cascade: [Cascade.ALL] })
    drafts? = new Collection<SignatureDraftEntities>(this);

    constructor(options:any) {
        super();
        this.name = options.name;
        this.html = options.html;
        this.isDefault = options.isDefault;
    }



}
