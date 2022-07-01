const defaultDelay = {
  mouse: 0,
  drag: 0,
  touch: 100,
};
function calcDelay(optionsDelay) {
  const delay = {};
  if (optionsDelay === void 0) return { ...defaultDelay };
  if (typeof optionsDelay === 'number') {
    for (const key in defaultDelay) {
      if (Object.prototype.hasOwnProperty.call(defaultDelay, key)) {
        delay[key] = optionsDelay;
      }
    }
    return delay;
  }
  return { ...defaultDelay, ...optionsDelay };
}
class Sensor {
  constructor(containers = [], options = {}) {
    this.dragging = false;
    this.currentContainer = null;
    this.originalSource = null;
    this.startEvent = null;
    if (containers instanceof NodeList || containers instanceof Array)
      this.containers = [...containers];
    else if (containers instanceof Element) this.containers = [containers];
    this.options = { ...options };
    this.delay = calcDelay(options.delay);
  }
  attach() {
    return this;
  }
  detach() {
    return this;
  }
  addContainer(...containers) {
    this.containers = [...this.containers, ...containers];
  }
  removeContainer(...containers) {
    this.containers = this.containers.filter(
      (container) => !containers.includes(container)
    );
  }
  trigger(element, sensorEvent) {
    element.dispatchEvent(
      new CustomEvent(sensorEvent.type, {
        detail: sensorEvent,
        bubbles: true,
        cancelable: true,
      })
    );
    this.lastEvent = sensorEvent;
    return sensorEvent;
  }
}
const matchFunction =
  Element.prototype.matches ||
  Element.prototype.mozMatchesSelector ||
  Element.prototype.msMatchesSelector;
function closest(element, value) {
  if (!element) return null;
  function conditionFn(currentElement) {
    if (!currentElement) return currentElement;
    else if (typeof value === 'string')
      return matchFunction.call(currentElement, value);
    else if (value instanceof NodeList || value instanceof Array)
      return [...value].includes(currentElement);
    else if (value instanceof Element) return value === currentElement;
    else if (typeof value === 'function') return value(currentElement);
    else return null;
  }
  let current = element;
  do {
    if (conditionFn(current)) return current;
    current = current.parentNode;
  } while (current && current !== document.body && current !== document);
  return null;
}
const requestNextAnimationFrame = (callback) =>
  requestAnimationFrame(() => {
    requestAnimationFrame(callback);
  });
const distance = (x1, y1, x2, y2) => Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
const touchCoords = (event = {}) => {
  const { touches, changedTouches } = event;
  return (touches && touches[0]) || (changedTouches && changedTouches[0]);
};
const canceled = Symbol('canceled');
const _AbstractEvent = class extends Event {
  constructor(data) {
    super(data == null ? void 0 : data.type, { ...data });
    this[canceled] = false;
    this.data = { ...data };
  }
  get type() {
    return Object.getPrototypeOf(this).constructor.type;
  }
  get cancelable() {
    return Object.getPrototypeOf(this).constructor.cancelable;
  }
  cancel() {
    this[canceled] = true;
  }
  canceled() {
    return Boolean(this[canceled]);
  }
  clone(data) {
    return new _AbstractEvent({
      ...this.data,
      ...data,
    });
  }
};
let AbstractEvent = _AbstractEvent;
AbstractEvent.type = 'event';
AbstractEvent.cancelable = false;
class SensorEvent extends AbstractEvent {
  constructor(data) {
    super(data);
  }
  get originalEvent() {
    return this.data.originalEvent;
  }
  get clientX() {
    return this.data.clientX;
  }
  get clientY() {
    return this.data.clientY;
  }
  get target() {
    return this.data.target;
  }
  get container() {
    return this.data.container;
  }
  get originalSource() {
    return this.data.originalSource;
  }
  get pressure() {
    return this.data.pressure;
  }
  clone(data) {
    return new SensorEvent({
      ...this.data,
      ...data,
    });
  }
}
const _DragStartSensorEvent = class extends SensorEvent {
  clone(data) {
    return new _DragStartSensorEvent({
      ...this.data,
      ...data,
    });
  }
};
let DragStartSensorEvent = _DragStartSensorEvent;
DragStartSensorEvent.type = 'drag:start';
const _DragMoveSensorEvent = class extends SensorEvent {
  clone(data) {
    return new _DragMoveSensorEvent({
      ...this.data,
      ...data,
    });
  }
};
let DragMoveSensorEvent = _DragMoveSensorEvent;
DragMoveSensorEvent.type = 'drag:move';
const _DragStopSensorEvent = class extends SensorEvent {
  clone(data) {
    return new _DragStopSensorEvent({
      ...this.data,
      ...data,
    });
  }
};
let DragStopSensorEvent = _DragStopSensorEvent;
DragStopSensorEvent.type = 'drag:stop';
const _DragPressureSensorEvent = class extends SensorEvent {
  clone(data) {
    return new _DragPressureSensorEvent({
      ...this.data,
      ...data,
    });
  }
};
let DragPressureSensorEvent = _DragPressureSensorEvent;
DragPressureSensorEvent.type = 'drag:pressure';
var _a$f, _b$e, _c$b, _d$a, _e$7, _f$5;
const onContextMenuWhileDragging = Symbol('onContextMenuWhileDragging');
const onMouseDown$2 = Symbol('onMouseDown');
const onMouseMove$1 = Symbol('onMouseMove');
const onMouseUp$2 = Symbol('onMouseUp');
const startDrag$1 = Symbol('startDrag');
const onDistanceChange$1 = Symbol('onDistanceChange');
function preventNativeDragStart(event) {
  event.preventDefault();
}
class MouseSensor extends Sensor {
  constructor() {
    super(...arguments);
    this.mouseDownTimeout = null;
    this.pageX = null;
    this.pageY = null;
    this[_a$f] = (event) => {
      if (event.button !== 0 || event.ctrlKey || event.metaKey) {
        return;
      }
      const container = closest(event.target, this.containers);
      if (!container) {
        return;
      }
      if (
        this.options.handle &&
        event.target &&
        !closest(event.target, this.options.handle)
      ) {
        return;
      }
      const originalSource = closest(event.target, this.options.draggable);
      if (!originalSource) {
        return;
      }
      const { delay } = this;
      const { pageX, pageY } = event;
      Object.assign(this, { pageX, pageY });
      this.onMouseDownAt = Date.now();
      this.startEvent = event;
      this.currentContainer = container;
      this.originalSource = originalSource;
      document.addEventListener('mouseup', this[onMouseUp$2]);
      document.addEventListener('dragstart', preventNativeDragStart);
      document.addEventListener('mousemove', this[onDistanceChange$1]);
      this.mouseDownTimeout = window.setTimeout(() => {
        this[onDistanceChange$1]({
          pageX: this.pageX,
          pageY: this.pageY,
        });
      }, delay.mouse);
    };
    this[_b$e] = () => {
      const startEvent = this.startEvent;
      const container = this.currentContainer;
      const originalSource = this.originalSource;
      const dragStartEvent = new DragStartSensorEvent({
        clientX: startEvent.clientX,
        clientY: startEvent.clientY,
        target: startEvent.target,
        container,
        originalSource,
        originalEvent: startEvent,
      });
      this.trigger(this.currentContainer, dragStartEvent);
      this.dragging = !dragStartEvent.canceled();
      if (this.dragging) {
        document.addEventListener(
          'contextmenu',
          this[onContextMenuWhileDragging],
          true
        );
        document.addEventListener('mousemove', this[onMouseMove$1]);
      }
    };
    this[_c$b] = (event) => {
      const { pageX, pageY } = event;
      const { distance: distance$1 } = this.options;
      const { startEvent, delay } = this;
      Object.assign(this, { pageX, pageY });
      if (!this.currentContainer) return;
      const timeElapsed = Date.now() - this.onMouseDownAt;
      const distanceTravelled =
        distance(startEvent.pageX, startEvent.pageY, pageX, pageY) || 0;
      clearTimeout(this.mouseDownTimeout);
      if (timeElapsed < delay.mouse) {
        document.removeEventListener('mousemove', this[onDistanceChange$1]);
      } else if (distanceTravelled >= distance$1) {
        document.removeEventListener('mousemove', this[onDistanceChange$1]);
        this[startDrag$1]();
      }
    };
    this[_d$a] = (event) => {
      if (!this.dragging) return;
      const target = document.elementFromPoint(event.clientX, event.clientY);
      const dragMoveEvent = new DragMoveSensorEvent({
        clientX: event.clientX,
        clientY: event.clientY,
        target,
        container: this.currentContainer,
        originalEvent: event,
      });
      this.trigger(this.currentContainer, dragMoveEvent);
    };
    this[_e$7] = (event) => {
      clearTimeout(this.mouseDownTimeout);
      if (event.button !== 0) return;
      document.removeEventListener('mouseup', this[onMouseUp$2]);
      document.removeEventListener('dragstart', preventNativeDragStart);
      document.removeEventListener('mousemove', this[onDistanceChange$1]);
      if (!this.dragging) return;
      const target = document.elementFromPoint(event.clientX, event.clientY);
      const dragStopEvent = new DragStopSensorEvent({
        clientX: event.clientX,
        clientY: event.clientY,
        target,
        container: this.currentContainer,
        originalEvent: event,
      });
      this.trigger(this.currentContainer, dragStopEvent);
      document.removeEventListener(
        'contextmenu',
        this[onContextMenuWhileDragging],
        true
      );
      document.removeEventListener('mousemove', this[onMouseMove$1]);
      this.currentContainer = null;
      this.dragging = false;
      this.startEvent = null;
    };
    this[_f$5] = (event) => {
      event.preventDefault();
    };
  }
  attach() {
    document.addEventListener('mousedown', this[onMouseDown$2], true);
  }
  detach() {
    document.removeEventListener('mousedown', this[onMouseDown$2], true);
  }
}
(_a$f = onMouseDown$2),
  (_b$e = startDrag$1),
  (_c$b = onDistanceChange$1),
  (_d$a = onMouseMove$1),
  (_e$7 = onMouseUp$2),
  (_f$5 = onContextMenuWhileDragging);
var _a$e, _b$d, _c$a, _d$9, _e$6;
const onTouchStart = Symbol('onTouchStart');
const onTouchEnd = Symbol('onTouchEnd');
const onTouchMove = Symbol('onTouchMove');
const startDrag = Symbol('startDrag');
const onDistanceChange = Symbol('onDistanceChange');
let preventScrolling = false;
window.addEventListener(
  'touchmove',
  (event) => {
    if (!preventScrolling) {
      return;
    }
    event.preventDefault();
  },
  { passive: false }
);
function onContextMenu(event) {
  event.preventDefault();
  event.stopPropagation();
}
class TouchSensor extends Sensor {
  constructor() {
    super(...arguments);
    this.currentScrollableParent = null;
    this.tapTimeout = null;
    this.touchMoved = false;
    this.onTouchStartAt = null;
    this.pageX = null;
    this.pageY = null;
    this[_a$e] = (event) => {
      const container = closest(event.target, this.containers);
      if (!container) return;
      if (
        this.options.handle &&
        event.target &&
        !closest(event.target, this.options.handle)
      )
        return;
      const originalSource = closest(event.target, this.options.draggable);
      if (!originalSource) return;
      const { distance: distance2 = 0 } = this.options;
      const { delay } = this;
      const { pageX, pageY } = touchCoords(event);
      Object.assign(this, { pageX, pageY });
      this.onTouchStartAt = Date.now();
      this.startEvent = event;
      this.currentContainer = container;
      this.originalSource = originalSource;
      document.addEventListener('touchend', this[onTouchEnd]);
      document.addEventListener('touchcancel', this[onTouchEnd]);
      document.addEventListener('touchmove', this[onDistanceChange]);
      container.addEventListener('contextmenu', onContextMenu);
      if (distance2) {
        preventScrolling = true;
      }
      this.tapTimeout = window.setTimeout(() => {
        navigator.vibrate([50]);
      }, delay.touch);
    };
    this[_b$d] = () => {
      const startEvent = this.startEvent;
      const container = this.currentContainer;
      const originalSource = this.originalSource;
      const touch = touchCoords(startEvent);
      const dragStartEvent = new DragStartSensorEvent({
        clientX: touch.pageX,
        clientY: touch.pageY,
        target: startEvent.target,
        container,
        originalSource,
        originalEvent: startEvent,
      });
      this.trigger(this.currentContainer, dragStartEvent);
      this.dragging = !dragStartEvent.canceled();
      if (this.dragging) {
        document.addEventListener('touchmove', this[onTouchMove]);
      }
      preventScrolling = this.dragging;
    };
    this[_c$a] = (event) => {
      const { distance: distance$1 } = this.options;
      const { startEvent, delay } = this;
      const start = touchCoords(startEvent);
      const current = touchCoords(event);
      const timeElapsed = Date.now() - this.onTouchStartAt;
      const distanceTravelled = distance(
        start.pageX,
        start.pageY,
        current.pageX,
        current.pageY
      );
      Object.assign(this, current);
      clearTimeout(this.tapTimeout);
      if (timeElapsed < delay.touch) {
        document.removeEventListener('touchmove', this[onDistanceChange]);
      } else if (distanceTravelled >= distance$1) {
        document.removeEventListener('touchmove', this[onDistanceChange]);
        this[startDrag]();
      }
    };
    this[_d$9] = (event) => {
      if (!this.dragging) return;
      const { pageX, pageY } = touchCoords(event);
      const target = document.elementFromPoint(
        pageX - window.scrollX,
        pageY - window.scrollY
      );
      const dragMoveEvent = new DragMoveSensorEvent({
        clientX: pageX,
        clientY: pageY,
        target,
        container: this.currentContainer,
        originalEvent: event,
      });
      this.trigger(this.currentContainer, dragMoveEvent);
    };
    this[_e$6] = (event) => {
      clearTimeout(this.tapTimeout);
      preventScrolling = false;
      document.removeEventListener('touchend', this[onTouchEnd]);
      document.removeEventListener('touchcancel', this[onTouchEnd]);
      document.removeEventListener('touchmove', this[onDistanceChange]);
      if (this.currentContainer)
        this.currentContainer.removeEventListener('contextmenu', onContextMenu);
      if (!this.dragging) return;
      document.removeEventListener('touchmove', this[onTouchMove]);
      const { pageX, pageY } = touchCoords(event);
      const target = document.elementFromPoint(
        pageX - window.scrollX,
        pageY - window.scrollY
      );
      event.preventDefault();
      const dragStopEvent = new DragStopSensorEvent({
        clientX: pageX,
        clientY: pageY,
        target,
        container: this.currentContainer,
        originalEvent: event,
      });
      this.trigger(this.currentContainer, dragStopEvent);
      this.currentContainer = null;
      this.dragging = false;
      this.startEvent = null;
    };
  }
  attach() {
    document.addEventListener('touchstart', this[onTouchStart]);
  }
  detach() {
    document.removeEventListener('touchstart', this[onTouchStart]);
  }
}
(_a$e = onTouchStart),
  (_b$d = startDrag),
  (_c$a = onDistanceChange),
  (_d$9 = onTouchMove),
  (_e$6 = onTouchEnd);
var _a$d, _b$c, _c$9, _d$8, _e$5, _f$4;
const onMouseDown$1 = Symbol('onMouseDown');
const onMouseUp$1 = Symbol('onMouseUp');
const onDragStart$7 = Symbol('onDragStart');
const onDragOver$4 = Symbol('onDragOver');
const onDragEnd = Symbol('onDragEnd');
const onDrop = Symbol('onDrop');
const reset = Symbol('reset');
class DragSensor extends Sensor {
  constructor() {
    super(...arguments);
    this.mouseDownTimeout = null;
    this.draggableElement = null;
    this.nativeDraggableElement = null;
    this[_a$d] = (event) => {
      event.dataTransfer.setData('text', '');
      event.dataTransfer.effectAllowed = this.options.type;
      const target = document.elementFromPoint(event.clientX, event.clientY);
      const originalSource = this.draggableElement;
      if (!originalSource) {
        return;
      }
      const dragStartEvent = new DragStartSensorEvent({
        clientX: event.clientX,
        clientY: event.clientY,
        originalSource,
        target,
        container: this.currentContainer,
        originalEvent: event,
      });
      setTimeout(() => {
        this.trigger(this.currentContainer, dragStartEvent);
        if (dragStartEvent.canceled()) {
          this.dragging = false;
        } else {
          this.dragging = true;
        }
      }, 0);
    };
    this[_b$c] = (event) => {
      if (!this.dragging) return;
      const target = document.elementFromPoint(event.clientX, event.clientY);
      const container = this.currentContainer;
      const dragMoveEvent = new DragMoveSensorEvent({
        clientX: event.clientX,
        clientY: event.clientY,
        target,
        container,
        originalEvent: event,
      });
      this.trigger(container, dragMoveEvent);
      if (!dragMoveEvent.canceled()) {
        event.preventDefault();
        event.dataTransfer.dropEffect = this.options.type;
      }
    };
    this[_c$9] = (event) => {
      if (!this.dragging) return;
      document.removeEventListener('mouseup', this[onMouseUp$1], true);
      const target = document.elementFromPoint(event.clientX, event.clientY);
      const container = this.currentContainer;
      const dragStopEvent = new DragStopSensorEvent({
        clientX: event.clientX,
        clientY: event.clientY,
        target,
        container,
        originalEvent: event,
      });
      this.trigger(container, dragStopEvent);
      this.dragging = false;
      this.startEvent = null;
      this[reset]();
    };
    this[_d$8] = (event) => {
      event.preventDefault();
    };
    this[_e$5] = (event) => {
      if (event.target && (event.target.form || event.target.contenteditable))
        return;
      const target = event.target;
      this.currentContainer = closest(target, this.containers);
      if (!this.currentContainer) return;
      if (
        this.options.handle &&
        target &&
        !closest(target, this.options.handle)
      )
        return;
      const originalSource = closest(target, this.options.draggable);
      if (!originalSource) return;
      const nativeDraggableElement = closest(
        event.target,
        (element) => element.draggable
      );
      if (nativeDraggableElement) {
        nativeDraggableElement.draggable = false;
        this.nativeDraggableElement = nativeDraggableElement;
      }
      document.addEventListener('mouseup', this[onMouseUp$1], true);
      document.addEventListener('dragstart', this[onDragStart$7], false);
      document.addEventListener('dragover', this[onDragOver$4], false);
      document.addEventListener('dragend', this[onDragEnd], false);
      document.addEventListener('drop', this[onDrop], false);
      this.startEvent = event;
      this.mouseDownTimeout = setTimeout(() => {
        originalSource.draggable = true;
        this.draggableElement = originalSource;
      }, this.delay.drag);
    };
    this[_f$4] = () => {
      this[reset]();
    };
  }
  attach() {
    document.addEventListener('mousedown', this[onMouseDown$1], true);
  }
  detach() {
    document.removeEventListener('mousedown', this[onMouseDown$1], true);
  }
  [((_a$d = onDragStart$7),
  (_b$c = onDragOver$4),
  (_c$9 = onDragEnd),
  (_d$8 = onDrop),
  (_e$5 = onMouseDown$1),
  (_f$4 = onMouseUp$1),
  reset)]() {
    clearTimeout(this.mouseDownTimeout);
    document.removeEventListener('mouseup', this[onMouseUp$1], true);
    document.removeEventListener('dragstart', this[onDragStart$7], false);
    document.removeEventListener('dragover', this[onDragOver$4], false);
    document.removeEventListener('dragend', this[onDragEnd], false);
    document.removeEventListener('drop', this[onDrop], false);
    if (this.nativeDraggableElement) {
      this.nativeDraggableElement.draggable = true;
      this.nativeDraggableElement = null;
    }
    if (this.draggableElement) {
      this.draggableElement.draggable = false;
      this.draggableElement = null;
    }
  }
}
var _a$c, _b$b, _c$8, _d$7, _e$4, _f$3, _g$1;
const onMouseForceWillBegin = Symbol('onMouseForceWillBegin');
const onMouseForceDown = Symbol('onMouseForceDown');
const onMouseDown = Symbol('onMouseDown');
const onMouseForceChange = Symbol('onMouseForceChange');
const onMouseMove = Symbol('onMouseMove');
const onMouseUp = Symbol('onMouseUp');
const onMouseForceGlobalChange = Symbol('onMouseForceGlobalChange');
class ForceTouchSensor extends Sensor {
  constructor() {
    super(...arguments);
    this.mightDrag = false;
    this[_a$c] = (event) => {
      event.preventDefault();
      this.mightDrag = true;
    };
    this[_b$b] = (event) => {
      if (this.dragging) return;
      const target = document.elementFromPoint(event.clientX, event.clientY);
      const container = event.currentTarget;
      if (
        this.options.handle &&
        target &&
        !closest(target, this.options.handle)
      ) {
        return;
      }
      const originalSource = closest(target, this.options.draggable);
      if (!originalSource) {
        return;
      }
      const dragStartEvent = new DragStartSensorEvent({
        clientX: event.clientX,
        clientY: event.clientY,
        target,
        container,
        originalSource,
        originalEvent: event,
      });
      this.trigger(container, dragStartEvent);
      this.currentContainer = container;
      this.dragging = !dragStartEvent.canceled();
      this.mightDrag = false;
    };
    this[_c$8] = (event) => {
      if (!this.dragging) return;
      const dragStopEvent = new DragStopSensorEvent({
        clientX: event.clientX,
        clientY: event.clientY,
        target: null,
        container: this.currentContainer,
        originalEvent: event,
      });
      this.trigger(this.currentContainer, dragStopEvent);
      this.currentContainer = null;
      this.dragging = false;
      this.mightDrag = false;
    };
    this[_d$7] = (event) => {
      if (!this.mightDrag) return;
      event.stopPropagation();
      event.stopImmediatePropagation();
      event.preventDefault();
    };
    this[_e$4] = (event) => {
      if (!this.dragging) return;
      const target = document.elementFromPoint(event.clientX, event.clientY);
      const dragMoveEvent = new DragMoveSensorEvent({
        clientX: event.clientX,
        clientY: event.clientY,
        target,
        container: this.currentContainer,
        originalEvent: event,
      });
      this.trigger(this.currentContainer, dragMoveEvent);
    };
    this[_f$3] = (event) => {
      if (this.dragging) return;
      const target = event.target;
      const container = event.currentTarget;
      const dragPressureEvent = new DragPressureSensorEvent({
        pressure: event.webkitForce,
        clientX: event.clientX,
        clientY: event.clientY,
        target,
        container,
        originalEvent: event,
      });
      this.trigger(container, dragPressureEvent);
    };
    this[_g$1] = (event) => {
      if (!this.dragging) return;
      const target = event.target;
      const dragPressureEvent = new DragPressureSensorEvent({
        pressure: event.webkitForce,
        clientX: event.clientX,
        clientY: event.clientY,
        target,
        container: this.currentContainer,
        originalEvent: event,
      });
      this.trigger(this.currentContainer, dragPressureEvent);
    };
  }
  attach() {
    for (const container of this.containers) {
      container.addEventListener(
        'webkitmouseforcewillbegin',
        this[onMouseForceWillBegin],
        false
      );
      container.addEventListener(
        'webkitmouseforcedown',
        this[onMouseForceDown],
        false
      );
      container.addEventListener('mousedown', this[onMouseDown], true);
      container.addEventListener(
        'webkitmouseforcechanged',
        this[onMouseForceChange],
        false
      );
    }
    document.addEventListener('mousemove', this[onMouseMove]);
    document.addEventListener('mouseup', this[onMouseUp]);
  }
  detach() {
    for (const container of this.containers) {
      container.removeEventListener(
        'webkitmouseforcewillbegin',
        this[onMouseForceWillBegin],
        false
      );
      container.removeEventListener(
        'webkitmouseforcedown',
        this[onMouseForceDown],
        false
      );
      container.removeEventListener('mousedown', this[onMouseDown], true);
      container.removeEventListener(
        'webkitmouseforcechanged',
        this[onMouseForceChange],
        false
      );
    }
    document.removeEventListener('mousemove', this[onMouseMove]);
    document.removeEventListener('mouseup', this[onMouseUp]);
  }
}
(_a$c = onMouseForceWillBegin),
  (_b$b = onMouseForceDown),
  (_c$8 = onMouseUp),
  (_d$7 = onMouseDown),
  (_e$4 = onMouseMove),
  (_f$3 = onMouseForceChange),
  (_g$1 = onMouseForceGlobalChange);
var index$2 = /* @__PURE__ */ Object.freeze(
  /* @__PURE__ */ Object.defineProperty(
    {
      __proto__: null,
      Sensor,
      MouseSensor,
      TouchSensor,
      DragSensor,
      ForceTouchSensor,
      SensorEvent,
      DragStartSensorEvent,
      DragMoveSensorEvent,
      DragStopSensorEvent,
      DragPressureSensorEvent,
    },
    Symbol.toStringTag,
    { value: 'Module' }
  )
);
class AbstractPlugin {
  constructor(draggable) {
    this.draggable = draggable;
  }
  attach() {
    throw new Error('Not Implemented');
  }
  detach() {
    throw new Error('Not Implemented');
  }
}
const _CollidableEvent = class extends AbstractEvent {
  get dragEvent() {
    return this.data.dragEvent;
  }
  clone(data) {
    return new _CollidableEvent({
      ...this.data,
      ...data,
    });
  }
};
let CollidableEvent = _CollidableEvent;
CollidableEvent.type = 'collidable';
const _CollidableInEvent = class extends CollidableEvent {
  get collidingElement() {
    return this.data.collidingElement;
  }
  clone(data) {
    return new _CollidableInEvent({
      ...this.data,
      ...data,
    });
  }
};
let CollidableInEvent = _CollidableInEvent;
CollidableInEvent.type = 'collidable:in';
const _CollidableOutEvent = class extends CollidableEvent {
  get collidingElement() {
    return this.data.collidingElement;
  }
  clone(data) {
    return new _CollidableOutEvent({
      ...this.data,
      ...data,
    });
  }
};
let CollidableOutEvent = _CollidableOutEvent;
CollidableOutEvent.type = 'collidable:out';
var _a$b, _b$a, _c$7;
const onDragMove$4 = Symbol('onDragMove');
const onDragStop$7 = Symbol('onDragStop');
const onRequestAnimationFrame = Symbol('onRequestAnimationFrame');
class Collidable extends AbstractPlugin {
  constructor() {
    super(...arguments);
    this.currentlyCollidingElement = null;
    this.lastCollidingElement = null;
    this.currentAnimationFrame = null;
    this[_a$b] = (event) => {
      const target = event.sensorEvent.target;
      this.currentAnimationFrame = requestAnimationFrame(
        this[onRequestAnimationFrame](target)
      );
      if (this.currentlyCollidingElement) {
        event.cancel();
      }
      const collidableInEvent = new CollidableInEvent({
        dragEvent: event,
        collidingElement: this.currentlyCollidingElement,
      });
      const collidableOutEvent = new CollidableOutEvent({
        dragEvent: event,
        collidingElement: this.lastCollidingElement,
      });
      const enteringCollidable = Boolean(
        this.currentlyCollidingElement &&
          this.lastCollidingElement !== this.currentlyCollidingElement
      );
      const leavingCollidable = Boolean(
        !this.currentlyCollidingElement && this.lastCollidingElement
      );
      if (enteringCollidable) {
        if (this.lastCollidingElement) {
          this.draggable.trigger(collidableOutEvent);
        }
        this.draggable.trigger(collidableInEvent);
      } else if (leavingCollidable) {
        this.draggable.trigger(collidableOutEvent);
      }
      this.lastCollidingElement = this.currentlyCollidingElement;
    };
    this[_b$a] = (event) => {
      const lastCollidingElement =
        this.currentlyCollidingElement || this.lastCollidingElement;
      const collidableOutEvent = new CollidableOutEvent({
        dragEvent: event,
        collidingElement: lastCollidingElement,
      });
      if (lastCollidingElement) this.draggable.trigger(collidableOutEvent);
      this.lastCollidingElement = null;
      this.currentlyCollidingElement = null;
    };
    this[_c$7] = (target) => {
      return () => {
        const collidables = this.getCollidables();
        this.currentlyCollidingElement = closest(target, (element) =>
          collidables.includes(element)
        );
      };
    };
  }
  attach() {
    this.draggable
      .on('drag:move', this[onDragMove$4])
      .on('drag:stop', this[onDragStop$7]);
  }
  detach() {
    this.draggable
      .off('drag:move', this[onDragMove$4])
      .off('drag:stop', this[onDragStop$7]);
  }
  getCollidables() {
    const collidables = this.draggable.options.collidables;
    if (typeof collidables === 'string') {
      return Array.prototype.slice.call(document.querySelectorAll(collidables));
    } else if (
      collidables instanceof NodeList ||
      collidables instanceof Array
    ) {
      return Array.prototype.slice.call(collidables);
    } else if (collidables instanceof HTMLElement) {
      return [collidables];
    } else if (typeof collidables === 'function') {
      return collidables();
    } else {
      return [];
    }
  }
}
(_a$b = onDragMove$4), (_b$a = onDragStop$7), (_c$7 = onRequestAnimationFrame);
var _a$a, _b$9, _c$6, _d$6;
const onMirrorCreated$2 = Symbol('onMirrorCreated');
const onMirrorDestroy$1 = Symbol('onMirrorDestroy');
const onDragOver$3 = Symbol('onDragOver');
const resize = Symbol('resize');
const defaultOptions$8 = {};
class ResizeMirror extends AbstractPlugin {
  constructor(draggable) {
    super(draggable);
    this.lastWidth = 0;
    this.lastHeight = 0;
    this.mirror = null;
    this.getOptions = () => {
      var _a2;
      return (_a2 = this.draggable.options.resizeMirror) != null ? _a2 : {};
    };
    this[_a$a] = ({ mirror }) => {
      this.mirror = mirror;
    };
    this[_b$9] = () => {
      this.mirror = null;
    };
    this[_c$6] = (dragEvent) => {
      this[resize](dragEvent);
    };
    this[_d$6] = ({ overContainer, over }) => {
      requestAnimationFrame(() => {
        if (!this.mirror.parentNode) return;
        if (this.mirror.parentNode !== overContainer)
          overContainer.appendChild(this.mirror);
        const overElement =
          over != null
            ? over
            : this.draggable.getDraggableElementsForContainer(overContainer)[0];
        if (!overElement) return;
        requestNextAnimationFrame(() => {
          const overRect = overElement.getBoundingClientRect();
          if (
            this.lastHeight === overRect.height &&
            this.lastWidth === overRect.width
          ) {
            return;
          }
          this.mirror.style.width = `${overRect.width}px`;
          this.mirror.style.height = `${overRect.height}px`;
          this.lastWidth = overRect.width;
          this.lastHeight = overRect.height;
        });
      });
    };
    this.options = {
      ...defaultOptions$8,
      ...this.getOptions(),
    };
    this[onMirrorCreated$2] = this[onMirrorCreated$2].bind(this);
    this[onMirrorDestroy$1] = this[onMirrorDestroy$1].bind(this);
    this[onDragOver$3] = this[onDragOver$3].bind(this);
  }
  attach() {
    this.draggable
      .on('mirror:created', this[onMirrorCreated$2])
      .on('drag:over', this[onDragOver$3])
      .on('drag:over:container', this[onDragOver$3]);
  }
  detach() {
    this.draggable
      .off('mirror:created', this[onMirrorCreated$2])
      .off('mirror:destroy', this[onMirrorDestroy$1])
      .off('drag:over', this[onDragOver$3])
      .off('drag:over:container', this[onDragOver$3]);
  }
}
(_a$a = onMirrorCreated$2),
  (_b$9 = onMirrorDestroy$1),
  (_c$6 = onDragOver$3),
  (_d$6 = resize);
const _SnapEvent = class extends AbstractEvent {
  get dragEvent() {
    return this.data.dragEvent;
  }
  get snappable() {
    return this.data.snappable;
  }
  clone(data) {
    return new _SnapEvent({
      ...this.data,
      ...data,
    });
  }
};
let SnapEvent = _SnapEvent;
SnapEvent.type = 'snap';
const _SnapInEvent = class extends SnapEvent {
  clone(data) {
    return new _SnapInEvent({
      ...this.data,
      ...data,
    });
  }
};
let SnapInEvent = _SnapInEvent;
SnapInEvent.type = 'snap:in';
SnapInEvent.cancelable = true;
const _SnapOutEvent = class extends SnapEvent {
  clone(data) {
    return new _SnapOutEvent({
      ...this.data,
      ...data,
    });
  }
};
let SnapOutEvent = _SnapOutEvent;
SnapOutEvent.type = 'snap:out';
SnapOutEvent.cancelable = true;
var _a$9, _b$8, _c$5, _d$5, _e$3, _f$2;
const onDragStart$6 = Symbol('onDragStart');
const onDragStop$6 = Symbol('onDragStop');
const onDragOver$2 = Symbol('onDragOver');
const onDragOut = Symbol('onDragOut');
const onMirrorCreated$1 = Symbol('onMirrorCreated');
const onMirrorDestroy = Symbol('onMirrorDestroy');
class Snappable extends AbstractPlugin {
  constructor() {
    super(...arguments);
    this.firstSource = null;
    this.mirror = null;
    this[_a$9] = (event) => {
      if (event.canceled()) return;
      this.firstSource = event.source;
    };
    this[_b$8] = () => {
      this.firstSource = null;
    };
    this[_c$5] = (event) => {
      var _a2, _b2;
      if (event.canceled()) return;
      const source =
        (_a2 = event.source) != null ? _a2 : event.dragEvent.source;
      if (source === this.firstSource) {
        this.firstSource = null;
        return;
      }
      const snapInEvent = new SnapInEvent({
        dragEvent: event,
        snappable: (_b2 = event.over) != null ? _b2 : event.droppable,
      });
      this.draggable.trigger(snapInEvent);
      if (snapInEvent.canceled()) return;
      if (this.mirror) this.mirror.style.display = 'none';
      source.classList.remove(
        ...this.draggable.getClassNamesFor('source:dragging')
      );
      source.classList.add(...this.draggable.getClassNamesFor('source:placed'));
      setTimeout(() => {
        source == null
          ? void 0
          : source.classList.remove(
              ...this.draggable.getClassNamesFor('source:placed')
            );
      }, this.draggable.options.placedTimeout);
    };
    this[_d$5] = (event) => {
      var _a2, _b2;
      if (event.canceled()) return;
      const source =
        (_a2 = event.source) != null ? _a2 : event.dragEvent.source;
      const snapOutEvent = new SnapOutEvent({
        dragEvent: event,
        snappable: (_b2 = event.over) != null ? _b2 : event.droppable,
      });
      this.draggable.trigger(snapOutEvent);
      if (snapOutEvent.canceled()) return;
      if (this.mirror) this.mirror.style.display = '';
      source.classList.add(
        ...this.draggable.getClassNamesFor('source:dragging')
      );
    };
    this[_e$3] = ({ mirror }) => {
      this.mirror = mirror;
    };
    this[_f$2] = () => {
      this.mirror = null;
    };
  }
  attach() {
    this.draggable
      .on('drag:start', this[onDragStart$6])
      .on('drag:stop', this[onDragStop$6])
      .on('drag:over', this[onDragOver$2])
      .on('drag:out', this[onDragOut])
      .on('droppable:over', this[onDragOver$2])
      .on('droppable:out', this[onDragOut])
      .on('mirror:created', this[onMirrorCreated$1])
      .on('mirror:destroy', this[onMirrorDestroy]);
  }
  detach() {
    this.draggable
      .off('drag:start', this[onDragStart$6])
      .off('drag:stop', this[onDragStop$6])
      .off('drag:over', this[onDragOver$2])
      .off('drag:out', this[onDragOut])
      .off('droppable:over', this[onDragOver$2])
      .off('droppable:out', this[onDragOut])
      .off('mirror:created', this[onMirrorCreated$1])
      .off('mirror:destroy', this[onMirrorDestroy]);
  }
}
(_a$9 = onDragStart$6),
  (_b$8 = onDragStop$6),
  (_c$5 = onDragOver$2),
  (_d$5 = onDragOut),
  (_e$3 = onMirrorCreated$1),
  (_f$2 = onMirrorDestroy);
var _a$8;
const onSortableSorted$1 = Symbol('onSortableSorted');
const defaultOptions$7 = {
  duration: 150,
  easingFunction: 'ease-in-out',
  horizontal: false,
};
function resetElementOnTransitionEnd$1(event) {
  var _a2;
  event.target.style.transition = '';
  event.target.style.pointerEvents = '';
  (_a2 = event.target) == null
    ? void 0
    : _a2.removeEventListener('transitionend', resetElementOnTransitionEnd$1);
}
function animate$1(from, to, { duration, easingFunction, horizontal }) {
  for (const element of [from, to]) {
    element.style.pointerEvents = 'none';
  }
  if (horizontal) {
    const width = from.offsetWidth;
    from.style.transform = `translate3d(${width}px, 0, 0)`;
    to.style.transform = `translate3d(-${width}px, 0, 0)`;
  } else {
    const height = from.offsetHeight;
    from.style.transform = `translate3d(0, ${height}px, 0)`;
    to.style.transform = `translate3d(0, -${height}px, 0)`;
  }
  requestAnimationFrame(() => {
    for (const element of [from, to]) {
      element.addEventListener('transitionend', resetElementOnTransitionEnd$1);
      element.style.transition = `transform ${duration}ms ${easingFunction}`;
      element.style.transform = '';
    }
  });
}
class SwapAnimation extends AbstractPlugin {
  constructor(draggable) {
    super(draggable);
    this.getOptions = () => {
      var _a2;
      return (_a2 = this.draggable.options.swapAnimation) != null ? _a2 : {};
    };
    this[_a$8] = ({ oldIndex, newIndex, dragEvent }) => {
      const { source, over } = dragEvent;
      cancelAnimationFrame(this.lastAnimationFrame);
      this.lastAnimationFrame = requestAnimationFrame(() => {
        if (oldIndex >= newIndex) animate$1(source, over, this.options);
        else animate$1(over, source, this.options);
      });
    };
    this.options = {
      ...defaultOptions$7,
      ...this.getOptions(),
    };
    this[onSortableSorted$1] = this[onSortableSorted$1].bind(this);
  }
  attach() {
    this.draggable.on('sortable:sorted', this[onSortableSorted$1]);
  }
  detach() {
    this.draggable.off('sortable:sorted', this[onSortableSorted$1]);
  }
}
_a$8 = onSortableSorted$1;
var _a$7, _b$7;
const onSortableSorted = Symbol('onSortableSorted');
const onSortableSort = Symbol('onSortableSort');
const defaultOptions$6 = {
  duration: 150,
  easingFunction: 'ease-in-out',
};
function resetElementOnTransitionEnd(event) {
  var _a2;
  event.target.style.transition = '';
  event.target.style.pointerEvents = '';
  (_a2 = event.target) == null
    ? void 0
    : _a2.removeEventListener('transitionend', resetElementOnTransitionEnd);
}
function animate({ from, to }, { duration, easingFunction }) {
  const domEl = from.domEl;
  const x = from.offsetLeft - to.offsetLeft;
  const y = from.offsetTop - to.offsetTop;
  domEl.style.pointerEvents = 'none';
  domEl.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  requestAnimationFrame(() => {
    domEl.addEventListener('transitionend', resetElementOnTransitionEnd);
    domEl.style.transition = `transform ${duration}ms ${easingFunction}`;
    domEl.style.transform = '';
  });
}
class SortAnimation extends AbstractPlugin {
  constructor(draggable) {
    super(draggable);
    this.lastElements = [];
    this.getOptions = () => {
      var _a2;
      return (_a2 = this.draggable.options.sortAnimation) != null ? _a2 : {};
    };
    this[_a$7] = (event) => {
      const { sourceContainer } = event.dragEvent;
      const elements =
        this.draggable.getDraggableElementsForContainer(sourceContainer);
      this.lastElements = [...elements].map((el) => ({
        domEl: el,
        offsetTop: el.offsetTop,
        offsetLeft: el.offsetLeft,
      }));
    };
    this[_b$7] = ({ oldIndex, newIndex }) => {
      if (oldIndex === newIndex) return;
      const effectedElements = [];
      let start, end, num;
      if (oldIndex > newIndex) {
        start = newIndex;
        end = oldIndex - 1;
        num = 1;
      } else {
        start = oldIndex + 1;
        end = newIndex;
        num = -1;
      }
      for (let i = start; i <= end; i++) {
        const from = this.lastElements[i];
        const to = this.lastElements[i + num];
        effectedElements.push({ from, to });
      }
      cancelAnimationFrame(this.lastAnimationFrame);
      this.lastAnimationFrame = requestAnimationFrame(() => {
        effectedElements.forEach((element) => animate(element, this.options));
      });
    };
    this.options = {
      ...defaultOptions$6,
      ...this.getOptions(),
    };
    this[onSortableSorted] = this[onSortableSorted].bind(this);
    this[onSortableSort] = this[onSortableSort].bind(this);
  }
  attach() {
    this.draggable.on('sortable:sort', this[onSortableSort]);
    this.draggable.on('sortable:sorted', this[onSortableSorted]);
  }
  detach() {
    this.draggable.off('sortable:sort', this[onSortableSort]);
    this.draggable.off('sortable:sorted', this[onSortableSorted]);
  }
}
(_a$7 = onSortableSort), (_b$7 = onSortableSorted);
var index$1 = /* @__PURE__ */ Object.freeze(
  /* @__PURE__ */ Object.defineProperty(
    {
      __proto__: null,
      Collidable,
      ResizeMirror,
      defaultResizeMirrorOptions: defaultOptions$8,
      Snappable,
      SwapAnimation,
      defaultSwapAnimationOptions: defaultOptions$7,
      SortAnimation,
      defaultSortAnimationOptions: defaultOptions$6,
    },
    Symbol.toStringTag,
    { value: 'Module' }
  )
);
const _DragEvent = class extends AbstractEvent {
  constructor(data) {
    super(data);
  }
  get source() {
    return this.data.source;
  }
  get originalSource() {
    return this.data.originalSource;
  }
  get mirror() {
    return this.data.mirror;
  }
  get sourceContainer() {
    return this.data.sourceContainer;
  }
  get sensorEvent() {
    return this.data.sensorEvent;
  }
  get originalEvent() {
    return this.sensorEvent ? this.sensorEvent.originalEvent : null;
  }
  get detail() {
    return this.detail;
  }
  clone(data) {
    return new _DragEvent({
      ...this.data,
      ...data,
    });
  }
};
let DragEvent = _DragEvent;
DragEvent.type = 'drag';
const _DragStartEvent = class extends DragEvent {
  clone(data) {
    return new _DragStartEvent({
      ...this.data,
      ...data,
    });
  }
};
let DragStartEvent = _DragStartEvent;
DragStartEvent.type = 'drag:start';
DragStartEvent.cancelable = true;
const _DragMoveEvent = class extends DragEvent {
  clone(data) {
    return new _DragMoveEvent({
      ...this.data,
      ...data,
    });
  }
};
let DragMoveEvent = _DragMoveEvent;
DragMoveEvent.type = 'drag:move';
const _DragOverEvent = class extends DragEvent {
  get overContainer() {
    return this.data.overContainer;
  }
  get over() {
    return this.data.over;
  }
  clone(data) {
    return new _DragOverEvent({
      ...this.data,
      ...data,
    });
  }
};
let DragOverEvent = _DragOverEvent;
DragOverEvent.type = 'drag:over';
DragOverEvent.cancelable = true;
const _DragOutEvent = class extends DragEvent {
  get overContainer() {
    return this.data.overContainer;
  }
  get over() {
    return this.data.over;
  }
  clone(data) {
    return new _DragOutEvent({
      ...this.data,
      ...data,
    });
  }
};
let DragOutEvent = _DragOutEvent;
DragOutEvent.type = 'drag:out';
const _DragOverContainerEvent = class extends DragEvent {
  get overContainer() {
    return this.data.overContainer;
  }
  get over() {
    return this.data.over;
  }
  clone(data) {
    return new _DragOverContainerEvent({
      ...this.data,
      ...data,
    });
  }
};
let DragOverContainerEvent = _DragOverContainerEvent;
DragOverContainerEvent.type = 'drag:over:container';
const _DragOutContainerEvent = class extends DragEvent {
  get overContainer() {
    return this.data.overContainer;
  }
  clone(data) {
    return new _DragOutContainerEvent({
      ...this.data,
      ...data,
    });
  }
};
let DragOutContainerEvent = _DragOutContainerEvent;
DragOutContainerEvent.type = 'drag:out:container';
const _DragPressureEvent = class extends DragEvent {
  get pressure() {
    return this.data.pressure;
  }
  clone(data) {
    return new _DragPressureEvent({
      ...this.data,
      ...data,
    });
  }
};
let DragPressureEvent = _DragPressureEvent;
DragPressureEvent.type = 'drag:pressure';
const _DragStopEvent = class extends DragEvent {
  clone(data) {
    return new _DragStopEvent({
      ...this.data,
      ...data,
    });
  }
};
let DragStopEvent = _DragStopEvent;
DragStopEvent.type = 'drag:stop';
DragStopEvent.cancelable = true;
const _DragStoppedEvent = class extends DragEvent {
  clone(data) {
    return new _DragStoppedEvent({
      ...this.data,
      ...data,
    });
  }
};
let DragStoppedEvent = _DragStoppedEvent;
DragStoppedEvent.type = 'drag:stopped';
const _DraggableEvent = class extends AbstractEvent {
  get draggable() {
    return this.data.draggable;
  }
  clone(data) {
    return new _DraggableEvent({
      ...this.data,
      ...data,
    });
  }
};
let DraggableEvent = _DraggableEvent;
DraggableEvent.type = 'draggable';
const _DraggableInitializedEvent = class extends DraggableEvent {
  clone(data) {
    return new _DraggableInitializedEvent({
      ...this.data,
      ...data,
    });
  }
};
let DraggableInitializedEvent = _DraggableInitializedEvent;
DraggableInitializedEvent.type = 'draggable:initialize';
const _DraggableDestroyEvent = class extends DraggableEvent {
  clone(data) {
    return new _DraggableDestroyEvent({
      ...this.data,
      ...data,
    });
  }
};
let DraggableDestroyEvent = _DraggableDestroyEvent;
DraggableDestroyEvent.type = 'draggable:destroy';
class Emitter {
  constructor() {
    this.callbacks = {};
  }
  on(type, ...callbacks) {
    if (!this.callbacks[type]) {
      this.callbacks[type] = [];
    }
    this.callbacks[type].push(...callbacks);
    return this;
  }
  off(type, callback) {
    if (!this.callbacks[type]) return null;
    const copy = [...this.callbacks[type]];
    copy.forEach((copyCallback, index2) => {
      if (callback === copyCallback) this.callbacks[type].splice(index2, 1);
    });
    return this;
  }
  trigger(event) {
    if (!this.callbacks[event.type]) return null;
    const callbacks = [...this.callbacks[event.type]];
    const caughtErrors = [];
    for (let i = callbacks.length - 1; i >= 0; i--) {
      const callback = callbacks[i];
      try {
        callback(event);
      } catch (error) {
        caughtErrors.push(error);
      }
    }
    if (caughtErrors.length) {
      console.error(
        `Draggable caught errors while triggering '${event.type}'`,
        caughtErrors
      );
    }
    return this;
  }
}
var _a$6, _b$6;
const onInitialize$1 = Symbol('onInitialize');
const onDestroy$1 = Symbol('onDestroy');
const announceEvent = Symbol('announceEvent');
const announceMessage = Symbol('announceMessage');
const ARIA_RELEVANT = 'aria-relevant';
const ARIA_ATOMIC = 'aria-atomic';
const ARIA_LIVE = 'aria-live';
const ROLE = 'role';
const defaultOptions$5 = {
  expire: 7e3,
};
function createRegion() {
  const element = document.createElement('div');
  element.setAttribute('id', 'draggable-live-region');
  element.setAttribute(ARIA_RELEVANT, 'additions');
  element.setAttribute(ARIA_ATOMIC, 'true');
  element.setAttribute(ARIA_LIVE, 'assertive');
  element.setAttribute(ROLE, 'log');
  element.style.position = 'fixed';
  element.style.width = '1px';
  element.style.height = '1px';
  element.style.top = '-1px';
  element.style.overflow = 'hidden';
  return element;
}
const liveRegion = createRegion();
function announce(message, { expire }) {
  const element = document.createElement('div');
  element.textContent = message;
  liveRegion.appendChild(element);
  return setTimeout(() => {
    liveRegion.removeChild(element);
  }, expire);
}
document.addEventListener('DOMContentLoaded', () => {
  document.body.appendChild(liveRegion);
});
class Announcement extends AbstractPlugin {
  constructor(draggable) {
    super(draggable);
    this.getOptions = () => {
      var _a2;
      return (_a2 = this.draggable.options.announcements) != null ? _a2 : {};
    };
    this[_a$6] = () => {
      this.draggable.trigger = (event) => {
        try {
          this[announceEvent](event);
        } finally {
          this.originalTriggerMethod.call(this.draggable, event);
        }
        return this.draggable;
      };
    };
    this[_b$6] = () => {
      this.draggable.trigger = this.originalTriggerMethod;
    };
    this.options = {
      ...defaultOptions$5,
      ...this.getOptions(),
    };
    this.originalTriggerMethod = this.draggable.trigger;
  }
  attach() {
    this.draggable.on('draggable:initialize', this[onInitialize$1]);
  }
  detach() {
    this.draggable.off('draggable:destroy', this[onDestroy$1]);
  }
  [announceEvent](event) {
    const message = this.options[event.type];
    if (message && typeof message === 'string') this[announceMessage](message);
    if (message && typeof message === 'function')
      this[announceMessage](message(event));
  }
  [announceMessage](message) {
    announce(message, { expire: this.options.expire });
  }
}
(_a$6 = onInitialize$1), (_b$6 = onDestroy$1);
var _a$5, _b$5;
const onInitialize = Symbol('onInitialize');
const onDestroy = Symbol('onDestroy');
const defaultOptions$4 = {};
const elementsWithMissingTabIndex = [];
function decorateElement(element) {
  const hasMissingTabIndex = Boolean(
    !element.getAttribute('tabindex') && element.tabIndex === -1
  );
  if (hasMissingTabIndex) {
    elementsWithMissingTabIndex.push(element);
    element.tabIndex = 0;
  }
}
function stripElement(element) {
  const tabIndexElementPosition = elementsWithMissingTabIndex.indexOf(element);
  if (tabIndexElementPosition !== -1) {
    element.tabIndex = -1;
    elementsWithMissingTabIndex.splice(tabIndexElementPosition, 1);
  }
}
class Focusable extends AbstractPlugin {
  constructor(draggable) {
    super(draggable);
    this.getOptions = () => {
      var _a2;
      return (_a2 = this.draggable.options.focusable) != null ? _a2 : {};
    };
    this.getElements = () => [
      ...this.draggable.containers,
      ...this.draggable.getDraggableElements(),
    ];
    this[_a$5] = () => {
      requestAnimationFrame(() => {
        this.getElements().forEach((element) => decorateElement(element));
      });
    };
    this[_b$5] = () => {
      requestAnimationFrame(() => {
        this.getElements().forEach((element) => stripElement(element));
      });
    };
    this.options = {
      ...defaultOptions$4,
      ...this.getOptions(),
    };
  }
  attach() {
    this.draggable
      .on('draggable:initialize', this[onInitialize])
      .on('draggable:destroy', this[onDestroy]);
  }
  detach() {
    this.draggable
      .off('draggable:initialize', this[onInitialize])
      .off('draggable:destroy', this[onDestroy]);
    this[onDestroy]();
  }
}
(_a$5 = onInitialize), (_b$5 = onDestroy);
class MirrorEvent extends AbstractEvent {
  get source() {
    return this.data.source;
  }
  get originalSource() {
    return this.data.originalSource;
  }
  get sourceContainer() {
    return this.data.sourceContainer;
  }
  get sensorEvent() {
    return this.data.sensorEvent;
  }
  get dragEvent() {
    return this.data.dragEvent;
  }
  get originalEvent() {
    return this.sensorEvent ? this.sensorEvent.originalEvent : null;
  }
  clone(data) {
    return new MirrorEvent({
      ...this.data,
      ...data,
    });
  }
}
const _MirrorCreateEvent = class extends MirrorEvent {
  clone(data) {
    return new _MirrorCreateEvent({
      ...this.data,
      ...data,
    });
  }
};
let MirrorCreateEvent = _MirrorCreateEvent;
MirrorCreateEvent.type = 'mirror:create';
const _MirrorCreatedEvent = class extends MirrorEvent {
  get mirror() {
    return this.data.mirror;
  }
  clone(data) {
    return new _MirrorCreatedEvent({
      ...this.data,
      ...data,
    });
  }
};
let MirrorCreatedEvent = _MirrorCreatedEvent;
MirrorCreatedEvent.type = 'mirror:created';
const _MirrorAttachedEvent = class extends MirrorEvent {
  get mirror() {
    return this.data.mirror;
  }
  clone(data) {
    return new _MirrorAttachedEvent({
      ...this.data,
      ...data,
    });
  }
};
let MirrorAttachedEvent = _MirrorAttachedEvent;
MirrorAttachedEvent.type = 'mirror:attached';
const _MirrorMoveEvent = class extends MirrorEvent {
  get mirror() {
    return this.data.mirror;
  }
  get passedThreshX() {
    return this.data.passedThreshX;
  }
  get passedThreshY() {
    return this.data.passedThreshY;
  }
  clone(data) {
    return new _MirrorMoveEvent({
      ...this.data,
      ...data,
    });
  }
};
let MirrorMoveEvent = _MirrorMoveEvent;
MirrorMoveEvent.type = 'mirror:move';
MirrorMoveEvent.cancelable = true;
const _MirrorMovedEvent = class extends MirrorEvent {
  get mirror() {
    return this.data.mirror;
  }
  get passedThreshX() {
    return this.data.passedThreshX;
  }
  get passedThreshY() {
    return this.data.passedThreshY;
  }
  clone(data) {
    return new _MirrorMovedEvent({
      ...this.data,
      ...data,
    });
  }
};
let MirrorMovedEvent = _MirrorMovedEvent;
MirrorMovedEvent.type = 'mirror:moved';
const _MirrorDestroyEvent = class extends MirrorEvent {
  get mirror() {
    return this.data.mirror;
  }
  clone(data) {
    return new _MirrorDestroyEvent({
      ...this.data,
      ...data,
    });
  }
};
let MirrorDestroyEvent = _MirrorDestroyEvent;
MirrorDestroyEvent.type = 'mirror:destroy';
MirrorDestroyEvent.cancelable = true;
var _a$4, _b$4, _c$4, _d$4, _e$2, _f$1;
const onDragStart$5 = Symbol('onDragStart');
const onDragMove$3 = Symbol('onDragMove');
const onDragStop$5 = Symbol('onDragStop');
const onMirrorCreated = Symbol('onMirrorCreated');
const onMirrorMove = Symbol('onMirrorMove');
const onScroll = Symbol('onScroll');
const getAppendableContainer = Symbol('getAppendableContainer');
const defaultOptions$3 = {
  constrainDimensions: false,
  xAxis: true,
  yAxis: true,
  cursorOffsetX: null,
  cursorOffsetY: null,
  thresholdX: null,
  thresholdY: null,
};
function withPromise(callback, { withFrame = false } = {}) {
  return new Promise((resolve, reject) => {
    if (withFrame) {
      requestAnimationFrame(() => {
        callback(resolve, reject);
      });
    } else callback(resolve, reject);
  });
}
function computeMirrorDimensions({ source, ...args }) {
  return withPromise((resolve) => {
    const sourceRect = source.getBoundingClientRect();
    resolve({ source, sourceRect, ...args });
  });
}
function calculateMirrorOffset({ sensorEvent, sourceRect, options, ...args }) {
  return withPromise((resolve) => {
    const top =
      options.cursorOffsetY === null
        ? sensorEvent.clientY - sourceRect.top
        : options.cursorOffsetY;
    const left =
      options.cursorOffsetX === null
        ? sensorEvent.clientX - sourceRect.left
        : options.cursorOffsetX;
    const mirrorOffset = { top, left };
    resolve({ sensorEvent, sourceRect, mirrorOffset, options, ...args });
  });
}
function resetMirror({ mirror, source, options, ...args }) {
  return withPromise((resolve) => {
    let offsetHeight;
    let offsetWidth;
    if (options.constrainDimensions) {
      const computedSourceStyles = getComputedStyle(source);
      offsetHeight = computedSourceStyles.getPropertyValue('height');
      offsetWidth = computedSourceStyles.getPropertyValue('width');
    }
    mirror.style.display = null;
    mirror.style.position = 'fixed';
    mirror.style.pointerEvents = 'none';
    mirror.style.top = 0;
    mirror.style.left = 0;
    mirror.style.margin = 0;
    if (options.constrainDimensions) {
      mirror.style.height = offsetHeight;
      mirror.style.width = offsetWidth;
    }
    resolve({ mirror, source, options, ...args });
  });
}
function addMirrorClasses({ mirror, mirrorClasses, ...args }) {
  return withPromise((resolve) => {
    mirror.classList.add(...mirrorClasses);
    resolve({ mirror, mirrorClasses, ...args });
  });
}
function removeMirrorID({ mirror, ...args }) {
  return withPromise((resolve) => {
    mirror.removeAttribute('id');
    delete mirror.id;
    resolve({ mirror, ...args });
  });
}
function positionMirror({ withFrame = false, initial = false } = {}) {
  return ({
    mirror,
    sensorEvent,
    mirrorOffset,
    initialY,
    initialX,
    scrollOffset,
    options,
    passedThreshX,
    passedThreshY,
    lastMovedX,
    lastMovedY,
    ...args
  }) =>
    withPromise(
      (resolve) => {
        var _a2, _b2, _c2, _d2;
        const result = {
          mirror,
          sensorEvent,
          mirrorOffset,
          options,
          ...args,
        };
        if (mirrorOffset) {
          const x = passedThreshX
            ? Math.round(
                (sensorEvent.clientX - mirrorOffset.left - scrollOffset.x) /
                  ((_a2 = options.thresholdX) != null ? _a2 : 1)
              ) * ((_b2 = options.thresholdX) != null ? _b2 : 1)
            : Math.round(lastMovedX);
          const y = passedThreshY
            ? Math.round(
                (sensorEvent.clientY - mirrorOffset.top - scrollOffset.y) /
                  ((_c2 = options.thresholdY) != null ? _c2 : 1)
              ) * ((_d2 = options.thresholdY) != null ? _d2 : 1)
            : Math.round(lastMovedY);
          const { xAxis, yAxis } = options;
          mirror.style.transform = `translate3d(${
            xAxis || initial ? x : initialX
          }px, ${yAxis || initial ? y : initialY}px, 0)`;
          if (initial) {
            result.initialX = x;
            result.initialY = y;
          }
          result.lastMovedX = x;
          result.lastMovedY = y;
        }
        resolve(result);
      },
      { withFrame }
    );
}
const isNativeDragEvent = (sensorEvent) =>
  /^drag/.test(sensorEvent.originalEvent.type);
class Mirror extends AbstractPlugin {
  constructor(draggable) {
    super(draggable);
    this.scrollOffset = { x: 0, y: 0 };
    this.initialScrollOffset = { x: 0, y: 0 };
    this.getOptions = () => {
      var _a2;
      return (_a2 = this.draggable.options.mirror) != null ? _a2 : {};
    };
    this[_a$4] = (dragEvent) => {
      if (dragEvent.canceled()) return;
      if ('ontouchstart' in window) {
        document.addEventListener('scroll', this[onScroll], true);
      }
      this.initialScrollOffset = {
        x: window.scrollX,
        y: window.scrollY,
      };
      const { source, originalSource, sourceContainer, sensorEvent } =
        dragEvent;
      this.lastMirrorMovedClient = {
        x: sensorEvent.clientX,
        y: sensorEvent.clientY,
      };
      const mirrorCreateEvent = new MirrorCreateEvent({
        source,
        originalSource,
        sourceContainer,
        sensorEvent,
        dragEvent,
      });
      this.draggable.trigger(mirrorCreateEvent);
      if (isNativeDragEvent(sensorEvent) || mirrorCreateEvent.canceled()) {
        return;
      }
      const appendableContainer =
        this[getAppendableContainer](source) || sourceContainer;
      this.mirror = source.cloneNode(true);
      this.mirror.setAttribute('role', 'dragmirror');
      const mirrorCreatedEvent = new MirrorCreatedEvent({
        source,
        originalSource,
        sourceContainer,
        sensorEvent,
        dragEvent,
        originalEvent: dragEvent.originalEvent,
        mirror: this.mirror,
      });
      const mirrorAttachedEvent = new MirrorAttachedEvent({
        source,
        originalSource,
        sourceContainer,
        sensorEvent,
        dragEvent,
        mirror: this.mirror,
      });
      this.draggable.trigger(mirrorCreatedEvent);
      appendableContainer.appendChild(this.mirror);
      this.draggable.trigger(mirrorAttachedEvent);
    };
    this[_b$4] = (dragEvent) => {
      if (!this.mirror || dragEvent.canceled()) return;
      const {
        source,
        originalSource,
        sourceContainer,
        sensorEvent,
        originalEvent,
      } = dragEvent;
      let passedThreshX = true,
        passedThreshY = true;
      const { thresholdX, thresholdY } = this.options;
      if (thresholdX || thresholdY) {
        const { x: lastX, y: lastY } = this.lastMirrorMovedClient;
        if (Math.abs(lastX - sensorEvent.clientX) < thresholdX)
          passedThreshX = false;
        else this.lastMirrorMovedClient.x = sensorEvent.clientX;
        if (Math.abs(lastY - sensorEvent.clientY) < thresholdY)
          passedThreshY = false;
        else this.lastMirrorMovedClient.y = sensorEvent.clientY;
        if (!passedThreshX && !passedThreshY) return;
      }
      const mirrorMoveEvent = new MirrorMoveEvent({
        source,
        originalSource,
        sourceContainer,
        sensorEvent,
        dragEvent,
        originalEvent,
        mirror: this.mirror,
        passedThreshX,
        passedThreshY,
      });
      this.draggable.trigger(mirrorMoveEvent);
    };
    this[_c$4] = (dragEvent) => {
      if ('ontouchstart' in window) {
        document.removeEventListener('scroll', this[onScroll], true);
      }
      this.initialScrollOffset = { x: 0, y: 0 };
      this.scrollOffset = { x: 0, y: 0 };
      if (!this.mirror) return;
      const { source, sourceContainer, sensorEvent } = dragEvent;
      const mirrorDestroyEvent = new MirrorDestroyEvent({
        source,
        mirror: this.mirror,
        sourceContainer,
        sensorEvent,
        dragEvent,
      });
      this.draggable.trigger(mirrorDestroyEvent);
      if (!mirrorDestroyEvent.canceled()) {
        this.mirror.remove();
      }
    };
    this[_d$4] = () => {
      this.scrollOffset = {
        x: window.scrollX - this.initialScrollOffset.x,
        y: window.scrollY - this.initialScrollOffset.y,
      };
    };
    this[_e$2] = ({ mirror, source, sensorEvent }) => {
      const mirrorClasses = this.draggable.getClassNamesFor('mirror');
      const setState = ({ mirrorOffset, initialX, initialY, ...args }) => {
        this.mirrorOffset = mirrorOffset;
        this.initialX = initialX;
        this.initialY = initialY;
        this.lastMovedX = initialX;
        this.lastMovedY = initialY;
        return { mirrorOffset, initialX, initialY, ...args };
      };
      mirror.style.display = 'none';
      const initialState = {
        mirror,
        source,
        sensorEvent,
        mirrorClasses,
        scrollOffset: this.scrollOffset,
        options: this.options,
        passedThreshX: true,
        passedThreshY: true,
      };
      return Promise.resolve(initialState)
        .then(computeMirrorDimensions)
        .then(calculateMirrorOffset)
        .then(resetMirror)
        .then(addMirrorClasses)
        .then(positionMirror({ initial: true }))
        .then(removeMirrorID)
        .then(setState);
    };
    this[_f$1] = (mirrorEvent) => {
      if (mirrorEvent.canceled()) return null;
      const setState = ({ lastMovedX, lastMovedY, ...args }) => {
        this.lastMovedX = lastMovedX;
        this.lastMovedY = lastMovedY;
        return { lastMovedX, lastMovedY, ...args };
      };
      const triggerMoved = (args) => {
        const mirrorMovedEvent = new MirrorMovedEvent({
          source: mirrorEvent.source,
          originalSource: mirrorEvent.originalSource,
          sourceContainer: mirrorEvent.sourceContainer,
          sensorEvent: mirrorEvent.sensorEvent,
          dragEvent: mirrorEvent.dragEvent,
          mirror: this.mirror,
          passedThreshX: mirrorEvent.passedThreshX,
          passedThreshY: mirrorEvent.passedThreshY,
        });
        this.draggable.trigger(mirrorMovedEvent);
        return args;
      };
      const initialState = {
        mirror: mirrorEvent.mirror,
        sensorEvent: mirrorEvent.sensorEvent,
        passedThreshX: mirrorEvent.passedThreshX,
        passedThreshY: mirrorEvent.passedThreshY,
        mirrorOffset: this.mirrorOffset,
        options: this.options,
        scrollOffset: this.scrollOffset,
        initialX: this.initialX,
        initialY: this.initialY,
        lastMovedX: this.lastMovedX,
        lastMovedY: this.lastMovedY,
      };
      return Promise.resolve(initialState)
        .then(positionMirror({ withFrame: true }))
        .then(setState)
        .then(triggerMoved);
    };
    this.options = {
      ...defaultOptions$3,
      ...this.getOptions(),
    };
    this.initialScrollOffset = {
      x: window.scrollX,
      y: window.scrollY,
    };
  }
  attach() {
    this.draggable
      .on('drag:start', this[onDragStart$5])
      .on('drag:move', this[onDragMove$3])
      .on('drag:stop', this[onDragStop$5])
      .on('mirror:created', this[onMirrorCreated])
      .on('mirror:move', this[onMirrorMove]);
  }
  detach() {
    this.draggable
      .off('drag:start', this[onDragStart$5])
      .off('drag:move', this[onDragMove$3])
      .off('drag:stop', this[onDragStop$5])
      .off('mirror:created', this[onMirrorCreated])
      .off('mirror:move', this[onMirrorMove]);
  }
  [((_a$4 = onDragStart$5),
  (_b$4 = onDragMove$3),
  (_c$4 = onDragStop$5),
  (_d$4 = onScroll),
  (_e$2 = onMirrorCreated),
  (_f$1 = onMirrorMove),
  getAppendableContainer)](source) {
    const { appendTo } = this.options;
    if (typeof appendTo === 'string') return document.querySelector(appendTo);
    else if (appendTo instanceof HTMLElement) return appendTo;
    else if (typeof appendTo === 'function') return appendTo(source);
    else return source.parentNode;
  }
}
var _a$3, _b$3, _c$3, _d$3;
const onDragStart$4 = Symbol('onDragStart');
const onDragMove$2 = Symbol('onDragMove');
const onDragStop$4 = Symbol('onDragStop');
const scroll = Symbol('scroll');
const defaultOptions$2 = {
  speed: 6,
  sensitivity: 50,
  scrollableElements: [],
};
const getDocumentScrollingElement = () => {
  var _a2;
  return (_a2 = document.scrollingElement) != null
    ? _a2
    : document.documentElement;
};
function hasOverflow(element) {
  const overflowRegex = /(auto|scroll)/;
  const computedStyles = getComputedStyle(element, null);
  const overflow =
    computedStyles.getPropertyValue('overflow') +
    computedStyles.getPropertyValue('overflow-y') +
    computedStyles.getPropertyValue('overflow-x');
  return overflowRegex.test(overflow);
}
function isStaticallyPositioned(element) {
  const position = getComputedStyle(element).getPropertyValue('position');
  return position === 'static';
}
function closestScrollableElement(element) {
  if (!element) return getDocumentScrollingElement();
  const position = getComputedStyle(element).getPropertyValue('position');
  const excludeStaticParents = position === 'absolute';
  const scrollableElement = closest(element, (parent) => {
    if (excludeStaticParents && isStaticallyPositioned(parent)) {
      return false;
    }
    return hasOverflow(parent);
  });
  if (position === 'fixed' || !scrollableElement)
    return getDocumentScrollingElement();
  else return scrollableElement;
}
class Scrollable extends AbstractPlugin {
  constructor(draggable) {
    super(draggable);
    this.currentMousePosition = null;
    this.scrollAnimationFrame = null;
    this.scrollableElement = null;
    this.findScrollableElementFrame = null;
    this.getOptions = () => {
      var _a2;
      return (_a2 = this.draggable.options.scrollable) != null ? _a2 : {};
    };
    this.hasDefinedScrollableElements = () =>
      Boolean(this.options.scrollableElements.length !== 0);
    this[_a$3] = (dragEvent) => {
      this.findScrollableElementFrame = requestAnimationFrame(() => {
        this.scrollableElement = this.getScrollableElement(dragEvent.source);
      });
    };
    this[_b$3] = (dragEvent) => {
      this.findScrollableElementFrame = requestAnimationFrame(() => {
        this.scrollableElement = this.getScrollableElement(
          dragEvent.sensorEvent.target
        );
      });
      if (!this.scrollableElement) return;
      const sensorEvent = dragEvent.sensorEvent;
      const scrollOffset = { x: 0, y: 0 };
      if ('ontouchstart' in window) {
        scrollOffset.y =
          window.pageYOffset ||
          document.documentElement.scrollTop ||
          document.body.scrollTop ||
          0;
        scrollOffset.x =
          window.pageXOffset ||
          document.documentElement.scrollLeft ||
          document.body.scrollLeft ||
          0;
      }
      this.currentMousePosition = {
        clientX: sensorEvent.clientX - scrollOffset.x,
        clientY: sensorEvent.clientY - scrollOffset.y,
      };
      this.scrollAnimationFrame = requestAnimationFrame(this[scroll]);
    };
    this[_c$3] = () => {
      cancelAnimationFrame(this.scrollAnimationFrame);
      cancelAnimationFrame(this.findScrollableElementFrame);
      this.scrollableElement = null;
      this.scrollAnimationFrame = null;
      this.findScrollableElementFrame = null;
      this.currentMousePosition = null;
    };
    this[_d$3] = () => {
      if (!this.scrollableElement || !this.currentMousePosition) return;
      cancelAnimationFrame(this.scrollAnimationFrame);
      const { speed, sensitivity } = this.options;
      const rect = this.scrollableElement.getBoundingClientRect();
      const bottomCutOff = rect.bottom > window.innerHeight;
      const topCutOff = rect.top < 0;
      const cutOff = topCutOff || bottomCutOff;
      const documentScrollingElement = getDocumentScrollingElement();
      const scrollableElement = this.scrollableElement;
      const clientX = this.currentMousePosition.clientX;
      const clientY = this.currentMousePosition.clientY;
      if (
        scrollableElement !== document.body &&
        scrollableElement !== document.documentElement &&
        !cutOff
      ) {
        const { offsetHeight, offsetWidth } = scrollableElement;
        if (rect.top + offsetHeight - clientY < sensitivity) {
          scrollableElement.scrollTop += speed;
        } else if (clientY - rect.top < sensitivity) {
          scrollableElement.scrollTop -= speed;
        }
        if (rect.left + offsetWidth - clientX < sensitivity) {
          scrollableElement.scrollLeft += speed;
        } else if (clientX - rect.left < sensitivity) {
          scrollableElement.scrollLeft -= speed;
        }
      } else {
        const { innerHeight, innerWidth } = window;
        if (clientY < sensitivity) {
          documentScrollingElement.scrollTop -= speed;
        } else if (innerHeight - clientY < sensitivity) {
          documentScrollingElement.scrollTop += speed;
        }
        if (clientX < sensitivity) {
          documentScrollingElement.scrollLeft -= speed;
        } else if (innerWidth - clientX < sensitivity) {
          documentScrollingElement.scrollLeft += speed;
        }
      }
      this.scrollAnimationFrame = requestAnimationFrame(this[scroll]);
    };
    this.options = { ...defaultOptions$2, ...this.getOptions() };
  }
  attach() {
    this.draggable
      .on('drag:start', this[onDragStart$4])
      .on('drag:move', this[onDragMove$2])
      .on('drag:stop', this[onDragStop$4]);
  }
  detach() {
    this.draggable
      .off('drag:start', this[onDragStart$4])
      .off('drag:move', this[onDragMove$2])
      .off('drag:stop', this[onDragStop$4]);
  }
  getScrollableElement(target) {
    if (this.hasDefinedScrollableElements()) {
      return (
        closest(target, this.options.scrollableElements) ||
        document.documentElement
      );
    } else return closestScrollableElement(target);
  }
}
(_a$3 = onDragStart$4),
  (_b$3 = onDragMove$2),
  (_c$3 = onDragStop$4),
  (_d$3 = scroll);
var _a$2, _b$2, _c$2, _d$2, _e$1;
const onDragStart$3 = Symbol('onDragStart');
const onDragMove$1 = Symbol('onDragMove');
const onDragStop$3 = Symbol('onDragStop');
const onDragPressure = Symbol('onDragPressure');
const dragStop = Symbol('dragStop');
const defaultAnnouncements$3 = {
  'drag:start': (event) =>
    `Picked up ${
      event.source.textContent.trim() || event.source.id || 'draggable element'
    }`,
  'drag:stop': (event) =>
    `Released ${
      event.source.textContent.trim() || event.source.id || 'draggable element'
    }`,
};
const defaultClasses$1 = {
  'container:dragging': 'draggable-container--is-dragging',
  'source:dragging': 'draggable-source--is-dragging',
  'source:placed': 'draggable-source--placed',
  'container:placed': 'draggable-container--placed',
  'body:dragging': 'draggable--is-dragging',
  'draggable:over': 'draggable--over',
  'container:over': 'draggable-container--over',
  'source:original': 'draggable--original',
  mirror: 'draggable-mirror',
};
const defaultOptions$1 = {
  draggable: '.draggable-source',
  handle: null,
  delay: {},
  distance: 0,
  placedTimeout: 800,
  plugins: [],
  sensors: [],
  exclude: {
    plugins: [],
    sensors: [],
  },
};
const getSensorEvent = (event) => event.detail;
function applyUserSelect(element, value) {
  element.style.webkitUserSelect = value;
  element.style.mozUserSelect = value;
  element.style.msUserSelect = value;
  element.style.oUserSelect = value;
  element.style.userSelect = value;
}
const _Draggable = class {
  constructor(containers = [document.body], options = {}) {
    var _a2, _b2, _c2, _d2, _e2, _f2;
    this.emitter = new Emitter();
    this.dragging = false;
    this.plugins = [];
    this.sensors = [];
    this.getClassNameFor = (name) => this.getClassNamesFor(name)[0];
    this.getClassNamesFor = (name) => {
      const classNames = this.options.classes[name];
      if (classNames instanceof Array) return classNames;
      else if (typeof classNames === 'string') return [classNames];
      else return [];
    };
    this.isDragging = () => Boolean(this.dragging);
    this.getDraggableElements = () =>
      this.containers.reduce(
        (current, container) => [
          ...current,
          ...this.getDraggableElementsForContainer(container),
        ],
        []
      );
    this.getDraggableElementsForContainer = (container) => {
      const allDraggableElements = container.querySelectorAll(
        this.options.draggable
      );
      return [...allDraggableElements].filter((childElement) => {
        return (
          childElement !== this.originalSource && childElement !== this.mirror
        );
      });
    };
    this[_a$2] = (event) => {
      const sensorEvent = getSensorEvent(event);
      const { target, container, originalSource } = sensorEvent;
      if (!this.containers.includes(container)) return;
      if (
        this.options.handle &&
        target &&
        !closest(target, this.options.handle)
      ) {
        sensorEvent.cancel();
        return;
      }
      this.originalSource = originalSource;
      this.sourceContainer = container;
      if (this.lastPlacedSource && this.lastPlacedContainer) {
        clearTimeout(this.placedTimeoutID);
        this.lastPlacedSource.classList.remove(
          ...this.getClassNamesFor('source:placed')
        );
        this.lastPlacedContainer.classList.remove(
          ...this.getClassNamesFor('container:placed')
        );
      }
      this.source = this.originalSource.cloneNode(true);
      this.originalSource.parentNode.insertBefore(
        this.source,
        this.originalSource
      );
      this.originalSource.style.display = 'none';
      const dragStartEvent = new DragStartEvent({
        source: this.source,
        originalSource: this.originalSource,
        sourceContainer: container,
        sensorEvent,
      });
      this.trigger(dragStartEvent);
      this.dragging = !dragStartEvent.canceled();
      if (dragStartEvent.canceled()) {
        this.source.remove();
        this.originalSource.style.display = null;
        return;
      }
      this.originalSource.classList.add(
        ...this.getClassNamesFor('source:original')
      );
      this.source.classList.add(...this.getClassNamesFor('source:dragging'));
      this.sourceContainer.classList.add(
        ...this.getClassNamesFor('container:dragging')
      );
      document.body.classList.add(...this.getClassNamesFor('body:dragging'));
      applyUserSelect(document.body, 'none');
      requestAnimationFrame(() => {
        const oldSensorEvent = getSensorEvent(event);
        const newSensorEvent = oldSensorEvent.clone({ target: this.source });
        this[onDragMove$1]({
          ...event,
          detail: newSensorEvent,
        });
      });
    };
    this[_b$2] = (event) => {
      if (!this.dragging) return;
      const sensorEvent = getSensorEvent(event);
      const { container } = sensorEvent;
      let target = sensorEvent.target;
      const dragMoveEvent = new DragMoveEvent({
        source: this.source,
        originalSource: this.originalSource,
        sourceContainer: container,
        sensorEvent,
      });
      this.trigger(dragMoveEvent);
      if (dragMoveEvent.canceled()) sensorEvent.cancel();
      target = closest(target, this.options.draggable);
      const withinCorrectContainer = closest(
        sensorEvent.target,
        this.containers
      );
      const overContainer = sensorEvent.overContainer || withinCorrectContainer;
      const isLeavingContainer =
        this.currentOverContainer &&
        overContainer !== this.currentOverContainer;
      const isLeavingDraggable =
        this.currentOver && target !== this.currentOver;
      const isOverContainer =
        overContainer && this.currentOverContainer !== overContainer;
      const isOverDraggable =
        withinCorrectContainer && target && this.currentOver !== target;
      if (isLeavingDraggable) {
        const dragOutEvent = new DragOutEvent({
          source: this.source,
          originalSource: this.originalSource,
          sourceContainer: container,
          sensorEvent,
          over: this.currentOver,
          overContainer: this.currentOverContainer,
        });
        this.currentOver.classList.remove(
          ...this.getClassNamesFor('draggable:over')
        );
        this.currentOver = null;
        this.trigger(dragOutEvent);
      }
      if (isLeavingContainer) {
        const dragOutContainerEvent = new DragOutContainerEvent({
          source: this.source,
          originalSource: this.originalSource,
          sourceContainer: container,
          sensorEvent,
          overContainer: this.currentOverContainer,
        });
        this.currentOverContainer.classList.remove(
          ...this.getClassNamesFor('container:over')
        );
        this.currentOverContainer = null;
        this.trigger(dragOutContainerEvent);
      }
      if (isOverContainer) {
        overContainer.classList.add(...this.getClassNamesFor('container:over'));
        const dragOverContainerEvent = new DragOverContainerEvent({
          source: this.source,
          originalSource: this.originalSource,
          sourceContainer: container,
          sensorEvent,
          overContainer,
        });
        this.currentOverContainer = overContainer;
        this.trigger(dragOverContainerEvent);
      }
      if (isOverDraggable) {
        target.classList.add(...this.getClassNamesFor('draggable:over'));
        const dragOverEvent = new DragOverEvent({
          source: this.source,
          originalSource: this.originalSource,
          sourceContainer: container,
          sensorEvent,
          overContainer,
          over: target,
        });
        this.currentOver = target;
        this.trigger(dragOverEvent);
      }
    };
    this[_c$2] = (event) => {
      if (!this.dragging) return;
      this.dragging = false;
      const dragStopEvent = new DragStopEvent({
        source: this.source,
        originalSource: this.originalSource,
        sensorEvent: event ? event.sensorEvent : null,
        sourceContainer: this.sourceContainer,
      });
      this.trigger(dragStopEvent);
      if (!dragStopEvent.canceled())
        this.source.parentNode.insertBefore(this.originalSource, this.source);
      this.source.remove();
      this.originalSource.style.display = '';
      this.source.classList.remove(...this.getClassNamesFor('source:dragging'));
      this.originalSource.classList.remove(
        ...this.getClassNamesFor('source:original')
      );
      this.originalSource.classList.add(
        ...this.getClassNamesFor('source:placed')
      );
      this.sourceContainer.classList.add(
        ...this.getClassNamesFor('container:placed')
      );
      this.sourceContainer.classList.remove(
        ...this.getClassNamesFor('container:dragging')
      );
      document.body.classList.remove(...this.getClassNamesFor('body:dragging'));
      applyUserSelect(document.body, '');
      if (this.currentOver) {
        this.currentOver.classList.remove(
          ...this.getClassNamesFor('draggable:over')
        );
      }
      if (this.currentOverContainer) {
        this.currentOverContainer.classList.remove(
          ...this.getClassNamesFor('container:over')
        );
      }
      this.lastPlacedSource = this.originalSource;
      this.lastPlacedContainer = this.sourceContainer;
      this.placedTimeoutID = setTimeout(() => {
        if (this.lastPlacedSource) {
          this.lastPlacedSource.classList.remove(
            ...this.getClassNamesFor('source:placed')
          );
        }
        if (this.lastPlacedContainer) {
          this.lastPlacedContainer.classList.remove(
            ...this.getClassNamesFor('container:placed')
          );
        }
        this.lastPlacedSource = null;
        this.lastPlacedContainer = null;
      }, this.options.placedTimeout);
      const dragStoppedEvent = new DragStoppedEvent({
        source: this.source,
        originalSource: this.originalSource,
        sensorEvent: event ? event.sensorEvent : null,
        sourceContainer: this.sourceContainer,
      });
      this.trigger(dragStoppedEvent);
      this.source = null;
      this.originalSource = null;
      this.currentOverContainer = null;
      this.currentOver = null;
      this.sourceContainer = null;
    };
    this[_d$2] = (event) => {
      this[dragStop](event);
    };
    this[_e$1] = (event) => {
      if (!this.dragging) return;
      const sensorEvent = getSensorEvent(event);
      const source =
        this.source ||
        closest(sensorEvent.originalEvent.target, this.options.draggable);
      const dragPressureEvent = new DragPressureEvent({
        sensorEvent,
        source,
        pressure: sensorEvent.pressure,
      });
      this.trigger(dragPressureEvent);
    };
    if (containers instanceof NodeList || containers instanceof Array)
      this.containers = [...containers];
    else if (containers instanceof Element) this.containers = [containers];
    else
      throw new Error(
        'Draggable containers are expected to be of type `NodeList`, `Element[]` or `Element`'
      );
    this.options = {
      ...defaultOptions$1,
      ...options,
      classes: {
        ...defaultClasses$1,
        ...((_a2 = options.classes) != null ? _a2 : {}),
      },
      announcements: {
        ...defaultAnnouncements$3,
        ...((_b2 = options.announcements) != null ? _b2 : {}),
      },
      exclude: {
        plugins:
          (_d2 = (_c2 = options.exclude) == null ? void 0 : _c2.plugins) != null
            ? _d2
            : [],
        sensors:
          (_f2 = (_e2 = options.exclude) == null ? void 0 : _e2.sensors) != null
            ? _f2
            : [],
      },
    };
    this[onDragStop$3] = this[onDragStop$3].bind(this);
    this[onDragPressure] = this[onDragPressure].bind(this);
    this[dragStop] = this[dragStop].bind(this);
    document.addEventListener('drag:start', this[onDragStart$3], true);
    document.addEventListener('drag:move', this[onDragMove$1], true);
    document.addEventListener('drag:stop', this[onDragStop$3], true);
    document.addEventListener('drag:pressure', this[onDragPressure], true);
    const defaultPlugins = Object.values(_Draggable.Plugins).filter(
      (plugin) => !this.options.exclude.plugins.includes(plugin)
    );
    const defaultSensors = Object.values(_Draggable.Sensors).filter(
      (sensor) => !this.options.exclude.sensors.includes(sensor)
    );
    this.addPlugin(...[...defaultPlugins, ...this.options.plugins]);
    this.addSensor(...[...defaultSensors, ...this.options.sensors]);
    const draggableInitializedEvent = new DraggableInitializedEvent({
      draggable: this,
    });
    this.on('mirror:created', ({ mirror }) => (this.mirror = mirror));
    this.on('mirror:destroy', () => (this.mirror = null));
    this.trigger(draggableInitializedEvent);
  }
  destroy() {
    document.removeEventListener('drag:start', this[onDragStart$3], true);
    document.removeEventListener('drag:move', this[onDragMove$1], true);
    document.removeEventListener('drag:stop', this[onDragStop$3], true);
    document.removeEventListener('drag:pressure', this[onDragPressure], true);
    const draggableDestroyEvent = new DraggableDestroyEvent({
      draggable: this,
    });
    this.trigger(draggableDestroyEvent);
    this.removePlugin(...this.plugins.map((plugin) => plugin.constructor));
    this.removeSensor(...this.sensors.map((sensor) => sensor.constructor));
  }
  addPlugin(...plugins) {
    const activePlugins = plugins.map((plugin) => new plugin(this));
    activePlugins.forEach((plugin) => plugin.attach());
    this.plugins = [...this.plugins, ...activePlugins];
    return this;
  }
  removePlugin(...plugins) {
    const removedPlugins = this.plugins.filter((plugin) =>
      plugins.includes(plugin.constructor)
    );
    removedPlugins.forEach((plugin) => plugin.detach());
    this.plugins = this.plugins.filter(
      (plugin) => !plugins.includes(plugin.constructor)
    );
    return this;
  }
  addSensor(...sensors) {
    const activeSensors = sensors.map(
      (sensor) => new sensor(this.containers, this.options)
    );
    activeSensors.forEach((sensor) => sensor.attach());
    this.sensors = [...this.sensors, ...activeSensors];
    return this;
  }
  removeSensor(...sensors) {
    const removedSensors = this.sensors.filter((sensor) =>
      sensors.includes(sensor.constructor)
    );
    removedSensors.forEach((sensor) => sensor.detach());
    this.sensors = this.sensors.filter(
      (sensor) => !sensors.includes(sensor.constructor)
    );
    return this;
  }
  addContainer(...containers) {
    this.containers = [...this.containers, ...containers];
    this.sensors.forEach((sensor) => sensor.addContainer(...containers));
    return this;
  }
  removeContainer(...containers) {
    this.containers = this.containers.filter(
      (container) => !containers.includes(container)
    );
    this.sensors.forEach((sensor) => sensor.removeContainer(...containers));
    return this;
  }
  on(type, ...callbacks) {
    this.emitter.on(type, ...callbacks);
    return this;
  }
  off(type, callback) {
    this.emitter.off(type, callback);
    return this;
  }
  trigger(event) {
    this.emitter.trigger(event);
    return this;
  }
  cancel() {
    this[dragStop]();
  }
};
let Draggable = _Draggable;
(_a$2 = onDragStart$3),
  (_b$2 = onDragMove$1),
  (_c$2 = dragStop),
  (_d$2 = onDragStop$3),
  (_e$1 = onDragPressure);
Draggable.Plugins = {
  Announcement,
  Focusable,
  Mirror,
  Scrollable,
};
Draggable.Sensors = { MouseSensor, TouchSensor };
const _DroppableEvent = class extends AbstractEvent {
  get droppable() {
    return this.data.droppable;
  }
  get dragEvent() {
    return this.data.dragEvent;
  }
  clone(data) {
    return new _DroppableEvent({
      ...this.data,
      ...data,
    });
  }
};
let DroppableEvent = _DroppableEvent;
DroppableEvent.type = 'droppable';
const _DroppableStartEvent = class extends DroppableEvent {
  get dropzone() {
    return this.data.dropzone;
  }
  clone(data) {
    return new _DroppableStartEvent({
      ...this.data,
      ...data,
    });
  }
};
let DroppableStartEvent = _DroppableStartEvent;
DroppableStartEvent.type = 'droppable:start';
DroppableStartEvent.cancelable = true;
const _DroppableDroppedEvent = class extends DroppableEvent {
  get dropzone() {
    return this.data.dropzone;
  }
  clone(data) {
    return new _DroppableDroppedEvent({
      ...this.data,
      ...data,
    });
  }
};
let DroppableDroppedEvent = _DroppableDroppedEvent;
DroppableDroppedEvent.type = 'droppable:dropped';
DroppableDroppedEvent.cancelable = true;
const _DroppableReturnedEvent = class extends DroppableEvent {
  get dropzone() {
    return this.data.dropzone;
  }
  clone(data) {
    return new _DroppableReturnedEvent({
      ...this.data,
      ...data,
    });
  }
};
let DroppableReturnedEvent = _DroppableReturnedEvent;
DroppableReturnedEvent.type = 'droppable:returned';
DroppableReturnedEvent.cancelable = true;
const _DroppableStopEvent = class extends DroppableEvent {
  get dropzone() {
    return this.data.dropzone;
  }
  clone(data) {
    return new _DroppableStopEvent({
      ...this.data,
      ...data,
    });
  }
};
let DroppableStopEvent = _DroppableStopEvent;
DroppableStopEvent.type = 'droppable:stop';
DroppableStopEvent.cancelable = true;
var _a$1, _b$1, _c$1, _d$1, _e, _f, _g;
const onDragStart$2 = Symbol('onDragStart');
const onDragMove = Symbol('onDragMove');
const onDragStop$2 = Symbol('onDragStop');
const dropInDropzone = Symbol('dropInDropZone');
const returnToOriginalDropzone = Symbol('returnToOriginalDropzone');
const closestDropzone = Symbol('closestDropzone');
const getDropzones = Symbol('getDropzones');
function onDroppableDroppedDefaultAnnouncement({ dragEvent, dropzone }) {
  const sourceText =
    dragEvent.source.textContent.trim() ||
    dragEvent.source.id ||
    'draggable element';
  const dropzoneText =
    dropzone.textContent.trim() || dropzone.id || 'droppable element';
  return `Dropped ${sourceText} into ${dropzoneText}`;
}
function onDroppableReturnedDefaultAnnouncement({ dragEvent, dropzone }) {
  const sourceText =
    dragEvent.source.textContent.trim() ||
    dragEvent.source.id ||
    'draggable element';
  const dropzoneText =
    dropzone.textContent.trim() || dropzone.id || 'droppable element';
  return `Returned ${sourceText} from ${dropzoneText}`;
}
const defaultAnnouncements$2 = {
  'droppable:dropped': onDroppableDroppedDefaultAnnouncement,
  'droppable:returned': onDroppableReturnedDefaultAnnouncement,
};
const defaultClasses = {
  'droppable:active': 'draggable-dropzone--active',
  'droppable:occupied': 'draggable-dropzone--occupied',
};
const defaultOptions = {
  dropzone: '.draggable-droppable',
};
class Droppable extends Draggable {
  constructor(containers = [], options = {}) {
    var _a2, _b2;
    super(containers, {
      ...defaultOptions,
      ...options,
      classes: {
        ...defaultClasses,
        ...((_a2 = options.classes) != null ? _a2 : {}),
      },
      announcements: {
        ...defaultAnnouncements$2,
        ...((_b2 = options.announcements) != null ? _b2 : {}),
      },
    });
    this.dropzones = null;
    this.lastDropzone = null;
    this.initialDropzone = null;
    this[_a$1] = (event) => {
      if (event.canceled()) return;
      this.dropzones = [...this[getDropzones]()];
      const dropzone = closest(event.sensorEvent.target, this.options.dropzone);
      if (!dropzone) {
        event.cancel();
        return;
      }
      const droppableStartEvent = new DroppableStartEvent({
        dragEvent: event,
        dropzone,
      });
      this.trigger(droppableStartEvent);
      if (droppableStartEvent.canceled()) {
        event.cancel();
        return;
      }
      this.initialDropzone = dropzone;
      for (const dropzoneElement of this.dropzones) {
        if (
          dropzoneElement.classList.contains(
            this.getClassNameFor('droppable:occupied')
          )
        ) {
          continue;
        }
        dropzoneElement.classList.add(
          ...this.getClassNamesFor('droppable:active')
        );
      }
    };
    this[_b$1] = (event) => {
      if (event.canceled()) return;
      const dropzone = this[closestDropzone](event.sensorEvent.target);
      const overEmptyDropzone =
        dropzone &&
        !dropzone.classList.contains(
          this.getClassNameFor('droppable:occupied')
        );
      if (overEmptyDropzone && this[dropInDropzone](event, dropzone)) {
        this.lastDropzone = dropzone;
      } else if (
        (!dropzone || dropzone === this.initialDropzone) &&
        this.lastDropzone
      ) {
        this[returnToOriginalDropzone](event);
        this.lastDropzone = null;
      }
    };
    this[_c$1] = (event) => {
      const droppableStopEvent = new DroppableStopEvent({
        dragEvent: event,
        dropzone: this.lastDropzone || this.initialDropzone,
      });
      this.trigger(droppableStopEvent);
      const occupiedClasses = this.getClassNamesFor('droppable:occupied');
      for (const dropzone of this.dropzones) {
        dropzone.classList.remove(...this.getClassNamesFor('droppable:active'));
      }
      if (this.lastDropzone && this.lastDropzone !== this.initialDropzone) {
        this.initialDropzone.classList.remove(...occupiedClasses);
      }
      this.dropzones = null;
      this.lastDropzone = null;
      this.initialDropzone = null;
    };
    this[_d$1] = (event, dropzone) => {
      const droppableDroppedEvent = new DroppableDroppedEvent({
        dragEvent: event,
        dropzone,
      });
      this.trigger(droppableDroppedEvent);
      if (droppableDroppedEvent.canceled()) return false;
      const occupiedClasses = this.getClassNamesFor('droppable:occupied');
      if (this.lastDropzone)
        this.lastDropzone.classList.remove(...occupiedClasses);
      dropzone.appendChild(event.source);
      dropzone.classList.add(...occupiedClasses);
      return true;
    };
    this[_e] = (event) => {
      const droppableReturnedEvent = new DroppableReturnedEvent({
        dragEvent: event,
        dropzone: this.lastDropzone,
      });
      this.trigger(droppableReturnedEvent);
      if (droppableReturnedEvent.canceled()) return;
      this.initialDropzone.appendChild(event.source);
      this.lastDropzone.classList.remove(
        ...this.getClassNamesFor('droppable:occupied')
      );
    };
    this[_f] = (target) =>
      this.dropzones ? closest(target, this.dropzones) : null;
    this[_g] = () => {
      const dropzone = this.options.dropzone;
      if (typeof dropzone === 'string')
        return document.querySelectorAll(dropzone);
      else if (dropzone instanceof Array) return dropzone;
      else if (typeof dropzone === 'function') return [dropzone()];
      else return [dropzone];
    };
    this.on('drag:start', this[onDragStart$2])
      .on('drag:move', this[onDragMove])
      .on('drag:stop', this[onDragStop$2]);
  }
  destroy() {
    super.destroy();
    this.off('drag:start', this[onDragStart$2])
      .off('drag:move', this[onDragMove])
      .off('drag:stop', this[onDragStop$2]);
  }
}
(_a$1 = onDragStart$2),
  (_b$1 = onDragMove),
  (_c$1 = onDragStop$2),
  (_d$1 = dropInDropzone),
  (_e = returnToOriginalDropzone),
  (_f = closestDropzone),
  (_g = getDropzones);
const _SwappableEvent = class extends AbstractEvent {
  get dragEvent() {
    return this.data.dragEvent;
  }
  clone(data) {
    return new _SwappableEvent({
      ...this.data,
      ...data,
    });
  }
};
let SwappableEvent = _SwappableEvent;
SwappableEvent.type = 'swappable';
const _SwappableStartEvent = class extends SwappableEvent {
  clone(data) {
    return new _SwappableStartEvent({
      ...this.data,
      ...data,
    });
  }
};
let SwappableStartEvent = _SwappableStartEvent;
SwappableStartEvent.type = 'swappable:start';
SwappableStartEvent.cancelable = true;
const _SwappableSwapEvent = class extends SwappableEvent {
  get over() {
    return this.data.over;
  }
  get overContainer() {
    return this.data.overContainer;
  }
  clone(data) {
    return new _SwappableSwapEvent({
      ...this.data,
      ...data,
    });
  }
};
let SwappableSwapEvent = _SwappableSwapEvent;
SwappableSwapEvent.type = 'swappable:swap';
SwappableSwapEvent.cancelable = true;
const _SwappableSwappedEvent = class extends SwappableEvent {
  get swappedElement() {
    return this.data.swappedElement;
  }
  clone(data) {
    return new _SwappableSwappedEvent({
      ...this.data,
      ...data,
    });
  }
};
let SwappableSwappedEvent = _SwappableSwappedEvent;
SwappableSwappedEvent.type = 'swappable:swapped';
const _SwappableStopEvent = class extends SwappableEvent {
  clone(data) {
    return new _SwappableStopEvent({
      ...this.data,
      ...data,
    });
  }
};
let SwappableStopEvent = _SwappableStopEvent;
SwappableStopEvent.type = 'swappable:stop';
const onDragStart$1 = Symbol('onDragStart');
const onDragOver$1 = Symbol('onDragOver');
const onDragStop$1 = Symbol('onDragStop');
function onSwappableSwappedDefaultAnnouncement({ dragEvent, swappedElement }) {
  var _a2, _b2;
  const sourceText =
    ((_a2 = dragEvent.source.textContent) == null ? void 0 : _a2.trim()) ||
    dragEvent.source.id ||
    'swappable element';
  const overText =
    ((_b2 = swappedElement.textContent) == null ? void 0 : _b2.trim()) ||
    swappedElement.id ||
    'swappable element';
  return `Swapped ${sourceText} with ${overText}`;
}
function withTempElement(callback) {
  const tmpElement = document.createElement('div');
  callback(tmpElement);
  tmpElement.remove();
}
function swap(source, over) {
  const overParent = over.parentNode;
  const sourceParent = source.parentNode;
  withTempElement((tmpElement) => {
    sourceParent.insertBefore(tmpElement, source);
    overParent.insertBefore(source, over);
    sourceParent.insertBefore(over, tmpElement);
  });
}
const defaultAnnouncements$1 = {
  'swappabled:swapped': onSwappableSwappedDefaultAnnouncement,
};
class Swappable extends Draggable {
  constructor(containers = [], options = {}) {
    var _a2;
    super(containers, {
      ...options,
      announcements: {
        ...defaultAnnouncements$1,
        ...((_a2 = options.announcements) != null ? _a2 : {}),
      },
    });
    this.lastOver = null;
    this[onDragStart$1] = this[onDragStart$1].bind(this);
    this[onDragOver$1] = this[onDragOver$1].bind(this);
    this[onDragStop$1] = this[onDragStop$1].bind(this);
    this.on('drag:start', this[onDragStart$1])
      .on('drag:over', this[onDragOver$1])
      .on('drag:stop', this[onDragStop$1]);
  }
  destroy() {
    super.destroy();
    this.off('drag:start', this[onDragStart$1])
      .off('drag:over', this[onDragOver$1])
      .off('drag:stop', this[onDragStop$1]);
  }
  [onDragStart$1](event) {
    const swappableStartEvent = new SwappableStartEvent({
      dragEvent: event,
    });
    this.trigger(swappableStartEvent);
    if (swappableStartEvent.canceled()) {
      event.cancel();
    }
  }
  [onDragOver$1](event) {
    if (
      event.over === event.originalSource ||
      event.over === event.source ||
      event.canceled()
    ) {
      return;
    }
    const swappableSwapEvent = new SwappableSwapEvent({
      dragEvent: event,
      over: event.over,
      overContainer: event.overContainer,
    });
    this.trigger(swappableSwapEvent);
    if (swappableSwapEvent.canceled()) {
      return;
    }
    if (this.lastOver && this.lastOver !== event.over) {
      swap(this.lastOver, event.source);
    }
    if (this.lastOver === event.over) {
      this.lastOver = null;
    } else {
      this.lastOver = event.over;
    }
    swap(event.source, event.over);
    const swappableSwappedEvent = new SwappableSwappedEvent({
      dragEvent: event,
      swappedElement: event.over,
    });
    this.trigger(swappableSwappedEvent);
  }
  [onDragStop$1](event) {
    const swappableStopEvent = new SwappableStopEvent({
      dragEvent: event,
    });
    this.trigger(swappableStopEvent);
    this.lastOver = null;
  }
}
const _SortableEvent = class extends AbstractEvent {
  get dragEvent() {
    return this.data.dragEvent;
  }
  clone(data) {
    return new _SortableEvent({
      ...this.data,
      ...data,
    });
  }
};
let SortableEvent = _SortableEvent;
SortableEvent.type = 'sortable';
const _SortableStartEvent = class extends SortableEvent {
  get startIndex() {
    return this.data.startIndex;
  }
  get startContainer() {
    return this.data.startContainer;
  }
  clone(data) {
    return new _SortableStartEvent({
      ...this.data,
      ...data,
    });
  }
};
let SortableStartEvent = _SortableStartEvent;
SortableStartEvent.type = 'sortable:start';
SortableStartEvent.cancelable = true;
const _SortableSortEvent = class extends SortableEvent {
  get currentIndex() {
    return this.data.currentIndex;
  }
  get over() {
    return this.data.over;
  }
  get overContainer() {
    return this.data.dragEvent.overContainer;
  }
  get dragEvent() {
    return this.data.dragEvent;
  }
  clone(data) {
    return new _SortableSortEvent({
      ...this.data,
      ...data,
    });
  }
};
let SortableSortEvent = _SortableSortEvent;
SortableSortEvent.type = 'sortable:sort';
SortableSortEvent.cancelable = true;
const _SortableSortedEvent = class extends SortableEvent {
  get dragEvent() {
    return this.data.dragEvent;
  }
  get oldIndex() {
    return this.data.oldIndex;
  }
  get newIndex() {
    return this.data.newIndex;
  }
  get oldContainer() {
    return this.data.oldContainer;
  }
  get newContainer() {
    return this.data.newContainer;
  }
  clone(data) {
    return new _SortableSortedEvent({
      ...this.data,
      ...data,
    });
  }
};
let SortableSortedEvent = _SortableSortedEvent;
SortableSortedEvent.type = 'sortable:sorted';
const _SortableStopEvent = class extends SortableEvent {
  get oldIndex() {
    return this.data.oldIndex;
  }
  get newIndex() {
    return this.data.newIndex;
  }
  get oldContainer() {
    return this.data.oldContainer;
  }
  get newContainer() {
    return this.data.newContainer;
  }
  clone(data) {
    return new _SortableStopEvent({
      ...this.data,
      ...data,
    });
  }
};
let SortableStopEvent = _SortableStopEvent;
SortableStopEvent.type = 'sortable:stop';
var _a, _b, _c, _d;
const onDragStart = Symbol('onDragStart');
const onDragOverContainer = Symbol('onDragOverContainer');
const onDragOver = Symbol('onDragOver');
const onDragStop = Symbol('onDragStop');
function onSortableSortedDefaultAnnouncement({ dragEvent }) {
  var _a2, _b2, _c2, _d2, _e2, _f2;
  const sourceText =
    (_c2 =
      (_b2 =
        (_a2 = dragEvent.source.textContent) == null ? void 0 : _a2.trim()) !=
      null
        ? _b2
        : dragEvent.source.id) != null
      ? _c2
      : 'sortable element';
  if (dragEvent.over) {
    const overText =
      (_f2 =
        (_e2 =
          (_d2 = dragEvent.over.textContent) == null ? void 0 : _d2.trim()) !=
        null
          ? _e2
          : dragEvent.over.id) != null
        ? _f2
        : 'sortable element';
    const isFollowing =
      dragEvent.source.compareDocumentPosition(dragEvent.over) &
      Node.DOCUMENT_POSITION_FOLLOWING;
    if (isFollowing) return `Placed ${sourceText} after ${overText}`;
    else return `Placed ${sourceText} before ${overText}`;
  } else {
    return `Placed ${sourceText} into a different container`;
  }
}
const index = (element) => {
  var _a2;
  return Array.prototype.indexOf.call(
    (_a2 = element.parentNode) == null ? void 0 : _a2.children,
    element
  );
};
function moveInsideEmptyContainer(source, overContainer) {
  const oldContainer = source.parentNode;
  overContainer.appendChild(source);
  return { oldContainer, newContainer: overContainer };
}
function moveWithinContainer(source, over) {
  var _a2, _b2;
  const oldIndex = index(source);
  const newIndex = index(over);
  if (oldIndex < newIndex)
    (_a2 = source.parentNode) == null
      ? void 0
      : _a2.insertBefore(source, over.nextElementSibling);
  else
    (_b2 = source.parentNode) == null ? void 0 : _b2.insertBefore(source, over);
  return {
    oldContainer: source.parentNode,
    newContainer: source.parentNode,
  };
}
function moveOutsideContainer(source, over, overContainer) {
  var _a2;
  const oldContainer = source.parentNode;
  if (over)
    (_a2 = over.parentNode) == null ? void 0 : _a2.insertBefore(source, over);
  else overContainer.appendChild(source);
  return { oldContainer, newContainer: source.parentNode };
}
function move({ source, over, overContainer, children }) {
  const emptyOverContainer = !children.length;
  const differentContainer = source.parentNode !== overContainer;
  const sameContainer = over && source.parentNode === over.parentNode;
  if (emptyOverContainer)
    return moveInsideEmptyContainer(source, overContainer);
  else if (sameContainer) return moveWithinContainer(source, over);
  else if (differentContainer)
    return moveOutsideContainer(source, over, overContainer);
  else return null;
}
const defaultAnnouncements = {
  'sortable:sorted': onSortableSortedDefaultAnnouncement,
};
class Sortable extends Draggable {
  constructor(containers = [], options = {}) {
    var _a2;
    super(containers, {
      ...options,
      announcements: {
        ...defaultAnnouncements,
        ...((_a2 = options.announcements) != null ? _a2 : {}),
      },
    });
    this[_a] = (event) => {
      this.startContainer = event.source.parentNode;
      this.startIndex = this.index(event.source);
      const sortableStartEvent = new SortableStartEvent({
        dragEvent: event,
        startIndex: this.startIndex,
        startContainer: this.startContainer,
      });
      this.trigger(sortableStartEvent);
      if (sortableStartEvent.canceled()) event.cancel();
    };
    this[_b] = (event) => {
      if (event.canceled()) return;
      const { source, over, overContainer } = event;
      const oldIndex = this.index(source);
      const sortableSortEvent = new SortableSortEvent({
        dragEvent: event,
        currentIndex: oldIndex,
        source,
        over,
      });
      this.trigger(sortableSortEvent);
      if (sortableSortEvent.canceled()) return;
      const children = this.getSortableElementsForContainer(overContainer);
      const moves = move({ source, over, overContainer, children });
      if (!moves) return;
      const { oldContainer, newContainer } = moves;
      const newIndex = this.index(event.source);
      const sortableSortedEvent = new SortableSortedEvent({
        dragEvent: event,
        oldIndex,
        newIndex,
        oldContainer,
        newContainer,
      });
      this.trigger(sortableSortedEvent);
    };
    this[_c] = (event) => {
      if (event.over === event.originalSource || event.over === event.source)
        return;
      const { source, over, overContainer } = event;
      const oldIndex = this.index(source);
      const sortableSortEvent = new SortableSortEvent({
        dragEvent: event,
        currentIndex: oldIndex,
        source,
        over,
      });
      this.trigger(sortableSortEvent);
      if (sortableSortEvent.canceled()) return;
      const children = this.getDraggableElementsForContainer(overContainer);
      const moves = move({ source, over, overContainer, children });
      if (!moves) return;
      const { oldContainer, newContainer } = moves;
      const newIndex = this.index(source);
      const sortableSortedEvent = new SortableSortedEvent({
        dragEvent: event,
        oldIndex,
        newIndex,
        oldContainer,
        newContainer,
      });
      this.trigger(sortableSortedEvent);
    };
    this[_d] = (event) => {
      const sortableStopEvent = new SortableStopEvent({
        dragEvent: event,
        oldIndex: this.startIndex,
        newIndex: this.index(event.source),
        oldContainer: this.startContainer,
        newContainer: event.source.parentNode,
      });
      this.trigger(sortableStopEvent);
      this.startIndex = null;
      this.startContainer = null;
    };
    this.on('drag:start', this[onDragStart])
      .on('drag:over:container', this[onDragOverContainer])
      .on('drag:over', this[onDragOver])
      .on('drag:stop', this[onDragStop]);
  }
  destroy() {
    super.destroy();
    this.off('drag:start', this[onDragStart])
      .off('drag:over:container', this[onDragOverContainer])
      .off('drag:over', this[onDragOver])
      .off('drag:stop', this[onDragStop]);
  }
  index(element) {
    return this.getSortableElementsForContainer(element.parentNode).indexOf(
      element
    );
  }
  getSortableElementsForContainer(container) {
    const allSortableElements = container.querySelectorAll(
      this.options.draggable
    );
    return [...allSortableElements].filter(
      (childElement) =>
        childElement !== this.originalSource &&
        childElement !== this.mirror &&
        childElement.parentNode === container
    );
  }
}
(_a = onDragStart),
  (_b = onDragOverContainer),
  (_c = onDragOver),
  (_d = onDragStop);
export {
  AbstractEvent as BaseEvent,
  AbstractPlugin as BasePlugin,
  Draggable,
  Droppable,
  index$1 as Plugins,
  index$2 as Sensors,
  Sortable,
  Swappable,
};
