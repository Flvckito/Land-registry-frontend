import { apiClient } from "@/lib/api/client";

export const blockchainService = {
  async health() {
    return await apiClient.get("/api/blockchain/health/");
  },
};
