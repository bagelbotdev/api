import { ensureConnected } from "./db/util";
import MenuItem from "./db/models/MenuItem";

import { MenuItemSpec } from "./db/schemas/MenuItem";

const items: MenuItemSpec[] = [
  {
    name: "Untoasted Blueberry Bagel",
    keywords: ["blueberry", "bagel"],
    price: 1.25,
    balsam_item_guid: "7bc2c647-4ef9-4f99-b940-272c62e6f71c",
    balsam_group_guid: "300383f2-6b47-49c8-85ee-7af133061c6e",
    balsam_modifiers: [
      {
        modifier_set_guid: "3bd023bc-0cac-41e1-84e8-847aa0cbf2c0",
        modifiers: [
          {
            modifier_group_guid: "300383f2-6b47-49c8-85ee-7af133061c6e",
            modifier_guid: "35bf1ecf-2394-4cbe-8e01-4eda8f3f658b",
          },
        ],
      },
    ],
  },
  {
    name: "Untoasted Montreal Everything Bagel",
    keywords: ["montreal", "everything", "bagel"],
    price: 1.25,
    balsam_item_guid: "7bc2c647-4ef9-4f99-b940-272c62e6f71c",
    balsam_group_guid: "300383f2-6b47-49c8-85ee-7af133061c6e",
    balsam_modifiers: [
      {
        modifier_set_guid: "3bd023bc-0cac-41e1-84e8-847aa0cbf2c0",
        modifiers: [
          {
            modifier_group_guid: "300383f2-6b47-49c8-85ee-7af133061c6e",
            modifier_guid: "295b508f-1974-409f-8da0-30f9e9fa6df8",
          },
        ],
      },
    ],
  },
  {
    name: "Untoasted Plain Bagel",
    keywords: ["plain", "bagel"],
    price: 1.25,
    balsam_item_guid: "7bc2c647-4ef9-4f99-b940-272c62e6f71c",
    balsam_group_guid: "300383f2-6b47-49c8-85ee-7af133061c6e",
    balsam_modifiers: [
      {
        modifier_set_guid: "3bd023bc-0cac-41e1-84e8-847aa0cbf2c0",
        modifiers: [
          {
            modifier_group_guid: "300383f2-6b47-49c8-85ee-7af133061c6e",
            modifier_guid: "116ad1c9-9ac5-46be-9b01-a149a91f114a",
          },
        ],
      },
    ],
  },
  {
    name: "Untoasted Salt Bagel",
    keywords: ["salt", "bagel"],
    price: 1.25,
    balsam_item_guid: "7bc2c647-4ef9-4f99-b940-272c62e6f71c",
    balsam_group_guid: "300383f2-6b47-49c8-85ee-7af133061c6e",
    balsam_modifiers: [
      {
        modifier_set_guid: "3bd023bc-0cac-41e1-84e8-847aa0cbf2c0",
        modifiers: [
          {
            modifier_group_guid: "300383f2-6b47-49c8-85ee-7af133061c6e",
            modifier_guid: "b207c930-c2ba-486e-93ca-ddd7e3a5a15e",
          },
        ],
      },
    ],
  },
  {
    name: "Untoasted Blueberry Bagel with Cream Cheese",
    keywords: ["blueberry", "bagel", "untoasted", "cream", "cheese"],
    price: 3,
    balsam_item_guid: "06a77603-e9cb-49ff-a26b-c9d93ffb84d6",
    balsam_group_guid: "0c8b6d60-f015-48b4-90b9-d19b11c07f0b",
    balsam_modifiers: [
      {
        modifier_set_guid: "8576728e-94b3-4aed-8a90-1d4dc426f8e1",
        modifiers: [
          {
            modifier_group_guid: "0c8b6d60-f015-48b4-90b9-d19b11c07f0b",
            modifier_guid: "c7d09748-ca72-424c-936c-78f456d560c1",
          },
        ],
      },
      {
        modifier_set_guid: "3bd023bc-0cac-41e1-84e8-847aa0cbf2c0",
        modifiers: [
          {
            modifier_group_guid: "0c8b6d60-f015-48b4-90b9-d19b11c07f0b",
            modifier_guid: "35bf1ecf-2394-4cbe-8e01-4eda8f3f658b",
          },
        ],
      },
      { modifier_set_guid: "ec8b7c88-4077-43b8-8d38-e7deef34288c", modifiers: [] },
    ],
  },
  {
    name: "Untoasted Everything Bagel with Cream Cheese",
    keywords: ["everything", "bagel", "untoasted", "cream", "cheese"],
    price: 3,
    balsam_item_guid: "06a77603-e9cb-49ff-a26b-c9d93ffb84d6",
    balsam_group_guid: "0c8b6d60-f015-48b4-90b9-d19b11c07f0b",
    balsam_modifiers: [
      {
        modifier_set_guid: "8576728e-94b3-4aed-8a90-1d4dc426f8e1",
        modifiers: [
          {
            modifier_group_guid: "0c8b6d60-f015-48b4-90b9-d19b11c07f0b",
            modifier_guid: "c7d09748-ca72-424c-936c-78f456d560c1",
          },
        ],
      },
      {
        modifier_set_guid: "3bd023bc-0cac-41e1-84e8-847aa0cbf2c0",
        modifiers: [
          {
            modifier_group_guid: "0c8b6d60-f015-48b4-90b9-d19b11c07f0b",
            modifier_guid: "b3cb9182-907e-4d76-b441-f7764df83898",
          },
        ],
      },
      { modifier_set_guid: "ec8b7c88-4077-43b8-8d38-e7deef34288c", modifiers: [] },
    ],
  },
  {
    name: "Untoasted Montreal Everything Bagel with Cream Cheese",
    keywords: ["montreal", "everything", "bagel", "cream", "cheese", "untoasted"],
    price: 3,
    balsam_item_guid: "06a77603-e9cb-49ff-a26b-c9d93ffb84d6",
    balsam_group_guid: "0c8b6d60-f015-48b4-90b9-d19b11c07f0b",
    balsam_modifiers: [
      {
        modifier_set_guid: "8576728e-94b3-4aed-8a90-1d4dc426f8e1",
        modifiers: [
          {
            modifier_group_guid: "0c8b6d60-f015-48b4-90b9-d19b11c07f0b",
            modifier_guid: "c7d09748-ca72-424c-936c-78f456d560c1",
          },
        ],
      },
      {
        modifier_set_guid: "3bd023bc-0cac-41e1-84e8-847aa0cbf2c0",
        modifiers: [
          {
            modifier_group_guid: "0c8b6d60-f015-48b4-90b9-d19b11c07f0b",
            modifier_guid: "295b508f-1974-409f-8da0-30f9e9fa6df8",
          },
        ],
      },
      { modifier_set_guid: "ec8b7c88-4077-43b8-8d38-e7deef34288c", modifiers: [] },
    ],
  },
  {
    name: "Untoasted Plain Bagel with Cream Cheese",
    keywords: ["plain", "bagel", "cream", "cheese", "untoasted"],
    price: 3,
    balsam_item_guid: "06a77603-e9cb-49ff-a26b-c9d93ffb84d6",
    balsam_group_guid: "0c8b6d60-f015-48b4-90b9-d19b11c07f0b",
    balsam_modifiers: [
      {
        modifier_set_guid: "8576728e-94b3-4aed-8a90-1d4dc426f8e1",
        modifiers: [
          {
            modifier_group_guid: "0c8b6d60-f015-48b4-90b9-d19b11c07f0b",
            modifier_guid: "c7d09748-ca72-424c-936c-78f456d560c1",
          },
        ],
      },
      {
        modifier_set_guid: "3bd023bc-0cac-41e1-84e8-847aa0cbf2c0",
        modifiers: [
          {
            modifier_group_guid: "0c8b6d60-f015-48b4-90b9-d19b11c07f0b",
            modifier_guid: "116ad1c9-9ac5-46be-9b01-a149a91f114a",
          },
        ],
      },
      { modifier_set_guid: "ec8b7c88-4077-43b8-8d38-e7deef34288c", modifiers: [] },
    ],
  },
  {
    name: "Toasted Blueberry Bagel with Cream Cheese",
    keywords: ["blueberry", "bagel", "cream", "cheese", "toasted"],
    price: 3,
    balsam_item_guid: "06a77603-e9cb-49ff-a26b-c9d93ffb84d6",
    balsam_group_guid: "0c8b6d60-f015-48b4-90b9-d19b11c07f0b",
    balsam_modifiers: [
      {
        modifier_set_guid: "8576728e-94b3-4aed-8a90-1d4dc426f8e1",
        modifiers: [
          {
            modifier_group_guid: "0c8b6d60-f015-48b4-90b9-d19b11c07f0b",
            modifier_guid: "9ca4479b-3156-4920-8748-a74343d46f47",
          },
        ],
      },
      {
        modifier_set_guid: "3bd023bc-0cac-41e1-84e8-847aa0cbf2c0",
        modifiers: [
          {
            modifier_group_guid: "0c8b6d60-f015-48b4-90b9-d19b11c07f0b",
            modifier_guid: "35bf1ecf-2394-4cbe-8e01-4eda8f3f658b",
          },
        ],
      },
      { modifier_set_guid: "ec8b7c88-4077-43b8-8d38-e7deef34288c", modifiers: [] },
    ],
  },
  {
    name: "Toasted Everything Bagel with Cream Cheese",
    keywords: ["everything", "bagel", "cream", "cheese", "toasted"],
    price: 3,
    balsam_item_guid: "06a77603-e9cb-49ff-a26b-c9d93ffb84d6",
    balsam_group_guid: "0c8b6d60-f015-48b4-90b9-d19b11c07f0b",
    balsam_modifiers: [
      {
        modifier_set_guid: "8576728e-94b3-4aed-8a90-1d4dc426f8e1",
        modifiers: [
          {
            modifier_group_guid: "0c8b6d60-f015-48b4-90b9-d19b11c07f0b",
            modifier_guid: "9ca4479b-3156-4920-8748-a74343d46f47",
          },
        ],
      },
      {
        modifier_set_guid: "3bd023bc-0cac-41e1-84e8-847aa0cbf2c0",
        modifiers: [
          {
            modifier_group_guid: "0c8b6d60-f015-48b4-90b9-d19b11c07f0b",
            modifier_guid: "b3cb9182-907e-4d76-b441-f7764df83898",
          },
        ],
      },
      { modifier_set_guid: "ec8b7c88-4077-43b8-8d38-e7deef34288c", modifiers: [] },
    ],
  },
  {
    name: "Toasted Plain Bagel with Cream Cheese",
    keywords: ["plain", "bagel", "cream", "cheese", "toasted"],
    price: 3,
    balsam_item_guid: "06a77603-e9cb-49ff-a26b-c9d93ffb84d6",
    balsam_group_guid: "0c8b6d60-f015-48b4-90b9-d19b11c07f0b",
    balsam_modifiers: [
      {
        modifier_set_guid: "8576728e-94b3-4aed-8a90-1d4dc426f8e1",
        modifiers: [
          {
            modifier_group_guid: "0c8b6d60-f015-48b4-90b9-d19b11c07f0b",
            modifier_guid: "9ca4479b-3156-4920-8748-a74343d46f47",
          },
        ],
      },
      {
        modifier_set_guid: "3bd023bc-0cac-41e1-84e8-847aa0cbf2c0",
        modifiers: [
          {
            modifier_group_guid: "0c8b6d60-f015-48b4-90b9-d19b11c07f0b",
            modifier_guid: "116ad1c9-9ac5-46be-9b01-a149a91f114a",
          },
        ],
      },
      { modifier_set_guid: "ec8b7c88-4077-43b8-8d38-e7deef34288c", modifiers: [] },
    ],
  },
  {
    name: "Toasted Montreal Everything Bagel with Cream Cheese",
    keywords: ["montreal", "everything", "bagel", "cream", "cheese", "toasted"],
    price: 3,
    balsam_item_guid: "06a77603-e9cb-49ff-a26b-c9d93ffb84d6",
    balsam_group_guid: "0c8b6d60-f015-48b4-90b9-d19b11c07f0b",
    balsam_modifiers: [
      {
        modifier_set_guid: "8576728e-94b3-4aed-8a90-1d4dc426f8e1",
        modifiers: [
          {
            modifier_group_guid: "0c8b6d60-f015-48b4-90b9-d19b11c07f0b",
            modifier_guid: "9ca4479b-3156-4920-8748-a74343d46f47",
          },
        ],
      },
      {
        modifier_set_guid: "3bd023bc-0cac-41e1-84e8-847aa0cbf2c0",
        modifiers: [
          {
            modifier_group_guid: "0c8b6d60-f015-48b4-90b9-d19b11c07f0b",
            modifier_guid: "295b508f-1974-409f-8da0-30f9e9fa6df8",
          },
        ],
      },
      { modifier_set_guid: "ec8b7c88-4077-43b8-8d38-e7deef34288c", modifiers: [] },
    ],
  },
];

(async () => {
  console.log("☁️  Connecting to mongo.erwijet.com...");
  await ensureConnected();
  console.log("⚙️  Purging old items...");
  await MenuItem.deleteMany({});
  for (let item of items) {
    await new MenuItem(item).save();
    console.log("👉 Inserted " + item.name);
  }
  console.log("🎉 Rebuilt MenuItem Collection");

  process.exit(0);
})();
