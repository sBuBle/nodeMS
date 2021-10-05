## What currently implemented:
🔴Not implemented yet 🟠Partly implemented 🟢Implemented

### Login Server
🟢 Client login + Auto registretion.\
🟢 World selection\
🟢 Multiworld implemented, that means you can choose which world will be showen on world list.\
🟠 Channel selection, you will be on the world port of the world basicly there only one channel.\
🟢 Character creation, you will spawn naked after creating char\
🟢 Character deletion\
🟢 Character selection, you will spawn naked after creating char\
### Channel Server
🟠 Portals, Player spawn's in "random" position inside the map when entering portal.\
🟠 script portals are implemented but they are need to get recoded.\
🔴 Skills\
🔴 Pets\
🟠 Inventory operations, implamnted only the basic you can add items but the client will not show them\
🟠 Player equipment - you can see others wearable equipment but not your own\
🟠 Monster Spawn, but they have no skills (means they cant attack you or hurt)\
🟢 NPC spawn/dialog/selection/life\
🔴 Character info, on click/press character information.\
🔴 Cashshop.\
🔴 Guild/Party/Trade/Friends operations\
🟢 Supporting Nx file foramt reading\
🟠 Player chat, you can speek with other players and use commands, only public chat implemented.\
🟢 Multiplayer, working but still may have bugs when changing map.\
🟠 Player emotes, you can use only the basic/default emotes.\
🔴 What not mentioned probably not implemented too.

# Setup/install emulator
Edit `constant.js` to your needs;\
To run this maplestory emulator, you have to do the following steps:
1) Firstly you have to install mysql server(wamp/xamp), and import there mysql file named `nodems.sql`.
2) Secondly you have to convert you'rs wz files to nx format and place you'rs nx format files inside path -> `provider` ->> `nx`.\
    you can get nx format converter tool from diamondo25 - [WZ to NX](https://github.com/diamondo25/Maple.js/tree/master/tools/WZ2NX). 
3) Ofcourse you have to get localhost/client/redirector and locate him inside your maplestory folder to start a new connection with this emulator. Please dont forget to change ip inside your's localhost/client/redirector, you can change them by using diamondo25 tool - [strEdit (direct download)](http://direct.craftnet.nl/app_updates/STREDIT.zip).
4) Without `node.js` engine you will not able to launch this emulator at all, so you have download and install `node.js` - [redirect to nodejs website](https://nodejs.org/en/).
5) Open file named `launch_servers.cmd` to launch the emulator. if you will not have node modules he will automaticly install them, after the node modules installetion you will have to close the `cmd` file and reopen him to launch emulator.

## Credits
* diamondo25 - for publiching his [Maple.js](https://github.com/diamondo25/Maple.js) maplestory emulator.
* Nexon - for creating maplestory at all.
