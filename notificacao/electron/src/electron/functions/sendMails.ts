import "reflect-metadata";
import nodemailer from "nodemailer";
import pug from "pug";
import { Repository } from "typeorm";
import { AppDataSource as db } from "./db.js";
import { User } from "./entity/User.js";

interface SendMailParams {
  host: string;
  port: string;
  user: string;
  pass: string;
  template: string;
}

async function sendMails(params: SendMailParams) {
  const { template, host, user, pass, port } = params;
  if (!template || !host || !user || !pass || !port) {
    throw new Error(
      "Parametros inválidos. Verifique se todos os campos foram preenchidos corretamente."
    );
  }

  console.log("Iniciando o envio de e-mails...");
  console.log("Parâmetros recebidos:", {
    template,
    host,
    user,
    pass: "********", // Não exibir a senha no log
    port,
  });

  let transporter: nodemailer.Transporter;
  try {
    transporter = nodemailer.createTransport({
      host,
      port: Number(port),
      auth: {
        user,
        pass,
      },
    });
  } catch (error) {
    throw new Error("Erro ao criar o transporter do nodemailer: " + error);
  }
  console.log("Transporter criado com sucesso!");
  console.log("Conectando ao banco de dados...");

  await db
    .initialize()
    .then(() => {
      console.log("Data Source iniciado com sucesso!");
    })
    .catch((err) => {
      console.error("Error during Data Source initialization", err);
    });

  const userRepository: Repository<User> = db.getRepository(User);

  console.log("Iniciando serviço de notificação...");
  const usersList: User[] = await userRepository.find();
  console.log(`${usersList.length} encontrados no banco de dados.`);

  usersList.forEach(async (user) => {
    if (!user.email) {
      console.log(`User with ID ${user.id} does not have an email address.`);
      return;
    }

    const sendMailParams = {
      from: "support@noreply.com",
      to: user.email,
      subject: "Alerta de vazamento de dados",
      template: "vazamento",
      context: {
        name: user.name,
      },
      html: pug.compileFile(template)({ name: user.name }),
    };

    await transporter
      .sendMail(sendMailParams)
      .then(() => console.log("Enviando para ", user.email, "..."))
      .catch((error) => {
        console.error(`Something went wrong while sending mail: ${error}`);
      });
  });
}

export { sendMails };
