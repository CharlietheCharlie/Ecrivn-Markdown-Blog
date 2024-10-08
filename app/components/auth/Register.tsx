"use client";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";

const userRegisterValidation = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const Register = () => {
  const router = useRouter();
  const [nameAvailable, setNameAvailable] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  const form = useForm<z.infer<typeof userRegisterValidation>>({
    resolver: zodResolver(userRegisterValidation),
    defaultValues: {
      name: "",
      email: "",
      password: ""
    }
  });

  const name = useWatch({ control: form.control, name: "name" });

  useEffect(() => {
    const checkNameAvailability = async (name: string) => {
      if (name) {
        try {
          const response = await fetch(`/api/check-name?name=${name}`);
          const data = await response.json();
          setNameAvailable(data.available);
          if (!data.available) {
            form.setError("name", { type: "manual", message: "Username is already taken" });
          } else {
            form.clearErrors("name");
          }
        } catch (error) {
          toast.error("Error checking name availability");
        }
      }
    };

    const debounce = setTimeout(() => {
      checkNameAvailability(name);
    }, 500); 

    return () => clearTimeout(debounce);
  }, [name, form]);

  const onSubmit = async (data: z.infer<typeof userRegisterValidation>) => {
    if (!nameAvailable) {
      return;
    }

    setIsRegistering(true);
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
        toast.error(errorData.message); 
        return;
      }else{
        toast.success("Registration successful! Please check your email for verification.");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
    setIsRegistering(false);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg space-y-4 max-w-md mx-auto transition-colors duration-300">
      <div>
        <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2">Name</label>
        <input 
          {...form.register("name")} 
          className={`w-full p-3 border ${form.formState.errors.name ? "border-red-500" : "border-gray-300 dark:border-gray-600"} rounded-lg focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-300`}
        />
        {form.formState.errors.name && <span className="text-red-500 text-sm">{form.formState.errors.name.message}</span>}
      </div>
      <div>
        <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2">Email</label>
        <input 
          type="email" 
          {...form.register("email")} 
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-300"
        />
        {form.formState.errors.email && <span className="text-red-500 text-sm">{form.formState.errors.email.message}</span>}
      </div>
      <div>
        <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2">Password</label>
        <input 
          type="password" 
          {...form.register("password")} 
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-300"
        />
        {form.formState.errors.password && <span className="text-red-500 text-sm">{form.formState.errors.password.message}</span>}
      </div>
      {isRegistering && <div className="text-center">Registering...</div>}
      {!isRegistering && <button 
        type="submit"
        className={`w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors duration-300 ${!nameAvailable ? "cursor-not-allowed opacity-50" : ""}`}
        disabled={!nameAvailable}
      >
        Register
      </button>}
    </form>
  );
};

export default Register;
