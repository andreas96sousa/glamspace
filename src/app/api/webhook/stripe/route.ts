import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { adminDb } from '@/lib/firebase-admin';
import Stripe from 'stripe';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get('Stripe-Signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    return NextResponse.json({ error: `Webhook Error: ${error.message}` }, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === 'checkout.session.completed') {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    const userId = session.client_reference_id; // Usually we pass the user ID here
    const planName = session.metadata?.planName;

    if (userId) {
      await adminDb.collection('subscriptions').doc(userId).set({
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: subscription.customer as string,
        planName: planName,
        status: subscription.status,
        priceId: subscription.items.data[0].price.id,
        currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
      });

      // Update user document if needed
      await adminDb.collection('users').doc(userId).update({
        isSubscribed: true,
        plan: planName,
      });
    }
  }

  if (event.type === 'customer.subscription.deleted' || event.type === 'customer.subscription.updated') {
    const subscription = event.data.object as Stripe.Subscription;
    const customerId = subscription.customer as string;

    // Find user by stripeCustomerId
    const usersSnapshot = await adminDb.collection('subscriptions')
      .where('stripeCustomerId', '==', customerId)
      .limit(1)
      .get();

    if (!usersSnapshot.empty) {
      const userDoc = usersSnapshot.docs[0];
      await userDoc.ref.update({
        status: subscription.status,
        currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
      });

      if (subscription.status !== 'active') {
        const userId = userDoc.id;
        await adminDb.collection('users').doc(userId).update({
          isSubscribed: false,
        });
      }
    }
  }

  return NextResponse.json({ received: true });
}
