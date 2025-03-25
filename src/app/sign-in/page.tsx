import SignInPage from "./signin";

export default function SigninPageWrapper() {
  return (
    <SignInPage
      websiteUrl={process.env.BETTER_AUTH_URL as string}
      siteKey={process.env.CAPTCHA_SITE_KEY as string}
    />
  );
}
