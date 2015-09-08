# wosu-record
Render osu! replays to video using wosu and Electron.

*Currently in a very very very early stage*

Running requires [Electron](http://electron.atom.io/).

Create a folder called `ext`, find and put:

* ffmpeg.exe
* lzma.min.js
* three.min.js
* WOsu.js

Finally, run `electron src` from the root folder. The page will first hang as it is indexing all songs and skins in the osu! directory. Afterwards, you can drop a replay file and it will render it 1280 x 720, 60 frames a second to `C:\tmp\output.mp4`.
