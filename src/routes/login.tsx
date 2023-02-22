import { useForm } from "react-hook-form";

interface ILoginForm {
  email: string;
  password: string;
}

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILoginForm>();
  const onSubmit = (data: any) => {};
  console.log(errors);
  return (
    <div className="flex h-screen items-center justify-center bg-gray-800">
      <div className="w-full max-w-lg rounded-lg bg-white pt-10 pb-7 text-center">
        <h3 className="text-2xl text-gray-800">Log In</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-5 grid gap-5 px-5">
          <input {...register("email", { required: "Email is required" })} type="email" placeholder="Email" className="input mb-3" />
          {errors.email?.message && <span className="font-medium text-red-500">{errors.email?.message}</span>}
          <input {...register("password", { required: "Password is required", minLength: 10 })} type="password" placeholder="Password" className="input" />
          {errors.password?.message && <span className="font-medium text-red-500">{errors.password?.message}</span>}
          {errors.password?.type === "minLength" && <span className="font-medium text-red-500">Password must be more than 10 chars.</span>}
          <button className="btn mt-3">Log In</button>
        </form>
      </div>
    </div>
  );
}
