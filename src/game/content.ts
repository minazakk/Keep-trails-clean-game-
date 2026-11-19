import type { MissionDefinition, MissionId, QuizQuestion } from "./types";

export const MISSIONS: MissionDefinition[] = [
  {
    id: 1,
    title: "Clean the Trail",
    short: "Leave nothing behind.",
    description: "Find and collect litter from the hiking trail.",
    objective: "Tap every piece of rubbish on the trail and take it with you.",
    icon: "trash",
    accent: "#2f7d4f",
    badge: { id: "trail-cleaner", name: "Trail Cleaner", blurb: "Left the trail spotless." },
    takeaway: "Take your rubbish with you. Leave the trail as you found it.",
    maxPoints: 80,
  },
  {
    id: 2,
    title: "Sort the Waste",
    short: "Every item belongs in the right bin.",
    description: "Sort rubbish into the correct waste categories.",
    objective: "Choose an item, then send it to the correct bin.",
    icon: "recycle",
    accent: "#1f7a8c",
    badge: { id: "waste-sorting-hero", name: "Waste Sorting Hero", blurb: "Sorted every item correctly." },
    takeaway: "Sorting waste keeps recyclables out of landfills.",
    maxPoints: 80,
  },
  {
    id: 3,
    title: "Wildlife Guardian",
    short: "Respect wildlife. Protect their home.",
    description: "Learn how to observe animals safely without disturbing them.",
    objective: "Read each situation and choose the responsible action.",
    icon: "paw",
    accent: "#3f7d3a",
    badge: { id: "wildlife-protector", name: "Wildlife Protector", blurb: "Kept wild animals undisturbed." },
    takeaway: "Observe from a distance. Keep noise low. Never disturb nests or habitats.",
    maxPoints: 60,
  },
  {
    id: 4,
    title: "Don't Feed Animals",
    short: "Let wild animals find their natural food.",
    description: "Make responsible decisions when encountering wildlife.",
    objective: "Help the hiker make the right choice near a wild monkey.",
    icon: "noFeed",
    accent: "#b5651d",
    badge: { id: "wildlife-feeding-awareness", name: "Wildlife Feeding Awareness", blurb: "Never fed wildlife." },
    takeaway: "Admire wildlife. Never feed it. Let it stay wild.",
    maxPoints: 45,
  },
  {
    id: 5,
    title: "Hike Safe",
    short: "Stay found, stay safe, help others.",
    description: "Make safe choices on the trail: paths, water, signs and weather.",
    objective: "Pick the safe choice in every trail situation.",
    icon: "shield",
    accent: "#c2691c",
    badge: { id: "safety-champion", name: "Safety Champion", blurb: "Made safe choices on every trail." },
    takeaway: "Plan ahead, stay on the marked trail, and look out for other hikers.",
    maxPoints: 90,
  },
];

export const FINAL_BADGE = {
  id: "trail-guardian",
  name: "Trail Guardian",
  blurb: "Completed every mission and quiz.",
};

export function getMission(id: MissionId): MissionDefinition {
  const found = MISSIONS.find((m) => m.id === id);
  if (!found) throw new Error(`Unknown mission ${id}`);
  return found;
}

/* ------------------------------------------------------------------ */
/* Mission 1 — litter placed on the illustrated trail (%)              */
/* ------------------------------------------------------------------ */

export interface LitterItem {
  id: string;
  kind: "bottle" | "can" | "wrapper" | "packet" | "paper" | "cup";
  label: string;
  x: number;
  y: number;
  size: number;
  tilt: number;
}

export const LITTER: LitterItem[] = [
  { id: "l1", kind: "bottle", label: "Plastic bottle", x: 14, y: 74, size: 54, tilt: -18 },
  { id: "l2", kind: "can", label: "Empty can", x: 33, y: 63, size: 46, tilt: 12 },
  { id: "l3", kind: "wrapper", label: "Paper wrapper", x: 52, y: 78, size: 48, tilt: -8 },
  { id: "l4", kind: "packet", label: "Food packaging", x: 71, y: 66, size: 50, tilt: 20 },
  { id: "l5", kind: "paper", label: "Crumpled paper", x: 87, y: 79, size: 46, tilt: -14 },
  { id: "l6", kind: "bottle", label: "Plastic bottle", x: 63, y: 47, size: 44, tilt: 24 },
  { id: "l7", kind: "cup", label: "Disposable cup", x: 41, y: 44, size: 44, tilt: -22 },
  { id: "l8", kind: "can", label: "Drink can", x: 22, y: 41, size: 42, tilt: 6 },
];

export const COLLECT_MESSAGES = [
  "Nice pick-up!",
  "Trail looks better already.",
  "Wildlife says thank you!",
  "One less hazard on the path.",
  "Great job, guardian!",
  "Cleaner trail, happier hikers.",
  "That belongs in a bin, not on the trail.",
  "Perfect — you found them all!",
];

/* ------------------------------------------------------------------ */
/* Mission 2 — waste sorting                                           */
/* ------------------------------------------------------------------ */

export type BinId = "recycle" | "paper" | "organic" | "general";

export interface BinDefinition {
  id: BinId;
  name: string;
  hint: string;
  color: string;
  ring: string;
}

export const BINS: BinDefinition[] = [
  { id: "recycle", name: "Recyclables", hint: "Clean plastic & metal", color: "#1f7a8c", ring: "#a8ddec" },
  { id: "paper", name: "Paper & Card", hint: "Dry paper products", color: "#2f7d4f", ring: "#a9dfbd" },
  { id: "organic", name: "Organic", hint: "Food & garden waste", color: "#7a5b2e", ring: "#e2cfa8" },
  { id: "general", name: "General Waste", hint: "Everything else", color: "#5b6470", ring: "#ccd2da" },
];

export interface WasteItem {
  id: string;
  label: string;
  art: "bottle" | "can" | "newspaper" | "banana" | "tissue" | "box" | "leftovers" | "chipbag";
  bin: BinId;
  note: string;
}

export const WASTE_ITEMS: WasteItem[] = [
  {
    id: "w1",
    label: "Empty plastic bottle",
    art: "bottle",
    bin: "recycle",
    note: "Rinse it, cap off where required, and place it in recyclables.",
  },
  {
    id: "w2",
    label: "Old newspaper",
    art: "newspaper",
    bin: "paper",
    note: "Dry, clean paper can be recycled with paper and cardboard.",
  },
  {
    id: "w3",
    label: "Banana peel",
    art: "banana",
    bin: "organic",
    note: "Food scraps break down into compost in the organic bin.",
  },
  {
    id: "w4",
    label: "Used tissue",
    art: "tissue",
    bin: "general",
    note: "Tissues cannot be recycled once used — they go to general waste.",
  },
  {
    id: "w5",
    label: "Aluminium drink can",
    art: "can",
    bin: "recycle",
    note: "Metal cans are recycled forever. Empty them first.",
  },
  {
    id: "w6",
    label: "Cardboard box",
    art: "box",
    bin: "paper",
    note: "Flatten dry cardboard so it can be recycled as paper.",
  },
  {
    id: "w7",
    label: "Leftover food",
    art: "leftovers",
    bin: "organic",
    note: "Leftover food belongs in the organic bin, not the compost-free one.",
  },
  {
    id: "w8",
    label: "Crisp packet",
    art: "chipbag",
    bin: "general",
    note: "Multi-layer foil packets are not accepted in most kerbside recycling.",
  },
];

export const SORT_RULE_NOTE =
  "Recycling rules can differ between cities and facilities. Always check the local guidance on the bin.";

/* ------------------------------------------------------------------ */
/* Mission 3 — wildlife guardian situations                            */
/* ------------------------------------------------------------------ */

export interface DecisionOption {
  text: string;
  responsible: boolean;
  feedback: string;
}

export interface WildlifeScenario {
  id: string;
  scene: "monkey" | "nest" | "deer" | "hikers";
  title: string;
  situation: string;
  options: DecisionOption[];
}

export const WILDLIFE_SCENARIOS: WildlifeScenario[] = [
  {
    id: "s1",
    scene: "monkey",
    title: "Monkey beside the trail",
    situation: "A langur monkey is sitting right next to the path, watching hikers pass by.",
    options: [
      {
        text: "Walk past quietly at a safe distance",
        responsible: true,
        feedback:
          "Correct. Giving the animal space keeps both of you calm and safe. Quiet hikers let wildlife carry on with their day.",
      },
      {
        text: "Call it over for a closer photo",
        responsible: false,
        feedback:
          "Calling an animal closer changes its natural behaviour and can make it bold around people. Keep your distance instead.",
      },
      {
        text: "Offer it part of your lunch",
        responsible: false,
        feedback:
          "Human food makes animals sick and dependent on people. Wildlife must find its own natural food.",
      },
    ],
  },
  {
    id: "s2",
    scene: "nest",
    title: "Bird nesting in a tree",
    situation: "You spot a small bird's nest with chicks, low in a tree beside the path.",
    options: [
      {
        text: "Step back, keep quiet and move on",
        responsible: true,
        feedback:
          "Correct. Nests are homes. Keeping noise low and staying away means the parents keep feeding their chicks.",
      },
      {
        text: "Look inside the nest for a closer look",
        responsible: false,
        feedback:
          "Disturbing a nest can cause parents to abandon their young. Never touch or crowd a nest.",
      },
      {
        text: "Take a branch away as a souvenir",
        responsible: false,
        feedback:
          "Removing parts of a habitat damages the animal's home. Leave every branch, leaf and stone where it belongs.",
      },
    ],
  },
  {
    id: "s3",
    scene: "deer",
    title: "Deer in the distance",
    situation: "A deer is grazing in a clearing, about eighty metres from the trail.",
    options: [
      {
        text: "Watch quietly from the trail",
        responsible: true,
        feedback:
          "Correct. Binoculars or a quiet gaze from far away is the kindest way to enjoy wild animals.",
      },
      {
        text: "Run towards it to get a selfie",
        responsible: false,
        feedback:
          "Chasing or rushing an animal causes stress and can be dangerous for you too. Stay where you are.",
      },
      {
        text: "Clap and shout so others can see it",
        responsible: false,
        feedback:
          "Loud noise scares wildlife away from feeding and resting areas. Keep your voice low on the trail.",
      },
    ],
  },
  {
    id: "s4",
    scene: "hikers",
    title: "Hikers approaching an animal",
    situation: "A group of hikers is walking straight towards a resting animal on the path.",
    options: [
      {
        text: "Ask them to stop and give the animal space",
        responsible: true,
        feedback:
          "Correct. Helping others understand trail etiquette protects animals and keeps everyone safe.",
      },
      {
        text: "Join them for a group photo",
        responsible: false,
        feedback:
          "Crowding an animal traps it and raises stress. A crowd is never safe for wildlife.",
      },
      {
        text: "Throw a stone to move it along",
        responsible: false,
        feedback:
          "Never harass wildlife. Follow official park guidance and let the animal move on its own.",
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Mission 4 — don't feed animals                                      */
/* ------------------------------------------------------------------ */

export interface FeedScenario {
  id: string;
  title: string;
  situation: string;
  options: DecisionOption[];
  lesson: string;
}

export const FEED_SCENARIOS: FeedScenario[] = [
  {
    id: "f1",
    title: "A monkey beside your lunch stop",
    situation: "You are eating a snack when a monkey sits down a few steps away and watches you.",
    options: [
      {
        text: "A. Offer the monkey a snack",
        responsible: false,
        feedback:
          "Not a good choice. Feeding teaches monkeys to beg from people, and human food can make them seriously ill.",
      },
      {
        text: "B. Move closer and try to touch it",
        responsible: false,
        feedback:
          "Risky and unkind. Wild animals can bite or carry disease, and touching them removes their fear of people.",
      },
      {
        text: "C. Keep your distance, secure your food and rubbish, and leave it undisturbed",
        responsible: true,
        feedback:
          "Excellent. The monkey looks for its own natural food, and your snack stays where it belongs — with you.",
      },
    ],
    lesson:
      "Feeding wildlife makes animals dependent on people, exposes them to unsuitable food and illness, changes their natural behaviour, and increases conflict between humans and animals.",
  },
  {
    id: "f2",
    title: "Other hikers are feeding the troop",
    situation: "A family is tossing chips to a group of monkeys right beside the trail.",
    options: [
      {
        text: "A. Join in so the monkeys come closer",
        responsible: false,
        feedback:
          "Adding to the problem only makes the monkeys bolder. Feeding is never the right answer.",
      },
      {
        text: "B. Keep walking and ignore it",
        responsible: false,
        feedback:
          "Staying quiet is safe, but a friendly reminder helps the whole trail. Feeding wildlife is against park rules.",
      },
      {
        text: "C. Politely remind them that feeding wildlife is harmful and not allowed",
        responsible: true,
        feedback:
          "Great work. Speaking up protects the animals and helps other visitors learn the same lesson.",
      },
    ],
    lesson:
      "Animals that are fed stop foraging naturally and start approaching people, which often ends with the animal being removed or hurt.",
  },
  {
    id: "f3",
    title: "Finish your break",
    situation: "Your break is over and a monkey is still nearby, watching your bag.",
    options: [
      {
        text: "A. Leave a few crumbs so it has something to eat",
        responsible: false,
        feedback:
          "Crumbs are junk food for wildlife. Leaving food behind trains animals to raid hikers' bags.",
      },
      {
        text: "B. Pack all food and rubbish away securely, then move on quietly",
        responsible: true,
        feedback:
          "Perfect. Secured food means the monkey keeps searching for its natural diet and stays wild.",
      },
      {
        text: "C. Share the last of your food to be friendly",
        responsible: false,
        feedback:
          "Kindness to people is great, but kindness to wildlife means not feeding it.",
      },
    ],
    lesson:
      "Never leave food or rubbish behind. A fed monkey becomes a bold monkey, and bold monkeys often get into conflict with visitors.",
  },
];

/* ------------------------------------------------------------------ */
/* Mission 5 — hike safe                                               */
/* ------------------------------------------------------------------ */

export interface SafetyScenario {
  id: string;
  title: string;
  situation: string;
  clue: "trail" | "water" | "sign" | "shortcut" | "weather" | "hiker";
  options: DecisionOption[];
}

export const SAFETY_SCENARIOS: SafetyScenario[] = [
  {
    id: "h1",
    title: "The path splits",
    situation: "Two routes diverge. One is a wide marked trail, the other a faint desire path into the trees.",
    clue: "trail",
    options: [
      {
        text: "Stay on the marked trail",
        responsible: true,
        feedback: "Correct. Marked paths are checked for safety and protect fragile habitat around them.",
      },
      {
        text: "Take the faint path — it looks shorter",
        responsible: false,
        feedback:
          "Unmarked shortcuts hide rocks, roots and drop-offs, and they damage plants. Always follow the markers.",
      },
    ],
  },
  {
    id: "h2",
    title: "Before you set off",
    situation: "You are at the trailhead on a warm morning. What do you make sure you have?",
    clue: "water",
    options: [
      {
        text: "Drinking water, a snack, sun protection and a charged phone",
        responsible: true,
        feedback: "Correct. Water and a simple plan prevent most trail emergencies.",
      },
      {
        text: "Nothing — I'll be fine",
        responsible: false,
        feedback: "Even short trails need water. Dehydration sneaks up quickly in heat and on climbs.",
      },
      {
        text: "Only my headphones",
        responsible: false,
        feedback:
          "Music can mask warnings like falling rocks, traffic or other hikers asking you to move. Keep ears open.",
      },
    ],
  },
  {
    id: "h3",
    title: "A warning sign",
    situation: "A sign reads: 'Trail closed ahead — rockfall risk'. A quiet path continues past it.",
    clue: "sign",
    options: [
      {
        text: "Turn back and choose another route",
        responsible: true,
        feedback: "Correct. Closures exist because the risk is real. Rangers do not close trails without reason.",
      },
      {
        text: "Ignore it — rockfall rarely happens",
        responsible: false,
        feedback:
          "Rockfall is sudden and unpredictable. Ignoring a closure puts you and any rescuers at risk.",
      },
      {
        text: "Climb around the sign quickly",
        responsible: false,
        feedback: "Climbing past a closure is dangerous and may break park rules. Turn back instead.",
      },
    ],
  },
  {
    id: "h4",
    title: "The steep shortcut",
    situation: "A steep, loose slope would save you twenty minutes on the way down.",
    clue: "shortcut",
    options: [
      {
        text: "Keep to the switchbacks",
        responsible: true,
        feedback: "Correct. The longer way down protects your knees and stops soil erosion on the slope.",
      },
      {
        text: "Slide down the loose ground",
        responsible: false,
        feedback: "Slipping on loose scree is a classic trail injury — and it scars the hillside for years.",
      },
    ],
  },
  {
    id: "h5",
    title: "Weather turning",
    situation: "Dark clouds are building and you can hear distant thunder on the ridge.",
    clue: "weather",
    options: [
      {
        text: "Leave the ridge and head down to shelter",
        responsible: true,
        feedback: "Correct. Ridgelines are the most dangerous place in a storm. Go down and wait it out.",
      },
      {
        text: "Keep going — the summit is close",
        responsible: false,
        feedback: "No view is worth a lightning strike. Turn back when weather changes.",
      },
      {
        text: "Stand under the tallest tree",
        responsible: false,
        feedback: "Tall isolated trees attract lightning. Find proper shelter at a lower level instead.",
      },
    ],
  },
  {
    id: "h6",
    title: "A hiker is hurt",
    situation: "You meet a hiker with a twisted ankle and no phone signal.",
    clue: "hiker",
    options: [
      {
        text: "Stay with them and send someone on the trail to get help",
        responsible: true,
        feedback:
          "Correct. Keeping them still, warm and accompanied while you fetch trained help is the right move.",
      },
      {
        text: "Leave them and continue your hike",
        responsible: false,
        feedback: "Never leave an injured person alone. Getting help quickly is part of hiking responsibly.",
      },
      {
        text: "Ask them to walk it off downhill",
        responsible: false,
        feedback: "Walking on a suspected fracture or sprain can make the injury much worse. Keep them still.",
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Quizzes — exactly three questions each                              */
/* ------------------------------------------------------------------ */

export const QUIZZES: Record<MissionId, QuizQuestion[]> = {
  1: [
    {
      prompt: "You see a plastic bottle on a hiking trail. What should you do?",
      image: "bottle",
      options: [
        "Leave it there for the cleaners.",
        "Kick it off the path into the bushes.",
        "Pick it up safely and carry it to an appropriate bin, if it is safe to do so.",
        "Hide it under a rock.",
      ],
      correct: 2,
      explanation:
        "If it is safe, carrying litter out keeps it out of streams and away from animals. Take it to the right bin.",
    },
    {
      prompt: "Why should you take your rubbish home from a trail?",
      options: [
        "To keep the trail clean and protect wildlife.",
        "Because bins are always full.",
        "To make your backpack heavier.",
        "It does not make any difference.",
      ],
      correct: 0,
      explanation:
        "Rubbish can poison animals, hurt their feet and wash into waterways. Leaving nothing behind protects the whole habitat.",
    },
    {
      prompt: "Where should food wrappers go after your picnic?",
      options: [
        "Buried under leaves.",
        "In your pack until you find a bin.",
        "Thrown into the stream.",
        "Left beside the bench.",
      ],
      correct: 1,
      explanation:
        "Pack it out. If no bin is nearby, keep it in your bag until you reach one.",
    },
  ],
  2: [
    {
      prompt: "An empty plastic bottle has been rinsed out. Which bin?",
      image: "bin",
      options: ["Organic", "Recyclables", "General waste", "Beside the trail"],
      correct: 1,
      explanation:
        "Clean plastic bottles are recyclable. Rinsing keeps the whole load from being rejected.",
    },
    {
      prompt: "A banana peel from your lunch — where does it belong?",
      options: ["Organic waste", "Recyclables", "Paper", "Leave it on the trail"],
      correct: 0,
      explanation:
        "Food scraps are organic waste and can be composted. Even though it is natural, dropping it on the trail is still littering.",
    },
    {
      prompt: "Why do recycling rules sometimes change between cities?",
      options: [
        "Because recycling does not really work.",
        "Because each recycling facility accepts different materials.",
        "To make the game harder.",
        "Because paper is no longer recyclable.",
      ],
      correct: 1,
      explanation:
        "Different facilities process different materials, so always check the local guidance printed on the bin.",
    },
  ],
  3: [
    {
      prompt: "You see a wild animal near the trail. What is the best response?",
      image: "deer",
      options: [
        "Move closer for a selfie.",
        "Feed it so it stays calm.",
        "Chase it away from the path.",
        "Keep a safe distance and avoid disturbing it.",
      ],
      correct: 3,
      explanation:
        "Distance is kindness. Watching quietly lets the animal behave naturally and keeps you safe too.",
    },
    {
      prompt: "What should you do if you find a bird's nest?",
      options: [
        "Look inside for eggs.",
        "Take a photo from far away and move on quietly.",
        "Move it to a safer branch.",
        "Call your friends over to see it.",
      ],
      correct: 1,
      explanation:
        "Nests are homes. Observing from far away without noise means the parents keep caring for their chicks.",
    },
    {
      prompt: "Which behaviour keeps wildlife comfortable?",
      options: [
        "Loud music on the trail.",
        "Offering snacks to animals.",
        "Keeping noise low and following park instructions.",
        "Cornering an animal for a better view.",
      ],
      correct: 2,
      explanation:
        "Low noise and official guidance keep animals unstressed and their habitats intact.",
    },
  ],
  4: [
    {
      prompt: "Why should you avoid feeding wild monkeys?",
      options: [
        "It can affect their health and natural behaviour.",
        "It makes the trail look too green.",
        "It helps them become pets.",
        "It prevents them from finding their natural food.",
      ],
      correct: 0,
        explanation:
        "Human food is unsuitable and can make animals ill, while also changing how they behave around people. The other options are not the main reason.",
    },
    {
      prompt: "A monkey reaches for your bag. What is the safest action?",
      options: [
        "Share a snack to distract it.",
        "Hold your bag close, keep your distance and move away calmly.",
        "Push it away.",
        "Call it closer to take a photo.",
      ],
      correct: 1,
      explanation:
        "Stay calm, secure your food and give the animal space. Feeding or touching only teaches it to approach the next visitor.",
    },
    {
      prompt: "What usually happens to animals that are regularly fed?",
      options: [
        "They become healthier.",
        "They keep away from people.",
        "They depend on people and may get sick or conflict with visitors.",
        "They learn to hunt better.",
      ],
      correct: 2,
      explanation:
        "Fed animals stop foraging naturally, rely on humans, and often end up in dangerous conflict with people.",
    },
  ],
  5: [
    {
      prompt: "A warning sign says the trail is closed ahead. What do you do?",
      image: "sign",
      options: ["Walk past it quickly.", "Turn back and pick another route.", "Wait for someone else to go first.", "Remove the sign."],
      correct: 1,
      explanation:
        "Closures are posted for real dangers such as rockfall or flooding. Turning back keeps you and rescuers safe.",
    },
    {
      prompt: "What should you carry on a warm day hike?",
      image: "water",
      options: ["Drinking water and sun protection.", "Only your camera.", "Nothing at all.", "Just extra weight to train."],
      correct: 0,
      explanation:
        "Water, sun protection and a charged phone prevent most small problems from becoming real emergencies.",
    },
    {
      prompt: "A hiker is injured and you have no signal. What is best?",
      options: [
        "Leave them to find help yourself.",
        "Stay with them and send someone on the trail to get help.",
        "Ask them to walk downhill immediately.",
        "Take a photo and continue.",
      ],
      correct: 1,
      explanation:
        "Keep the person still, warm and accompanied, and get trained help to them as quickly as possible.",
    },
  ],
};

export const QUIZ_PASS_MARK = 2;
export const QUIZ_POINTS_PER_ANSWER = 10;
