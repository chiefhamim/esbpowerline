import { redirect } from 'next/navigation';

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

/** Legacy auth path — member registration uses the member login screen. */
export default async function SignUpRedirectPage({ searchParams }: Props) {
  const params = await searchParams;
  const callbackUrl = typeof params.callbackUrl === 'string' ? params.callbackUrl : undefined;

  const destination = new URL('/members/login', 'http://local');
  if (callbackUrl) destination.searchParams.set('callbackUrl', callbackUrl);

  redirect(`${destination.pathname}${destination.search}`);
}