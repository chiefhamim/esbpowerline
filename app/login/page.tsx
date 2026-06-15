import { LoginScreen } from '@/components/auth/LoginScreen';

export const metadata = {
  title: 'Sign in',
  description: 'Secure sign-in for ESB PowerLine admin and editor workspaces.',
};

export default function LoginPage() {
  return <LoginScreen />;
}