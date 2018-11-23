import PanResponder from './src/PanResponder'
import ResponderEventPlugin from './src/ResponderEventPlugin'
import { injectEventPluginsByName } from 'react-dom/unstable-native-dependencies'

// Add responder events
injectEventPluginsByName({ ResponderEventPlugin })

export default PanResponder