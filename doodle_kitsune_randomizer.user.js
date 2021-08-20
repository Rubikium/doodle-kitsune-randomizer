// ==UserScript==
// @name         DoodleKitsune Randomizer
// @version      0.1.0
// @description  Entrance Randomizer for Doodle Champion Island Games
// @author       Rubikium
// @include      https://www.google.com/doodles/doodle-champion-island-games*
// @include      http*://*/*/kitsune/rc4/kitsune20.html
// @include      http*://*/*/kitsune/rc5/kitsune20.html
// @include      http*://*/*/kitsune/rc6/kitsune20.html
// @include      *://127.0.0.1*/logos/run.html
// @grant        unsafeWindow
// ==/UserScript==


// Math.imul polyfill from MDN Web Docs
if (!Math.imul)
  Math.imul = function(opA, opB) {
    opB |= 0;
    let result = (opA & 0x003fffff) * opB;
    if (opA & 0xffc00000) result += ((opA & 0xffc00000) * opB) | 0;
    return result | 0;
  };

let RNG = function(seed) {
  if (typeof seed === "number") {
    this.seed = seed >>> 0;
  } else if (typeof seed === "string" && seed !== "") {
    // String hash algorithm from https://github.com/darkskyapp/string-hash
    let hash = 5381;
    let i = seed.length;
    while (i) {
      hash = (hash * 33) ^ seed.charCodeAt(--i);
    }
    this.seed = hash >>> 0;
  } else {
    this.seed = (Math.random() * Math.pow(2, 32)) >>> 0;
  }
  this.state = this.seed;
};

// Inspired by https://blog.demofox.org/2013/07/07/a-super-tiny-random-number-generator/
RNG.prototype.bit = function() {
  let s = this.state;
  this.state += Math.imul(s, s) | 5;
  return this.state >>> 31;
};

RNG.prototype.uInt32 = function() {
  let result = 0;
  for (let i = 0; i < 32; ++i) {
    if (this.bit()) result += Math.pow(2, i);
  }
  return result;
};

RNG.prototype.random = function() {
  let result = 0;
  for (let i = 0; i < 53; ++i) {
    if (this.bit()) result += Math.pow(2, i);
  }
  return result / Math.pow(2, 53);
};

RNG.prototype.randomBetween = function(a, b) {
  return a + this.random() * (b - a);
};

// Random integer between zero and max, inclusive
RNG.prototype.uIntUnder = function(max) {
  if (max < 0) {
    throw new RangeError("Expected input to be non-negative");
  }
  let result;
  let multiplier;
  do {
    result = 0;
    multiplier = 1;

    while (multiplier <= max) {
      result += this.bit() * multiplier;
      multiplier *= 2;
    }
  } while (result > max);
  return result;
};

RNG.prototype.intBetween = function(a, b) {
  return a + this.uIntUnder(b - a);
};

RNG.prototype.shuffle = function(arr) {
  // Fisher–Yates shuffle
  let i = arr.length;
  while (i) {
    let index = this.intBetween(0, --i);
    let temp = arr[i];
    arr[i] = arr[index];
    arr[index] = temp;
  }
  return arr;
};

// -----------------------------------------------------------------------------------------------

let OVERWORLD = 1; // Connected to overworld
let ISOLATED = 2; // Connected to isolated spot in overworld
let CONNECTION = 4; // Connected to room with multiple doors
let INTERIOR = 8; // Connected to room with single door

let HOUSE = OVERWORLD | INTERIOR;
let ENTRY = OVERWORLD | CONNECTION;
let EXIT = CONNECTION | ISOLATED;
let MAIN = CONNECTION | INTERIOR;

let archeryDojoEntrances = [
  [
    "interior:archerydojohallway@archerydojohallways",
    "overworld@archerydojo",
    ENTRY
  ],
  [
    "interior:archeryDojoMainRoom@archerydojomainroomn",
    "overworld@archerydojobalcony",
    EXIT
  ]
];
let otohimeCastleEntrances = [
  ["interior:otohimeCastle@otohimeFront", "overworld@otohimeFront", ENTRY],
  ["interior:otohimeCastle@otohimeBack", "overworld@otohimeBack", EXIT]
];
let banyantreeEntrances = [
  ["interior:banyantree@banyantree1", "overworld@banyantree1", ENTRY],
  ["interior:banyantree@banyantree2", "overworld@banyantree2", EXIT]
];
let connectorCaveEntrances = [
  ["interior:cave1@cave1a", "overworld@cave1a", ENTRY],
  ["interior:cave1@cave1b", "overworld@cave1b", EXIT],
  ["interior:cave1@cave1c", "overworld@cave1c", EXIT]
];

let multiRoomEntrances = [
  [
    "interior:skatedojohallway@skatedojohallways",
    "overworld@skatedojo",
    ENTRY
  ],
  [
    "interior:climbingdojohallway@climbingdojohallways",
    "overworld@climbingdojo",
    ENTRY
  ],
  [
    "interior:pingpongdojohallway@pingpongdojohallways",
    "overworld@pingpongdojo",
    ENTRY
  ],
  [
    "interior:rugbydojohallway@rugbydojohallways",
    "overworld@rugbydojo",
    ENTRY
  ],
  ["interior:redteamhq1@redteamhq1s", "overworld@redteamhq", ENTRY],
  ["interior:yellowteamhq1@yellowteamhq1s", "overworld@yellowteamhq", ENTRY],
  ["interior:greenteamhq1@greenteamhq1s", "overworld@greenteamhq", ENTRY],
  ["interior:blueteamhq1@blueteamhq1s", "overworld@blueteamhq", ENTRY]
];
let archeryEntrances = [
  ["interior:porcupineHouse", "overworld@porcupineHouse", HOUSE],
  ["interior:boatHouse1", "overworld@boat3", HOUSE],
  ["interior:boatHouse2", "overworld@boat2", HOUSE],
  ["interior:whirlpoolBoat", "overworld@boat1", HOUSE],
  ["interior:arrowshop", "overworld@arrowshop", HOUSE]
];
let swimEntrances = [
  ["interior:ghostGazebo", "overworld@ghostGazebo", HOUSE],
  ["interior:gazebo", "overworld@gazebo1", HOUSE]
];
let skateEastEntrances = [
  ["interior:sister3house", "overworld@sister3house", HOUSE],
  ["interior:convenienceStore1", "overworld@conveniencestore", HOUSE],
  ["interior:bookstore", "overworld@noodleShop", HOUSE],
  ["interior:noodleShop", "overworld@bookstore", HOUSE],
  ["interior:lostbookhouse", "overworld@lostBookHouse", HOUSE],
  ["interior:trainStation", "overworld@trainStation", HOUSE],
];
let skateWestEntrances = [
  ["interior:bakery", "overworld@bakery", HOUSE],
  ["interior:gym", "overworld@gym", HOUSE],
  ["interior:arcade", "overworld@arcade", HOUSE]
];
let skateEntrances = [...skateEastEntrances, ...skateWestEntrances];
let climbingEntrances = [
  ["interior:gohouse", "overworld@climbinggym", HOUSE],
  ["interior:climbingGym", "overworld@gondola", HOUSE],
  ["interior:momotarohouse", "overworld@momotarohouse", HOUSE]
];
let pingpongEntrances = [
  ["interior:abandonedHouse1", "overworld@pingponghouse1", HOUSE],
  ["interior:abandonedHouse2", "overworld@pingponghouse3", HOUSE]
];
let rugbyEntrances = [
  ["interior:locksmith", "overworld@locksmith", HOUSE],
  ["interior:oniBakerHouse", "overworld@onibaker", HOUSE]
];
let marathonEntrances = [
  ["interior:woodshop", "overworld@driftwoodartist", HOUSE],
  ["interior:sister1house", "overworld@sister1house", HOUSE]
];
let hubEntrances = [
  ["interior:trophyRoom", "overworld@trophy", HOUSE],
  ["interior:koma2House", "overworld@koma1", HOUSE],
  ["interior:koma1House", "overworld@koma2", HOUSE]
];

let interiorConnections = [
  [
    "interior:archeryDojoMainRoom@archerydojomainrooms",
    "interior:archerydojohallway@archerydojohallwayn",
    MAIN
  ],
  [
    "interior:skatedojomainroom",
    "interior:skatedojohallway@skatedojohallwayn",
    MAIN
  ],
  [
    "interior:climbingdojomainroom",
    "interior:climbingdojohallway@climbingdojohallwayn",
    MAIN
  ],
  [
    "interior:tabletennisdojo",
    "interior:pingpongdojohallway@pingpongdojohallwayn",
    MAIN
  ],
  [
    "interior:rugbydojomainroom",
    "interior:rugbydojohallway@rugbydojohallwayn",
    MAIN
  ],
  [
    "interior:redteamhq2@redteamhq2s",
    "interior:redteamhq1@redteamhq1n",
    CONNECTION
  ],
  [
    "interior:redteamhq3@redteamhq3s",
    "interior:redteamhq2@redteamhq2n",
    MAIN
  ],
  [
    "interior:yellowteamhq2@yellowteamhq2s",
    "interior:yellowteamhq1@yellowteamhq1n",
    CONNECTION
  ],
  [
    "interior:yellowteamhq3@yellowteamhq3s",
    "interior:yellowteamhq2@yellowteamhq2n",
    MAIN
  ],
  [
    "interior:greenteamhq2@greenteamhq2s",
    "interior:greenteamhq1@greenteamhq1n",
    CONNECTION
  ],
  [
    "interior:greenteamhq3@greenteamhq3s",
    "interior:greenteamhq2@greenteamhq2n",
    MAIN
  ],
  [
    "interior:blueteamhq2@blueteamhq2s",
    "interior:blueteamhq1@blueteamhq1n",
    CONNECTION
  ],
  [
    "interior:blueteamhq3@blueteamhq3s",
    "interior:blueteamhq2@blueteamhq2n",
    MAIN
  ]
];

let connectorList = [
  archeryDojoEntrances,
  otohimeCastleEntrances,
  banyantreeEntrances,
  connectorCaveEntrances
];
let connectorEntrances = connectorList.flat();

let overworldEntranceList = [
  multiRoomEntrances,
  archeryEntrances,
  swimEntrances,
  skateEntrances,
  climbingEntrances,
  pingpongEntrances,
  rugbyEntrances,
  marathonEntrances,
  hubEntrances
];
let overworldEntrances = overworldEntranceList.flat();

let overworldConnections = [...connectorEntrances, ...overworldEntrances];

let defaultConnections = [...overworldConnections, ...interiorConnections];

// -----------------------------------------------------------------------------------------------

function shuffleOverworldConnections(rng, flags) {
  let deadEndConnections = [];
  let otherEntrances = [...overworldEntrances];

  for (let connector of connectorList) {
    if (connector === banyantreeEntrances) {
      // Prevent banyantree2 from connecting to the overworld
      otherEntrances.push(connector[0]);
      deadEndConnections.push(connector[1]);
    } else {
      // Select which exits from interior lead to isolated spots
      let deadEndCount = connector.filter(x => x[2] & ISOLATED).length;
      let shuffledConnector = rng.shuffle([...connector]);
      if (deadEndCount !== 0) {
        deadEndConnections.push(...shuffledConnector.slice(0, deadEndCount));
      }
      if (deadEndCount !== connector.length) {
        otherEntrances.push(
          ...shuffledConnector.slice(deadEndCount, connector.length)
        );
      }
    }
  }

  let shuffledEntrances = rng.shuffle([...otherEntrances]);
  let shuffleddeadEndConnections = rng.shuffle([...deadEndConnections]);

  // Select where each overworld entrance leads to
  let result = [];
  for (let i = 0; i < connectorEntrances.length; ++i) {
    if (connectorEntrances[i][2] & ISOLATED) {
      result.push(shuffleddeadEndConnections.pop());
    } else {
      result.push(shuffledEntrances.pop());
    }
  }
  return [...result, ...shuffledEntrances];
}

function shuffleInteriorConnections(rng, flags) {
  return interiorConnections;
  /* return rng.shuffle([...interiorConnections]); */
}

function shuffleConnections(rng, flags) {
  return [
    ...shuffleOverworldConnections(rng),
    ...shuffleInteriorConnections(rng)
  ];
}

function generateMapping(originList, shuffledList) {
  let M = new Map();
  for (let i = 0; i < originList.length; ++i) {
    M.set(originList[i][0], shuffledList[i][0]);
    M.set(shuffledList[i][1], originList[i][1]);
  }
  return M;
}

// -----------------------------------------------------------------------------------------------

let forbiddenConnections = [];
// Prevent Whirlpool Boat being inaccessible while doing Trophy Master quest
forbiddenConnections.push(["interior:trophyRoom", "interior:whirlpoolBoat"]);
// Prevent Arrow Shop being inaccessible before finishing Hot Spring quest
forbiddenConnections.push(["interior:blueteamhq1@blueteamhq1s", "interior:arrowshop"])
for (let item of skateWestEntrances) {
  forbiddenConnections.push([item[0], "interior:arrowshop"])
}

function isSeedCompletable() {
  for (let item of forbiddenConnections) {
    if (W.shuffledMapping.get(item[0]) === item[1]) {
      console.log(`Found forbidden connection: ${item}\nReroll seed...`);
      return false;
    }
  }
  return true;
}

// -----------------------------------------------------------------------------------------------

function getGameWindow() {
  // Global object, have access to global variables
  let W = unsafeWindow ? unsafeWindow : window;
  if (W.length) {
    for (let i = 0; i < unsafeWindow.length; ++i) {
      try {
        console.debug(unsafeWindow[i].location); // May throw DOMException
        W = unsafeWindow[i];
        break;
      } catch (e) {
        // Sub-window don't have same origin, ignore
        if (e instanceof DOMException) continue;
        console.error(e);
        continue;
      }
    }
  }
  return W;
}

function isBase10Int(n) {
  return parseInt(n, 10).toString(10) === n;
}

function isBase16Int(n) {
  n = n.toLowerCase();
  return "0x" + parseInt(n, 16).toString(16) === n;
}

function initializeRng(seed) {
  let rng = new RNG(seed);
  W.rngSeed = rng.seed;
  return rng;
}

function modifyTData(g) {
  let t = g.T;
  let modified = false;

  if (t.scenePortal || t.sceneTrigger) {
    // Transition
    if (t.sceneTrigger && t.sceneTrigger.name === "interior:whirlpoolBoat") {
      // Transition from momo's room to inside whirlpool boat should stay fixed
      // The other transition with the same label is a scenePortal
      return g;
    } else {
      let scene = t.scenePortal || t.sceneTrigger;
      if (W.shuffledMapping.has(scene.name)) {
        scene.name = W.shuffledMapping.get(scene.name);
      }
      scene.modified = modified = true;
    }
  }
  if (t.storageSprite) {
    // Sprite based on conditions
    if (
      t.storageSprite.condition1 === "$PORCUPINE == 'complete'" &&
      t.storageSprite.frame1 === "locked"
    ) {
      // Prevent porcupine boat door no longer accessible after completing porcupine quest
      t.storageSprite.condition1 = "false";
    }
    t.storageSprite.modified = modified = true;
  }
  if (t.storageNpc) {
    // NPC based on conditions
    if (t.storageNpc.condition1 == "$PLAYER_TEAM == null") {
      // Make team changing possible at any time
      t.storageNpc.condition1 = "true";
    } else if (t.storageNpc.condition2 === "$PORCUPINE == 'delivered'") {
      // Prevent porcupine from initiating quest again after completion
      t.storageNpc.condition2 =
          "($PORCUPINE == 'delivered') || ($PORCUPINE == 'complete')";
    }
    t.storageNpc.modified = modified = true;
  }
  if (modified) {
    g.ec = null; // Reset cached properties
  }
  return g;
}

function modifyMjFunction() {
  if (!W.Mj) {
    // Nothing to modify yet
    return false;
  }
  if (W.Mj.toString().startsWith("function(b, g, m, k)")) {
    // Mj is already modified
    return false;
  }

  (function(f) {
    W.Mj = function(b, g, m, k) {
      if (
        g &&
        g.T &&
        ((g.T.scenePortal && !g.T.scenePortal.modified) ||
            (g.T.sceneTrigger && !g.T.sceneTrigger.modified) ||
            (g.T.storageSprite && !g.T.storageSprite.modified) ||
            (g.T.storageNpc && !g.T.storageNpc.modified))
      ) {
        g = modifyTData(g);
      }
      f.apply(W, arguments);
    };
  })(W.Mj);
  return true; // Modification successful
}

function delayTimer(time) {
  return new Promise(resolve => {
    setTimeout(resolve, time);
  })
}

// -----------------------------------------------------------------------------------------------

let W = getGameWindow();

async function main() {
  let inputSeed = prompt(
    "Please input a string or integer for generating a seed.\n" +
        "Leave blank for a random seed."
  ) || "";
  let seed = inputSeed;
  if (isBase10Int(seed) || isBase16Int(seed)) {
    seed = parseInt(seed);
  }

  let rng = initializeRng(seed);
  do {
    W.shuffledMapping = generateMapping(
      defaultConnections,
      shuffleConnections(rng)
    );
  } while (!isSeedCompletable()); // TODO: Is seed beatable? Reroll the seed if not beatable

  for (let i = 0; i < 25; ++i) {
    if (modifyMjFunction()) break; // Returns true if modification is successful
    await delayTimer(100);
  }

  alert(
    "Thanks for playing this randomizer! " +
        "This is currently in development so any feedback would be appreciate ^w^\n" +
        "Game version: 0.1.0\n" +
        `Your seed input: ${inputSeed || "(empty)"}\n` +
        `Numuric seed: ${W.rngSeed.toString(10)}\n` +
        `Seed in base 16: 0x${W.rngSeed.toString(16).toUpperCase()}`
  );
}

setTimeout(main, 100);
