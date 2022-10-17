import { BalsamGQL } from "../../../../@types/balsamgql";

export default function mapMenuResToBlockKit(selectedMenu: string, o: BalsamGQL.Menu[]) {
  return o
    .filter(({ name }) => name == selectedMenu)
    .flatMap((menu) => {
      return [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: menu.name,
          },
        },
        ...menu.groups.flatMap((group) => {
          return [
            {
              type: "context",
              elements: [
                {
                  type: "plain_text",
                  text: group.name,
                },
              ],
            },
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text:
                  group.items
                    .filter(({ outOfStock }) => !outOfStock)
                    .reduce((acc: string, cur: any, i, arr) => {
                      acc += `*${cur.name}*\t$${cur.price}\n${
                        !!cur.description ? "_" + cur.description + "_" : ""
                      }\n\n`;
                      return acc;
                    }, "") || "_No items in stock_",
              },
            },
          ];
        }),
      ];
    });
}
