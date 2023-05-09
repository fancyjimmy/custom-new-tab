This is a Chrome Plugin for custom new Types

## Installation
to install go to the extension tab and unpack the folder in which this project is in 

## Usage
to build it run

### npm run bild

the files referenced in the build script are relative to dist, but files in a chrome plugin have to be relative to the root folder of the plugin, so the build script copies the files to the root folder.
So you have to manually change the paths in the index.html in the dist folder and prefix them with **dist**