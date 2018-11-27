# PanResponder for the web
This module allows to use the PanResponder created for react-native in the web with react-dom.

Not much code in this repo is originally mine:
* PanResponder is taken directly from facebook source code, making it use just pure JS instead of flow.
* Responder events are already in react-dom but they are not active, this module injects the ResponderEventPlugin in react's event hub allowing to listen to them.
* Special considerations for the web and normalization is taken from [@necolas](https://github.com/necolas)'s awesome project: [react-native-web](https://github.com/necolas/react-native-web)

I have just glued the pieces.

## Install
```
npm install react-panresponder-web
```

## Usage
```
// Import the pan responder from this package
import PanResponder from 'react-panresponder-web'

// ...then our react component we can initialize it with our own code
this.panResponder =  PanResponder.create({
	onMoveShouldSetResponderCapture: () => true,

	onPanResponderGrant: (e, {x0, y0}) => {	
		this.startDrag( {x: x0, y: y0} )
	},

	onPanResponderMove: (evt, gesture ) => {
		this.onDragging( gesture )
	},

	onPanResponderRelease: () => {
		this.endDrag()
	}
})

// ...Finally in our render method we can add the listeners
render(){
	return (
		<div { ...this.panResponder.panHandlers }>
		</div>
	)
}
```

Just by importing the module the responder events are active for the DOM, they are triggered clicking with the mouse, so you can start listening to them by adding the following props to the elements in your component:
* `onStartShouldSetResponder`
* `onMoveShouldSetResponder`
* `onResponderGrant`
* `onResponderReject`
* `onResponderMove`
* `onResponderRelease`
* `onResponderTerminationRequest`
* `onResponderTerminate`

Have a look at [react-native's gesture responder system](https://facebook.github.io/react-native/docs/gesture-responder-system) to know more.


---

[MIT licensed](LICENSE)
