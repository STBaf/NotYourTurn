/* 
 * NotYourTurn
 * Author: STB#9841 / Cris#6864
 */

import {registerSettings} from "./src/settings.js";
import {checkCombat, whisperGM, sockets, storeAllPositions, setTokenPositionOld, setTokenPositionNew, undoMovement, AllocateCorrectTokenLayerOnCanvas} from "./src/misc.js";

new Date();
let timer = 0; 
export var duplicateCheck = false;
let NYTTcontrolledTokens = [];
let dialogWait = false;
let GMwait = false;
let count = 0;
let warningTimer = 0;
let warningPeriod = 1000;
let NYTTokenPositionMap = new Map();

Hooks.on('NotYourTurn',async(data) => { 
    if (game.user.isGM == false) return;
    let nonCombat;
    if (data.nonCombat != undefined) {
        if (data.nonCombat == true) nonCombat = true;
        else if (data.nonCombat == false) nonCombat = false;
        else if (data.nonCombat == 'toggle') nonCombat = !game.settings.get('NotYourTurn','nonCombat');
        await game.settings.set('NotYourTurn','nonCombat',nonCombat);
        ui.controls.controls.find(controls => controls.name == "token").tools.find(tools => tools.name == "blockMovement").active = nonCombat;
        ui.controls.render();  
        storeAllPositions(NYTTokenPositionMap);
    }
    let combat;
    if (data.combat != undefined) {
        if (data.combat == true) combat = true;
        else if (data.combat == false) combat = false;
        else if (data.combat == 'toggle') combat = !game.settings.get('NotYourTurn','enable');
        await game.settings.set('NotYourTurn','enable',combat);
        ui.controls.controls.find(controls => controls.name == "token").tools.find(tools => tools.name == "enableNotYourTurn").active = combat;
        ui.controls.render(); 
        storeAllPositions(NYTTokenPositionMap); 
    }
});

Hooks.on('updateSetting', async(setting, value, diff, key) => {
    if ((setting.key == 'NotYourTurn.nonCombat' || setting.key == 'NotYourTurn.enable') && setting.value == true) {
        storeAllPositions(NYTTokenPositionMap);
    }
});

Hooks.once('init', function(){
    registerSettings(); //in ./src/settings.js       
});

Hooks.once('ready', ()=>{
    timer = Date.now();
    sockets(NYTTokenPositionMap);
});

Hooks.on("canvasReady",(canvas) => {
    NYTTcontrolledTokens = [];
    NYTTokenPositionMap.clear();

    // While on canvasReady in V10 X/Y of token was already filled with correct value, in V11/V12 it is at CanvasReady still 0/0. So we need to track position later when set, seem to exist on first refreshToken.
    // We can use the refreshToken in V11/V12 globally since coords still the old before movement while in V10 already the new position (which would move token to actual position on Undo instead of back)
    // Overall: V10 and V11 act different in token positions
    if (game.version.startsWith("10"))
    {
        storeAllPositions(NYTTokenPositionMap, canvas);    
    } else
    {
        Hooks.on('refreshToken', OnRefreshTokenV11AndLater);
    }

    let allocatedTokenLayer = AllocateCorrectTokenLayerOnCanvas(canvas);
    if (allocatedTokenLayer != undefined)
    {
        let tokens = allocatedTokenLayer.children;
        for (let i=0; i<tokens.length; i++)
        {
            if (tokens[i].isOwner)
            {
                NYTTcontrolledTokens.push(tokens[i].id);
            }
        }
    }            
});

//Register control button
Hooks.on("getSceneControlButtons", async(controls) => {
    if (game.user.isGM) {
        let tokenButton = controls.find(b => b.name == "token")
        if (tokenButton) {
            tokenButton.tools.push(
                {
                    name: "enableNotYourTurn",
                    title: game.i18n.localize("NotYourTurn.Enable"),
                    icon: "fas fa-fist-raised",
                    toggle: true,
                    active: game.settings.get('NotYourTurn','enable'),
                    visible: game.user.isGM,
                    onClick: (value) => {
                        setEnable(value);
                    }
                },
                {
                    name: "blockMovement",
                    title: game.i18n.localize("NotYourTurn.ControlBtn"),
                    icon: "fas fa-lock",
                    toggle: true,
                    active: game.settings.get('NotYourTurn','nonCombat'),
                    visible: game.user.isGM,
                    onClick: (value) => {
                        setNonCombat(value);
                    }
                }
            );
        }
    }
});

async function setEnable(value){
    await game.settings.set('NotYourTurn','enable',value);
    storeAllPositions(NYTTokenPositionMap);
    Hooks.call("NotYourTurn",{enable:value});
}
async function setNonCombat(value){
    await game.settings.set('NotYourTurn','nonCombat',value);
    storeAllPositions(NYTTokenPositionMap);
    Hooks.call("NotYourTurn",{nonCombat:value});
}

//Register the token position
Hooks.on('controlToken', (token,controlled)=>{
    if (controlled && token.isOwner) {
                
        NYTTokenPositionMap.set(token.id, {x:token.x,y:token.y});
        for (let i=0; i<NYTTcontrolledTokens.length; i++)
            if (NYTTcontrolledTokens[i] == token.id)
                return;

        let length = NYTTcontrolledTokens.length+1;
        for (let i=0; i<length; i++){
            if (NYTTcontrolledTokens[i] == undefined){
                NYTTcontrolledTokens[i] = token.id;
                return;
            }
        }   
    }
    else {
        for (let i=0; i<NYTTcontrolledTokens.length; i++){
            if (NYTTcontrolledTokens[i] == token.id){
                NYTTcontrolledTokens.splice(i,1);
                return;
            }
        }
    }
    
});

function OnRefreshTokenV11AndLater(token)
{
    if (token.controlled || token.isOwner) {
        NYTTokenPositionMap.set(token.id, {x:token.x,y:token.y});
    }    
}

Hooks.on('updateToken',(a,b,c,d,e)=>{
    const updateData = b;
    const userId = d;

    //Check if movement has been updated
    if (updateData.x == undefined && updateData.y == undefined) {
         return;
    }

    //To prevent the dialog from appearing multiple times, set a timer
    if (duplicateCheck == true)
    { 
        return;
    }

    //Check if client controls the token
    if (userId != game.userId) {
         return;
    }

    //Check if there is combat, or if nonCombat block is on
    if (checkCombat() == false && game.settings.get('NotYourTurn','nonCombat') == false) { return };
    if (checkCombat() && game.settings.get('NotYourTurn','enable') == false) { return };
    
    //make sure the next part only happens once, even if you have multiple tokens selected
    count++;
    if (count < NYTTcontrolledTokens.length) { return };
    count = 0;
    duplicateCheck = true;
    blockMovement(updateData);
});

async function blockMovement(data){
    //Get the token shift    
    let token = AllocateCorrectTokenLayerOnCanvas(canvas).children.find(p => p.id == data._id);    

    let movementShift = {
        x: isNaN(data.x) ? 0 : data.x-token.x, 
        y: isNaN(data.y) ? 0 : data.y-token.y
    };
    let counter = 0;
    let tokens = [];
    //Add controlled tokens to the combatants array, except the token whose turn it is, or tokens that are not in combat is nonCombat is true
    for (let i=0; i<NYTTcontrolledTokens.length; i++){
        let token = AllocateCorrectTokenLayerOnCanvas(canvas).children.find(p => p.id == NYTTcontrolledTokens[i]);
        let location = {x:token.x+movementShift.x, y:token.y+movementShift.y};
        if (checkCombat() && dialogWait == false && game.settings.get('NotYourTurn','AlwaysBlock') == false){
            const combatTokenId = game.combat.combatant.token.id;
            if (combatTokenId == NYTTcontrolledTokens[i] && token.isOwner){ 
                NYTTokenPositionMap.set(token.id, location);
                continue;
            }
            let isCombatant = game.combat.combatants.find(p => p.token.id == NYTTcontrolledTokens[i]);
            if (isCombatant == undefined && game.settings.get('NotYourTurn','nonCombat') == false && token.isOwner){
                NYTTokenPositionMap.set(token.id, location);
                continue;
            }
        }
        const tokenName = token.name;
        tokens[counter] = {id: NYTTcontrolledTokens[i], name: tokenName, location, locationOld: NYTTokenPositionMap.get(token.id)};
        counter++;
    }

    //If there are no more tokens, return
    if (tokens.length == 0) {
        duplicateCheck = false;
        return;
    }

    //If the dialog box is open, prevent user from moving other tokens
    if (dialogWait || GMwait){
        await setTokenPositionOld(tokens, NYTTokenPositionMap);
        duplicateCheck = false;
        return;
    }
    
    //Get the block setting, depending on the setting of the user role
    let role =  game.user.role;
    let blockSett = 0;
    if (role == 1) blockSett = game.settings.get("NotYourTurn","BlockPlayer");
    else if (role == 2) blockSett = game.settings.get("NotYourTurn","BlockTrusted");
    else if (role == 3) blockSett = game.settings.get("NotYourTurn","BlockAssistant");
    else if (role == 4) blockSett = game.settings.get("NotYourTurn","BlockGM");
    if (blockSett == 0) return;
    
    //Check if autoblock applies, which will automatically force the token back to its original position
    if (blockSett == 3){
        await setTokenPositionOld(tokens, NYTTokenPositionMap);
        if (Date.now()-warningTimer > warningPeriod) {
            ui.notifications.warn(game.i18n.localize("NotYourTurn.UI_Warning")); 
            warningTimer = Date.now();
        }
        duplicateCheck = false;
    }
    
    //Check if 'warning only' is set for the turn block function, if so, continue movement and give warning
    else if (blockSett == 1){
        let names = "";
        for (let i=0; i<tokens.length; i++){
            let token = AllocateCorrectTokenLayerOnCanvas(canvas).children.find(p => p.id == tokens[i].id);
            setTokenPositionNew(tokens, NYTTokenPositionMap);
            names += "'" + token.name + "'";
            if (i+2 == tokens.length) names += game.i18n.localize("NotYourTurn.And");
            else if (i+1 == tokens.length) names += " ";
            else names += ", ";
        }
        if (Date.now()-warningTimer > warningPeriod) {
            ui.notifications.warn(game.i18n.localize("NotYourTurn.UI_Warning"));
            
            if (game.settings.get("NotYourTurn","ChatMessages")==true && role < 3) 
                whisperGM(names + game.i18n.localize("NotYourTurn.MovementWhisper")); 
            warningTimer = Date.now();
        }
        duplicateCheck = false;
    }
    
    //In all other cases, create a dialog box
    else {
        
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
                    undoMovement(tokens, NYTTokenPositionMap);
                }

                //If 'Ignore' is pressed, continue movement
                else if (applyChanges == 1) { //ignore
                    let names = "";
                    for (let i=0; i<tokens.length; i++){
                        setTokenPositionNew(tokens, NYTTokenPositionMap);
                        let token = AllocateCorrectTokenLayerOnCanvas(canvas).children.find(p => p.id == tokens[i].id);
                        names += "'" + token.name + "'";
                        if (i+2 == tokens.length) names += " and ";
                        else if (i+1 == tokens.length) names += " ";
                        else names += ", ";
                    }
                    if (game.settings.get("NotYourTurn","ChatMessages")==true && role < 3) 
                        whisperGM(names + game.i18n.localize("NotYourTurn.MovementWhisper"));
                    duplicateCheck = false;
                    dialogWait = false;
                }  

                else if (applyChanges == 2) { //request movement
                    let users = game.users.contents;
                    //Request movement from GM, then apply movement (GM can undo this)   
                    for (let i=0; i < users.length; i++)
                        if (users[i].role > 2) {
                            if (users[i].viewedScene == canvas.scene.id){
                                GMwait = true;
                                duplicateCheck = false;
                                dialogWait = false;
                                let payload = {
                                    "msgType": "requestMovement",
                                    "sender": game.userId, 
                                    "receiver": users[i].id, 
                                    "tokens": tokens,
                                    "scene": {
                                        id: canvas.scene.id,
                                        name: canvas.scene.name
                                    }
                                };
                                game.socket.emit(`module.NotYourTurn`, payload);
                            }
                            else {
                                ui.notifications.warn(game.i18n.localize("NotYourTurn.UI_GMnotOnScene"));
                                GMwait = false;
                                undoMovement(tokens, NYTTokenPositionMap);
                            }
                            break;
                        }
                }

            }
        });
        d.render(true); 
    }
}

export function setDuplicateCheck(value){
    duplicateCheck = value;
}

export function setDialogWait(value){
    dialogWait = value;
}

export function setGMwait(value){
    GMwait = value;
}

export function setTimer(value){
    timer = value;
}