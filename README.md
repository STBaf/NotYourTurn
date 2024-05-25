# Not Your Turn
'Not Your Turn' is a <a href="https://foundryvtt.com/">Foundry VTT</a> module that prevents tokens from moving when the GM doesn't want it. Using the default settings the module only blocks movement during combat, but by pressing the 'Block Movement' button in the Basic Controls (buttons on the left) you can enable the module for all movement.<br>

<b>Note: </b>If you have a pre v1.1.0 version, you need to uninstall it before you can install the latest version! Any version later than that should update normally.

### Operation
If a player moves a token when it's not the token's turn (or always, if 'Block Movement' is enabled) one of a few things can happen, depending on the settings:
<ul>
<li><b>Off</b> - Nothing, the token can continue moving</li>
<li><b>Warning</b> - A warning is given, but the token can continue moving</li>
<li><b>Dialog</b> - A dialog box appears</li>
<li><b>Autoblock</b> - The token is automatically blocked from moving</li>
</ul>

The dialog box contains the following options:<br>
<ul>
<li><b>Undo</b> - Returns the token to its previous position</li>
<li><b>Ignore</b> - Ignores the step counter (can be disabled)</li>
<li><b>Request</b> - Request the GM to move the token further</li>
</ul>

![dialog](https://github.com/STBaf/NotYourTurn/blob/master/img/examples/Dialog.png)

If the request button is pressed, a dialog box appears for the GM, with the following options:<br>
<ul>
<li><b>Accept</b> - Accepts the movement request</li>
<li><b>Decline</b> - Declines the request and returns the token to its start position</li>
</ul>

![request](https://github.com/STBaf/NotYourTurn/blob/master/img/examples/Request.png)

### Control Buttons
There are 2 'Not Your Turn' control buttons:
<ul>
<li><b>Block Combat Movement</b> - Enabling this will enable movement blocking during combat</li>
<li><b>Block Non-Combat Movement</b> - Enabling this will enable movement blocking when not in combat</li>
</ul>

### Settings
The operation of the module can be modified in the module settings. Here is an overview of the settings:<br>
<ul>
<li><b>Player/Trusted/Assistant/GM</b> - This determines the behavior when a token tries to move when it's not its turn for the specified permission group</li>
<li><b>Ignore Button</b> - This determines what users have access to the 'Ignore' button in the dialog box</li>
<li><b>GM Request Button</b> - Adds or removes the 'Request' button (it is not needed if players have access to the 'Ignore' button)</li>
<li><b>Chat Messages</b> - Creates a chat message whenever a non-gm user either: presses the 'Ignore' button, or moves a token when it's not their turn and 'Turn Block' is set to 'Warning Only'</li>
</ul>

![moduleSettings](https://github.com/STBaf/NotYourTurn/blob/master/img/examples/ModuleSettings.png)

## Software Versions & Module Incompatibilities
<b>Foundry VTT:</b> Tested on v12, v11 and v10<br>
For support of Foundry Version 0.7.9 - 9.280 use earlier versions 1.1.5 up to 1.2.8 of this module<br>
<b>Module Incompatibilities:</b> None known<br>

## Feedback
If you have any suggestions or bugs to report, feel free to contact me on Discord (STB#9841), or send me an email: andre@stbaf.de.<br>
Please contact only the actual maintainer, not the previous authors regarding this module.

## Credits
<b>Author / Maintainer:</b> Andre / STB (stbaf on Discord (old: STB#9841))<br>
Original author of this module was Cristian Deenen (Cris#6864 on Discord). Thanks for all the fantastic work on this module!<br>

### Localization
<b>Spanish:</b> Lozalojo (https://github.com/lozalojo)<br />
<b>French:</b> Maxtor<br />
<b>German:</b> GenX187 (https://github.com/GenX187) and RadicalEd (https://github.com/marcel-wiechmann)<br />
<b>Italian:</b> smoothingplane (https://github.com/smoothingplane)

## Abandonment
Abandoned modules are a (potential) problem for Foundry, because users and/or other modules might rely on abandoned modules, which might break in future Foundry updates.<br>
I consider this module abandoned if all of the below cases apply:
<ul>
  <li>This module/github page has not received any updates in at least 3 months</li>
  <li>I have not posted anything on "the Foundry" and "the League of Extraordinary Foundry VTT Developers" Discord servers in at least 3 months</li>
  <li>I have not responded to emails or PMs on Discord in at least 1 month</li>
  <li>I have not announced a temporary break from development, unless the announced end date of this break has been passed by at least 3 months</li>
</ul>
If the above cases apply (as judged by the "League of Extraordinary Foundry VTT Developers" admins), I give permission to the "League of Extraordinary Foundry VTT Developers" admins to assign one or more developers to take over this module, including requesting the Foundry team to reassign the module to the new developer(s).<br>
I require the "League of Extraordinary Foundry VTT Developers" admins to send me an email 2 weeks before the reassignment takes place, to give me one last chance to prevent the reassignment.<br>
I require to be credited for my work in all future releases.
