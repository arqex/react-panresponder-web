/*!
 * react-panresponder-web v1.0.0
 * (c) 2018-present Javier Marquez
 * Released under the MIT License.
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('react-dom/unstable-native-dependencies')) :
  typeof define === 'function' && define.amd ? define(['react-dom/unstable-native-dependencies'], factory) :
  (global.PanResponder = factory(global.UnstableDependencies));
}(this, (function (ReactDOMUnstableNativeDependencies) { 'use strict';

  var ReactDOMUnstableNativeDependencies__default = 'default' in ReactDOMUnstableNativeDependencies ? ReactDOMUnstableNativeDependencies['default'] : ReactDOMUnstableNativeDependencies;

  /**
   * Copyright (c) 2015-present, Nicolas Gallagher.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *
   */
  var _requestIdleCallback = function _requestIdleCallback(cb, options) {
    return setTimeout(function () {
      var start = Date.now();
      cb({
        didTimeout: false,
        timeRemaining: function timeRemaining() {
          return Math.max(0, 50 - (Date.now() - start));
        }
      });
    }, 1);
  };

  var _cancelIdleCallback = function _cancelIdleCallback(id) {
    clearTimeout(id);
  };

  var isSupported = typeof window.requestIdleCallback !== 'undefined';
  var requestIdleCallback = isSupported ? window.requestIdleCallback : _requestIdleCallback;
  var cancelIdleCallback = isSupported ? window.cancelIdleCallback : _cancelIdleCallback;

  /**
   * Copyright (c) 2016-present, Nicolas Gallagher.
   * Copyright (c) 2015-present, Facebook, Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *
   */
  var InteractionManager = {
    Events: {
      interactionStart: 'interactionStart',
      interactionComplete: 'interactionComplete'
    },

    /**
     * Schedule a function to run after all interactions have completed.
     */
    runAfterInteractions: function runAfterInteractions(task) {
      var handle;
      var promise = new Promise(function (resolve) {
        handle = requestIdleCallback(function () {
          if (task) {
            resolve(task());
          }
        });
      });
      return {
        then: promise.then.bind(promise),
        done: promise.then.bind(promise),
        cancel: function cancel() {
          cancelIdleCallback(handle);
        }
      };
    },

    /**
     * Notify manager that an interaction has started.
     */
    createInteractionHandle: function createInteractionHandle() {
      return 1;
    },

    /**
     * Notify manager that an interaction has completed.
     */
    clearInteractionHandle: function clearInteractionHandle(handle) {
      !handle && console.warn('Must provide a handle to clear.');
    },
    addListener: function addListener() {}
  };

  var TouchHistoryMath = {
    /**
     * This code is optimized and not intended to look beautiful. This allows
     * computing of touch centroids that have moved after `touchesChangedAfter`
     * timeStamp. You can compute the current centroid involving all touches
     * moves after `touchesChangedAfter`, or you can compute the previous
     * centroid of all touches that were moved after `touchesChangedAfter`.
     *
     * @param {TouchHistoryMath} touchHistory Standard Responder touch track
     * data.
     * @param {number} touchesChangedAfter timeStamp after which moved touches
     * are considered "actively moving" - not just "active".
     * @param {boolean} isXAxis Consider `x` dimension vs. `y` dimension.
     * @param {boolean} ofCurrent Compute current centroid for actively moving
     * touches vs. previous centroid of now actively moving touches.
     * @return {number} value of centroid in specified dimension.
     */
    centroidDimension: function centroidDimension(touchHistory, touchesChangedAfter, isXAxis, ofCurrent) {
      var touchBank = touchHistory.touchBank;
      var total = 0;
      var count = 0;
      var oneTouchData = touchHistory.numberActiveTouches === 1 ? touchHistory.touchBank[touchHistory.indexOfSingleActiveTouch] : null;

      if (oneTouchData !== null) {
        if (oneTouchData.touchActive && oneTouchData.currentTimeStamp > touchesChangedAfter) {
          total += ofCurrent && isXAxis ? oneTouchData.currentPageX : ofCurrent && !isXAxis ? oneTouchData.currentPageY : !ofCurrent && isXAxis ? oneTouchData.previousPageX : oneTouchData.previousPageY;
          count = 1;
        }
      } else {
        for (var i = 0; i < touchBank.length; i++) {
          var touchTrack = touchBank[i];

          if (touchTrack !== null && touchTrack !== undefined && touchTrack.touchActive && touchTrack.currentTimeStamp >= touchesChangedAfter) {
            var toAdd = void 0; // Yuck, program temporarily in invalid state.

            if (ofCurrent && isXAxis) {
              toAdd = touchTrack.currentPageX;
            } else if (ofCurrent && !isXAxis) {
              toAdd = touchTrack.currentPageY;
            } else if (!ofCurrent && isXAxis) {
              toAdd = touchTrack.previousPageX;
            } else {
              toAdd = touchTrack.previousPageY;
            }

            total += toAdd;
            count++;
          }
        }
      }

      return count > 0 ? total / count : TouchHistoryMath.noCentroid;
    },
    currentCentroidXOfTouchesChangedAfter: function currentCentroidXOfTouchesChangedAfter(touchHistory, touchesChangedAfter) {
      return TouchHistoryMath.centroidDimension(touchHistory, touchesChangedAfter, true, // isXAxis
      true);
    },
    currentCentroidYOfTouchesChangedAfter: function currentCentroidYOfTouchesChangedAfter(touchHistory, touchesChangedAfter) {
      return TouchHistoryMath.centroidDimension(touchHistory, touchesChangedAfter, false, // isXAxis
      true);
    },
    previousCentroidXOfTouchesChangedAfter: function previousCentroidXOfTouchesChangedAfter(touchHistory, touchesChangedAfter) {
      return TouchHistoryMath.centroidDimension(touchHistory, touchesChangedAfter, true, // isXAxis
      false);
    },
    previousCentroidYOfTouchesChangedAfter: function previousCentroidYOfTouchesChangedAfter(touchHistory, touchesChangedAfter) {
      return TouchHistoryMath.centroidDimension(touchHistory, touchesChangedAfter, false, // isXAxis
      false);
    },
    currentCentroidX: function currentCentroidX(touchHistory) {
      return TouchHistoryMath.centroidDimension(touchHistory, 0, // touchesChangedAfter
      true, // isXAxis
      true);
    },
    currentCentroidY: function currentCentroidY(touchHistory) {
      return TouchHistoryMath.centroidDimension(touchHistory, 0, // touchesChangedAfter
      false, // isXAxis
      true);
    },
    noCentroid: -1
  };

  /**
   * Copyright (c) 2013-present, Facebook, Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */
  var currentCentroidXOfTouchesChangedAfter = TouchHistoryMath.currentCentroidXOfTouchesChangedAfter;
  var currentCentroidYOfTouchesChangedAfter = TouchHistoryMath.currentCentroidYOfTouchesChangedAfter;
  var previousCentroidXOfTouchesChangedAfter = TouchHistoryMath.previousCentroidXOfTouchesChangedAfter;
  var previousCentroidYOfTouchesChangedAfter = TouchHistoryMath.previousCentroidYOfTouchesChangedAfter;
  var currentCentroidX = TouchHistoryMath.currentCentroidX;
  var currentCentroidY = TouchHistoryMath.currentCentroidY;
  /**
   * `PanResponder` reconciles several touches into a single gesture. It makes
   * single-touch gestures resilient to extra touches, and can be used to
   * recognize simple multi-touch gestures.
   *
   * By default, `PanResponder` holds an `InteractionManager` handle to block
   * long-running JS events from interrupting active gestures.
   *
   * It provides a predictable wrapper of the responder handlers provided by the
   * [gesture responder system](docs/gesture-responder-system.html).
   * For each handler, it provides a new `gestureState` object alongside the
   * native event object:
   *
   * ```
   * onPanResponderMove: (event, gestureState) => {}
   * ```
   *
   * A native event is a synthetic touch event with the following form:
   *
   *  - `nativeEvent`
   *      + `changedTouches` - Array of all touch events that have changed since the last event
   *      + `identifier` - The ID of the touch
   *      + `locationX` - The X position of the touch, relative to the element
   *      + `locationY` - The Y position of the touch, relative to the element
   *      + `pageX` - The X position of the touch, relative to the root element
   *      + `pageY` - The Y position of the touch, relative to the root element
   *      + `target` - The node id of the element receiving the touch event
   *      + `timestamp` - A time identifier for the touch, useful for velocity calculation
   *      + `touches` - Array of all current touches on the screen
   *
   * A `gestureState` object has the following:
   *
   *  - `stateID` - ID of the gestureState- persisted as long as there at least
   *     one touch on screen
   *  - `moveX` - the latest screen coordinates of the recently-moved touch
   *  - `moveY` - the latest screen coordinates of the recently-moved touch
   *  - `x0` - the screen coordinates of the responder grant
   *  - `y0` - the screen coordinates of the responder grant
   *  - `dx` - accumulated distance of the gesture since the touch started
   *  - `dy` - accumulated distance of the gesture since the touch started
   *  - `vx` - current velocity of the gesture
   *  - `vy` - current velocity of the gesture
   *  - `numberActiveTouches` - Number of touches currently on screen
   *
   * ### Basic Usage
   *
   * ```
   *   componentWillMount: function() {
   *     this._panResponder = PanResponder.create({
   *       // Ask to be the responder:
   *       onStartShouldSetPanResponder: (evt, gestureState) => true,
   *       onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
   *       onMoveShouldSetPanResponder: (evt, gestureState) => true,
   *       onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
   *
   *       onPanResponderGrant: (evt, gestureState) => {
   *         // The gesture has started. Show visual feedback so the user knows
   *         // what is happening!
   *
   *         // gestureState.d{x,y} will be set to zero now
   *       },
   *       onPanResponderMove: (evt, gestureState) => {
   *         // The most recent move distance is gestureState.move{X,Y}
   *
   *         // The accumulated gesture distance since becoming responder is
   *         // gestureState.d{x,y}
   *       },
   *       onPanResponderTerminationRequest: (evt, gestureState) => true,
   *       onPanResponderRelease: (evt, gestureState) => {
   *         // The user has released all touches while this view is the
   *         // responder. This typically means a gesture has succeeded
   *       },
   *       onPanResponderTerminate: (evt, gestureState) => {
   *         // Another component has become the responder, so this gesture
   *         // should be cancelled
   *       },
   *       onShouldBlockNativeResponder: (evt, gestureState) => {
   *         // Returns whether this component should block native components from becoming the JS
   *         // responder. Returns true by default. Is currently only supported on android.
   *         return true;
   *       },
   *     });
   *   },
   *
   *   render: function() {
   *     return (
   *       <View {...this._panResponder.panHandlers} />
   *     );
   *   },
   *
   * ```
   *
   * ### Working Example
   *
   * To see it in action, try the
   * [PanResponder example in RNTester](https://github.com/facebook/react-native/blob/master/RNTester/js/PanResponderExample.js)
   */

  var PanResponder = {
    /**
     *
     * A graphical explanation of the touch data flow:
     *
     * +----------------------------+             +--------------------------------+
     * | ResponderTouchHistoryStore |             |TouchHistoryMath                |
     * +----------------------------+             +----------+---------------------+
     * |Global store of touchHistory|             |Allocation-less math util       |
     * |including activeness, start |             |on touch history (centroids     |
     * |position, prev/cur position.|             |and multitouch movement etc)    |
     * |                            |             |                                |
     * +----^-----------------------+             +----^---------------------------+
     *      |                                          |
     *      | (records relevant history                |
     *      |  of touches relevant for                 |
     *      |  implementing higher level               |
     *      |  gestures)                               |
     *      |                                          |
     * +----+-----------------------+             +----|---------------------------+
     * | ResponderEventPlugin       |             |    |   Your App/Component      |
     * +----------------------------+             +----|---------------------------+
     * |Negotiates which view gets  | Low level   |    |             High level    |
     * |onResponderMove events.     | events w/   |  +-+-------+     events w/     |
     * |Also records history into   | touchHistory|  |   Pan   |     multitouch +  |
     * |ResponderTouchHistoryStore. +---------------->Responder+-----> accumulative|
     * +----------------------------+ attached to |  |         |     distance and  |
     *                                 each event |  +---------+     velocity.     |
     *                                            |                                |
     *                                            |                                |
     *                                            +--------------------------------+
     *
     *
     *
     * Gesture that calculates cumulative movement over time in a way that just
     * "does the right thing" for multiple touches. The "right thing" is very
     * nuanced. When moving two touches in opposite directions, the cumulative
     * distance is zero in each dimension. When two touches move in parallel five
     * pixels in the same direction, the cumulative distance is five, not ten. If
     * two touches start, one moves five in a direction, then stops and the other
     * touch moves fives in the same direction, the cumulative distance is ten.
     *
     * This logic requires a kind of processing of time "clusters" of touch events
     * so that two touch moves that essentially occur in parallel but move every
     * other frame respectively, are considered part of the same movement.
     *
     * Explanation of some of the non-obvious fields:
     *
     * - moveX/moveY: If no move event has been observed, then `(moveX, moveY)` is
     *   invalid. If a move event has been observed, `(moveX, moveY)` is the
     *   centroid of the most recently moved "cluster" of active touches.
     *   (Currently all move have the same timeStamp, but later we should add some
     *   threshold for what is considered to be "moving"). If a palm is
     *   accidentally counted as a touch, but a finger is moving greatly, the palm
     *   will move slightly, but we only want to count the single moving touch.
     * - x0/y0: Centroid location (non-cumulative) at the time of becoming
     *   responder.
     * - dx/dy: Cumulative touch distance - not the same thing as sum of each touch
     *   distance. Accounts for touch moves that are clustered together in time,
     *   moving the same direction. Only valid when currently responder (otherwise,
     *   it only represents the drag distance below the threshold).
     * - vx/vy: Velocity.
     */
    _initializeGestureState: function _initializeGestureState(gestureState) {
      gestureState.moveX = 0;
      gestureState.moveY = 0;
      gestureState.x0 = 0;
      gestureState.y0 = 0;
      gestureState.dx = 0;
      gestureState.dy = 0;
      gestureState.vx = 0;
      gestureState.vy = 0;
      gestureState.numberActiveTouches = 0; // All `gestureState` accounts for timeStamps up until:

      gestureState._accountsForMovesUpTo = 0;
    },

    /**
     * This is nuanced and is necessary. It is incorrect to continuously take all
     * active *and* recently moved touches, find the centroid, and track how that
     * result changes over time. Instead, we must take all recently moved
     * touches, and calculate how the centroid has changed just for those
     * recently moved touches, and append that change to an accumulator. This is
     * to (at least) handle the case where the user is moving three fingers, and
     * then one of the fingers stops but the other two continue.
     *
     * This is very different than taking all of the recently moved touches and
     * storing their centroid as `dx/dy`. For correctness, we must *accumulate
     * changes* in the centroid of recently moved touches.
     *
     * There is also some nuance with how we handle multiple moved touches in a
     * single event. With the way `ReactNativeEventEmitter` dispatches touches as
     * individual events, multiple touches generate two 'move' events, each of
     * them triggering `onResponderMove`. But with the way `PanResponder` works,
     * all of the gesture inference is performed on the first dispatch, since it
     * looks at all of the touches (even the ones for which there hasn't been a
     * native dispatch yet). Therefore, `PanResponder` does not call
     * `onResponderMove` passed the first dispatch. This diverges from the
     * typical responder callback pattern (without using `PanResponder`), but
     * avoids more dispatches than necessary.
     */
    _updateGestureStateOnMove: function _updateGestureStateOnMove(gestureState, touchHistory) {
      gestureState.numberActiveTouches = touchHistory.numberActiveTouches;
      gestureState.moveX = currentCentroidXOfTouchesChangedAfter(touchHistory, gestureState._accountsForMovesUpTo);
      gestureState.moveY = currentCentroidYOfTouchesChangedAfter(touchHistory, gestureState._accountsForMovesUpTo);
      var movedAfter = gestureState._accountsForMovesUpTo;
      var prevX = previousCentroidXOfTouchesChangedAfter(touchHistory, movedAfter);
      var x = currentCentroidXOfTouchesChangedAfter(touchHistory, movedAfter);
      var prevY = previousCentroidYOfTouchesChangedAfter(touchHistory, movedAfter);
      var y = currentCentroidYOfTouchesChangedAfter(touchHistory, movedAfter);
      var nextDX = gestureState.dx + (x - prevX);
      var nextDY = gestureState.dy + (y - prevY); // TODO: This must be filtered intelligently.

      var dt = touchHistory.mostRecentTimeStamp - gestureState._accountsForMovesUpTo;
      gestureState.vx = (nextDX - gestureState.dx) / dt;
      gestureState.vy = (nextDY - gestureState.dy) / dt;
      gestureState.dx = nextDX;
      gestureState.dy = nextDY;
      gestureState._accountsForMovesUpTo = touchHistory.mostRecentTimeStamp;
    },

    /**
     * @param {object} config Enhanced versions of all of the responder callbacks
     * that provide not only the typical `ResponderSyntheticEvent`, but also the
     * `PanResponder` gesture state.  Simply replace the word `Responder` with
     * `PanResponder` in each of the typical `onResponder*` callbacks. For
     * example, the `config` object would look like:
     *
     *  - `onMoveShouldSetPanResponder: (e, gestureState) => {...}`
     *  - `onMoveShouldSetPanResponderCapture: (e, gestureState) => {...}`
     *  - `onStartShouldSetPanResponder: (e, gestureState) => {...}`
     *  - `onStartShouldSetPanResponderCapture: (e, gestureState) => {...}`
     *  - `onPanResponderReject: (e, gestureState) => {...}`
     *  - `onPanResponderGrant: (e, gestureState) => {...}`
     *  - `onPanResponderStart: (e, gestureState) => {...}`
     *  - `onPanResponderEnd: (e, gestureState) => {...}`
     *  - `onPanResponderRelease: (e, gestureState) => {...}`
     *  - `onPanResponderMove: (e, gestureState) => {...}`
     *  - `onPanResponderTerminate: (e, gestureState) => {...}`
     *  - `onPanResponderTerminationRequest: (e, gestureState) => {...}`
     *  - `onShouldBlockNativeResponder: (e, gestureState) => {...}`
     *
     *  In general, for events that have capture equivalents, we update the
     *  gestureState once in the capture phase and can use it in the bubble phase
     *  as well.
     *
     *  Be careful with onStartShould* callbacks. They only reflect updated
     *  `gestureState` for start/end events that bubble/capture to the Node.
     *  Once the node is the responder, you can rely on every start/end event
     *  being processed by the gesture and `gestureState` being updated
     *  accordingly. (numberActiveTouches) may not be totally accurate unless you
     *  are the responder.
     */
    create: function create(config) {
      var interactionState = {
        handle: null
      };
      var gestureState = {
        // Useful for debugging
        stateID: Math.random()
      };

      PanResponder._initializeGestureState(gestureState);

      var panHandlers = {
        onStartShouldSetResponder: function onStartShouldSetResponder(e) {
          return config.onStartShouldSetPanResponder === undefined ? false : config.onStartShouldSetPanResponder(e, gestureState);
        },
        onMoveShouldSetResponder: function onMoveShouldSetResponder(e) {
          return config.onMoveShouldSetPanResponder === undefined ? false : config.onMoveShouldSetPanResponder(e, gestureState);
        },
        onStartShouldSetResponderCapture: function onStartShouldSetResponderCapture(e) {
          // TODO: Actually, we should reinitialize the state any time
          // touches.length increases from 0 active to > 0 active.
          if (e.nativeEvent.touches.length === 1) {
            PanResponder._initializeGestureState(gestureState);
          }

          gestureState.numberActiveTouches = e.touchHistory.numberActiveTouches;
          return config.onStartShouldSetPanResponderCapture !== undefined ? config.onStartShouldSetPanResponderCapture(e, gestureState) : false;
        },
        onMoveShouldSetResponderCapture: function onMoveShouldSetResponderCapture(e) {
          var touchHistory = e.touchHistory; // Responder system incorrectly dispatches should* to current responder
          // Filter out any touch moves past the first one - we would have
          // already processed multi-touch geometry during the first event.

          if (gestureState._accountsForMovesUpTo === touchHistory.mostRecentTimeStamp) {
            return false;
          }

          PanResponder._updateGestureStateOnMove(gestureState, touchHistory);

          return config.onMoveShouldSetPanResponderCapture ? config.onMoveShouldSetPanResponderCapture(e, gestureState) : false;
        },
        onResponderGrant: function onResponderGrant(e) {
          if (!interactionState.handle) {
            interactionState.handle = InteractionManager.createInteractionHandle();
          }

          gestureState.x0 = currentCentroidX(e.touchHistory);
          gestureState.y0 = currentCentroidY(e.touchHistory);
          gestureState.dx = 0;
          gestureState.dy = 0;

          if (config.onPanResponderGrant) {
            config.onPanResponderGrant(e, gestureState);
          } // TODO: t7467124 investigate if this can be removed


          return config.onShouldBlockNativeResponder === undefined ? true : config.onShouldBlockNativeResponder();
        },
        onResponderReject: function onResponderReject(e) {
          clearInteractionHandle(interactionState, config.onPanResponderReject, e, gestureState);
        },
        onResponderRelease: function onResponderRelease(e) {
          clearInteractionHandle(interactionState, config.onPanResponderRelease, e, gestureState);

          PanResponder._initializeGestureState(gestureState);
        },
        onResponderStart: function onResponderStart(e) {
          var touchHistory = e.touchHistory;
          gestureState.numberActiveTouches = touchHistory.numberActiveTouches;

          if (config.onPanResponderStart) {
            config.onPanResponderStart(e, gestureState);
          }
        },
        onResponderMove: function onResponderMove(e) {
          var touchHistory = e.touchHistory; // Guard against the dispatch of two touch moves when there are two
          // simultaneously changed touches.

          if (gestureState._accountsForMovesUpTo === touchHistory.mostRecentTimeStamp) {
            return;
          } // Filter out any touch moves past the first one - we would have
          // already processed multi-touch geometry during the first event.


          PanResponder._updateGestureStateOnMove(gestureState, touchHistory);

          if (config.onPanResponderMove) {
            config.onPanResponderMove(e, gestureState);
          }
        },
        onResponderEnd: function onResponderEnd(e) {
          var touchHistory = e.touchHistory;
          gestureState.numberActiveTouches = touchHistory.numberActiveTouches;
          clearInteractionHandle(interactionState, config.onPanResponderEnd, e, gestureState);
        },
        onResponderTerminate: function onResponderTerminate(e) {
          clearInteractionHandle(interactionState, config.onPanResponderTerminate, e, gestureState);

          PanResponder._initializeGestureState(gestureState);
        },
        onResponderTerminationRequest: function onResponderTerminationRequest(e) {
          return config.onPanResponderTerminationRequest === undefined ? true : config.onPanResponderTerminationRequest(e, gestureState);
        }
      };
      return {
        panHandlers: panHandlers,
        getInteractionHandle: function getInteractionHandle() {
          return interactionState.handle;
        }
      };
    }
  };

  function clearInteractionHandle(interactionState, callback, event, gestureState) {
    if (interactionState.handle) {
      InteractionManager.clearInteractionHandle(interactionState.handle);
      interactionState.handle = null;
    }

    if (callback) {
      callback(event, gestureState);
    }
  }

  /**
   * Copyright (c) 2015-present, Nicolas Gallagher.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *
   * 
   */

  /**
  * Updated by Javier Marquez - 2018
  */
  var emptyArray = [];

  var emptyFunction = function emptyFunction() {};

  var getRect = function getRect(node) {
    if (node) {
      var isElement = node.nodeType === 1
      /* Node.ELEMENT_NODE */
      ;

      if (isElement && typeof node.getBoundingClientRect === 'function') {
        return node.getBoundingClientRect();
      }
    }
  }; // Mobile Safari re-uses touch objects, so we copy the properties we want and normalize the identifier


  var normalizeTouches = function normalizeTouches(touches) {
    if (!touches) {
      return emptyArray;
    }

    return Array.prototype.slice.call(touches).map(function (touch) {
      var identifier = touch.identifier > 20 ? touch.identifier % 20 : touch.identifier;
      var rect;
      return {
        _normalized: true,
        clientX: touch.clientX,
        clientY: touch.clientY,
        force: touch.force,

        get locationX() {
          rect = rect || getRect(touch.target);
          return rect && touch.pageX - rect.left || undefined;
        },

        get locationY() {
          rect = rect || getRect(touch.target);
          return rect && touch.pageY - rect.top || undefined;
        },

        identifier: identifier,
        pageX: touch.pageX,
        pageY: touch.pageY,
        radiusX: touch.radiusX,
        radiusY: touch.radiusY,
        rotationAngle: touch.rotationAngle,
        screenX: touch.screenX,
        screenY: touch.screenY,
        target: touch.target,
        // normalize the timestamp
        // https://stackoverflow.com/questions/26177087/ios-8-mobile-safari-wrong-timestamp-on-touch-events
        timestamp: Date.now()
      };
    });
  };

  function normalizeTouchEvent(nativeEvent) {
    var changedTouches = normalizeTouches(nativeEvent.changedTouches);
    var touches = normalizeTouches(nativeEvent.touches);
    var preventDefault = typeof nativeEvent.preventDefault === 'function' ? nativeEvent.preventDefault.bind(nativeEvent) : emptyFunction;
    var stopImmediatePropagation = typeof nativeEvent.stopImmediatePropagation === 'function' ? nativeEvent.stopImmediatePropagation.bind(nativeEvent) : emptyFunction;
    var stopPropagation = typeof nativeEvent.stopPropagation === 'function' ? nativeEvent.stopPropagation.bind(nativeEvent) : emptyFunction;
    var event = {
      _normalized: true,
      bubbles: nativeEvent.bubbles,
      cancelable: nativeEvent.cancelable,
      changedTouches: changedTouches,
      defaultPrevented: nativeEvent.defaultPrevented,
      identifier: undefined,
      locationX: undefined,
      locationY: undefined,
      pageX: nativeEvent.pageX,
      pageY: nativeEvent.pageY,
      preventDefault: preventDefault,
      stopImmediatePropagation: stopImmediatePropagation,
      stopPropagation: stopPropagation,
      target: nativeEvent.target,
      // normalize the timestamp
      // https://stackoverflow.com/questions/26177087/ios-8-mobile-safari-wrong-timestamp-on-touch-events
      timestamp: Date.now(),
      touches: touches,
      type: nativeEvent.type,
      which: nativeEvent.which
    };

    if (changedTouches[0]) {
      event.identifier = changedTouches[0].identifier;
      event.pageX = changedTouches[0].pageX;
      event.pageY = changedTouches[0].pageY;
      event.locationX = changedTouches[0].locationX;
      event.locationY = changedTouches[0].locationY;
    }

    return event;
  }

  function normalizeMouseEvent(nativeEvent) {
    var rect;
    var touches = [{
      _normalized: true,
      clientX: nativeEvent.clientX,
      clientY: nativeEvent.clientY,
      force: nativeEvent.force,
      identifier: 0,

      get locationX() {
        rect = rect || getRect(nativeEvent.target);
        return rect && nativeEvent.pageX - rect.left || undefined;
      },

      get locationY() {
        rect = rect || getRect(nativeEvent.target);
        return rect && nativeEvent.pageY - rect.top || undefined;
      },

      pageX: nativeEvent.pageX,
      pageY: nativeEvent.pageY,
      screenX: nativeEvent.screenX,
      screenY: nativeEvent.screenY,
      target: nativeEvent.target,
      timestamp: Date.now()
    }];
    var preventDefault = typeof nativeEvent.preventDefault === 'function' ? nativeEvent.preventDefault.bind(nativeEvent) : emptyFunction;
    var stopImmediatePropagation = typeof nativeEvent.stopImmediatePropagation === 'function' ? nativeEvent.stopImmediatePropagation.bind(nativeEvent) : emptyFunction;
    var stopPropagation = typeof nativeEvent.stopPropagation === 'function' ? nativeEvent.stopPropagation.bind(nativeEvent) : emptyFunction;
    return {
      _normalized: true,
      bubbles: nativeEvent.bubbles,
      cancelable: nativeEvent.cancelable,
      changedTouches: touches,
      defaultPrevented: nativeEvent.defaultPrevented,
      identifier: touches[0].identifier,
      locationX: touches[0].locationX,
      locationY: touches[0].locationY,
      pageX: nativeEvent.pageX,
      pageY: nativeEvent.pageY,
      preventDefault: preventDefault,
      stopImmediatePropagation: stopImmediatePropagation,
      stopPropagation: stopPropagation,
      target: nativeEvent.target,
      timestamp: touches[0].timestamp,
      touches: nativeEvent.type === 'mouseup' ? emptyArray : touches,
      type: nativeEvent.type,
      which: nativeEvent.which
    };
  } // TODO: how to best handle keyboard events?


  function normalizeNativeEvent(nativeEvent) {
    if (!nativeEvent || nativeEvent._normalized) {
      return nativeEvent;
    }

    var eventType = nativeEvent.type || '';
    var mouse = eventType.indexOf('mouse') >= 0;

    if (mouse) {
      return normalizeMouseEvent(nativeEvent);
    } else {
      return normalizeTouchEvent(nativeEvent);
    }
  }

  // based on https://github.com/facebook/react/pull/4303/files
  var ResponderEventPlugin = ReactDOMUnstableNativeDependencies__default.ResponderEventPlugin,
      ResponderTouchHistoryStore = ReactDOMUnstableNativeDependencies__default.ResponderTouchHistoryStore; // On older versions of React (< 16.4) we have to inject the dependencies in
  // order for the plugin to work properly in the browser. This version still
  // uses `top*` strings to identify the internal event names.
  // https://github.com/facebook/react/pull/12629

  var types = ResponderEventPlugin.eventTypes;

  if (!types.responderMove.dependencies) {
    var endDependencies = ['topTouchCancel', 'topTouchEnd', 'topMouseUp'];
    var moveDependencies = ['topTouchMove', 'topMouseMove'];
    var startDependencies = ['topTouchStart', 'topMouseDown'];
    /**
     * Setup ResponderEventPlugin dependencies
     */

    types.responderMove.dependencies = moveDependencies;
    types.responderEnd.dependencies = endDependencies;
    types.responderStart.dependencies = startDependencies;
    types.responderRelease.dependencies = endDependencies;
    types.responderTerminationRequest.dependencies = [];
    types.responderGrant.dependencies = [];
    types.responderReject.dependencies = [];
    types.responderTerminate.dependencies = [];
    types.moveShouldSetResponder.dependencies = moveDependencies;
    types.selectionChangeShouldSetResponder.dependencies = ['topSelectionChange'];
    types.scrollShouldSetResponder.dependencies = ['topScroll'];
    types.startShouldSetResponder.dependencies = startDependencies;
  }

  var lastActiveTouchTimestamp = null;
  var originalExtractEvents = ResponderEventPlugin.extractEvents;

  ResponderEventPlugin.extractEvents = function (topLevelType, targetInst, nativeEvent, nativeEventTarget) {
    var hasActiveTouches = ResponderTouchHistoryStore.touchHistory.numberActiveTouches > 0;
    var eventType = nativeEvent.type;
    var shouldSkipMouseAfterTouch = false;

    if (eventType.indexOf('touch') > -1) {
      lastActiveTouchTimestamp = Date.now();
    } else if (lastActiveTouchTimestamp && eventType.indexOf('mouse') > -1) {
      var now = Date.now();
      shouldSkipMouseAfterTouch = now - lastActiveTouchTimestamp < 250;
    }

    if ( // Filter out mousemove and mouseup events when a touch hasn't started yet
    (eventType === 'mousemove' || eventType === 'mouseup') && !hasActiveTouches || // Filter out events from wheel/middle and right click.
    nativeEvent.button === 1 || nativeEvent.button === 2 || // Filter out mouse events that browsers dispatch immediately after touch events end
    // Prevents the REP from calling handlers twice for touch interactions.
    // See #802 and #932.
    shouldSkipMouseAfterTouch) {
      return;
    }

    var normalizedEvent = normalizeNativeEvent(nativeEvent);
    return originalExtractEvents.call(ResponderEventPlugin, topLevelType, targetInst, normalizedEvent, nativeEventTarget);
  };

  ReactDOMUnstableNativeDependencies.injectEventPluginsByName({
    ResponderEventPlugin: ResponderEventPlugin
  });

  return PanResponder;

})));
