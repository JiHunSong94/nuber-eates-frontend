import { gql, useApolloClient, useMutation } from "@apollo/client";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import Button from "../../components/button";
import { graphql } from "../../gql";
import { EditProfileMutation, EditProfileMutationVariables } from "../../gql/graphql";
import { useMe } from "../../hooks/useMe";

const EDIT_PROFILE_MUTATION = graphql(`
  mutation editProfile($editProfileInput: EditProfileInput!) {
    editProfile(input: $editProfileInput) {
      ok
      error
    }
  }
`);

interface IFormProps {
  email?: string;
  password?: string;
}

export const EditProfile = () => {
  const { data: userData } = useMe();
  const client = useApolloClient();
  const onCompleted = (data: EditProfileMutation) => {
    const {
      editProfile: { ok },
    } = data;
    if (ok && userData) {
      const {
        me: { email: prevEmail, id },
      } = userData;
      const { email: newEmail } = getValues();
      if (prevEmail !== newEmail) {
        client.writeFragment({
          id: `User:${id}`,
          fragment: gql`
            fragment EditedUser on User {
              email
              verified
            }
          `,
          data: {
            email: newEmail,
            verified: false,
          },
        });
      }
    }
  };
  const [editProfileMutation, { loading }] = useMutation<EditProfileMutation, EditProfileMutationVariables>(EDIT_PROFILE_MUTATION, { onCompleted });
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<IFormProps>({
    defaultValues: {
      email: userData?.me.email,
    },
  });
  const onSubmit = ({ email, password }: IFormProps) => {
    editProfileMutation({
      variables: {
        editProfileInput: {
          email,
          ...(password !== "" && { password }),
        },
      },
    });
  };
  return (
    <div className="mt-52 flex flex-col items-center justify-center">
      <Helmet>
        <title>Edit Profile | Create Account</title>
      </Helmet>
      <h4 className="mb-3 text-2xl font-semibold">Edit Profile</h4>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-5 mb-5 grid w-full max-w-screen-sm gap-3">
        <input
          className="input"
          {...register("email", {
            pattern:
              /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          })}
          type="email"
          placeholder="Email"
        />
        <input className="input" {...register("password")} type="password" placeholder="Password" />
        <Button loading={loading} canClick={!loading} actionText="Save Profile" />
      </form>
    </div>
  );
};
