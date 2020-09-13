/* 
 * NotYourTurn
 * Author: Cris#6864
 */

new Date();
let timer = 0; 
let role;
let blockSett;
let duplicateCheck = false;
let oldPositionX;
let oldPositionY;

function checkCombat(){
    if (game.combat) 
        return game.combat.started;
    else return false; 
}

function whisperGM(message){
    for (let i=0; i<game.data.users.length; i++){
        if (game.data.users[i].role > 2) 
            ChatMessage.create({
                content: message,
                whisper: [game.data.users[i]._id]
        });                                                                                      
    }
}

Hooks.on('ready', ()=>{
    role =  game.user.data.role;
    if (role == 1) blockSett = game.settings.get("NotYourTurn","BlockPlayer");
    else if (role == 2) blockSett = game.settings.get("NotYourTurn","BlockTrusted");
    else if (role == 3) blockSett = game.settings.get("NotYourTurn","BlockAssistant");
    else if (role == 4) blockSett = game.settings.get("NotYourTurn","BlockGM");
    timer = Date.now();

    game.socket.on(`module.NotYourTurn`, (payload) =>{
        //check if this user is the target, else return
        if (game.userId != payload.receiver) return;

        //check if the correct message has been received
        if (payload.msgType == "requestMovement"){
        
            //get the name of the requesting user, and his/her token data
            let user = game.users.get(payload.sender).data.name;
            let token;
            for (let i=0; i<canvas.tokens.children[0].children.length; i++)
                if (canvas.tokens.children[0].children[i].data._id == payload.tokenId) token = canvas.tokens.children[0].children[i];
            
            //build dialog
            let applyChanges = 0;
            let buttons = {
            //Accept button, accepts the request
                Accept: {
                    label: `Accept`,
                    callback: () => applyChanges = 0
                }
            }
            //Decline button, declines the request
            buttons.Decline = {
                label: `Decline`,
                callback: () => applyChanges = 1
            }
            
            let d = new Dialog({
                title: `Movement request`,
                content: `Player '` + user + `' has requested to move token '` + token.data.name+ "'",
                buttons,
                default: "Decline",
                close: html => {
                    let ret;
                    if (applyChanges == 0) ret = true;
                    else if (applyChanges == 1) ret = false;
                    let payload2 = {
                        "msgType": "requestMovement_GMack",
                        "sender": game.userId, 
                        "receiver": payload.sender, 
                        "tokenId": payload.tokenId,
                        "shiftX": payload.shiftX,
                        "shiftY": payload.shiftY,
                        ret
                    };
                    game.socket.emit(`module.NotYourTurn`, payload2);
                }
            });
            d.render(true);
        }
        else if (payload.msgType == "requestMovement_GMack"){
            let token;
                for (let i=0; i<canvas.tokens.children[0].children.length; i++)
                    if (canvas.tokens.children[0].children[i].data._id == payload.tokenId) token = canvas.tokens.children[0].children[i];
            if (payload.ret == true) {
                ui.notifications.info("The GM has granted your request");
                oldPositionX = token.data.x;
                oldPositionY = token.data.y;
            }
            else {
                ui.notifications.warn("The GM has declined your request");
                token.shiftPosition(payload.shiftX,payload.shiftY,true);
                oldPositionX = token.data.x + payload.shiftX*canvas.dimensions.size;
                oldPositionY = token.data.y + payload.shiftY*canvas.dimensions.size;
            }
            //let shiftY = (oldPositionY - data.y)/canvas.dimensions.size;
            
            disableMoveKeys(false);
            duplicateCheck = false;
            timer = Date.now();
            
        }
    });
});

Hooks.once('init', function(){
    //initialize all settings
    game.settings.register('NotYourTurn','BlockPlayer', {
        name: "Player",
        scope: "world",
        config: true,
        type:Number,
        default:2,
        choices:["Off","Warning Only","Dialog Box","Auto Block"],
        onChange: x => window.location.reload()
    });
    game.settings.register('NotYourTurn','BlockTrusted', {
        name: "Trusted",
        scope: "world",
        config: true,
        type:Number,
        default:2,
        choices:["Off","Warning Only","Dialog Box","Auto Block"],
        onChange: x => window.location.reload()
    });
    game.settings.register('NotYourTurn','BlockAssistant', {
        name: "Assistant",
        scope: "world",
        config: true,
        type:Number,
        default:1,
        choices:["Off","Warning Only","Dialog Box","Autoblock"],
        onChange: x => window.location.reload()
    });
    game.settings.register('NotYourTurn','BlockGM', {
        name: "GM",
        hint: "Determines behavior when token is moved when its not its turn for each permission level",
        scope: "world",
        config: true,
        type:Number,
        default:1,
        choices:["Off","Warning Only","Dialog Box","Auto Block"],
        onChange: x => window.location.reload()
    });

    game.settings.register('NotYourTurn','IgnoreButton', {
        name: "Ignore Button",
        hint: "Determines who can see the ignore button in the dialog box",
        scope: "world",
        config: true,
        type:Number,
        default:2,
        choices:["Everyone","Trusted & Up","Assistants & Up","Gamemaster only","Nobody"],
        onChange: x => window.location.reload()
    });
    game.settings.register('NotYourTurn','RequestButton', {
        name: "GM Request Button",
        hint: "Allow players to request the GM to allow movement",
        scope: "world",
        config: true,
        default: true,
        type: Boolean,
        onChange: x => window.location.reload()
    });
    game.settings.register('NotYourTurn','ChatMessages', {
        name: "Chat Messages",
        hint: "Creates a chat message when a token is moved when it's not its turn if set to 'warning only' or 'dialog box'",
        scope: "world",
        config: true,
        default: true,
        type: Boolean,
        onChange: x => window.location.reload()
    });
});

function disableMoveKeys(enable){
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

Hooks.on('controlToken', (token,controlled)=>{
    if (controlled == false) return;
    oldPositionX = token.data.x;
    oldPositionY = token.data.y;
    console.log(token);
    Hooks.on('updateToken',(scene,data,c,d,user)=>{
        if (blockSett == 0) return;
        
        //To prevent the dialog from appearing multiple times, set a timer
        if (duplicateCheck == true) 
           return;
        
        timer = Date.now();

        //check if currently in combat
        let inCombat = checkCombat();

        //check if client controls the token, if the user corresponds with the client and if in combat
        if (user != game.userId || inCombat == false) return;

        for (let i=0; i<game.combat.data.combatants.length; i++)
            if (game.combat.data.combatants[i].tokenId == data._id){
                if (game.combat.data.combatants[i].active) {
                    oldPositionX = data.x;
                    oldPositionY = data.y;
                    return;
                }
            }

        //Check if token has moved
        if ((data.x - oldPositionX) == 0 && (data.y - oldPositionY) == 0) return;

        
        for (let i=0; i<canvas.tokens.children[0].children.length; i++)
            if (canvas.tokens.children[0].children[i].data._id == data._id)
                token = canvas.tokens.children[0].children[i];
        
        duplicateCheck = true;

        //Check if autoblock applies, which will automatically force the token back to its original position
        if (blockSett == 3){
            token.shiftPosition((oldPositionX - data.x)/canvas.dimensions.size,(oldPositionY - data.y)/canvas.dimensions.size,true);
            ui.notifications.warn("It is not your turn"); 
            timer = Date.now();
            duplicateCheck = false;
            
        }
        //Check if 'warning only' is set for the turn block function, if so, continue movement and give warning
        else if (blockSett == 1){
            ui.notifications.warn("It is not your turn");
            if (game.settings.get("NotYourTurn","ChatMessages")==true && role < 3) 
                whisperGM(token.name + " moved when it was not its turn");
            oldPositionX = data.x;
            oldPositionY = data.y;
            timer = Date.now();
            duplicateCheck = false;
        }
        
        //In all other cases, create a dialog box
        else {
            disableMoveKeys(true);
            //Create a dialog, with buttons based on the current situation
            let applyChanges = 0;
            let buttons = {
                //Undo button
                Undo: {
                    label: `Undo`,
                    callback: () => applyChanges = 0
                }
            }
            //Check if the role of the user. If applicable, add ignore button
            if (game.settings.get("NotYourTurn","IgnoreButton")<role){
                buttons.Ignore = {
                    label: `Ignore`,
                    callback: () => applyChanges = 1
                }
            }
            //Check if the user is player, add request button if enabled
            if (game.settings.get("NotYourTurn","RequestButton")==true && role <4){
                buttons.Request = {
                    label: `Request`,
                    callback: () => applyChanges = 2
                }
            }

            let title = "It's not your turn!";
            let content = ` You're trying to move, but it is not your turn<br><br>`;
            let d = new Dialog({
                title: "It's not your turn!",
                content: "You're trying to move, but it is not your turn<br><br>",
                buttons,
                default: "Undo",
                close: html => {
                    //If 'Undo' is pressed, move token back to previous position
                    if (applyChanges == 0){ //undo
                        token.shiftPosition((oldPositionX - data.x)/canvas.dimensions.size,(oldPositionY - data.y)/canvas.dimensions.size,true);
                        disableMoveKeys(false);
                        duplicateCheck = false;
                    }
                    //If 'Ignore' is pressed, continue movement
                    else if (applyChanges == 1) { //ignore
                        if (game.settings.get("NotYourTurn","ChatMessages")==true && role < 3) 
                            whisperGM(token.name + " moved when it was not its turn");                                                                                    
                        disableMoveKeys(false);
                        duplicateCheck = false;
                        oldPositionX = data.x;
                        oldPositionY = data.y;
                    }  
                    else if (applyChanges == 2) { //request movement
                        //Request movement from GM, then apply movement (GM can undo this)
                        let shiftX = (oldPositionX - data.x)/canvas.dimensions.size;
                        let shiftY = (oldPositionY - data.y)/canvas.dimensions.size;
                        for (let i=0; i<game.data.users.length; i++)
                            if (game.data.users[i].role > 2) {
                                let payload = {
                                    "msgType": "requestMovement",
                                    "sender": game.userId, 
                                    "receiver": game.data.users[i]._id, 
                                    "tokenId": token.data._id,
                                    "shiftX": shiftX,
                                    "shiftY": shiftY
                                };
                                game.socket.emit(`module.NotYourTurn`, payload);
                            }
                    }
                }
            });
            d.render(true); 
        }
        timer = Date.now();
    })
})