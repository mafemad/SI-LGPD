import { contextBridge, ipcRenderer } from "electron";

console.log("[PRELOAD] Preload carregado!");

contextBridge.exposeInMainWorld("electron", {
  selectTemplate: () => ipcRenderer.invoke("select-template"),
  selectSource: () => ipcRenderer.invoke("select-source"),
  sendMails: (params: any) => ipcRenderer.invoke("send-mails", params),
});
