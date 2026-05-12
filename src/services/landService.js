import { apiClient } from "@/lib/api/client";

// Maps backend parcel DTO -> frontend LandRecord shape used by existing UI.
// Tweak field names to match your Django serializer output.
function mapParcel(p) {
  if (!p) return p;
  return {
    id: String(p.id ?? p.parcel_id ?? ""),
    parcelNumber: p.parcel_number ?? p.parcelNumber ?? String(p.id ?? ""),
    title: p.title ?? p.land_title ?? "",
    ownerId: p.owner_id ?? p.owner ?? "",
    ownerName: p.owner_name ?? p.ownerName ?? "",
    ownerNationalId: p.owner_national_id ?? p.owner_address ?? "",
    location: p.location_text ?? p.location ?? "",
    district: p.district ?? "",
    region: p.region ?? "",
    areaSqm: Number(p.size ?? p.area_sqm ?? 0),
    use: p.land_use_type ?? p.use ?? "residential",
    status: p.status ?? "registered",
    description: p.description ?? "",
    registeredById: p.registered_by_id ?? "",
    registeredByName: p.registered_by_name ?? "",
    createdAt: p.created_at ?? p.createdAt ?? new Date().toISOString(),
    updatedAt: p.updated_at ?? p.updatedAt ?? p.created_at ?? new Date().toISOString(),
    anchor: {
      txHash: p.blockchain_tx_hash ?? p.tx_hash ?? "",
      blockHash: p.block_hash ?? "",
      blockNumber: Number(p.block_number ?? 0),
      network: p.network ?? "Sepolia",
      timestamp: p.anchored_at ?? p.created_at ?? new Date().toISOString(),
    },
    history: Array.isArray(p.history) ? p.history : [],
    raw: p,
  };
}

export const landService = {
  async list() {
    const data = await apiClient.get("/api/land/");
    const items = Array.isArray(data) ? data : data.results ?? [];
    return items.map(mapParcel);
  },

  async listForUser(_user) {
    // Backend should already scope by authenticated user via JWT.
    return this.list();
  },

  async getById(id) {
    const data = await apiClient.get(`/api/land/${id}/`);
    return mapParcel(data);
  },

  async register(payload) {
    const data = await apiClient.post("/api/land/", {
      parcel_number: payload.parcelNumber,
      title: payload.title,
      owner_name: payload.ownerName,
      owner_national_id: payload.ownerNationalId,
      location: payload.location,
      district: payload.district,
      region: payload.region,
      size: payload.areaSqm,
      land_use_type: payload.use,
      description: payload.description,
    });
    return mapParcel(data);
  },

  async verifyByHash(hash) {
    // Adjust to your backend's verification endpoint.
    const data = await apiClient.get(`/api/land/verify/?hash=${encodeURIComponent(hash)}`);
    return mapParcel(data);
  },
};
