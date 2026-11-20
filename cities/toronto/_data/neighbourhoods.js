// Toronto neighbourhood guide definitions (matches the designer's 4 supplied
// neighbourhood illustrations). Each renders a page at /neighbourhoods/{slug}/
// pairing editorial character with the real directory groups matching `aliases`.

module.exports = [
  {
    slug: "kensington",
    name: "Kensington",
    aliases: "kensington, kensington market, chinatown, baldwin, augusta, spadina",
    art: "kensington.svg",
    tagline: "Bohemian, walkable, and full of people organizing things.",
    metaDescription:
      "Things to do and people to meet in Kensington Market and Chinatown — community dinners, music, art nights, and more from Toronto's community directory.",
    intro:
      "Kensington Market is Toronto's community heart — a tangle of pedestrian streets and independent shops, sitting right beside Chinatown and its dim-sum-and-late-night energy.",
    character: [
      "If Toronto feels big and anonymous, Kensington is the antidote. It's the most joiner-friendly part of the city: diverse, a little chaotic, and full of people who organize things — potlucks, music nights, art crawls, language exchanges.",
      "Chinatown and the Spadina strip bring their own depth, with cultural associations and food-centred community that spans generations. The Market proper is dense enough that bumping into the same faces is the default, not the exception.",
      "The whole area rewards just walking in. It's the kind of place where a street festival becomes a friend group, and where 'come by the shop Saturday' is a standing invitation.",
    ],
  },
  {
    slug: "junction",
    name: "The Junction",
    aliases: "junction, the junction, junction triangle, west toronto, dundas west, roncesvalles",
    art: "junction.svg",
    tagline: "Old rail town turned indie main street — studios, bars, and neighbours.",
    metaDescription:
      "Things to do and people to meet in The Junction and Junction Triangle — maker spaces, run clubs, music, and community groups in west Toronto.",
    intro:
      "The Junction is a former rail town that grew into one of Toronto's most neighbourly main streets — a walkable strip of independent shops, studios, and bars, with the Junction Triangle and Roncesvalles close by.",
    character: [
      "It's a creative, slightly scruffy part of the west end, and that's the point: pottery studios, print shops, rehearsal rooms, and small venues that host the kind of nights where you end up talking to strangers.",
      "The Junction is also a run-and-ride neighbourhood — groups launch from the strip and head into the nearby ravine and waterfront trails. Roncesvalles adds a more established, family-friendly rhythm a few minutes east.",
      "It rewards regularity: a weekly class, a standing run, a bar trivia night. That's how a main street turns into your neighbourhood.",
    ],
  },
  {
    slug: "leslieville",
    name: "Leslieville",
    aliases: "leslieville, riverside, south riverdale, the beaches, beachers, queen east",
    art: "leslieville.svg",
    tagline: "Village streets, the lake, and a slower east-end rhythm.",
    metaDescription:
      "Things to do and people to meet in Leslieville and Riverside — community groups, clubs, cafes and meetups in Toronto's east end.",
    intro:
      "Leslieville is Toronto's village-in-the-city east end — a walkable stretch of cafes, boutiques, and Victorian streets, with the lake and the Beaches boardwalk a short walk south.",
    character: [
      "Life here leans village. Streets are quieter, the lake is close, and people actually know their neighbours — which makes recurring groups matter more, not less. A weekly club is how you keep seeing the same faces.",
      "Riverside and the Beaches bring the food-and-festival energy, and the boardwalk is a four-season community runway for runners, skaters, and swimmers.",
      "It's a little further from the core, but the trade is a sense of place. If you want a community that feels local, start in the east end.",
    ],
  },
  {
    slug: "high-park",
    name: "High Park",
    aliases: "high park, roncesvalles, parkdale, swansea, bloor west, west end",
    art: "high-park.svg",
    tagline: "The city's big green backyard, and the groups that meet in it.",
    metaDescription:
      "Things to do and people to meet in High Park, Parkdale and Bloor West — run clubs, nature groups, sports and meetups in west Toronto.",
    intro:
      "High Park is Toronto's biggest green space, and the neighbourhoods around it — Parkdale, Roncesvalles, Swansea, Bloor West — use it as a living room all year round.",
    character: [
      "The park is the anchor: trails, sports fields, a zoo, and a lakefront stretch that turns into an impromptu social scene the moment the weather cooperates. Run clubs, nature groups, and picnics all orbit it.",
      "Parkdale and Bloor West add the main-street energy — cafes, music, and a dense mix of people that makes meeting someone new unusually easy.",
      "If you like your community with fresh air attached, start here. Almost everything social in this corner of the city begins with a walk in the park.",
    ],
  },
];
