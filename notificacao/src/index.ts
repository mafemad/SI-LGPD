import "dotenv/config";
import "reflect-metadata";
import { Repository } from "typeorm";
import { AppDataSource as db } from "./db";
import { User } from "./entity/User";
import { transporter } from "./transporter";
import pug from "pug";

async function main() {
  await db
    .initialize()
    .then(() => {
      console.log("Data Source has been initialized!");
    })
    .catch((err) => {
      console.error("Error during Data Source initialization", err);
    });

  console.log(process.env.SMTP_FROM);
  const userRepository: Repository<User> = db.getRepository(User);

  console.log("Starting the email notification process...");
  const usersList: User[] = await userRepository.find();

  usersList.forEach(async (user) => {
    if (!user.email) {
      this.logger.warn(
        `User with ID ${user.id} does not have an email address.`
      );
      return;
    }

    const sendMailParams = {
      from: process.env.SMTP_FROM,
      to: user.email,
      subject: "Alerta de vazamento de dados",
      template: "vazamento",
      context: {
        name: user.name,
      },
      html: pug.compileFile("./templates/vazamento.pug")({ name: user.name }),
    };

    await transporter
      .sendMail(sendMailParams)
      .then(() => console.log("Enviando para ", user.email, "..."))
      .catch((error) => {
        console.error(`Something went wrong while sending mail: ${error}`);
      });
  });
}

main();
