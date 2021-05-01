import {Cascade, Collection, Entity, ManyToMany, ManyToOne, OneToMany, OneToOne, Property} from "@mikro-orm/core";
import {Field, ObjectType} from "type-graphql";
import {BaseEntities} from "./base.entities";
import {AccountEntities} from "./account.entities";
import {TokenEntities} from "./token.entities";
import {SubscriptionPlanEntities} from "./subscriptionPlan.entities";
import { SubscriptionEntities } from "./subscription.entities";
import { AddressEntities } from "./address.entities";
import { SocialsEntities } from "./socials.entities";
import { SignatureEntities } from "./signature.entities";
import { SignatureDraftEntities } from "./signatureDraft.entities";

@ObjectType()
export class fontProperty{
    @Field()
    @Property()
    fontFamily!: string;
    @Field()
    @Property()
    fontSize!: string;
    @Field()
    @Property()
    fontWeight!: string;
    @Field()
    @Property()
    lineHeight!: string;
    @Field()
    @Property()
    color!: string;
}
@ObjectType()
export class iconStyle{
    @Field()
    @Property()
    shape!: string;
}

@ObjectType()
export class iconProperty{
    @Field()
    @Property()
    social!: iconStyle;
    @Field()
    @Property()
    contact!: iconStyle;
}
@ObjectType()
export class dividerProperty{
    @Field()
    @Property()
    style!: string;
    @Field()
    @Property()
    thickness!: string;
    @Field()
    @Property()
    color!: string;
}



@ObjectType()
@Entity()
export class PropertiesEntities extends BaseEntities{

    @Field()
    @Property()
    heading!: fontProperty;
    @Field()
    @Property()
    body!: fontProperty;
    @Field()
    @Property()
    link!: fontProperty;
    @Field()
    @Property()
    icons!: iconProperty;
    @Field()
    @Property()
    dividers!: dividerProperty;

    @Field(() => SignatureEntities, { nullable: true })
    @OneToOne(() => SignatureEntities, signature => signature.properties)
    signature!: SignatureEntities;

    @Field(() => SignatureDraftEntities, { nullable: true })
    @OneToOne(() => SignatureDraftEntities, draft => draft.properties)
    draft!: SignatureDraftEntities;

    constructor(options:any) {
        super();
        this.heading = options.heading;
        this.body = options.body;
        this.link = options.link;
        this.icons = options.icons;
        this.dividers = options.dividers;
    }



}
