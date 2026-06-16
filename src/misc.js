export function checkCombat(){
    if (game.combat) 
        return game.combat.started;
    else return false; 
}

export function whisperGM(message){
    game.users.forEach(user => {
        if (user.role > 2) 
            ChatMessage.create({
                content: message,
                whisper: [user._id]
        });                                                                                      
    });
}
