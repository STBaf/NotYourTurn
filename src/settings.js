export const registerSettings = function() {
    //initialize all settings
    game.settings.register('NotYourTurn','BlockPlayer', {
        name: "NotYourTurn.Player",
        scope: "world",
        config: true,
        type: Number,
        default:2,
        choices:["NotYourTurn.Mode_Off","NotYourTurn.Mode_WarningOnly","NotYourTurn.Mode_Dialogbox","NotYourTurn.Mode_Autoblock"]
    });
    game.settings.register('NotYourTurn','BlockTrusted', {
        name: "NotYourTurn.Trusted",
        scope: "world",
        config: true,
        type: Number,
        default:2,
        choices:["NotYourTurn.Mode_Off","NotYourTurn.Mode_WarningOnly","NotYourTurn.Mode_Dialogbox","NotYourTurn.Mode_Autoblock"]
    });
    game.settings.register('NotYourTurn','BlockAssistant', {
        name: "NotYourTurn.Assistant",
        scope: "world",
        config: true,
        type: Number,
        default:1,
        choices:["NotYourTurn.Mode_Off","NotYourTurn.Mode_WarningOnly","NotYourTurn.Mode_Dialogbox","NotYourTurn.Mode_Autoblock"]
    });
    game.settings.register('NotYourTurn','BlockGM', {
        name: "NotYourTurn.Gamemaster",
        hint: "NotYourTurn.Mode_Hint",
        scope: "world",
        config: true,
        type: Number,
        default:1,
        choices:["NotYourTurn.Mode_Off","NotYourTurn.Mode_WarningOnly","NotYourTurn.Mode_Dialogbox","NotYourTurn.Mode_Autoblock"]
    });

    game.settings.register('NotYourTurn','IgnoreButton', {
        name: "NotYourTurn.IgnoreButton",
        hint: "NotYourTurn.IgnoreButton_Hint",
        scope: "world",
        config: true,
        type: Number,
        default:2,
        choices:["NotYourTurn.Ignore_Everyone","NotYourTurn.Ignore_Trusted","NotYourTurn.Ignore_Assistants","NotYourTurn.Ignore_Gamemaster","NotYourTurn.Ignore_Nobody"]
    });
    game.settings.register('NotYourTurn','RequestButton', {
        name: "NotYourTurn.RequestButton",
        hint: "NotYourTurn.RequestButton_Hint",
        scope: "world",
        config: true,
        default: true,
        type: Boolean
    });
    game.settings.register('NotYourTurn','ChatMessages', {
        name: "NotYourTurn.ChatMessage",
        hint: "NotYourTurn.ChatMessages_Hint",
        scope: "world",
        config: true,
        default: true,
        type: Boolean
    });
    game.settings.register('NotYourTurn','AlwaysBlock', {
        name: "NotYourTurn.AlwaysBlock",
        hint: "NotYourTurn.AlwaysBlock_Hint",
        scope: "world",
        config: true,
        default: false,
        type: Boolean
    });
    game.settings.register('NotYourTurn','nonCombat', {
        name: "nonCombat",
        scope: "world",
        config: false,
        default: false,
        type: Boolean
    });
    game.settings.register('NotYourTurn','enable', {
        name: "enable",
        scope: "world",
        config: false,
        default: true,
        type: Boolean 
    });
}