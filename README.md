# PokeDisco
a pokemon discord bot written in node.js. developed to be easily transplanted to the source code of another node discord bot.

## Features (soon)
- [x] Nice looking embeds for Pokemon
- [x] After a random time a Pokemon "spawns" in a config-provided channel (from 7am to 5pm)
  - [x] spawned pokemon has random level, ID, and species
  - [ ] has a chance to be shiny
  - [x] different catch chance depending on level (will be displayed to chatters)
  - [x] multiple chances to catch per person
- [x] Pokemon "runs away"(no longer catchable) after random time
- [x] ". . ." catching animation shown in chat using edited messages
- [x] 'catch' command to attempt catch
- [ ] 'show <nickname/id/species>' command to display rich embed of the pokemon in chat
  - if the species identifier is used: will show the highest level catch
  - no duplicate nicknames allowed
- [x] 'dex' command shows pages of caught pokemon with nickname, species, level, and id
- [ ] 'nickname <id> <nickname>' command allows a nickname to be set
- [ ] 'leaderboard' command for displaying chatters with most species caught
- [ ] trading
  
## config.json
- **prefix** - the prefix used to initiate a command 
- **spawnChannel** - specifies the channel to spawn new pokemon
