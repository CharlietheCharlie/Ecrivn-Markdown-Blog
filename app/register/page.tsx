"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";

const userRegisterValidation = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const Register = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof userRegisterValidation>>({
    resolver: zodResolver(userRegisterValidation),
    defaultValues: {
      name: "",
      email: "",
      password: ""
    }
  });

  const onSubmit = async (data: z.infer<typeof userRegisterValidation>) => {
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error:", errorData);
        return;
      }

      router.push("/login");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div>
        <label>Name</label>
        <input {...form.register("name")} />
        {form.formState.errors.name && <span>{form.formState.errors.name.message}</span>}
      </div>
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
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;
