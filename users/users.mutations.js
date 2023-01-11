import client from "../client";
import bcrypt from "bcrypt";

export default {
  Mutation: {
    createAccount: async (
      _,
      { username, email, name, password, location, avatarURL, githubUsername }
    ) => {
      const existingUser = await client.user.findFrist({
        where: {
          OR: [{ username }, { email }],
        },
      });

      const hashedPassword = await bcrypt.hash(password, 10);
      return client.user.create({
        data: {
          username,
          email,
          name,
          password: hashedPassword,
          location,
          avatarURL,
          githubUsername,
        },
      });
    },
  },
};
