"use client";

import { InputField } from "@/components/form/input-field";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/services/use-auth";
import { SubmitHandler, useForm } from "react-hook-form";
import { Lock, Mail, User } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { useEffect, useState } from "react";
import { redirect, useRouter } from "next/navigation";

const signUpSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  username: z.string().min(3, "Username must be at least 3 characters long"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

type SignUpSchema = z.infer<typeof signUpSchema>;

export default function SignUp() {
  const { toast } = useToast();
  const router = useRouter();

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
  });

  const { mutate: register, isPending } = useAuth({
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
    onSuccess: () => {
      reset();
      toast({
        title: "Success",
        description: "Account created successfully",
        variant: "default",
      });
      router.push("/sign-in");
    },
  }).register;

  const onSubmit: SubmitHandler<SignUpSchema> = (data: SignUpSchema) => {
    register(data);
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <InputField
          label="Email"
          iconLeft={<Mail className="h-4 w-4" />}
          type="email"
          placeholder="Enter your email"
          error={errors.email?.message}
          {...formRegister("email")}
        />
        <InputField
          label="Username"
          iconLeft={<User className="h-4 w-4" />}
          type="text"
          placeholder="Enter your username"
          error={errors.username?.message}
          {...formRegister("username")}
        />
        <InputField
          label="Password"
          iconLeft={<Lock className="h-4 w-4" />}
          type="password"
          placeholder="Enter your password"
          error={errors.password?.message}
          {...formRegister("password")}
        />

        <Button className="mt-4" type="submit" size="lg" isLoading={isPending}>
          Sign Up
        </Button>

        <div className="flex items-center gap-1 text-center justify-center mt-2">
          <p className="text-muted-foreground">Already have an account?</p>
          <Link className="text-blue-700 font-semibold" href="/sign-in">
            Log In
          </Link>
        </div>
      </form>
    </div>
  );
}
