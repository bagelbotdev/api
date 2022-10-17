export default function mapOrderConfirmationToBlockKit(
  cartGuid: string,
  menuItemOid: string,
  menuItemName: string,
  menuItemPrice: number,
  originalSearchQuery: string,
  lunrsearchScore: number
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
          text: `*${menuItemName}*\n>From query: \`/order ${originalSearchQuery}\``,
        },
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: {
              type: "plain_text",
              text: `Add to Tab ($${menuItemPrice})`,
              emoji: true,
            },
            value: cartGuid + ":" + menuItemOid,
            action_id: "confirm-order",
          },
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "Schedule for Next Tab",
              emoji: true,
            },
            value: cartGuid + ":" + menuItemOid,
            action_id: "schedule-order",
          },
        ],
      },
    ],
  };
}
