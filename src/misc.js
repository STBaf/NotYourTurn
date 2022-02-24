import {duplicateCheck,setDuplicateCheck,setDialogWait,setGMwait,setTimer} from "../NotYourTurn.js";

export function checkCombat(){
    if (game.combat) 
        return game.combat.started;
    else return false; 
}

export function whisperGM(message){
    for (let i=0; i<game.data.users.length; i++){
        if (game.data.users[i].role > 2) 
            ChatMessage.create({
                content: message,
                whisper: [game.data.users[i]._id]
        });                                                                                      
    }
}

export async function storeAllPositions(map){
    let tokens = canvas.tokens.children[0].children;
    for (let i=0; i<tokens.length; i++){
        let token = tokens[i];
        if (token.isOwner)
        {
            let position = tokens[i]._validPosition;
            map.set(token.id, position);
        }
    }
}

export async function setTokenPositionOld(tokens, map){
    for (let i=0; i<tokens.length; i++){
        let token = canvas.tokens.children[0].children.find(p => p.id == tokens[i].id);
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
        let token = canvas.tokens.children[0].children.find(p => p.id == tokens[i].id);
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
    disableMoveKeys(false);
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
            const user = game.users.get(payload.sender).data.name;

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
            disableMoveKeys(false);
            setDuplicateCheck(false);
            setGMwait(false);
            setTimer(Date.now());
        }
    });
}

export function disableMoveKeys(enable){
    if (enable){
        game.keyboard.moveKeys.w = "";
        game.keyboard.moveKeys.a = "";
        game.keyboard.moveKeys.s = "";
        game.keyboard.moveKeys.d = "";
        game.keyboard.moveKeys.W = "";
        game.keyboard.moveKeys.A = "";
        game.keyboard.moveKeys.S = "";
        game.keyboard.moveKeys.D = "";
        game.keyboard.moveKeys.ArrowUp = "";
        game.keyboard.moveKeys.ArrowRight = "";
        game.keyboard.moveKeys.ArrowDown = "";
        game.keyboard.moveKeys.ArrowLeft = "";
        game.keyboard.moveKeys.Numpad1 = "";
        game.keyboard.moveKeys.Numpad2 = "";
        game.keyboard.moveKeys.Numpad3 = "";
        game.keyboard.moveKeys.Numpad4 = "";
        game.keyboard.moveKeys.Numpad6 = "";
        game.keyboard.moveKeys.Numpad7 = "";
        game.keyboard.moveKeys.Numpad8 = "";
        game.keyboard.moveKeys.Numpad9 = "";
    }
    else {
        game.keyboard.moveKeys.w = ["up"];
        game.keyboard.moveKeys.s = ["down"];
        game.keyboard.moveKeys.a = ["left"];
        game.keyboard.moveKeys.d = ["right"];
        game.keyboard.moveKeys.W = ["up"];
        game.keyboard.moveKeys.S = ["down"];
        game.keyboard.moveKeys.A = ["left"];
        game.keyboard.moveKeys.D = ["right"];
        game.keyboard.moveKeys.ArrowUp = ["up"];
        game.keyboard.moveKeys.ArrowRight = ["right"];
        game.keyboard.moveKeys.ArrowDown = ["down"];
        game.keyboard.moveKeys.ArrowLeft = ["left"];
        game.keyboard.moveKeys.Numpad1 = ["down","left"];
        game.keyboard.moveKeys.Numpad2 = ["down"];
        game.keyboard.moveKeys.Numpad3 = ["down","right"];
        game.keyboard.moveKeys.Numpad4 = ["left"];
        game.keyboard.moveKeys.Numpad6 = ["right"];
        game.keyboard.moveKeys.Numpad7 = ["up","left"];
        game.keyboard.moveKeys.Numpad8 = ["up"];
        game.keyboard.moveKeys.Numpad9 = ["up","right"];
    }   
}