# PokeDisco
a pokemon discord bot written in node.js. developed to be easily transplanted to the source code of another node discord bot.

## Goals
- [ ] Nice looking embeds for Pokemon
- [ ] Every 60-200 minutes a Pokemon "spawns" in a config-provided channel
  - spawned pokemon has random level, ID, and species
  - has a 1/200 chance to be shiny
  - different catch chance depending on level (will be displayed to chatters)
  - only one chance to catch per person
- [ ] Pokemon "runs away"(no longer catchable) after 10-30 minutes
- [ ] ". . ." catching animation shown in chat using edited messages
- [ ] 'catch' command to attempt catch
- [ ] 'show <nickname/id/species>' command to display rich embed of the pokemon in chat
  - if the species identifier is used: will show the highest level catch
  - no duplicate nicknames allowed
- [ ] 'dex' command shows pages of caught pokemon with nickname, species, level, and id
- [ ] 'nickname <id> <nickname>' command allows a nickname to be set
- [ ] 'spawn (dexNum)' command spawns a pokemon in the spawn channel
  - only usable by admins (specified in config)
- [ ] 'leaderboard' command for displaying chatters with most species caught
  
## config.json
- **prefix** - the prefix used to initiate a command 
- **adminID** - specifies the user able to use the 'spawn' command
- **spawnChannel** - specifies the channel to spawn new pokemon

## To-do (future):
- [ ] make times/chances customizable in config
- [ ] allow multiple adminIDs for spawning pokemon
- [ ] more admin commands (?)
