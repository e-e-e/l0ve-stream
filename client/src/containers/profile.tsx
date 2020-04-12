import React, { useCallback } from "react";
import { Typography } from "../components/typography/typography";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/reducers/reducers";

const selectWhoami = (state: RootState) => state.user.whoami;
export const ProfileView = () => {
  const whoami = useSelector(selectWhoami);
  if (!whoami) {
    return (
      <div>
        Do not know who you are. Something went really wrong.
      </div>
    );
  }
  return (
    <div>
      <Typography variant="h1">Profile</Typography>
      <Typography>Hello {whoami.name}</Typography>
      <Typography>Your id is {whoami.id}</Typography>
      <Typography>And your role is {whoami.role}</Typography>
    </div>
  );
};
