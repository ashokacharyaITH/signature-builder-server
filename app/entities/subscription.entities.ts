import { Entity, ManyToOne, OneToOne, Property } from "@mikro-orm/core";
import {Field, ObjectType} from "type-graphql";
import {BaseEntities} from "./base.entities";
import {SubscriptionPlanEntities} from "./subscriptionPlan.entities";
import {AccountEntities} from "./account.entities";

@ObjectType()
@Entity()
export class SubscriptionEntities extends BaseEntities{

    @Field()
    @Property()
    subscriptionId!: string;

    @Field()
    @Property()
    customerId!: string;

    @Field()
    @Property()
    paymentMethodId!: string;

    @Field()
    @Property()
    renewDate?: string;

    @Field()
    @Property()
    status?:string;

    @Field({ nullable: true })
    @Property()
    invoiceStatus?:string;

    @Field({ nullable: true })
    @Property()
    invoiceId?:string;

    @Field()
    @Property()
    price!: string;

    @Field()
    @Property()
    productId?:string;

    @Field()
    @Property({type: Number})
    quantity?: Number;

    // @Field(() => SubscriptionPlanEntities, { nullable: true })
    // @ManyToOne(() => SubscriptionPlanEntities, { nullable: true })
    // subscriptionPlan?: SubscriptionPlanEntities;

    @Field()
    @Property()
    subscriptionPlan?:string;

    @Field(() => AccountEntities,{ nullable: true })
    @OneToOne(() => AccountEntities,account => account.subscription)
    account?: AccountEntities;

    constructor(options:any) {
        super();
        this.subscriptionId = options.subscriptionId;
        this.customerId = options.customerId;
        this.renewDate = options.renewDate;
        this.status = options.status;
        this.productId =options.productId;
        this.paymentMethodId =options.paymentMethodId;
        this.invoiceStatus =options.invoiceStatus;
        this.invoiceId =options.invoiceId;
        this.quantity=options.quantity
        this.account = options.account;
        this.subscriptionPlan = options.subscriptionPlan;


    }
}
