import { redirect } from 'next/navigation';

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

/** Legacy auth path — always use the dedicated staff or member login screens. */
export default async function SignInRedirectPage({ searchParams }: Props) {
  const params = await searchParams;
  const callbackUrl = typeof params.callbackUrl === 'string' ? params.callbackUrl : undefined;
  const isStaffDestination =
    callbackUrl?.startsWith('/admin') ||
    callbackUrl?.startsWith('/cms') ||
    callbackUrl?.includes('/admin') ||
    callbackUrl?.includes('/cms');

  const destination = new URL(isStaffDestination ? '/login' : '/members/login', 'http://local');
  if (callbackUrl) destination.searchParams.set('callbackUrl', callbackUrl);

  redirect(`${destination.pathname}${destination.search}`);
}