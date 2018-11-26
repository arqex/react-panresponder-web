# react-panresponder-web
This module allows to use the PanResponder created for react-native in the web with react-dom.

Not much code in this repo is originally mine:
* PanResponder is taken directly from facebook source code, making it use just pure JS instead of flow.
* Responder events are already in react-dom but they are not active, this module injects the ResponderEventPlugin in react's event hub allowing to listen to them.
* Special considerations for the web and normalization is taken from (@necolas)[https://github.com/necolas]'s awesome project: (react-native-web)[https://github.com/necolas/react-native-web]

## Install
Simple:
```
npm install react-panresponder-web
```


## Usage
Activates the PanResponder for react-dom
