

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { updateUserSubscription } from '../firebase/flashcardOperations';

export default function SuccessPage() {
  const router = useRouter();

  useEffect(() => {
    const { session_id, userId } = router.query;

    if (session_id && userId) {
      updateUserSubscription(userId, 'premium')
        .then(() => {
          console.log('Subscription updated successfully');
          // Redirect to dashboard or show a success message
          router.push('/dashboard');
        })
        .catch((error) => {
          console.error('Error updating subscription:', error);
          // Handle error (show error message, etc.)
        });
    }
  }, [router.query]);

  return <div>Processing your subscription...</div>;
}