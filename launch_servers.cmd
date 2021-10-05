@echo off
:Restart
IF NOT EXIST .\\provider\nx\Character.nx GOTO :Nx_Not_Exist
IF NOT EXIST .\\provider\nx\Item.nx GOTO :Nx_Not_Exist 
IF NOT EXIST .\\provider\nx\Mob.nx GOTO :Nx_Not_Exist
IF NOT EXIST .\\provider\nx\Npc.nx GOTO :Nx_Not_Exist 
IF NOT EXIST .\\provider\nx\Quest.nx GOTO :Nx_Not_Exist
IF NOT EXIST .\\provider\nx\Skill.nx GOTO :Nx_Not_Exist 
IF NOT EXIST .\\provider\nx\Map.nx GOTO :Nx_Not_Exist 
IF NOT EXIST .\\provider\nx\UI.nx GOTO :Nx_Not_Exist
CLS
GOTO :initialize

:initialize
IF EXIST .\\node_modules npm run servers
IF NOT EXIST .\\node_modules npm install

:Nx_Not_Exist
ECHO ~~~ Nx files are missing! ~~~ 
pause
GOTO :Restart
cmd /k