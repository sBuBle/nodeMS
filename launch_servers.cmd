@ECHO OFF

:Restart
CLS
FOR %%G IN (Base Character Effect Etc Item Map Mob Morph Npc Quest Reactor Skill Sound String TamingMob UI) DO (
    IF NOT EXIST .\\provider\nx\%%G.nx (
        SET FileMissing=%%G
        GOTO :Nx_Not_Exist
    )
)
CLS
GOTO :initialize

:initialize
IF EXIST .\\node_modules npm run servers
IF NOT EXIST .\\node_modules npm install

:Nx_Not_Exist
ECHO ~~~ Nx files are missing! ~~~ 
ECHO File name %FileMissing%.nx  are missing!
pause
GOTO :Restart
cmd /k