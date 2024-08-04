"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const userLoginValidation = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const Login = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof userLoginValidation>>({
    resolver: zodResolver(userLoginValidation),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const onSubmit = async (data: z.infer<typeof userLoginValidation>) => {
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      callbackUrl: "/",
      redirect: false,
    });

    if (result?.error) {
      // handle error
      console.error(result.error);
    } else {
      // redirect to callbackUrl
      router.push(result.url);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div>
        <label>Email</label>
        <input {...form.register("email")} />
        {form.formState.errors.email && <span>{form.formState.errors.email.message}</span>}
      </div>
      <div>
        <label>Password</label>
        <input type="password" {...form.register("password")} />
        {form.formState.errors.password && <span>{form.formState.errors.password.message}</span>}
      </div>
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
