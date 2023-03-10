import { useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { Link, useHistory } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Button from "../components/button";
import FormError from "../components/form-error";
import { graphql } from "../gql/gql";
import { CreateAccountMutation, CreateAccountMutationVariables, UserRole } from "../gql/graphql";
import nuberLogo from "../images/logo.svg";

const CREATE_ACCOUNT_MUTATION = graphql(`
  mutation CreateAccount($createAccountInput: CreateAccountInput!) {
    createAccount(input: $createAccountInput) {
      ok
      error
    }
  }
`);

interface ICreateAccountForm {
  email: string;
  password: string;
  role: UserRole;
}

export default function CreateAccount() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ICreateAccountForm>({ defaultValues: { role: UserRole.Client } });
  const history = useHistory();
  const onCompleted = (data: CreateAccountMutation) => {
    const {
      createAccount: { ok },
    } = data;
    if (ok) {
      alert("Acoount Created! Log in now!");
      history.push("/");
    }
  };
  const [createAccountMutation, { data: createAccountMutationResult, loading }] = useMutation<CreateAccountMutation, CreateAccountMutationVariables>(
    CREATE_ACCOUNT_MUTATION,
    { onCompleted }
  );
  const onSubmit = ({ email, password, role }: ICreateAccountForm) => {
    if (!loading) {
      createAccountMutation({
        variables: {
          createAccountInput: { email, password, role },
        },
      });
    }
  };
  return (
    <div className="mt-10 flex h-screen flex-col items-center lg:mt-28">
      <Helmet>
        <title>Nuber | Create Account</title>
      </Helmet>
      <div className="flex w-full max-w-screen-sm flex-col items-center px-5">
        <img src={nuberLogo} className="mb-5 w-52" alt="Nuber Eats" />
        <h4 className="w-full text-3xl font-medium">Let's get started</h4>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-5 mb-3 grid w-full gap-3">
          <input
            {...register("email", {
              required: "Email is required",
              pattern:
                /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            })}
            type="email"
            placeholder="Email"
            className="input"
          />
          {errors.email?.message && <FormError errorMessage={errors.email?.message} />}
          {errors.email?.type === "pattern" && <FormError errorMessage={"Please enter a valid email"} />}
          <input {...register("password", { required: "Password is required" })} type="password" placeholder="Password" className="input" />
          {errors.password?.message && <FormError errorMessage={errors.password?.message} />}
          {errors.password?.type === "minLength" && <FormError errorMessage="Password must be more 10 chars" />}
          <select {...register("role", { required: true })} required className="input">
            {Object.keys(UserRole).map((role, index) => (
              <option key={index}>{role}</option>
            ))}
          </select>
          <Button canClick={isValid} loading={loading} actionText={"Create Account"} />
          {createAccountMutationResult?.createAccount.error && <FormError errorMessage={createAccountMutationResult?.createAccount.error} />}
        </form>
        <div>
          Already have an account{" "}
          <Link to="/" className="text-lime-600">
            Log In Now
          </Link>
        </div>
      </div>
    </div>
  );
}
