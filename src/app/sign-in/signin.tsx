"use client";

import "@/app/globals.css";
import ThemeBasedRenderer from "@/components/theme-based-renderer";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { signinSchema } from "@/lib/schemas";
import { faGithub, faGoogle } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { ArrowRightIcon, LoaderCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import Turnstile, { useTurnstile } from "react-turnstile";
import { toast } from "sonner";
import type { z } from "zod";

export default function SignInPage({ siteKey }: { siteKey: string }) {
  const turnstile = useTurnstile();
  const [token, setToken] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const form = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof signinSchema>) {
    startTransition(async () => {
      if (!token) {
        toast.error("Please complete the captcha challenge!");
        return;
      }
      const res = await authClient.signIn.email({
        email: values.email,
        password: values.password,
        fetchOptions: {
          headers: {
            "x-captcha-response": token,
          },
          onSuccess: () => {
            router.push("/home");
          }
        },
      });
      if (res.error) {
        turnstile.reset();
        toast.error(res.error.message);
      }
    });
  }

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
      <motion.div
        initial={{ opacity: 0, x: "calc(var(--spacing) * -2)" }}
        animate={{ opacity: 1, x: "calc(var(--spacing) * 2)" }}
        transition={{ duration: 0.4, ease: "circInOut" }}
        className="absolute left-2 top-4"
      >
        <Link href={"/"}>
          <ThemeBasedRenderer
            light={<Image src={"/simple-logo.svg"} width={120} height={32} alt="Notables" />}
            dark={<Image src={"/simple-logo-light.svg"} width={120} height={32} alt="Notables" />}
          />
        </Link>
      </motion.div>
      <ThemeToggle className="absolute right-2 top-2" />
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "circInOut" }}
        className={
          "w-[90%] h-fit md:w-[50%] md:min-h-fit p-5 flex flex-col gap-y-1 border border-border bg-background shadow-xl rounded-md"
        }
      >
        <h1 className="text-2xl font-semibold">Sign in</h1>
        <h2 className="text-muted-foreground text-sm md:text-base flex items-center gap-x-1">
          Not a member yet?{" "}
          <Link
            className="underline flex items-center text-blue-500"
            href={"/sign-up"}
          >
            Join today
            <ArrowRightIcon size={18} />
          </Link>
        </h2>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="pt-4 space-y-5"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      placeholder="john.doe@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input disabled={isPending} type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Turnstile
              sitekey={siteKey}
              onVerify={(token) => setToken(token)}
            />
            <Button
              type="submit"
              className="flex items-center gap-x-2"
              disabled={isPending}
            >
              {isPending && <LoaderCircle className="animate-spin" />}
              Sign in
            </Button>
          </form>
        </Form>
        <div className="flex my-2 gap-x-2 items-center">
          <hr className="border-t flex-auto border-border" />
          Or
          <hr className="border-t flex-auto border-border" />
        </div>
        <div className="flex gap-y-4 flex-col mt-auto">
          <Button
            disabled={isPending}
            className="flex items-center"
            variant="secondary"
            onClick={async () => {
              const res = await authClient.signIn.social({
                provider: "google"
              });
              res.error && toast.error(res.error.message);
            }}
          >
            <FontAwesomeIcon icon={faGoogle} className="mr-2" />
            Sign in with Google
          </Button>
          <Button
            disabled={isPending}
            className="flex items-center"
            variant="secondary"
            onClick={async () => {
              const res = await authClient.signIn.social({
                provider: "github"
              });
              res.error && toast.error(res.error.message);
            }}
          >
            <FontAwesomeIcon icon={faGithub} className="mr-2" />
            Sign in with GitHub
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
