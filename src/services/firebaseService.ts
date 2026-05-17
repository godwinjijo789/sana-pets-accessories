import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  onSnapshot,
  getDocFromServer
} from 'firebase/firestore';
import { db, auth } from '../firebase/config';
import { Pet, Accessory, Review, Enquiry, Admin, ContactInfo } from '../types';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error Detailed: ', JSON.stringify(errInfo, null, 2));
  throw new Error(JSON.stringify(errInfo));
}

// CRITICAL: Connection test as per guidelines
export const testFirestoreConnection = async () => {
  try {
    // Attempting to read a dummy document to verify connection and rules
    await getDocFromServer(doc(db, 'system', 'connection-test'));
    console.log('Firestore connection verified');
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Firestore is offline. Check your configuration.");
    } else {
      console.warn("Firestore connection test failed (this might be expected if rules are strict):", error);
    }
  }
};

// PETS
export const getPets = async () => {
  try {
    const q = query(collection(db, 'pets'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Pet));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'pets');
  }
};

export const getPetById = async (id: string) => {
  try {
    const docRef = doc(db, 'pets', id);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() } as Pet;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `pets/${id}`);
  }
};

export const addPet = async (pet: Omit<Pet, 'id' | 'createdAt'>) => {
  try {
    const docRef = await addDoc(collection(db, 'pets'), {
      ...pet,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, 'pets');
  }
};

export const updatePet = async (id: string, pet: Partial<Pet>) => {
  try {
    const docRef = doc(db, 'pets', id);
    await updateDoc(docRef, { ...pet, updatedAt: serverTimestamp() });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `pets/${id}`);
  }
};

export const deletePet = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'pets', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `pets/${id}`);
  }
};

// ACCESSORIES
export const getAccessories = async () => {
  try {
    const q = query(collection(db, 'accessories'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Accessory));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'accessories');
  }
};

export const getAccessoryById = async (id: string) => {
  try {
    const docRef = doc(db, 'accessories', id);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() } as Accessory;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `accessories/${id}`);
  }
};

export const addAccessory = async (accessory: Omit<Accessory, 'id' | 'createdAt'>) => {
  try {
    const docRef = await addDoc(collection(db, 'accessories'), {
      ...accessory,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, 'accessories');
  }
};

export const updateAccessory = async (id: string, accessory: Partial<Accessory>) => {
  try {
    const docRef = doc(db, 'accessories', id);
    await updateDoc(docRef, { ...accessory, updatedAt: serverTimestamp() });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `accessories/${id}`);
  }
};

export const deleteAccessory = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'accessories', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `accessories/${id}`);
  }
};

// ENQUIRIES
export const addEnquiry = async (enquiry: Omit<Enquiry, 'id' | 'createdAt' | 'status'>) => {
  try {
    await addDoc(collection(db, 'enquiries'), {
      ...enquiry,
      status: 'unread',
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, 'enquiries');
  }
};

export const getEnquiries = async () => {
  try {
    const q = query(collection(db, 'enquiries'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Enquiry));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'enquiries');
  }
};

export const markEnquiryAsRead = async (id: string) => {
  try {
    const docRef = doc(db, 'enquiries', id);
    await updateDoc(docRef, { status: 'read' });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `enquiries/${id}`);
  }
};

export const deleteEnquiry = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'enquiries', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `enquiries/${id}`);
  }
};

// REVIEWS
export const addReview = async (review: Omit<Review, 'id' | 'createdAt'>) => {
  try {
    await addDoc(collection(db, 'reviews'), {
      ...review,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, 'reviews');
  }
};

export const getReviewsByAccessoryId = (accessoryId: string, callback: (reviews: Review[]) => void) => {
  const q = query(
    collection(db, 'reviews'), 
    where('accessoryId', '==', accessoryId), 
    orderBy('createdAt', 'desc')
  );
  
  return onSnapshot(q, (snapshot) => {
    const reviews = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review));
    callback(reviews);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, `reviews?accessoryId=${accessoryId}`);
  });
};

export const deleteReview = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'reviews', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `reviews/${id}`);
  }
};

export const getAdmins = async () => {
  try {
    const q = query(collection(db, 'admins'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as Admin));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'admins');
  }
};

// CONTACT
export const getContactInfo = async () => {
  try {
    const docRef = doc(db, 'contact', 'info');
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return snapshot.data() as ContactInfo;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, 'contact/info');
  }
};

export const updateContactInfo = async (info: ContactInfo) => {
  try {
    const docRef = doc(db, 'contact', 'info');
    await updateDoc(docRef, { ...info });
  } catch (error) {
    // If it doesn't exist, we might need to set it
    try {
      const docRef = doc(db, 'contact', 'info');
      const { setDoc } = await import('firebase/firestore');
      await setDoc(docRef, info);
    } catch (innerError) {
      handleFirestoreError(innerError, OperationType.WRITE, 'contact/info');
    }
  }
};
