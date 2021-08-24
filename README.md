# doodle-kitsune-randomizer

This is a entrance randomizer for [*Doodle Champion Island Games*][1],
a Doodle game from Google. A [full screen version][2] of
the base game is also available.

[1]: https://www.google.com/doodles/doodle-champion-island-games-begin
[2]: https://www.google.com/logos/2020/kitsune/rc7/kitsune20.html


## Install guide

Install Tampermonkey (other userscript managers might also work), and
then [click here][3] to install this script.

[3]: https://github.com/Rubikium/doodle-kitsune-randomizer/raw/main/doodle_kitsune_randomizer.user.js

## Additions to the base game

- A pop-up appears when the game is loaded, prompting the player to
  enter a seed for the randomizer.
- Overworld entrances (overworld-interior connections) are randomized.
  Interior connections are not randomized in the current version.
- The player can join teams at any time, even if the player is
  in a team already. This ensures that all team HQ entrances are accessible.


## Future development directions

#### Shuffle Warp Points

Shuffle each menu warp destination to a random overworld location

#### Entrance Shuffle Modes

(Only the Overworld mode is available at the moment)

**Simple:**
Shuffles overworld entrances in each area separately.
Shuffles connectors entrances among themselves only.
Interior connections are _not_ shuffled.

**Overworld:**
Freely shuffles all overworld entrances.
Interior connections are _not_ shuffled.

**Full:**
Freely shuffles all overworld entrances.
Shuffles interior connections among themselves only

**Crossed:**
Freely shuffles all connections.

**Insanity:**
Decouples entrances and exits from each other and shuffles them freely

#### Shuffle Minigame Locations

Shuffle the 14 minigame locations among themselves
(Affects connection logic since some connections require 6 scrolls)


## Known Issues / Quirks:

- When going in the west convenience store entrance to a room with
  multiple doors, and going back out the same door, the player will appear
  in front of the east convenience store instead. This is intentional
  so that a connector linked to the store can bring the player
  from one end to another. This quirk also occurs in the case of
  the abandoned houses in table tennis area (exit at northwest house).
