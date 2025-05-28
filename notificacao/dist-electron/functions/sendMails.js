import "reflect-metadata";
import nodemailer from "nodemailer";
import pug from "pug";
import { User } from "./entity/User.js";
import DBFactory from "./db.factory.js";
import { readFileSync } from "fs";
function getExtension(filePath) {
    const parts = filePath.split(".");
    return parts.length > 1 ? parts.pop() || "" : "";
}
async function sendMails(params) {
    const { template, host, user, pass, port, path } = params;
    if (!template || !host || !user || !pass || !port) {
        throw new Error("Parametros inválidos. Verifique se todos os campos foram preenchidos corretamente.");
    }
    console.log("Iniciando o envio de e-mails...");
    console.log("Parâmetros recebidos:", {
        template,
        host,
        user,
        pass: "********", // Não exibir a senha no log
        port,
    });
    let transporter;
    try {
        transporter = nodemailer.createTransport({
            host,
            port: Number(port),
            auth: {
                user,
                pass,
            },
        });
    }
    catch (error) {
        throw new Error("Erro ao criar o transporter do nodemailer: " + error);
    }
    console.log("Transporter criado com sucesso!");
    console.log("Conectando ao banco de dados...");
    const db = (await DBFactory.getInstance(path)).getDataSource();
    const userRepository = db.getRepository(User);
    console.log("Iniciando serviço de notificação...");
    const usersList = await userRepository.find();
    console.log(`${usersList.length} encontrados no banco de dados.`);
    const promises = usersList.map((user) => {
        if (!user.email) {
            console.log(`User with ID ${user.id} does not have an email address.`);
            return Promise.resolve();
        }
        let sendMailParams;
        switch (getExtension(template)) {
            case "pug":
                sendMailParams = {
                    from: "support@noreply.com",
                    to: user.email,
                    subject: "Alerta de vazamento de dados",
                    html: pug.compileFile(template)({ name: user.name }),
                };
                break;
            case "html":
                sendMailParams = {
                    from: "support@noreply.com",
                    to: user.email,
                    subject: "Alerta de vazamento de dados",
                    html: readFileSync(template, "utf-8"),
                };
                break;
            default:
                console.error(`Unsupported template format for user ${user.email}`);
                return Promise.resolve();
        }
        return transporter
            .sendMail(sendMailParams)
            .then(() => console.log("Enviado para", user.email))
            .catch((error) => {
            console.error(`Erro ao enviar para ${user.email}:`, error);
        });
    });
    await Promise.all(promises);
    console.log("Todos os e-mails foram enviados!");
    return { success: true, message: "E-mails enviados com sucesso!" };
}
export { sendMails };
