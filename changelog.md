# Changelog

### v2.2.0 - 25-05-2024
Adding support for Foundry v12

### v2.1.4 - 18-09-2023
Fixing undefinied layer bug for scenes without tokens

### v2.1.3 - 14-09-2023
Fixing a possible bug when other modules add additional layers for Tokens to canvas, like Vision 5e does
(Bug occured in combination with Vision 5e module)

### v2.1.2 - 28-08-2023
German translation revision contributed by RadicalEd - thanks!

### v2.1.1 - 27-05-2023
Remove forgotten Debug Switch

### v2.1.0 - 26-05-2023
Update for FoundryVTT v11 stable release
Changes for parallel v10 and v11 compatibility
Minor bugfixes

### v2.0.0 - 01-09-2022
Update for FoundryVTT v10 stable release
Minor bugfixes

### v1.2.8 - 01-09-2022
Preparing update for v10 release - changes to download locations for v9 backward compatiblity

### v1.2.7 - 15-03-2022
Fixes issue 26 - Movement becomes bugged after first pop-up window for player

### v1.2.6 - 24-02-2022
Fixes crashing scene in rendering which leads to not all tokens placed correctly when 3+ players are involved in scene change (Second attempt)

### v1.2.5 - 22-02-2022
Revert non-working changes

### v1.2.4 - 22-02-2022
Fixes crashing scene in rendering which leads to not all tokens placed correctly when 3+ players are involved in scene change

### v1.2.3 - 20-02-2022
Fixes error when saving non-owned token positions due to Foundry permission system

### v1.2.2 - 06-01-2022
Added localisation: Deutsch (German)<br />
Added localisation: Italian

### v1.2.1 - 03-01-2022
Maintainer change. Corresponding changes to Readme and manifest.

### v1.2.0 - 02-01-2022
Changes for compatibility Foundry v9

### v1.1.5 - 31-05-2021
Additions:
-Added option to always block combat movement, even when it's the token's turn

Other:
-Added compatibility for Foundry 0.8.6

### v1.1.4 - 25-02-2021
Additions
-Added control button to quickly enable or disable movement blocking during combat
-Added hooks and hook listeners for external module integration

### v1.1.3 - 01-02-2021
Bug fixes
-'Block Movement' control button would stop working after a scene change
-'Block Movement' control button wouldn't work for a token that is selected by default on a scene load
-GM request would break module if the GM was not on the same scene as the player, it now autorejects

Additions
-French localization added (credit: Maxtor)

### v1.1.2 - 10-11-2020
Bug fix
-Another stupid bug fixed

### v1.1.1 - 05-11-2020
Enhancements
-Spanish translation updated

Bug fix
-Stupid bug fixed :p

### v1.1.0 - 02-11-2020
Enhancements
-Reduced the amount of warnings/chat messages to max 1 per second
-Now works when multiple tokens are moved
-Can now block movement outside of combat, can be toggled by pressing the 'Block Movement' button in the Basic Controls (buttons on the left)

Bug fixes
-Prevented token movement while dialog is open or while waiting for GM response
-Fixed issue with manifest link, where updating in Foundy wouldn't work properly

<b>You need to uninstall and reinstall this module for the update to work</b>

### v1.0.3 - 21-10-2020
Fixed minor bugs
Confirmed 0.7.5 compatibility

### v1.0.2 - 08-10-2020
Added Spanish translation (by Lozalojo: https://github.com/lozalojo)

### v1.0.1 - 06-10-2020
Added localization support<br>
Added core v0.7.3 compatibility

### v1.0.0 - 14-09-2020
Initial release
