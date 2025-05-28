"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
console.log("[PRELOAD] Preload carregado!");
electron_1.contextBridge.exposeInMainWorld("electron", {
    selectTemplate: () => electron_1.ipcRenderer.invoke("select-template"),
    selectSource: () => electron_1.ipcRenderer.invoke("select-source"),
    sendMails: (params) => electron_1.ipcRenderer.invoke("send-mails", params),
});
