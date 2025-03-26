"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { signupSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { ArrowRightIcon, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import Turnstile, { useTurnstile } from "react-turnstile";
import { toast } from "sonner";
import type { z } from "zod";

export default function SignupForm({
  siteKey,
  websiteUrl,
}: {
  siteKey: string;
  websiteUrl: string;
}) {
  const [isPending, startTransition] = useTransition();
  const turnstile = useTurnstile();
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(values: z.infer<typeof signupSchema>) {
    startTransition(async () => {
      if (!token) {
        toast.error("Please complete the captcha challenge!");
        return;
      }
      const res = await authClient.signUp.email({
        email: values.email,
        password: values.password,
        name: values.username,
        fetchOptions: {
          headers: {
            "x-captcha-response": token,
          },
          onSuccess: () => {
            router.push("/home");
          },
        },
      });
      if (res.error) {
        turnstile.reset();
        toast.error(res.error.message);
      }
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "circInOut" }}
      className={
        "w-[90%] h-fit md:w-[50%] md:min-h-fit p-5 flex flex-col gap-y-1 border border-border bg-background shadow-xl rounded-md"
      }>
      <h1 className="text-2xl font-semibold">Sign up</h1>
      <h2 className="text-muted-foreground text-sm md:text-base flex items-center gap-x-1">
        Already a member?{" "}
        <Link
          className="underline flex items-center text-blue-500"
          href={"/sign-in"}>
          Sign in instead
          <ArrowRightIcon size={18} />
        </Link>
      </h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="pt-4 space-y-5">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    placeholder="JohnDoe744"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm password</FormLabel>
                <FormControl>
                  <Input disabled={isPending} type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center gap-x-4 text-sm">
            <Checkbox
              className="transition-colors border-gray-400"
              id="acceptTos"
            />
            <label htmlFor="acceptTos">
              I accept{" "}
              <Link
                target="_blank"
                className="underline font-semibold text-blue-500"
                href={"/terms"}>
                Terms of Conditions
              </Link>
            </label>
          </div>
          <Turnstile sitekey={siteKey} onVerify={(token) => setToken(token)} />
          <Button
            type="submit"
            className="flex items-center gap-x-2"
            disabled={isPending}>
            {isPending && <LoaderCircle className="animate-spin" />}
            Sign up
          </Button>
        </form>
      </Form>
    </motion.div>
  );
}
