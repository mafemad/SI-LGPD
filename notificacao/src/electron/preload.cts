import { contextBridge, ipcRenderer } from "electron";
import { SendMailParams } from "./functions/sendMails";

console.log("[PRELOAD] Preload carregado!");

contextBridge.exposeInMainWorld("electron", {
  selectTemplate: () => ipcRenderer.invoke("select-template"),
  selectSource: () => ipcRenderer.invoke("select-source"),
  sendMails: (params: SendMailParams) =>
    ipcRenderer.invoke("send-mails", params),
});
