import { 
  doc, collection, addDoc, updateDoc, deleteDoc, getDocs, getDoc, 
  writeBatch, serverTimestamp, query, orderBy, setDoc
} from 'firebase/firestore';
import { db } from './index';

export const updateUserSubscription = async (userId, subscriptionType) => {
  const userRef = db.collection('users').doc(userId);
  await userRef.update({ subscription: subscriptionType });
};

export const createFlashcardSet = async (userId, setData, flashcards) => {
  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);
  let userData = userDoc.data();

  if (!userData || !userData.subscription) {
    userData = { ...userData, subscription: 'free' };
    await setDoc(userRef, userData);
  }

  if (userData.subscription === 'free') {
    const setsRef = collection(db, 'users', userId, 'flashcardSets');
    const setsSnapshot = await getDocs(setsRef);
    if (setsSnapshot.size >= 5) {
      throw new Error('Free users are limited to 5 flashcard sets. Please upgrade to create more.');
    }
  }

  const batch = writeBatch(db);
  
  const setRef = doc(collection(db, 'users', userId, 'flashcardSets'));
  batch.set(setRef, {
    ...setData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  flashcards.forEach((card, index) => {
    const cardRef = doc(collection(setRef, 'flashcards'));
    batch.set(cardRef, { ...card, order: index });
  });

  await batch.commit();
  return setRef.id;
};
  
  export const fetchFlashcardSets = async (userId) => {
    const setsRef = collection(db, 'users', userId, 'flashcardSets');
    const q = query(setsRef, orderBy('updatedAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  };
  
  export const fetchFlashcardSet = async (userId, setId) => {
    const setRef = doc(db, 'users', userId, 'flashcardSets', setId);
    const setDoc = await getDoc(setRef);
    
    if (!setDoc.exists()) {
      throw new Error('Flashcard set not found');
    }
  
    const cardsRef = collection(setRef, 'flashcards');
    const cardsSnapshot = await getDocs(query(cardsRef, orderBy('order')));
    const cards = cardsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
    return { id: setId, ...setDoc.data(), flashcards: cards };
  };
  
  export const updateFlashcardSet = async (userId, setId, updateData) => { 

    console.log(updateData.flashcards)
    const setRef = doc(db, 'users', userId, 'flashcardSets', setId);
    const batch = writeBatch(db); 

    batch.update(setRef, { 
      name: updateData.name, 
      description: updateData.description, 
      updatedAt: serverTimestamp() 
    }); 

 // Fetch existing flashcards to prepare for deletion
 const flashcardsRef = collection(setRef, 'flashcards');
 const existingFlashcardsSnapshot = await getDocs(query(flashcardsRef, orderBy('order')));
 const existingFlashcards = existingFlashcardsSnapshot.docs.map(doc => doc.id);

 // Delete all existing flashcards
 existingFlashcards.forEach(cardId => {
   const cardRef = doc(db, 'users', userId, 'flashcardSets', setId, 'flashcards', cardId);
   batch.delete(cardRef);
 });

 // Add new flashcards
 updateData.flashcards.forEach(card => {
   const cardRef = doc(db, 'users', userId, 'flashcardSets', setId, 'flashcards', card.id);
   batch.set(cardRef, card);
 });

 await batch.commit();
  };
  
  export const deleteFlashcardSet = async (userId, setId) => {
    const setRef = doc(db, 'users', userId, 'flashcardSets', setId);
    await deleteDoc(setRef);
  };
  
  export const updateFlashcard = async (userId, setId, cardId, updateData) => {
    const cardRef = doc(db, 'users', userId, 'flashcardSets', setId, 'flashcards', cardId);
    await updateDoc(cardRef, updateData);
  };
  
  export const deleteFlashcard = async (userId, setId, cardId) => {
    const cardRef = doc(db, 'users', userId, 'flashcardSets', setId, 'flashcards', cardId);
    await deleteDoc(cardRef);
  }; 



