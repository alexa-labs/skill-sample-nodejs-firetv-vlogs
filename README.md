## Fire TV Vlogs

Now with the Alexa Presentation Language, you can incorporate Video components into any display in your skill.

This skill demonstrates using the Video Component, Pager, TouchWrapper, selecting by name, and selecting by ordinal.

In this skill, a user asks Alexa "Open Fire TV Vlogs". They can then choose to select a list item displayed on screen by name: "Show me Adventure in NYC". Or they can select a list item by number: "Show me number one". If you are viewing this skill on a small round hub, the menu is displayed in a Pager component where the user can select by voice.

The skill then directs the user to a display featuring the Video Component with an on-screen Frame featuring the title and description of the video. The command "ControlMedia" is sent alongside the APL document to tell the Video component to play as soon as the display is rendered. There is a Play/Pause toggle button who's state change is dependent on the playing video. When the button is pressed, the state of the button is changed and the video is played or paused depending on the current state of the event.

## License

This library is licensed under the Amazon Software License.
