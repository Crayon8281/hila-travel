import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  global_library: defineTable({
    type: v.string(),
    country: v.string(),
    city: v.string(),
    title: v.string(),
    description_he: v.string(),
    images: v.array(v.string()),
    expert_notes: v.string(),
    tags: v.array(v.string()),
    cost_price: v.number(),
    selling_price: v.number(),
  })
    .index("by_type", ["type"])
    .index("by_country", ["country"])
    .index("by_city", ["city"]),

  trips: defineTable({
    client_name: v.string(),
    start_date: v.string(),
    end_date: v.string(),
    status: v.union(
      v.literal("draft"),
      v.literal("proposal"),
      v.literal("confirmed")
    ),
    cover_image: v.string(),
  }).index("by_status", ["status"]),

  trip_days: defineTable({
    tripId: v.id("trips"),
    day_number: v.number(),
    date: v.string(),
  }).index("by_trip", ["tripId"]),

  trip_activities: defineTable({
    dayId: v.id("trip_days"),
    assetId: v.id("global_library"),
    start_time: v.string(),
    custom_note: v.string(),
    sort_order: v.number(),
  }).index("by_day", ["dayId"]),
});
