import { getItem } from "../../../balsam/items";

export default function mapConfigureOrderToBlockKit(
  cartGuid: string,
  item: Awaited<ReturnType<typeof getItem>>,
  price: number = item.price
) {
  return {
    blocks: [
      {
        type: "divider",
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `Configuring ${item.name}...`,
        },
      },
      ...item.modifierGroups
        .map((group) => {
          const isSingleSelect = group.maxSelections == 1 && group.minSelections == 1;
          // Ignore nested modifiers, they suck!
          const modifiers = group.modifiers.filter((modifier) => !modifier.modifierGroups.length);
          if (!modifiers.length) return null;
          return {
            type: "section",
            block_id: group.guid,
            text: { type: "mrkdwn", text: group.name },
            accessory: {
              action_id:
                "configure-order:" +
                cartGuid +
                ":" +
                item.itemGuid +
                ":" +
                item.itemGroupGuid +
                ":" +
                group.guid,
              type: isSingleSelect ? "static_select" : "multi_static_select",
              max_selected_items: (!isSingleSelect && group.maxSelections) || undefined,
              placeholder: {
                type: "plain_text",
                text: isSingleSelect ? group.name : "Select",
              },
              options: modifiers.map((modifier) => ({
                text: {
                  type: "plain_text",
                  text: modifier.name + (modifier.price ? ` (+$${modifier.price.toFixed(2)})` : ""),
                },
                value: modifier.itemGuid,
              })),
            },
          };
        })
        .filter((entry) => !!entry),
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: {
              type: "plain_text",
              text: `Add to Tab ($${price.toFixed(2)})`,
              emoji: true,
            },
            value: cartGuid + ":" + item.itemGuid + ":" + item.itemGroupGuid,
            action_id: "confirm-custom-order",
          },
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "Schedule for Next Tab",
              emoji: true,
            },
            value: cartGuid + ":" + item.itemGuid + ":" + item.itemGroupGuid,
            action_id: "schedule-custom-order",
          },
        ],
      },
    ],
  };
}
