import { useState, useEffect } from 'react';
import { 
  collection, 
  doc, 
  onSnapshot, 
  query, 
  where, 
  orderBy, 
  DocumentData,
  Query 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export function useRealtimeDocument(collectionName: string, docId: string) {
  const [data, setData] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!docId) {
      setLoading(false);
      return;
    }

    const docRef = doc(db, collectionName, docId);
    
    const unsubscribe = onSnapshot(
      docRef,
      (doc) => {
        if (doc.exists()) {
          setData({ id: doc.id, ...doc.data() });
        } else {
          setData(null);
        }
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Firestore error:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [collectionName, docId]);

  return { data, loading, error };
}

export function useRealtimeCollection(
  collectionName: string, 
  constraints: Array<any> = []
) {
  const [data, setData] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let q: Query<DocumentData> = collection(db, collectionName);
    
    // Apply constraints if provided
    if (constraints.length > 0) {
      q = query(q, ...constraints);
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setData(docs);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Firestore error:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [collectionName, JSON.stringify(constraints)]);

  return { data, loading, error };
}

// Hook specifically for order status updates
export function useOrderStatus(orderId: string) {
  return useRealtimeDocument('orders', orderId);
}

// Hook for restaurant orders
export function useRestaurantOrders(restaurantId: string) {
  const constraints = [
    where('restaurantId', '==', restaurantId),
    orderBy('createdAt', 'desc')
  ];
  
  return useRealtimeCollection('orders', constraints);
}
