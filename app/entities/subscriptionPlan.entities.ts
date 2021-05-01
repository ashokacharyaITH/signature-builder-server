import {Cascade, Collection, Entity, ManyToOne, OneToMany, Property} from "@mikro-orm/core";
import {Field, ObjectType} from "type-graphql";
import {BaseEntities} from "./base.entities";

import {SubscriptionEntities} from "./subscription.entities";
export enum SubscriptionType {
    Fixed = 'fixed', // fixed standard type
    Seat = 'seat', // per seat type, can add as much as you can
}

@ObjectType()
@Entity()
export class SubscriptionPlanEntities extends BaseEntities{

    @Field()
    @Property()
    priceId!: string; //reference to stripe price id

    @Field()
    @Property()
    productId!: string; //reference to stripe price id

    @Field(() =>Number,{nullable:true})
    @Property({ nullable: true })
    price!: number;

    @Field()
    @Property()
    s_type!: SubscriptionType; //subscription type fixed standard or per seat subscruiption

    @Field()
    @Property()
    interval!: string;

    @Field()
    @Property()
    intervalCount!: number;

    @Field()
    @Property()
    name!: string;

    @Field()
    @Property()
    description!: string;

    @Field()
    @Property()
    availibility!: boolean;

    @Field()
    @Property()
    TrialPeriod!: string;

    //
    // @Field(() => [SubscriptionEntities], { nullable: true })
    // @OneToMany(() => SubscriptionEntities, (s:SubscriptionEntities) => s.subscriptionPlan, { cascade: [Cascade.ALL] })
    // subscriptions? = new Collection<SubscriptionEntities>(this);

    constructor(options:any) {
        super();
        this.name = options.name;
        this.description = options.description;
        this.availibility = true;
        this.TrialPeriod = "none";
        this.priceId = options.priceId;
        this.productId = options.productId;
        this.price = options.price;
        this.interval = options.interval;
        this.intervalCount=options.intervalCount;
        this.s_type=options.s_type;
    }

}
