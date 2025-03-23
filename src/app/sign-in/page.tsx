import SignInPage from "./signin";

export default function SigninPageWrapper() {


  return <SignInPage siteKey={process.env.CAPTCHA_SITE_KEY as string} />
}