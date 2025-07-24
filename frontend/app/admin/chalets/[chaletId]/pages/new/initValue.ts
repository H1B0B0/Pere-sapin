export const WITH_BASIC_INIT_VALUE: any = {
  "equipment-title": {
    id: "equipment-title",
    value: [
      {
        id: "equipment-title-content",
        type: "heading-one",
        children: [
          {
            text: "Mode d'emploi - Poêle à pellets automatique",
          },
        ],
        props: {
          nodeType: "block",
        },
      },
    ],
    type: "HeadingOne",
    meta: {
      order: 0,
      depth: 0,
    },
  },
  "safety-callout": {
    id: "safety-callout",
    value: [
      {
        id: "safety-callout-content",
        type: "callout",
        children: [
          {
            text: "⚠️ Veuillez lire attentivement ces instructions avant d'utiliser le poêle. En cas de doute, contactez-nous immédiatement.",
          },
        ],
        props: {
          nodeType: "block",
          theme: "warning",
        },
      },
    ],
    type: "Callout",
    meta: {
      order: 1,
      depth: 0,
    },
  },
};
