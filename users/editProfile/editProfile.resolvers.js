import client from "../../client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { protectedResolver } from "../users.utils";

const resolverFn = async (
  _,
  {
    name,
    username,
    email,
    password: newPassword,
    location,
    avatarURL,
    githubUsername,
  },
  { loggedInUser, protectedResolver }
) => {
  let hashedPassword = null;
  if (newPassword) {
    hashedPassword = await bcrypt.hash(newPassword, 10);
  }
  const upsdatedUser = await client.user.update({
    where: {
      id: loggedInUser.id,
    },
    data: {
      name,
      username,
      email,
      ...(hashedPassword && { password: hashedPassword }),
      location,
      avatarURL,
      githubUsername,
    },
  });
  if (upsdatedUser.id) {
    return {
      ok: true,
    };
  } else {
    return {
      ok: false,
      error: "프로필 업데이트 실패",
    };
  }
};

export default {
  Mutation: {
    editProfile: protectedResolver(resolverFn),
  },
};
