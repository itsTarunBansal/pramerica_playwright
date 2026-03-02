import { Tenant } from "../models/tenant.js";

const DEMO_TENANT_ID = "00000000-0000-0000-0000-000000000001";

export async function seedDemoTenant() {
  await Tenant.updateOne(
    { id: DEMO_TENANT_ID },
    { $setOnInsert: { id: DEMO_TENANT_ID, name: "Demo Insurance Tenant" } },
    { upsert: true }
  );
}
