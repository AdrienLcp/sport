import type { LocalizedText } from '@/helpers/localized-text'

/**
 * The table. Source of truth for the nutrition plates, the way `program.ts` is
 * the source of truth for the sessions.
 */

/**
 * The day's protein target when the reader has not set one, a round middle
 * figure. About 1.6 g per kilo of body weight is the usual aim for keeping
 * muscle while the waist goes down; the settings plate takes the reader's own.
 */
export const DEFAULT_PROTEIN_TARGET = 120

export const PROTEIN_TARGET_RANGE = { max: 300, min: 40 } as const

export type ProteinSource = {
  readonly id: string
  readonly name: LocalizedText
  /** What one tap counts. Never a weight to be measured on a scale. */
  readonly portion: LocalizedText
  readonly protein: number
}

/** By yield, whey last because it is an exception rather than a staple. */
export const SOURCES: readonly ProteinSource[] = [
  {
    id: 'chicken',
    name: { en: 'Chicken breast', fr: 'Blanc de poulet' },
    portion: { en: '100 g', fr: '100 g' },
    protein: 30
  },
  {
    id: 'tuna',
    name: { en: 'Tuna in water', fr: 'Thon au naturel' },
    portion: { en: '1 can', fr: '1 boîte' },
    protein: 25
  },
  {
    id: 'beef',
    name: { en: 'Lean minced beef', fr: 'Steak haché 5 %' },
    portion: { en: '100 g', fr: '100 g' },
    protein: 21
  },
  {
    id: 'salmon',
    name: { en: 'Salmon or mackerel', fr: 'Saumon ou maquereau' },
    portion: { en: '100 g', fr: '100 g' },
    protein: 20
  },
  {
    id: 'quark',
    name: { en: 'Fat-free quark', fr: 'Fromage blanc 0 %' },
    portion: { en: '200 g', fr: '200 g' },
    protein: 16
  },
  {
    id: 'skyr',
    name: { en: 'Skyr', fr: 'Skyr' },
    portion: { en: '1 pot, 150 g', fr: '1 pot de 150 g' },
    protein: 16
  },
  {
    id: 'tofu',
    name: { en: 'Firm tofu', fr: 'Tofu ferme' },
    portion: { en: '100 g', fr: '100 g' },
    protein: 15
  },
  {
    id: 'oats',
    name: { en: 'Rolled oats', fr: 'Flocons d’avoine' },
    portion: { en: '100 g dry', fr: '100 g secs' },
    protein: 13
  },
  {
    id: 'lentils',
    name: { en: 'Cooked lentils', fr: 'Lentilles cuites' },
    portion: { en: '100 g', fr: '100 g' },
    protein: 9
  },
  {
    id: 'egg',
    name: { en: 'Egg', fr: 'Œuf' },
    portion: { en: '1', fr: '1' },
    protein: 6.5
  },
  {
    id: 'whey',
    name: { en: 'Whey', fr: 'Whey' },
    portion: { en: '1 scoop, 30 g', fr: '1 dose de 30 g' },
    protein: 24
  }
]

export type DayShare = {
  readonly moment: LocalizedText
  /** The part of the day's target this moment carries. */
  readonly share: number
}

/** How the target falls across a day. Shown as a shape, never enforced: asking
    which meal a tap belongs to would be a decision, and there are none here. */
export const DAY_SHAPE: readonly DayShare[] = [
  { moment: { en: 'Breakfast', fr: 'Petit-déjeuner' }, share: 0.25 },
  { moment: { en: 'Lunch', fr: 'Midi' }, share: 0.33 },
  { moment: { en: 'Snack', fr: 'En-cas' }, share: 0.12 },
  { moment: { en: 'Dinner', fr: 'Soir' }, share: 0.3 }
]

/** Grams a share of the target stands for, rounded to five: a portion is
    never counted closer than that. */
export const gramsOfShare = (target: number, share: number): number =>
  Math.round((target * share) / 5) * 5

export type PlateShare = {
  readonly id: string
  readonly hand: LocalizedText
  readonly what: LocalizedText
  readonly detail: LocalizedText
}

/** The hand follows the body: no scale, midday and evening alike. The first
    three are sectors of the drawn plate, in that order; the fourth is the
    drop beside it. */
export const PLATE_SHARES: readonly PlateShare[] = [
  {
    detail: {
      en: 'any of them, frozen included',
      fr: 'n’importe lesquels, surgelés compris'
    },
    hand: { en: 'Half', fr: 'La moitié' },
    id: 'greens',
    what: { en: 'Vegetables', fr: 'Légumes' }
  },
  {
    detail: {
      en: 'chicken, fish, eggs, lean beef, pulses',
      fr: 'poulet, poisson, œufs, steak 5 %, légumineuses'
    },
    hand: { en: 'A palm', fr: 'Une paume' },
    id: 'protein',
    what: { en: 'Protein', fr: 'Protéine' }
  },
  {
    detail: {
      en: 'brown rice, wholewheat pasta, sweet potato, lentils',
      fr: 'riz complet, pâtes complètes, patate douce, lentilles'
    },
    hand: { en: 'A fist', fr: 'Un poing' },
    id: 'starch',
    what: { en: 'Starch', fr: 'Féculent' }
  },
  {
    detail: {
      en: 'olive oil, avocado, a handful of almonds',
      fr: 'huile d’olive, avocat, une poignée d’amandes'
    },
    hand: { en: 'A thumb', fr: 'Un pouce' },
    id: 'fat',
    what: { en: 'Fat', fr: 'Gras' }
  }
]

/** 80 g in the pot is 40 g in each of its two portions. */
export const POT_TARGET = 80

export type PotPart = {
  readonly id: string
  readonly what: LocalizedText
  readonly detail: LocalizedText
}

export const POT: readonly PotPart[] = [
  {
    detail: {
      en: '250 to 300 g of raw meat or fish — or 2 cans of tuna, or 6 eggs, or 200 g of dry lentils and 2 eggs',
      fr: '250 à 300 g de viande ou de poisson crus — ou 2 boîtes de thon, ou 6 œufs, ou 200 g de lentilles sèches et 2 œufs'
    },
    id: 'pot-protein',
    what: { en: 'Protein', fr: 'Protéine' }
  },
  {
    detail: {
      en: 'a large bag of frozen vegetables — half the volume of the pot',
      fr: 'un grand sachet de surgelés — la moitié du volume de la casserole'
    },
    id: 'pot-greens',
    what: { en: 'Vegetables', fr: 'Légumes' }
  },
  {
    detail: {
      en: '150 g raw: brown rice, wholewheat pasta, lentils',
      fr: '150 g crus : riz complet, pâtes complètes, lentilles'
    },
    id: 'pot-starch',
    what: { en: 'Starch', fr: 'Féculent' }
  },
  {
    detail: {
      en: 'a tablespoon of olive oil',
      fr: 'une cuillère à soupe d’huile d’olive'
    },
    id: 'pot-fat',
    what: { en: 'Fat', fr: 'Gras' }
  }
]

export type Base = {
  readonly address: string
  readonly name: LocalizedText
  readonly detail: LocalizedText
}

/** Five that are ready in twenty minutes, because the session comes first. */
export const BASES: readonly Base[] = [
  {
    address: 'C-01',
    detail: {
      en: 'The staple, reheats perfectly',
      fr: 'Le fond de roulement, se réchauffe parfaitement'
    },
    name: {
      en: 'Chicken, brown rice, broccoli',
      fr: 'Poulet, riz complet, brocolis'
    }
  },
  {
    address: 'C-02',
    detail: {
      en: 'Better the next day than the same evening',
      fr: 'Meilleur le lendemain que le soir même'
    },
    name: {
      en: 'Kidney bean chili, lean beef',
      fr: 'Chili de haricots rouges, steak 5 %'
    }
  },
  {
    address: 'C-03',
    detail: {
      en: '20 min, almost nothing to watch',
      fr: '20 min, presque rien à surveiller'
    },
    name: {
      en: 'Red lentil dal, spinach, poached egg',
      fr: 'Dahl de lentilles corail, épinards, œuf poché'
    }
  },
  {
    address: 'C-04',
    detail: {
      en: 'No protein to cook',
      fr: 'Zéro cuisson de protéine'
    },
    name: {
      en: 'Tuna, chickpeas, peppers, lemon',
      fr: 'Poêlée thon, pois chiches, poivrons, citron'
    }
  },
  {
    address: 'C-05',
    detail: {
      en: 'The oven works alone while you shower',
      fr: 'Le four travaille seul pendant la douche'
    },
    name: {
      en: 'Baked salmon, sweet potato, green beans',
      fr: 'Saumon au four, patate douce, haricots verts'
    }
  }
]

export type MarketItem = {
  readonly id: string
  readonly label: LocalizedText
}

export type MarketAisle = {
  readonly id: string
  readonly name: LocalizedText
  readonly items: readonly MarketItem[]
}

/** The same every week — repetition is what makes it hold, not variety. */
export const MARKET: readonly MarketAisle[] = [
  {
    id: 'proteins',
    items: [
      { id: 'm-chicken', label: { en: 'Chicken', fr: 'Poulet' } },
      { id: 'm-eggs', label: { en: 'Eggs, a dozen', fr: 'Œufs, par 12' } },
      { id: 'm-tuna', label: { en: 'Canned tuna', fr: 'Thon en boîte' } },
      {
        id: 'm-mackerel',
        label: { en: 'Canned mackerel', fr: 'Maquereau en boîte' }
      },
      {
        id: 'm-quark',
        label: { en: 'Fat-free quark or skyr', fr: 'Fromage blanc 0 % ou skyr' }
      },
      {
        id: 'm-beef',
        label: { en: 'Lean minced beef', fr: 'Steak haché 5 %' }
      },
      { id: 'm-lentils', label: { en: 'Lentils', fr: 'Lentilles' } }
    ],
    name: { en: 'Proteins', fr: 'Protéines' }
  },
  {
    id: 'greens',
    items: [
      {
        id: 'm-broccoli',
        label: { en: 'Frozen broccoli', fr: 'Brocoli surgelé' }
      },
      {
        id: 'm-beans',
        label: { en: 'Frozen green beans', fr: 'Haricots verts surgelés' }
      },
      {
        id: 'm-spinach',
        label: { en: 'Frozen spinach', fr: 'Épinards surgelés' }
      },
      {
        id: 'm-mix',
        label: { en: 'Frozen stir-fry mix', fr: 'Poêlée surgelée' }
      },
      { id: 'm-carrots', label: { en: 'Carrots', fr: 'Carottes' } },
      { id: 'm-courgettes', label: { en: 'Courgettes', fr: 'Courgettes' } },
      { id: 'm-salad', label: { en: 'Salad', fr: 'Salade' } },
      { id: 'm-tomatoes', label: { en: 'Tomatoes', fr: 'Tomates' } },
      { id: 'm-onions', label: { en: 'Onions', fr: 'Oignons' } }
    ],
    name: { en: 'Vegetables', fr: 'Légumes' }
  },
  {
    id: 'starches',
    items: [
      { id: 'm-rice', label: { en: 'Brown rice', fr: 'Riz complet' } },
      {
        id: 'm-pasta',
        label: { en: 'Wholewheat pasta', fr: 'Pâtes complètes' }
      },
      { id: 'm-oats', label: { en: 'Rolled oats', fr: 'Flocons d’avoine' } },
      {
        id: 'm-sweet-potato',
        label: { en: 'Sweet potatoes', fr: 'Patates douces' }
      }
    ],
    name: { en: 'Starches', fr: 'Féculents' }
  },
  {
    id: 'fats',
    items: [
      { id: 'm-oil', label: { en: 'Olive oil', fr: 'Huile d’olive' } },
      { id: 'm-almonds', label: { en: 'Almonds', fr: 'Amandes' } },
      { id: 'm-avocado', label: { en: 'Avocados', fr: 'Avocats' } }
    ],
    name: { en: 'Fats', fr: 'Gras' }
  },
  {
    id: 'fruit',
    items: [
      { id: 'm-bananas', label: { en: 'Bananas', fr: 'Bananes' } },
      { id: 'm-apples', label: { en: 'Apples', fr: 'Pommes' } },
      {
        id: 'm-berries',
        label: { en: 'Frozen berries', fr: 'Fruits rouges surgelés' }
      }
    ],
    name: { en: 'Fruit', fr: 'Fruits' }
  },
  {
    id: 'drink',
    items: [
      {
        id: 'm-sparkling',
        label: { en: 'Sparkling water', fr: 'Eau pétillante' }
      },
      { id: 'm-coffee', label: { en: 'Coffee', fr: 'Café' } },
      { id: 'm-tea', label: { en: 'Tea', fr: 'Thé' } }
    ],
    name: { en: 'Drinks', fr: 'Boisson' }
  }
]

export const MARKET_COUNT = MARKET.reduce(
  (total, aisle) => total + aisle.items.length,
  0
)

export const MARKET_IDS: ReadonlySet<string> = new Set(
  MARKET.flatMap((aisle) => aisle.items.map((item) => item.id))
)
