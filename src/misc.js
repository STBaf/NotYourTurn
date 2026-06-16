import {duplicateCheck,setDuplicateCheck,setDialogWait,setGMwait,setTimer} from "../NotYourTurn.js";

export function checkCombat(){
    if (game.combat) 
        return game.combat.started;
    else return false; 
}

export function whisperGM(message){
    for (let i=0; i<game.users.length; i++){
        if (game.users[i].role > 2) 
            ChatMessage.create({
                content: message,
                whisper: [game.users[i]._id]
        });                                                                                      
    }
}

export async function storeAllPositions(map, useCanvas)
{
    let tokens;
    let handOverCanvas = useCanvas != undefined;
    if (handOverCanvas)
    { 
        tokens = useCanvas.tokens.ownedTokens
    } else {
        tokens = AllocateCorrectTokenLayerOnCanvas(canvas).children;
    }
    
    for (let i=0; i<tokens.length; i++){
        let token = tokens[i];
        if (handOverCanvas || token.isOwner)
        {            
            let position = { x: token.x, y: token.y };
            map.set(token.id, position);
        }
    }
}

export async function setTokenPositionOld(tokens, map){
    for (let i=0; i<tokens.length; i++){
        let token = AllocateCorrectTokenLayerOnCanvas(canvas).children.find(p => p.id == tokens[i].id);
        if (token.isOwner)
        {
            let position = tokens[i].locationOld;
            await token.document.update(position);
            map.set(token.id, position);
        }
    }
}

export async function setTokenPositionNew(tokens, map){
    for (let i=0; i<tokens.length; i++){
        let token = AllocateCorrectTokenLayerOnCanvas(canvas).children.find(p => p.id == tokens[i].id);
        if (token.isOwner)
        {
            let position = tokens[i].location;
            await token.document.update(position);
            map.set(token.id, position);
        }
    }
}

export async function undoMovement(tokens, map){
    await setTokenPositionOld(tokens, map);    
    setDuplicateCheck(false);
    setDialogWait(false);
}

export function sockets(map){
    game.socket.on(`module.NotYourTurn`, (payload) =>{
        //check if this user is the target, else return
        if (game.userId != payload.receiver) return;
        //console.log(payload);
        //check if the correct message has been received
        if (payload.msgType == "requestMovement"){
        
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
            
            let names = "";
            for (let i=0; i<payload.tokens.length; i++){
                names += "'" + payload.tokens[i].name + "'";
                if (i+2 == payload.tokens.length) names += game.i18n.localize("NotYourTurn.And");
                else if (i+1 == payload.tokens.length) names += " ";
                else names += ", ";
            }

            let d = new Dialog({
                title: game.i18n.localize("NotYourTurn.Request_Title"),
                content: game.i18n.localize("NotYourTurn.Request_Text1") + user + game.i18n.localize("NotYourTurn.Request_Text2") + names + ".",
                buttons,
                default: "Decline",
                close: html => {
                    let ret;
                    if (applyChanges == 0) {
                        ret = true;
                        setTokenPositionNew(payload.tokens, map);
                    }
                    else if (applyChanges == 1) {
                        ret = false;
                        setTokenPositionOld(payload.tokens, map);
                    }
                    let payload2 = {
                        "msgType": "requestMovement_GMack",
                        "sender": game.userId, 
                        "receiver": payload.sender, 
                        "tokens": payload.tokens,
                        "ret": ret
                    };
                    game.socket.emit(`module.NotYourTurn`, payload2);
                }
            });
            d.render(true);
        }
        else if (payload.msgType == "requestMovement_GMack"){
            if (payload.ret == true) 
                ui.notifications.info(game.i18n.localize("NotYourTurn.UI_RequestGranted")); 
            else 
                ui.notifications.warn(game.i18n.localize("NotYourTurn.UI_RequestDeclined"));            
            setDuplicateCheck(false);
            setGMwait(false);
            setTimer(Date.now());
        }
    });
}

export function AllocateCorrectTokenLayerOnCanvas(canvas) {
    let SearchForLayerWithObjectsOfType = CONFIG.Token.objectClass.name;
    return canvas.tokens.children.find((clayer) => clayer.children.length > 0 && clayer.children[0].constructor.name == SearchForLayerWithObjectsOfType);
}
