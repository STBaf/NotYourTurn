# Not Your Turn
'Not Your Turn' is a <a href="https://foundryvtt.com/">Foundry VTT</a> module that prevents tokens from moving when it's not their turn in combat.<br>
<b>Please note: at the moment the module only works when trying to move one token at a time. Moving multiple tokens might cause unexpected behaviour. This will hopefully be fixed in the next update.</b>

### Operation
If a player moves a token when it's not the token's turn one of a few things can happen, depending on the settings:
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

![dialog](https://github.com/CDeenen/NotYourTurn/blob/master/img/examples/Dialog.png)

If the request button is pressed, a dialog box appears for the GM, with the following options:<br>
<ul>
<li><b>Accept</b> - Accepts the movement request</li>
<li><b>Decline</b> - Declines the request and returns the token to its start position</li>
</ul>

![request](https://github.com/CDeenen/NotYourTurn/blob/master/img/examples/Request.png)

### Settings
The operation of the module can be modified in the module settings. Here is an overview of the settings:<br>
<ul>
<li><b>Player/Trusted/Assistant/GM</b> - This determines the behavior when a token tries to move when it's not its turn for the specified permission group</li>
<li><b>Ignore Button</b> - This determines what users have access to the 'Ignore' button in the dialog box</li>
<li><b>GM Request Button</b> - Adds or removes the 'Request' button (it is not needed if players have access to the 'Ignore' button)</li>
<li><b>Chat Messages</b> - Creates a chat message whenever a non-gm user either: presses the 'Ignore' button, or moves a token when it's not their turn and 'Turn Block' is set to 'Warning Only'</li>
</ul>

![moduleSettings](https://github.com/CDeenen/NotYourTurn/blob/master/img/examples/ModuleSettings.png)

### Limitations/Issues
<ul>
<li>Currently, the module only works if one token is moved at a time. Expect weird behaviour if 'Autoblock' is on, and multiple tokens are moved</li>
<li>When a player is waiting on the GM to answer his/her request, the player can move other tokens they control</li>
</ul>

## Software Versions & Module Incompatibilities
<b>Foundry VTT:</b> Tested on 0.6.6<br>
<b>Module Incompatibilities:</b> None known<br>

## Feedback
If you have any suggestions or bugs to report, feel free to contact me on Discord (Cris#6864), or send me an email: cdeenen@outlook.com.

## Credits
<b>Author:</b> Cristian Deenen (Cris#6864 on Discord)<br>

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
