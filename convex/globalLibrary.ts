import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const list = query({
  args: {
    type: v.optional(v.string()),
    country: v.optional(v.string()),
    searchText: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let assets;

    if (args.type) {
      assets = await ctx.db
        .query("global_library")
        .withIndex("by_type", (q) => q.eq("type", args.type!))
        .collect();
    } else if (args.country) {
      assets = await ctx.db
        .query("global_library")
        .withIndex("by_country", (q) => q.eq("country", args.country!))
        .collect();
    } else {
      assets = await ctx.db.query("global_library").collect();
    }

    if (args.searchText) {
      const search = args.searchText.toLowerCase();
      assets = assets.filter(
        (a) =>
          a.title.toLowerCase().includes(search) ||
          a.city.toLowerCase().includes(search) ||
          a.description_he.toLowerCase().includes(search) ||
          a.tags.some((t) => t.toLowerCase().includes(search))
      );
    }

    return assets;
  },
});

export const getById = query({
  args: { id: v.id("global_library") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getFilterOptions = query({
  args: {},
  handler: async (ctx) => {
    const assets = await ctx.db.query("global_library").collect();
    const countries = [...new Set(assets.map((a) => a.country))].sort();
    const types = [...new Set(assets.map((a) => a.type))].sort();
    const cities = [...new Set(assets.map((a) => a.city))].sort();
    return { countries, types, cities };
  },
});

export const create = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("global_library", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("global_library"),
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
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args;
    await ctx.db.patch(id, data);
  },
});

export const remove = mutation({
  args: { id: v.id("global_library") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
