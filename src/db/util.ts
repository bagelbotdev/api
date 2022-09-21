import mongoose from "mongoose";
import cache from "./caching";
import elasticlunr from "elasticlunr";
import MenuItemModel from "./models/MenuItem";

export async function ensureConnected() {
  const PRIMARY_CONN_STR = process.env.MONGO_URL;

  await mongoose.connect(PRIMARY_CONN_STR!, { ssl: false, authSource: 'admin' });
}

export const getMenuItems = cache(async () => {
  await ensureConnected();
  return await MenuItemModel.find({});
});

export const searchMenuItemsByKeyword = cache(async (queryExpr: string) => {
  const items = await getMenuItems();

  const index = elasticlunr<{ name: string; keywords: string; _id: string }>();
  index.setRef("_id");
  index.addField("name");
  index.addField("keywords");

  items.forEach((item) =>
    index.addDoc({
      _id: item._id.toString(),
      name: item.name!,
      keywords: item.keywords!.join(" "),
    })
  );

  const searchResults = index.search(queryExpr, {
    fields: {
      keywords: { boost: 2 },
      name: { boost: 1 },
    },
  }) as [{ score: number; ref: string }];

  const topSearchResultIndicator = searchResults.filter(({ score }) => score >= 1).shift();
  return await MenuItemModel.findById(topSearchResultIndicator?.ref);
});