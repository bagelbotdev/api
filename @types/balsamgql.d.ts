export namespace BalsamGQL {
  interface Item {
    guid: string;
    price: string;
    name: string;
    outOfStock: boolean;
    description: string;
  }

  interface Group {
    name: string;
    items: Item[];
  }

  interface Menu {
    name: string;
    groups: Group[];
  }
}
