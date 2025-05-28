import { app, BrowserWindow, dialog, ipcMain } from "electron";
import path from "path";
import "reflect-metadata";
import { sendMails } from "./functions/sendMails.js";
import { isDev } from "./util.js";
import { getPreloadPath } from "./pathResolver.js";
app.commandLine.appendSwitch("disable-gpu");
app.on("ready", () => {
    const mainWindow = new BrowserWindow({
        webPreferences: {
            preload: getPreloadPath(),
        },
    });
    if (isDev()) {
        mainWindow.loadURL("http://localhost:5123");
    }
    else {
        mainWindow.loadFile(path.join(app.getAppPath(), "/dist-react/index.html"));
    }
    ipcMain.handle("send-mails", async (event, params) => {
        try {
            return await sendMails(params);
        }
        catch (error) {
            return { success: false, error: error.message };
        }
    });
    ipcMain.handle("select-template", async () => {
        const result = await dialog.showOpenDialog({
            properties: ["openFile"],
        });
        console.log("Resultado do dialogo:", result);
        if (result.canceled || result.filePaths.length === 0)
            return null;
        return result.filePaths[0];
    });
    ipcMain.handle("select-source", async () => {
        const result = await dialog.showOpenDialog({
            properties: ["openFile"],
        });
        if (result.canceled || result.filePaths.length === 0)
            return null;
        return result.filePaths[0];
    });
});
