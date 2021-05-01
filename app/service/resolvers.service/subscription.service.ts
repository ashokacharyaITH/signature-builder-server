

import { initializeStripeService } from "../index";
import { SubscriptionEntities, SubscriptionPlanEntities } from "../../entities";
import { DI } from "../../server";


export const SubscriptionCreateService=async (options:any)=>{
    const planId ="price_1IklpuF1iwOYcVBEY92RbWFs";
    const productId="prod_JNWtnKPFoAwUz2";
    try {
        const customerId =options!.customerId;
        const paymentMethodId =options!.paymentMethodId;
        const paymentMethod = await initializeStripeService.paymentMethods.attach(
            paymentMethodId,
            {customer: customerId}
        );
        const subscription:any = await initializeStripeService.subscriptions.create({
            customer: customerId,
            items: [{ price: planId,quantity:options.quantity }],
            default_payment_method:paymentMethod.id,
            expand: ['latest_invoice.payment_intent', 'plan.product'],
        });
        const SubscriptionOption ={
            subscriptionId:subscription.id,
            customerId:customerId, //it is unique for each subscriptions
            renewDate:subscription.current_period_end,
            status :subscription.status,
            invoiceStatus:subscription!.latest_invoice!.payment_intent!.status,
            invoiceId:subscription!.latest_invoice!.id,
            quantity:options.quantity,
            account:options.account,
            subscriptionPlan:planId
        }
        const subscriptionDB = new SubscriptionEntities(SubscriptionOption);
        const billing = await initializeStripeService.paymentMethods.retrieve(
            paymentMethodId
        );
        await DI.em.persistAndFlush(subscriptionDB as any);
        return {subscription:SubscriptionOption,billing:billing}
    }catch(e){
        return {errors:[{field:"subscription",message:e.message}]}
    }

}