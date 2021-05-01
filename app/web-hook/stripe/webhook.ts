import Stripe from "stripe";
import { initializeStripeService } from "../../service";
const events:Stripe.WebhookEndpointCreateParams.EnabledEvent[]=[
    'charge.failed',
    'charge.succeeded',
    'charge.expired',
    'charge.pending',
    'charge.updated',
    'customer.subscription.trial_will_end',
    'customer.subscription.updated',
    'customer.subscription.pending_update_expired',
    'customer.subscription.deleted',
    'invoice.created',
    'invoice.paid',
    'invoice.payment_action_required', //very important
    'invoice.payment_failed',
    'invoice.payment_succeeded',
    'invoice.sent',
    'payment_intent.canceled',
    'payment_intent.created',
    'payment_intent.payment_failed',
    'payment_intent.processing',
    'payment_intent.requires_action',
    'payment_intent.succeeded',
    'payment_method.attached',
    'payment_method.detached',
    'payment_method.updated',
];
export const webhook =async ()=>{
    const enpoints = await initializeStripeService.webhookEndpoints.create({
        url: 'https://example.com/my/webhook/endpoint',
        enabled_events: events,
    });
}
