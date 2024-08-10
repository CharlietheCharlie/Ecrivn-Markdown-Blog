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
    <form onSubmit={form.handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow-lg space-y-4 max-w-md mx-auto">
      <div>
        <label className="block text-gray-700 font-bold mb-2">Name</label>
        <input 
          {...form.register("name")} 
          className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
        />
        {form.formState.errors.name && <span className="text-red-500 text-sm">{form.formState.errors.name.message}</span>}
      </div>
      <div>
        <label className="block text-gray-700 font-bold mb-2">Email</label>
        <input 
          type="email" 
          {...form.register("email")} 
          className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
        />
        {form.formState.errors.email && <span className="text-red-500 text-sm">{form.formState.errors.email.message}</span>}
      </div>
      <div>
        <label className="block text-gray-700 font-bold mb-2">Password</label>
        <input 
          type="password" 
          {...form.register("password")} 
          className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
        />
        {form.formState.errors.password && <span className="text-red-500 text-sm">{form.formState.errors.password.message}</span>}
      </div>
      <button 
        type="submit"
        className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition duration-300"
      >
        Register
      </button>
    </form>
  );
};

export default Register;
