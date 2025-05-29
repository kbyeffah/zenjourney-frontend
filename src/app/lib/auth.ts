import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';

export async function signIn(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error instanceof Error ? error : new Error('Failed to sign in');
  }
}