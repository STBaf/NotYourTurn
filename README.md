# StepCounter
'Not Your Turn' is a <a href="https://foundryvtt.com/">Foundry VTT</a> module that prevents tokens from moving when it's not their turn in combat.

### Operation
If a player moves a token when it's not the token's turn one of a few things can happen, depending on the settings:
<ul>
<li>Nothing, the player can continue moving</li>
<li>A warning is given</li>
<li>A dialog box appears</li>
<li>The token is automatically blocked from moving</li>
</ul>

The dialog box contains the following options:<br>
<ul>
<li><b>Undo</b> - Returns the token to its previous position</li>
<li><b>Ignore</b> - Ignores the step counter (can be disabled)</li>
<li><b>Request</b> - Request the GM to move the token further</li>
</ul>

If the request button is pressed, a dialog box appears for the GM, with the following options:<br>
<ul>
<li><b>Accept</b> - Accepts the movement request</li>
<li><b>Decline</b> - Declines the request and returns the token to its start position</li>
</ul>

### Settings
The operation of the module can be modified in the module settings. Here is an overview of the settings:<br>
<ul>
<li><b>Turn Block</b> - This determines the behavior when a token tries to move when it's not its turn. It can be 'Off' (nothing happens), 'Warning Only' (only a warning message is displayed), 'Dialog Box' (the above mentioned dialog box is displayed), 'Auto Block' (movement is automatically blocked). These settings can be set for each permission level (player/trusted/assistant/gamemaster).</li>
<li><b>Ignore Button</b> - This determines what users have access to the 'Ignore' button in the dialog box</li>
<li><b>GM Request Button</b> - Adds or removes the 'Request' button (it is not needed if players have acces to the 'Ignore' button)</li>
<li><b>Chat Messages</b> - Creates a chat message whenever a non-gm user either: presses the 'Ignore' button or moves a token when it's not their turn and 'Turn Block' is set to 'Warning Only'</li>
</ul>

### Limitations
<ul>
<li>Currently, the module only works if one token is moved at a time</li>
<li>When a player is waiting on the GM to answer his/her request, the player can move other tokens they control</li>
</ul>

## Software Versions & Module Incompatibilities
<b>Foundry VTT:</b> Tested on 0.6.6<br>
<b>Module Incompatibilities:</b> None known<br>

## Feedback
If you have any suggestions or bugs to report, feel free to contact me on Discord (Cris#6864), or send me an email: cdeenen@outlook.com.

## Credits
<b>Author:</b> Cristian Deenen (Cris#6864 on Discord)<br>

## Changelog
<b>v1.0.0</b> - 13-09-2020 - Initial release<br>