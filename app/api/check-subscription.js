// pages/api/check-subscription.js

import { getAuth } from "@clerk/nextjs/server";
import { db } from "../firebase"; 

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();

    let subscription = 'free';

    if (userDoc.exists) {
      const userData = userDoc.data();
      subscription = userData.subscription || 'free';
    } else {
      // If the user doesn't exist in the database, create a new document with free subscription
      await userRef.set({ subscription: 'free' });
    }

    res.status(200).json({ subscription });
  } catch (error) {
    console.error('Error checking subscription:', error);
    res.status(500).json({ error: 'Internal server error', subscription: 'free' });
  }
}