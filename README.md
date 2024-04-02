## Current Implementation Status:

### Login Server
🟢 Client login and automatic registration.\
🟢 World selection feature.\
🟢 Multiworld functionality allowing users to choose displayed worlds.\
🟠 Partial implementation of channel selection. Players spawn on the default channel.\
🟢 Character creation with spawning in a basic state.\
🟢 Character deletion capability.\
🟢 Character selection with spawning in a basic state.

### Channel Server
🟠 Portals functionality: Players spawn in a "random" position within the map upon entering portals.\
🟠 Script portals are implemented but require recoding.\
🔴 Skills system not yet implemented.\
🔴 Pets feature not implemented.\
🟠 Basic inventory operations implemented, although items may not display correctly to the client.\
🟠 Player equipment display implemented for other players, but not for the player's own equipment.\
🟠 Monster spawn feature enabled, but monsters lack skills and cannot attack or cause harm.\
🟢 NPCs spawn, with dialogue, selection, and lifelike behavior.\
🔴 Character info functionality not implemented.\
🔴 Cash shop feature not implemented.\
🔴 Guild, party, trade, and friends operations are not yet available.\
🟢 Support for Nx file format reading.\
🟠 Player chat feature enabled for public communication and commands, with only public chat implemented.\
🟢 Multiplayer functionality working, though may have bugs when changing maps.\
🟠 Basic player emotes available, limited to default options.

## Emulator Setup Instructions:
To set up and install the MapleStory emulator, follow these steps:

1. Install a MySQL server (such as WAMP or XAMPP) and import the provided MySQL file named `nodems.sql`.
2. Convert WZ files to NX format using a tool like diamondo25's WZ to NX converter. Place the NX format files in the specified directory (`provider` -> `nx`).
3. Place the localhost/client/redirector files in your MapleStory folder, ensuring to update the IP address as necessary using diamondo25's tool, strEdit.
4. Install Node.js from the official website.
5. Open the `launch_servers.cmd` file to start the emulator. If necessary, it will install required node modules. After module installation, close and reopen the file to launch the emulator.

## Credits:
* diamondo25 - for creating the Maple.js emulator.
* Nexon - for developing MapleStory.
