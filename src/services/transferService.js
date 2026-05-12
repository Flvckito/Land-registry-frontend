import { apiClient } from "@/lib/api/client";

function mapTransfer(t) {
  if (!t) return t;
  return {
    id: String(t.id ?? ""),
    landId: String(t.parcel_id ?? t.land_id ?? t.parcel ?? ""),
    parcelNumber: t.parcel_number ?? "",
    landTitle: t.land_title ?? t.parcel_title ?? "",
    fromOwnerId: t.from_owner_id ?? t.previous_owner_id ?? "",
    fromOwnerName: t.from_owner_name ?? t.previous_owner_name ?? "",
    fromOwnerNationalId: t.from_owner_address ?? t.previous_owner_address ?? "",
    toOwnerName: t.to_owner_name ?? t.new_owner_name ?? "",
    toOwnerNationalId: t.new_owner_address ?? t.to_owner_address ?? "",
    reason: t.reason ?? t.transfer_type ?? "",
    status: t.status ?? "pending",
    initiatedById: t.initiated_by_id ?? "",
    initiatedByName: t.initiated_by_name ?? "",
    initiatedAt: t.created_at ?? t.initiated_at ?? new Date().toISOString(),
    decidedById: t.decided_by_id,
    decidedByName: t.decided_by_name,
    decidedAt: t.decided_at,
    decisionNotes: t.decision_notes,
    initiationAnchor: {
      txHash: t.blockchain_tx_hash ?? "",
      blockHash: t.block_hash ?? "",
      blockNumber: Number(t.block_number ?? 0),
      network: t.network ?? "Sepolia",
      timestamp: t.created_at ?? new Date().toISOString(),
    },
    settlementAnchor: t.settlement_tx_hash
      ? {
          txHash: t.settlement_tx_hash,
          blockHash: t.settlement_block_hash ?? "",
          blockNumber: Number(t.settlement_block_number ?? 0),
          network: t.network ?? "Sepolia",
          timestamp: t.settled_at ?? new Date().toISOString(),
        }
      : undefined,
    raw: t,
  };
}

export const transferService = {
  async list() {
    const data = await apiClient.get("/api/transfers/");
    const items = Array.isArray(data) ? data : data.results ?? [];
    return items.map(mapTransfer);
  },

  async listForUser(_user) {
    return this.list();
  },

  async getById(id) {
    return mapTransfer(await apiClient.get(`/api/transfers/${id}/`));
  },

  async initiate(payload, _actor) {
    const body = {
      new_owner_address: payload.toOwnerNationalId,
      new_owner_name: payload.toOwnerName,
      transfer_type: payload.reason || "sale",
      reason: payload.reason,
    };
    return mapTransfer(await apiClient.post(`/api/land/${payload.landId}/transfer/`, body));
  },

  async approve(transferId, _actor, notes) {
    return mapTransfer(
      await apiClient.post(`/api/transfers/${transferId}/approve/`, { notes }),
    );
  },

  async reject(transferId, _actor, notes) {
    return mapTransfer(
      await apiClient.post(`/api/transfers/${transferId}/reject/`, { notes }),
    );
  },

  async cancel(transferId, _actor, notes) {
    return mapTransfer(
      await apiClient.post(`/api/transfers/${transferId}/cancel/`, { notes }),
    );
  },
};
