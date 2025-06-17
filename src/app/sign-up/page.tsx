import Logo from "@/components/layout/logo";
import ThemeBasedRenderer from "@/components/theme/theme-based-renderer";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import SignupForm from "./signup-form";

export default function SignUpPageWrapper() {
  return (
    <div className="h-screen flex items-center justify-center">
      <ThemeBasedRenderer
        light={
          <div className="absolute inset-0 -z-10 h-full w-full bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)]" />
        }
        dark={
          <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#0C0B0A_40%,#63e_100%)]" />
        }
      />
      <ThemeToggle className="absolute right-2 top-2" />
      <SignupForm
        websiteUrl={process.env.BETTER_AUTH_URL as string}
        siteKey={process.env.CAPTCHA_SITE_KEY as string}
      />
      <Logo />
    </div>
  );
}
