import type { Metadata } from 'next';
import SignupForm from './SignupForm';

export const metadata: Metadata = {
  title: 'Create Account',
  description: 'Join Predicta.ng free. Get daily picks, full track record access, and AI-powered predictions.',
};

export default function SignupPage() {
  return <SignupForm />;
}
