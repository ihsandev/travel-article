"use client";

import { InputField } from "@/components/form/input-field";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/services/use-auth";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

const signInSchema = z.object({
  identifier: z.string().min(1, "Username is required"),
  password: z.string().min(4, "Password must be at least 4 characters long"),
});

type SignInSchema = z.infer<typeof signInSchema>;

export default function SignIn() {
  const { toast } = useToast();
  const router = useRouter();
  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
  });

  const { mutate: login, isPending } = useAuth({
    onError: (error) => {
      toast({
        description: error.message,
        variant: "destructive",
      });
    },
    onSuccess: () => {
      reset();
      toast({
        description: "Login successfully",
        variant: "default",
      });
      router.replace("/dashboard");
    },
  }).login;

  const onSubmit: SubmitHandler<SignInSchema> = (data: SignInSchema) => {
    login(data);
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <InputField
          label="Username or email"
          iconLeft={<User className="h-4 w-4" />}
          placeholder="Enter your username or email"
          error={errors.identifier?.message}
          {...formRegister("identifier")}
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
          Sign In
        </Button>

        <div className="flex items-center gap-1 text-center justify-center mt-2">
          <p className="text-muted-foreground">Don't have an account?</p>
          <Link className="text-blue-700 font-semibold" href="/sign-up">
            Sign Up
          </Link>
        </div>
      </form>
    </div>
  );
}
