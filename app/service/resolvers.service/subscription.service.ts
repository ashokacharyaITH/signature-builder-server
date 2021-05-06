

import { initializeStripeService } from "../index";
import { AccountEntities, SubscriptionEntities } from "../../entities";
import { DI } from "../../server";
export const SubscriptionBillingService=async (paymentMethodId:string)=>{
    const billing = await initializeStripeService.paymentMethods.retrieve(
        paymentMethodId
    );
    return billing

}

export const SubscriptionCreateService=async (options:any)=>{
    const account:any= await DI.orm.em.findOne(AccountEntities,{id:options.account});
    const planId ="price_1IklpuF1iwOYcVBEY92RbWFs";
    const productId="prod_JNWtnKPFoAwUz2";
    try {
        const customerId =options!.account.stripe_customer_id;
        const paymentMethodId =options!.paymentmethodId;

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
            latest_invoice:subscription!.latest_invoice!.payment_intent!.client_secret,
            invoiceStatus:subscription!.latest_invoice!.payment_intent!.status,
            invoiceId:subscription!.latest_invoice!.id,
            quantity:parseInt(options.quantity),
            account:options.account,
            subscriptionPlan:planId,
            paymentMethodId:paymentMethod.id,
            price:(parseInt(options.quantity)*1.8).toString(),
            productId:productId

        }
        const billing = await SubscriptionBillingService( paymentMethodId)
          if(subscription!.latest_invoice!.payment_intent!.status=="succeeded"){
              const subscriptionDB = new SubscriptionEntities(SubscriptionOption);
              await DI.em.persistAndFlush(subscriptionDB as any); //only save when succedded
              return {subscription:SubscriptionOption,billing:billing} //succeded
          }else{
              console.log("i am here and tested mate")
              return {subscription:SubscriptionOption,billing:billing}
          }


    }catch(e){
        return {errors:[{field:"subscription",message:e.message}]}
    }
}

export const SubscriptionPostOnBoardService=async (options:any)=>{
    try {
        let account = await DI.em.findOne(AccountEntities, {id: options.account.id as string}, ['users']);
        const SubscriptionOption ={
            subscriptionId:options.subscriptionId,//it is unique for each subscriptions
            customerId:options.customerId,
            renewDate:parseInt(options.renewDate),
            status :options.status,
            latest_invoice:options.latest_invoice,
            invoiceStatus:options.invoiceStatus,
            invoiceId:options.invoiceId,
            quantity:parseInt(options.quantity),
            subscriptionPlan:options.subscriptionPlan,
            paymentMethodId:options.paymentMethodId,
            price:options.price,
            productId:options.productId,
            account:account
        }
       ;
        const billing = await SubscriptionBillingService(options.paymentMethodId)
        account!.status="subscription";
        const subscriptionDB = new SubscriptionEntities(SubscriptionOption);
        await DI.em.persistAndFlush([subscriptionDB,account]); //only save when succedded
        return {subscription:SubscriptionOption,billing:billing,account:account} //succeded

    }catch(e){
        return {errors:[{field:"subscription",message:e.message}]}
    }
}