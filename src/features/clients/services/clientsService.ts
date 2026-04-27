import { clientsData } from "../data/clientsData";
import type { Client } from "../types/client";

const NETWORK_DELAY_MS = 870;

export const clientsService = {
  async getClients(): Promise<Client[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(clientsData.map((client) => ({ ...client })));
      }, NETWORK_DELAY_MS);
    });
  },
};
