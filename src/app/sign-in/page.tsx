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
import { signinSchema } from "@/lib/schemas";
import { faGithub, faGoogle } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import type { z } from "zod";

export default function SignInPage() {
  const form = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof signinSchema>) {}

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
        initial={{ opacity: 0, x: 'calc(var(--spacing) * -2)' }}
        animate={{ opacity: 1, x: 'calc(var(--spacing) * 2)' }}
        transition={{ duration: 0.4, ease: "circInOut" }}
        className="absolute left-2 top-2 text-2xl font-bold">
        <Link href={"/"}>
          Notables
        </Link>
      </motion.div>
      <ThemeToggle className="absolute right-2 top-2" />
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "circInOut" }}
        className={
          "w-[90%] h-fit md:w-[50%] md:h-[50%] p-5 flex flex-col gap-y-1 border border-border bg-background shadow-xl rounded-md"
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
                    <Input placeholder="john.doe@example.com" {...field} />
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
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Sign in</Button>
          </form>
        </Form>
        <div className="flex my-2 gap-x-2 items-center">
          <hr className="border-t flex-auto border-border" />
          Or
          <hr className="border-t flex-auto border-border" />
        </div>
        <div className="flex gap-y-4 flex-col mt-auto">
          <Button className="flex items-center" variant="secondary">
            <FontAwesomeIcon icon={faGoogle} className="mr-2" />
            Sign in with Google
          </Button>
          <Button className="flex items-center" variant="secondary">
            <FontAwesomeIcon icon={faGithub} className="mr-2" />
            Sign in with GitHub
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
