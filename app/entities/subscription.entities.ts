import { Entity, ManyToOne, OneToOne, Property } from "@mikro-orm/core";
import {Field, ObjectType} from "type-graphql";
import {BaseEntities} from "./base.entities";
import {AccountEntities} from "./account.entities";

@ObjectType()
@Entity()
export class SubscriptionEntities extends BaseEntities{

    @Field({ nullable: true })
    @Property()
    subscriptionId!: string;

    @Field({ nullable: true })
    @Property()
    customerId!: string;

    @Field({ nullable: true })
    @Property()
    paymentMethodId!: string;

    @Field({ nullable: true })
    @Property()
    renewDate?: number;

    @Field({ nullable: true })
    @Property()
    status?:string;

    @Field({ nullable: true })
    @Property()
    invoiceStatus?:string;

    @Field({ nullable: true })
    @Property()
    latest_invoice?:string;

    @Field({ nullable: true })
    @Property()
    invoiceId?:string;

    @Field({ nullable: true })
    @Property()
    price!: string;

    @Field({ nullable: true })
    @Property()
    productId?:string;

    @Field({ nullable: true })
    @Property({type: Number})
    quantity?: Number;

    @Field({ nullable: true })
    @Property({type: Number})
    inUse: Number=0;

    // @Field(() => SubscriptionPlanEntities, { nullable: true })
    // @ManyToOne(() => SubscriptionPlanEntities, { nullable: true })
    // subscriptionPlan?: SubscriptionPlanEntities;

    @Field({ nullable: true })
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
        this.paymentMethodId =options.paymentMethodId;
        this.invoiceStatus =options.invoiceStatus;
        this.invoiceId =options.invoiceId;
        this.quantity=options.quantity
        this.account = options.account;
        this.subscriptionPlan = options.subscriptionPlan;
        this.price = options.price;
        this.productId = options.productId;


    }
}
