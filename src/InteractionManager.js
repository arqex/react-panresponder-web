/**
 * Copyright (c) 2016-present, Nicolas Gallagher.
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import requestIdleCallback, { cancelIdleCallback } from './requestIdleCallback';

const InteractionManager = {
  Events: {
    interactionStart: 'interactionStart',
    interactionComplete: 'interactionComplete'
  },

  /**
   * Schedule a function to run after all interactions have completed.
   */
  runAfterInteractions(task) {
    let handle;

    const promise = new Promise(resolve => {
      handle = requestIdleCallback(() => {
        if (task) {
          resolve(task());
        }
      });
    });
    return {
      then: promise.then.bind(promise),
      done: promise.then.bind(promise),
      cancel: () => {
        cancelIdleCallback(handle);
      }
    };
  },

  /**
   * Notify manager that an interaction has started.
   */
  createInteractionHandle() {
    return 1;
  },

  /**
   * Notify manager that an interaction has completed.
   */
  clearInteractionHandle(handle) {
		!handle &&  console.warn('Must provide a handle to clear.');
  },

  addListener: () => {}
};

export default InteractionManager;