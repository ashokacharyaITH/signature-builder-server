import { Field, InputType, ObjectType } from "type-graphql";

import { metaData } from "./onBoard.graphs.types";


@ObjectType()
export class StripeAddress {
    @Field(() => String, {nullable: true})
    city?: string | null;
    @Field(() => String, {nullable: true})
    country?: string | null;
    @Field(() => String, {nullable: true})
    line1?: string | null;
    @Field(() => String, {nullable: true})
    line2?: string | null;
    @Field(() => String, {nullable: true})
    postal_code?: string | null;
    @Field(() => String, {nullable: true})
    state?: string | null;
}
@ObjectType()
export class StripeBillingDetails {
    @Field(() =>StripeAddress, {nullable: true})
    address?:StripeAddress
    @Field(() => String, {nullable: true})
    email?: string | null;
    @Field(() => String, {nullable: true})
    name?: string | null;
    @Field(() => String, {nullable: true})
    phone?: string | null;
}
@ObjectType()
export class StripeChecks {
    @Field(() => String, {nullable: true})
    address_line1_check?: string | null;
    @Field(() => String, {nullable: true})
    address_postal_code_check?: string | null;
    @Field(() => String, {nullable: true})
    cvc_check?: string | null;
}
@ObjectType()
export class StripeNetworks {
    @Field(() => [String], {nullable: true})
    available?: [string ]
    @Field(() => String, {nullable: true})
    preferred?: string | null;
}
@ObjectType()
export class Stripe3D {
    @Field(() => Boolean, {nullable: true})
    supported?: Boolean
}
@ObjectType()
export class StripeCard {

    @Field(() => String, {nullable: true})
    brand?: string | null;
    @Field(() => StripeChecks, {nullable: true})
    checks?: StripeChecks
    @Field(() => String, {nullable: true})
    country?: string | null;
    @Field(() => String, {nullable: true})
    exp_month?: string | null;
    @Field(() => String, {nullable: true})
    exp_year?: string | null;
    @Field(() => String, {nullable: true})
    fingerprint?: string | null;
    @Field(() => String, {nullable: true})
    funding?: string | null;
    @Field(() => String, {nullable: true})
    generated_from?: string | null;
    @Field(() => String, {nullable: true})
    last4?: string | null;
    @Field(() => StripeNetworks, {nullable: true})
    networks?:StripeNetworks
    @Field(() => Stripe3D, {nullable: true})
    three_d_secure_usage?: Stripe3D
    @Field(() => String, {nullable: true})
    wallet?: string | null;

}


@ObjectType()
export class StripeCardType {
    @Field(() => String, {nullable: true})
    id?: string | null;
    @Field(() => String, {nullable: true})
    object?: string | null;
    @Field(() => StripeBillingDetails , {nullable: true})
    billing_details?:StripeBillingDetails
    @Field(() => StripeCard, {nullable: true})
    card?: StripeCard
    @Field(() => Date, {nullable: true})
    created?: Date
    @Field(() => String, {nullable: true})
    customer?: string | null;
    @Field(() => Boolean, {nullable: true})
    livemode?: Boolean
    @Field(() => metaData, {nullable: true})
    metadata?: metaData
    @Field(() => String, {nullable: true})
    type?: string | null;
}