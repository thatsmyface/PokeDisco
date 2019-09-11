# PokeDisco
a pokemon discord bot written in node.js. developed to be easily transplanted to the source code of another node discord bot.

## Features (soon)
- [x] Nice looking embeds for Pokemon
- [x] After a random time a Pokemon "spawns" in a config-provided channel
  - [x] spawned pokemon has random level, ID, and species
  - [x] has a chance to be shiny
  - [x] ability to limit which hours can spawn pokemon
  - [x] different catch chance depending on level (will be displayed to chatters)
  - [x] multiple chances to catch per person
- [x] Pokemon "runs away"(no longer catchable) after random time
- [x] ". . ." catching animation shown in chat using edited messages
- [x] 'catch' command to attempt catch
- [x] 'show <nickname/id/species>' command to display rich embed of the pokemon in chat
  - if the species identifier is used: will show the most recently caught
- [x] 'dex' command shows pages of caught pokemon with nickname, species, level, and id
- [x] 'nickname <id> <nickname>' command allows a nickname to be set
- [ ] 'leaderboard' command for displaying chatters with most species caught
- [ ] trading
  
## pokemon_config.json
- **token** - your discord bot's api token
- **prefix** - the prefix used to initiate a command 
- **spawnChannel** - specifies the channel to spawn new pokemon
- **requireCatchingInSpawnChannel** - restrict catching to the spawn channel only
- **catchDifficulty** - higher number = higher catch chance (15 is the best)
- **numberOfAttempts** - amount of pokeballs that can be thrown by each user at each pokemon
- **shinyChance** - the chance that a spawned pokemon will be shiny
- **animatedCatch** - enable animated catches (if you have problems disable this)
- **animationShakeTime** - time in milliseconds of each shake when animation is enabled
- **animationAmountShakes** - amount of shakes when catching when animation is enabled
- **maxRunTime** / **minRunTime** - the range for how long until a pokemon is no longer catchable
- **maxSpawnTime** / **minSpawnTime** - the range for how long until a pokemon spawns after the last pokemon ran away
- **limitSpawnTimes** - restrict the times that 'mons can spawn
- **hourEnableSpawns** / **hourDisableSpawns** - the range for when 'mons will spawn when limitSpawnTimes is enabled
- **enableWeekendSpawns** - should pokemon spawn when limitSpawnTimes is enabled?