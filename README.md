# StepCounter
Step Counter is a <a href="https://foundryvtt.com/">Foundry VTT</a> module that adds a step counter to Foundry.
The module counts the distance that a token has moved to keep track of a token's movement, and can be used to prevent tokens from moving when they're not supposed to.
It was developed for DnD 5e.

### Operation
Using the default settings, a small textbox appears on the upper left corner of the screen during combat. This box gives the distance moved, the speed of the token, and whether 'dash' has been used. If a player moves a token further than its speed allows, a dialog box appears. The step counter is automatically reset at the start of the token's turn<br>
<br>
This dialog box contains the following options:<br>
<ul>
<li><b>Undo</b> - Returns the token to its previous position</li>
<li><b>Dash</b> - Applies the dash (bonus)action, to double the token's speed (can only be used once each turn)</li>
<li><b>Reset</b> - Resets the step counter (can be disabled)</li>
<li><b>Ignore</b> - Ignores the step counter (can be disabled)</li>
<li><b>Request</b> - Request the GM to move the token further</li>
</ul>
<br>
Furthermore, if a token is moved when its not the token's turn, a similar dialog box appears containing the following options:<br>
<ul>
<li><b>Undo</b> - Same as above</li>
<li><b>Ignore</b> - Same as above</li>
<li><b>Request</b> - Same as above</li>
</ul>
<br>
If the request button is pressed, a dialog box appears for the GM, with the following options:<br>
<ul>
<li><b>Accept</b> - Accepts the movement request</li>
<li><b>Accept + Reset</b> - Accepts the request and resets the step counter</li>
<li><b>Decline</b> - Declines the request and returns the token to its start position</li>
</ul>

### Settings
The operation of the module can be modified in the module settings. Here is an overview of the settings:<br>
<ul>
<li><b>Turn Block</b> - This determines the behavior when a token tries to move when it's not its turn. It can be 'Off' (nothing happens), 'Warning Only' (only a warning message is displayed), 'Dialog Box' (the above mentioned dialog box is displayed), 'Auto Block' (movement is automatically blocked). These settings can be set for each permission level (player/trusted/assistant/gamemaster).</li>
<li><b>Step Counter</b> - This Determines the behavior when a token tries to move further than its speed allows. It can be 'Off' (nothing happens, no display), 'Display Only' (nothing happens, but the display is shown), 'Display + Warning' (a warning message is displayed, and the display is shown), 'Display + Dialog Box' (above mentioned dialog box appears, and the display is shown), 'Display + Auto Block' (movement is automatically blocked, and the display is shown). These settings can be set for each permission level.</li>
<li><b>Step Counter Reset Button</b> - This determines what users have access to the 'Reset' button in the dialog box.</li>
<li><b>Ignore Step Counter Button</b> - This determines what usersr have access to the 'Ignore' button in the dialog box.</li>
<li><b>GM Request Button</b> - Adds or removes the 'Request' button (it is not needed if players have acces to the 'Reset' and 'Ignore' buttons.</li>
<li><b>Combat Only</b> - Only enables the step counter during combat.</li>
<li><b>Auto Reset</b> - Automatically resets the step counter a the start of a token's turn.</li>
<li><b>Chat Messages</b> - Creates a chat message whenever a non-gm user either: presses the 'Reset' button, presses the 'Ignore' button, moves a token too far when 'Step Counter' is set to 'Display + Warning', moves a token when it's not their turn and 'Turn Block' is set to 'Warning Only'.</li>
</ul>

### Macros
There are 3 macros included as a compendium:
<ul>
<li><b>Enable Dash</b> - Enables dash to double the movement speed</li>
<li><b>Disable Dash</b> - Disables dash</li>
<li><b>Reset Step Counter</b> - Resets the step counter and disables dash</li>
</ul>

## Software Versions & Module Incompatibilities
<b>Foundry VTT:</b> Tested on 0.6.6<br>
<b>DnD5e:</b> Tested on 0.96<br>
<b>Module Incompatibilities:</b> None known<br>

## Feedback
If you have any suggestions or bugs to report, feel free to contact me on Discord (Cris#6864), or send me an email: cdeenen@outlook.com.

## Credits
<b>Author:</b> Cristian Deenen (Cris#6864 on Discord)<br>
<b>Other:</b> The UI is based on the work of kekilla#7036 from his TokenBar module<br>
<b>Special Thanks:</b> Many thanks to kekilla#7036 and cole#9640 for their help<br>

## Changelog
<b>v1.0.0</b> - 08-09-2020 - Initial release<br>
<b>v1.0.1</b> - 09-09-2020 - Minor bug fixes and added 5/10/5 diagonal movement calculations<br>