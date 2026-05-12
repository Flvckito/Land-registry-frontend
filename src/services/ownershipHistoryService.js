import { apiClient } from "@/lib/api/client";

export const ownershipHistoryService = {
  async listForParcel(parcelId) {
    const data = await apiClient.get(`/api/ownership-history/?parcel=${parcelId}`);
    const items = Array.isArray(data) ? data : data.results ?? [];
    return items;
  },
};
