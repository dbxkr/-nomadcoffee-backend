import client from "../../client";
import bcrypt from "bcrypt";

export default {
  Mutation: {
    createAccount: async (
      _,
      { username, email, name, password, location, avatarURL, githubUsername }
    ) => {
      try {
        const existingUser = await client.user.findFirst({
          where: {
            OR: [{ username }, { email }],
          },
        });
        if (existingUser) {
          throw new Error("This username/password is already taken.");
        }

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
      } catch (e) {
        return e;
      }
    },
  },
};
