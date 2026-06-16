/* 
 * NotYourTurn
 * Author: STB#9841
 */

import {registerSettings} from "./src/settings.js";
import {checkCombat, whisperGM} from "./src/misc.js";

let timer = 0;
let dialogWait = false;
let GMwait = false;
let warningTimer = 0;
let warningPeriod = 1000;

let moduleForcedMovement = false;

async function handleSocketGMSide(payload) {    
    //check if this user is the target, else return
    if (game.userId != payload.receiver) return;
        
    if (payload.msgType == "requestMovement")
    {
        if (game.user.isGM == false) return;
    
        //get the name of the requesting user, and his/her token data
        const user = game.users.get(payload.sender).name;

        //build dialog
        let applyChanges = 0;
        let buttons = {
        //Accept button, accepts the request
            Accept: {
                label: game.i18n.localize("NotYourTurn.Request_AcceptBtn"),
                callback: () => applyChanges = 0
            }
        }
        //Decline button, declines the request
        buttons.Decline = {
            label: game.i18n.localize("NotYourTurn.Request_DeclineBtn"),
            callback: () => applyChanges = 1
        }
        
        let d = new Dialog({
            title: game.i18n.localize("NotYourTurn.Request_Title"),
            content: game.i18n.localize("NotYourTurn.Request_Text1") + user + game.i18n.localize("NotYourTurn.Request_Text2") + payload.token.name + ".",
            buttons,
            default: "Decline",
            close: html => {
                
                let ret = false;
                
                if (applyChanges == 0) {
                    ret = true;
                }
                else if (applyChanges == 1) {                                                
                    ret = false;
                }

                let payload2 = {
                    "msgType": "requestMovement_GMack",
                    "sender": game.userId, 
                    "receiver": payload.sender, 
                    "token": payload.token,
                    "preMovePosition": payload.preMovePosition,
                    "ret": ret
                };

                game.socket.emit('module.NotYourTurn', payload2);                
            }
        });
        d.render(true);
    }
    else if (payload.msgType == "requestMovement_GMack"){
        if (payload.ret == true)
        { 
            ui.notifications.info(game.i18n.localize("NotYourTurn.UI_RequestGranted")); 
        }
        else { 
            ui.notifications.warn(game.i18n.localize("NotYourTurn.UI_RequestDeclined"));
            let resetToken = game.canvas.tokens.ownedTokens.find(x => x.document._id == payload.token._id);
            moduleForcedMovement = true;
            resetToken.document.update(payload.preMovePosition);            
        }
    }    
}

Hooks.once('init', function(){    
    registerSettings(); //in ./src/settings.js
    game.socket.on('module.NotYourTurn', handleSocketGMSide);
});

Hooks.once('ready', () => {
    timer = Date.now();
    moduleForcedMovement = false;    
});

//Register control button
Hooks.on("getSceneControlButtons", async(controls) => {
    if (game.user.isGM) {
        let tokenButton = controls.tokens.tools;
        if (tokenButton) {

            let enableNotYourTurnButton = {
                name: "notyourturn_enableNotYourTurnButton",
                title: game.i18n.localize("NotYourTurn.Enable"),
                icon: "fas fa-fist-raised",
                toggle: true,                
                active: game.settings.get('NotYourTurn','enable'),
                visible: game.user.isGM,
                onChange: (event, active) => {
                    setEnable(active);
                }
            };

            let blockMovementButton = {
                name: "notyourturn_blockMovementButton",
                title: game.i18n.localize("NotYourTurn.ControlBtn"),
                icon: "fas fa-lock",
                toggle: true,                
                active: game.settings.get('NotYourTurn','nonCombat'),
                visible: game.user.isGM,
                onChange: (event, active) => {
                    setNonCombat(active);
                }
            };

            tokenButton.notyourturn_enableNotYourTurnButton = enableNotYourTurnButton;
            tokenButton.notyourturn_blockMovementButton = blockMovementButton;
        }
    }
});

async function setEnable(value){
    await game.settings.set('NotYourTurn','enable',value);
}
async function setNonCombat(value){
    await game.settings.set('NotYourTurn','nonCombat',value);
}

Hooks.on('preMoveToken', (token, waydata, terrainOptions) => {

    if (moduleForcedMovement) {
        moduleForcedMovement = false;
        return;
    }

    if (checkCombat() == false && game.settings.get('NotYourTurn','nonCombat') == false) { 
        return;
    };
    if (checkCombat() && game.settings.get('NotYourTurn','enable') == false) { 
        return;
    };

    if (token.isOwner) {

        if (checkCombat())
        {
            // in combat and tokens turn nothing to do, you can move free
            const combatTokenId = game.combat.combatant.token.id;
            if (token.id == combatTokenId) {
                return;
            }
        }        

        //Get the block setting, depending on the setting of the user role
        let role =  game.user.role;
        let blockSetting = 0;
        if (role == 1) blockSetting = game.settings.get("NotYourTurn","BlockPlayer");
        else if (role == 2) blockSetting = game.settings.get("NotYourTurn","BlockTrusted");
        else if (role == 3) blockSetting = game.settings.get("NotYourTurn","BlockAssistant");
        else if (role == 4) blockSetting = game.settings.get("NotYourTurn","BlockGM");
        if (blockSetting == 0) return;

        //Always block blockSetting == 3
        if (blockSetting == 3) {            
            if (Date.now()-warningTimer > warningPeriod) {
                ui.notifications.warn(game.i18n.localize("NotYourTurn.UI_Warning")); 
                warningTimer = Date.now();
            }
            return false;
        }
        else if (blockSetting == 1) { //Check if 'warning only' is set for the turn block function, if so, continue movement and give warning
            if (Date.now()-warningTimer > warningPeriod) {
                ui.notifications.warn(game.i18n.localize("NotYourTurn.UI_Warning"));
                
                if (game.settings.get("NotYourTurn","ChatMessages") == true && role < 10) 
                    whisperGM(token.name + game.i18n.localize("NotYourTurn.MovementWhisper")); 
                warningTimer = Date.now();
            }        
        } 
        else { //In all other cases, create a dialog box
            
            let preMovePosition = { x: token.x, y: token.y};

            //Create a dialog, with buttons based on the current situation
            let applyChanges = 0;
            let buttons = {
                //Undo button
                Undo: {
                    label: game.i18n.localize("NotYourTurn.Dialog_UndoBtn"),
                    callback: () => applyChanges = 0
                }
            }
            //Check if the role of the user. If applicable, add ignore button
            if (game.settings.get("NotYourTurn","IgnoreButton")<role){
                buttons.Ignore = {
                    label: game.i18n.localize("NotYourTurn.Dialog_IgnoreBtn"),
                    callback: () => applyChanges = 1
                }
            }
            //Check if the user is player, add request button if enabled
            if (game.settings.get("NotYourTurn","RequestButton")==true && role <4){
                buttons.Request = {
                    label: game.i18n.localize("NotYourTurn.Dialog_RequestBtn"),
                    callback: () => applyChanges = 2
                }
            }

            dialogWait = true;            

            let d = new Dialog({
                title: game.i18n.localize("NotYourTurn.Dialog_Title"),
                content: game.i18n.localize("NotYourTurn.Dialog_Text")+ '<br><br>',
                buttons,
                default: "Undo",
                close: html => {
                    //If 'Undo' is pressed, move token back to previous position
                    
                    if (applyChanges == 0){ //undo                        
                        dialogWait = false;
                        moduleForcedMovement = true;
                        token.update(preMovePosition);
                        return;
                    }

                    //If 'Ignore' is pressed, continue movement
                    else if (applyChanges == 1) { //ignore                        
                        if (game.settings.get("NotYourTurn","ChatMessages")==true && role < 3)
                        {
                            whisperGM(token.name + game.i18n.localize("NotYourTurn.MovementWhisper"));
                        }
                        dialogWait = false;
                        return;
                    }  

                    else if (applyChanges == 2) { //request movement
                        let users = game.users.contents;
                        //Request movement from GM, then apply movement (GM can undo this)   
                        for (let i=0; i < users.length; i++)
                            if (users[i].role > 2) {
                                if (users[i].viewedScene == canvas.scene.id){
                                    GMwait = true;                                    
                                    dialogWait = false;
                                    let payload = {
                                        "msgType": "requestMovement",
                                        "sender": game.userId, 
                                        "receiver": users[i].id, 
                                        "token": token,
                                        "preMovePosition": preMovePosition,
                                        "scene": {
                                            id: canvas.scene.id,
                                            name: canvas.scene.name
                                        }
                                    };
                                    game.socket.emit('module.NotYourTurn', payload);
                                }
                                else {
                                    ui.notifications.warn(game.i18n.localize("NotYourTurn.UI_GMnotOnScene"));
                                    GMwait = false;
                                    return false;
                                }
                                break;
                            }
                    }

                }
            });

            d.render(true); 
        }
        
        return;
    }
});
