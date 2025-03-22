import ThemeBasedRenderer from "@/components/theme-based-renderer";

export default function SignInPage() {
  return (
    <div className="h-screen flex items-center justify-center">
      <ThemeBasedRenderer
        light={
          <div className="absolute inset-0 -z-10 h-full w-full bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)]" />
        }
        dark={
          <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]" />
        }
      />
    </div>
  );
}
