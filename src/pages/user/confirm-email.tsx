import { gql, useApolloClient, useMutation } from "@apollo/client";
import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useHistory } from "react-router-dom";
import { graphql } from "../../gql";
import { VerifyEmailMutation, VerifyEmailMutationVariables } from "../../gql/graphql";
import { useMe } from "../../hooks/useMe";

const VERIFY_EMAIL_MUTATION = graphql(`
  mutation VerifyEmail($verifyEmailInput: VerifyEmailInput!) {
    verifyEmail(input: $verifyEmailInput) {
      ok
      error
    }
  }
`);

export const ConfirmEmail = () => {
  const { data: userData } = useMe();
  const client = useApolloClient();
  const history = useHistory();
  const onCompleted = (data: VerifyEmailMutation) => {
    const {
      verifyEmail: { ok },
    } = data;
    if (ok && userData?.me.id) {
      client.writeFragment({
        id: `User:${userData?.me.id}`,
        fragment: gql`
          fragment VerifiedUser on User {
            verified
          }
        `,
        data: {
          verified: true,
        },
      });
    }
    history.push("/");
  };
  const [verifyEmailMutation, { loading: verifyingEmail }] = useMutation<VerifyEmailMutation, VerifyEmailMutationVariables>(VERIFY_EMAIL_MUTATION, {
    onCompleted,
  });
  useEffect(() => {
    const [_, code] = window.location.href.split("code=");
    verifyEmailMutation({
      variables: {
        verifyEmailInput: {
          code,
        },
      },
    });
  }, []);
  return (
    <div className="mt-52 flex flex-col items-center justify-center">
      <Helmet>
        <title>Verify Email | Create Account</title>
      </Helmet>
      <h2 className="mb-1 text-lg font-medium">Confirming email...</h2>
      <h4 className="text-sm text-gray-700">Please wait, don't close this page...</h4>
    </div>
  );
};
