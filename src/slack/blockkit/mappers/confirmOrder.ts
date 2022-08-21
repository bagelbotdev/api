export default function mapOrderConfirmationToBlockKit(
  cartGuid: string,
  menuItemOid: string,
  menuItemName: string
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
          text: menuItemName,
        },
        accessory: {
          type: "button",
          text: {
            type: "plain_text",
            text: "Order",
            emoji: true,
          },
          value: cartGuid + ":" + menuItemOid,
          action_id: "confirm-order",
        },
      },
    ],
  };
}
