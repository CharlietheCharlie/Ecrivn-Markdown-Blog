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

    if (result) {
      console.log(result);
    } else {
      router.push('/');
    }
  };

  const handleOAuthSignIn = (provider: string) => async () => {
    await signIn(provider, { callbackUrl: "/" });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow-lg space-y-6 max-w-md mx-auto">
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
        className="w-full bg-gray-700 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition duration-300 shadow-md"
      >
        Login
      </button>
      <div className="flex justify-between space-x-4">
        <button 
          type="button"
          onClick={handleOAuthSignIn("google")}
          className="w-1/2 bg-white text-gray-700 p-3 rounded-lg font-semibold border border-gray-300 hover:bg-gray-100 transition duration-300 shadow-md flex items-center justify-center space-x-2"
        >
          <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.67 0 6.76 1.26 9.32 3.7l7.15-7.14C35.9 2.1 30.31 0 24 0 14.71 0 7 5.8 3.67 13.78l7.9 6.14C13.51 13.1 18.36 9.5 24 9.5z"/>
            <path fill="#34A853" d="M24 48c6.13 0 11.2-2.02 14.93-5.48l-7.15-5.63C29.76 39.89 26.93 41 24 41c-5.64 0-10.45-3.6-12.23-8.64l-7.9 6.14C7.15 42.2 14.71 48 24 48z"/>
            <path fill="#4A90E2" d="M46.48 24.5c0-1.33-.12-2.6-.33-3.85H24v7.31h12.76c-.54 2.89-2.06 5.31-4.34 6.94l7.15 5.63C43.63 37.49 46.48 31.46 46.48 24.5z"/>
            <path fill="#FBBC05" d="M11.77 29.86A14.94 14.94 0 0 1 9.5 24c0-1.69.29-3.32.79-4.86l-7.9-6.14C1.52 16.68 0 20.21 0 24s1.52 7.32 4.39 10.14l7.38-4.28z"/>
          </svg>
          <span>Sign in with Google</span>
        </button>
        <button 
          type="button"
          onClick={handleOAuthSignIn("github")}
          className="w-1/2 bg-gray-800 text-white p-3 rounded-lg font-semibold hover:bg-gray-900 transition duration-300 shadow-md flex items-center justify-center space-x-2"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 0C5.373 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.387.6.111.82-.26.82-.577v-2.234c-3.338.724-4.043-1.608-4.043-1.608-.546-1.386-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.833 2.807 1.304 3.492.996.108-.774.418-1.304.762-1.604-2.666-.3-5.467-1.333-5.467-5.931 0-1.31.469-2.38 1.236-3.22-.123-.302-.536-1.518.117-3.165 0 0 1.008-.322 3.3 1.23.957-.266 1.98-.399 3-.404 1.02.005 2.043.138 3 .404 2.292-1.552 3.3-1.23 3.3-1.23.654 1.647.241 2.863.118 3.165.77.84 1.235 1.91 1.235 3.22 0 4.609-2.803 5.628-5.475 5.923.43.372.814 1.103.814 2.222v3.293c0 .319.218.694.825.576C20.565 21.795 24 17.298 24 12c0-6.627-5.373-12-12-12z"/>
          </svg>
          <span>Sign in with GitHub</span>
        </button>
      </div>
    </form>
  );
};

export default Login;
