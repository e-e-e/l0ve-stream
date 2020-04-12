import React, { useCallback } from "react";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import { WhoAmI } from "../__generated_types__/WhoAmI";
import { Typography } from "../components/typography/typography";

export const ProfileView = () => {
  const { data, loading, error } = useQuery<WhoAmI>(gql`
    query WhoAmI2 {
      whoami {
        id
        name
        role
      }
    }
  `);
  if (!data) {
    return (
      <div>
        {loading && <div>loading</div>}
        {error && <div>{error}</div>}
      </div>
    );
  }
  return (
    <div>
      <Typography variant="h1">Profile</Typography>
      <Typography>Hello {data?.whoami?.name}</Typography>
      <Typography>Your id is {data?.whoami?.id}</Typography>
      <Typography>And your role is {data?.whoami?.role}</Typography>
    </div>
  );
};
