export declare class BaseEvent extends Event {
    data: Record<string, unknown>;
    constructor(data?: Record<string, unknown>);
    get type(): any;
    get cancelable(): any;
    cancel(): void;
    canceled(): boolean;
    clone(data: any): BaseEvent;
    static type: string;
    static cancelable: boolean;
}

export declare class BasePlugin {
    draggable: Draggable;
    constructor(draggable: Draggable);
    attach(): void;
    detach(): void;
}

declare const closestDropzone: unique symbol;

/**
 * Collidable plugin which detects colliding elements while dragging
 * @class Collidable
 * @module Collidable
 * @extends AbstractPlugin
 */
declare class Collidable extends BasePlugin {
    /*** Keeps track of currently colliding elements */
    currentlyCollidingElement: HTMLElement | null;
    /*** Keeps track of currently colliding elements */
    lastCollidingElement: HTMLElement | null;
    /*** Animation frame for finding colliding elements */
    currentAnimationFrame: number | null;
    /**
     * Attaches plugins event listeners
     */
    attach(): void;
    /**
     * Detaches plugins event listeners
     */
    detach(): void;
    /*** Returns current collidables based on `collidables` option */
    getCollidables(): Element[];
    /*** Drag move handler */
    private [onDragMove_3];
    /*** Drag stop handler */
    private [onDragStop_5];
    /*** Animation frame function */
    private [onRequestAnimationFrame];
}

declare const defaultClasses: {
    'container:dragging': string;
    'source:dragging': string;
    'source:placed': string;
    'container:placed': string;
    'body:dragging': string;
    'draggable:over': string;
    'container:over': string;
    'source:original': string;
    mirror: string;
};

declare const defaultClasses_2: {
    'droppable:active': string;
    'droppable:occupied': string;
};

/**
 * ResizeMirror default options
 * @property {Object} defaultOptions
 * @type {Object}
 */
declare const defaultOptions: {};

declare const defaultOptions_2: {
    duration: number;
    easingFunction: string;
    horizontal: boolean;
};

declare const defaultOptions_3: {
    duration: number;
    easingFunction: string;
};

declare class DragEvent_2 extends BaseEvent {
    data: DragEventData;
    constructor(data?: DragEventData);
    get source(): HTMLElement;
    get originalSource(): HTMLElement;
    get mirror(): HTMLElement;
    get sourceContainer(): HTMLElement;
    get sensorEvent(): SensorEvent;
    get originalEvent(): Event;
    get detail(): any;
    clone(data: any): DragEvent_2;
    static type: string;
}

declare type DragEventData = {
    mirror?: HTMLElement;
    over?: HTMLElement;
    source: HTMLElement;
    overContainer?: HTMLElement;
    sourceContainer?: HTMLElement;
    sensorEvent?: SensorEvent;
    originalSource?: HTMLElement;
    pressure?: number;
    draggable?: string;
    detail?: SensorEvent;
};

export declare class Draggable {
    containers: HTMLElement[];
    options: DraggableOptions;
    /*** Draggables event emitter */
    emitter: Emitter;
    /*** Current drag state */
    dragging: boolean;
    /*** Active plugins */
    plugins: BasePlugin[];
    /*** Active sensors */
    sensors: Sensor[];
    /*** Mirror */
    mirror: Element;
    /*** Original HTML Element */
    originalSource: HTMLElement;
    /*** Source container ref */
    sourceContainer: HTMLElement;
    /*** Source container ref */
    source: HTMLElement;
    /*** Last placed element ref */
    lastPlacedSource: Element;
    /*** Last placed element container ref */
    lastPlacedContainer: Element;
    /** Current over element container ref */
    currentOverContainer: HTMLElement;
    /** Current over element ref */
    currentOver: HTMLElement;
    /*** Placement timeout ID */
    placedTimeoutID: ReturnType<typeof setTimeout>;
    constructor(containers?: HTMLElement[], options?: Partial<DraggableOptions>);
    destroy(): void;
    addPlugin(...plugins: typeof BasePlugin[]): this;
    removePlugin(...plugins: typeof BasePlugin['constructor'][]): this;
    addSensor(...sensors: typeof Sensor[]): this;
    removeSensor(...sensors: typeof Sensor['constructor'][]): this;
    addContainer(...containers: HTMLElement[]): this;
    removeContainer(...containers: any[]): this;
    on(type: any, ...callbacks: any[]): this;
    off(type: any, callback: any): this;
    trigger(event: BaseEvent): this;
    getClassNameFor: (name: string) => string;
    getClassNamesFor: (name: string) => string[];
    isDragging: () => boolean;
    getDraggableElements: () => HTMLElement[];
    getDraggableElementsForContainer: (container: Element) => HTMLElement[];
    cancel(): void;
    private [onDragStart];
    private [onDragMove];
    private [dragStop];
    private [onDragStop];
    private [onDragPressure];
    /** Default plugins draggable uses */
    static Plugins: Record<string, typeof BasePlugin>;
    /** Default sensors draggable uses */
    static Sensors: Record<string, typeof Sensor>;
}

declare interface DraggableOptions {
    draggable: string;
    distance?: number;
    handle?: string | Element[] | Element | ((currentElement: Element) => Element);
    delay?: number | DelayOptions;
    plugins?: typeof BasePlugin[];
    sensors?: typeof Sensor[];
    classes?: {
        [key in keyof typeof defaultClasses]?: string | string[];
    };
    announcements?: Record<string, (event: BaseEvent) => unknown>;
    collidables?: string | Element[] | (() => Element[]);
    mirror?: MirrorOptions;
    scrollable?: ScrollableOptions;
    swapAnimation?: SwapAnimationOptions;
    sortAnimation?: SortAnimationOptions;
    placedTimeout?: number;
    resizeMirror?: ResizeMirrorOptions;
    focusable?: FocusableOptions;
    exclude?: {
        plugins?: typeof BasePlugin[];
        sensors?: typeof Sensor[];
    };
}

declare class DragMoveSensorEvent extends SensorEvent {
    clone(data: SensorEventData): DragMoveSensorEvent;
    static type: string;
}

declare class DragPressureSensorEvent extends SensorEvent {
    clone(data: SensorEventData): DragPressureSensorEvent;
    static type: string;
}

declare class DragSensor extends Sensor {
    /*** Mouse down timer which will end up setting the draggable attribute, unless canceled */
    mouseDownTimeout: ReturnType<typeof setTimeout>;
    /*** Draggable element needs to be remembered to unset the draggable attribute after drag operation has completed */
    draggableElement: HTMLElement;
    /*** Native draggable element could be links or images, their draggable state will be disabled during drag operation */
    nativeDraggableElement: HTMLElement;
    options: SensorOptions & {
        type: string;
    };
    attach(): void;
    detach(): void;
    private [onDragStart_5];
    private [onDragOver_3];
    private [onDragEnd];
    private [onDrop];
    private [onMouseDown_2];
    [onMouseUp_2]: () => void;
    [reset](): void;
}

declare class DragStartSensorEvent extends SensorEvent {
    clone(data: SensorEventData): DragStartSensorEvent;
    static type: string;
}

declare const dragStop: unique symbol;

declare class DragStopSensorEvent extends SensorEvent {
    clone(data: SensorEventData): DragStopSensorEvent;
    static type: string;
}

declare const dropInDropzone: unique symbol;

/**
 * Droppable is built on top of Draggable and allows dropping draggable elements
 * into dropzone element
 */
export declare class Droppable extends Draggable {
    options: DroppableOptions;
    dropzones: HTMLElement[];
    lastDropzone: HTMLElement;
    initialDropzone: HTMLElement;
    constructor(containers?: HTMLElement[], options?: Partial<DroppableOptions>);
    destroy(): void;
    private [onDragStart_2];
    private [onDragMove_2];
    private [onDragStop_2];
    /**
     * Drops a draggable element into a dropzone element
     */
    private [dropInDropzone];
    /**
     * Moves the previously dropped element back into its original dropzone
     */
    private [returnToOriginalDropzone];
    private [closestDropzone];
    private [getDropzones];
}

declare interface DroppableOptions extends Omit<DraggableOptions, 'classes'> {
    dropzone?: string | HTMLElement[] | (() => HTMLElement);
    classes?: DraggableOptions['classes'] & {
        [key in keyof typeof defaultClasses_2]?: string | string[];
    };
}

declare class Emitter {
    callbacks: Record<string, Array<EmitterEventCallback>>;
    constructor();
    on(type: string, ...callbacks: Array<EmitterEventCallback>): this;
    off(type: string, callback: EmitterEventCallback): this;
    trigger(event: BaseEvent): this;
}

declare type EmitterEventCallback = (event?: BaseEvent) => void;

declare type FocusableOptions = Record<string, unknown>;

declare class ForceTouchSensor extends Sensor {
    mightDrag: boolean;
    attach(): void;
    detach(): void;
    private [onMouseForceWillBegin];
    private [onMouseForceDown];
    private [onMouseUp_3];
    private [onMouseDown_3];
    private [onMouseMove_2];
    private [onMouseForceChange];
    private [onMouseForceGlobalChange];
}

declare const getDropzones: unique symbol;

declare interface MirrorOptions {
    constrainDimensions?: boolean;
    xAxis?: boolean;
    yAxis?: boolean;
    cursorOffsetX?: number | null;
    cursorOffsetY?: number | null;
    appendTo?: string | HTMLElement | ((element: HTMLElement) => void);
    thresholdX?: number;
    thresholdY?: number;
}

declare class MouseSensor extends Sensor {
    startEvent: MouseEvent;
    /*** Mouse down timer which will end up triggering the drag start operation */
    mouseDownTimeout: number;
    /*** Save pageX coordinates for delay drag */
    private pageX;
    /*** Save pageY coordinates for delay drag */
    private pageY;
    /*** Moment when mouseDown event happened */
    private onMouseDownAt;
    private [onMouseDown];
    private [startDrag];
    private [onDistanceChange];
    private [onMouseMove];
    private [onMouseUp];
    private [onContextMenuWhileDragging];
    attach(): void;
    detach(): void;
}

declare const onContextMenuWhileDragging: unique symbol;

declare const onDistanceChange: unique symbol;

declare const onDistanceChange_2: unique symbol;

declare const onDragEnd: unique symbol;

declare const onDragMove: unique symbol;

declare const onDragMove_2: unique symbol;

declare const onDragMove_3: unique symbol;

declare const onDragOut: unique symbol;

declare const onDragOver: unique symbol;

declare const onDragOver_2: unique symbol;

declare const onDragOver_3: unique symbol;

declare const onDragOver_4: unique symbol;

declare const onDragOver_5: unique symbol;

declare const onDragOverContainer: unique symbol;

declare const onDragPressure: unique symbol;

declare const onDragStart: unique symbol;

declare const onDragStart_2: unique symbol;

declare const onDragStart_3: unique symbol;

declare const onDragStart_4: unique symbol;

declare const onDragStart_5: unique symbol;

declare const onDragStart_6: unique symbol;

declare const onDragStop: unique symbol;

declare const onDragStop_2: unique symbol;

declare const onDragStop_3: unique symbol;

declare const onDragStop_4: unique symbol;

declare const onDragStop_5: unique symbol;

declare const onDragStop_6: unique symbol;

declare const onDrop: unique symbol;

declare const onMirrorCreated: unique symbol;

declare const onMirrorCreated_2: unique symbol;

declare const onMirrorDestroy: unique symbol;

declare const onMirrorDestroy_2: unique symbol;

declare const onMouseDown: unique symbol;

declare const onMouseDown_2: unique symbol;

declare const onMouseDown_3: unique symbol;

declare const onMouseForceChange: unique symbol;

declare const onMouseForceDown: unique symbol;

declare const onMouseForceGlobalChange: unique symbol;

declare const onMouseForceWillBegin: unique symbol;

declare const onMouseMove: unique symbol;

declare const onMouseMove_2: unique symbol;

declare const onMouseUp: unique symbol;

declare const onMouseUp_2: unique symbol;

declare const onMouseUp_3: unique symbol;

declare const onRequestAnimationFrame: unique symbol;

declare const onSortableSort: unique symbol;

declare const onSortableSorted: unique symbol;

declare const onSortableSorted_2: unique symbol;

declare const onTouchEnd: unique symbol;

declare const onTouchMove: unique symbol;

declare const onTouchStart: unique symbol;

declare namespace Plugins {
    export {
        Collidable,
        ResizeMirror,
        defaultOptions as defaultResizeMirrorOptions,
        Snappable,
        SwapAnimation,
        defaultOptions_2 as defaultSwapAnimationOptions,
        SortAnimation,
        defaultOptions_3 as defaultSortAnimationOptions,
        ResizeMirrorOptions,
        SwapAnimationOptions,
        SortAnimationOptions
    }
}
export { Plugins }

declare const reset: unique symbol;

declare const resize: unique symbol;

/**
 * The ResizeMirror plugin resizes the mirror element to the dimensions of the draggable element that the mirror is hovering over
 * @class ResizeMirror
 * @module ResizeMirror
 * @extends AbstractPlugin
 */
declare class ResizeMirror extends BasePlugin {
    options: ResizeMirrorOptions;
    lastWidth: number;
    lastHeight: number;
    mirror: HTMLElement;
    /**
     * ResizeMirror constructor.
     * @constructs ResizeMirror
     * @param {Draggable} draggable - Draggable instance
     */
    constructor(draggable: any);
    attach(): void;
    detach(): void;
    getOptions: () => ResizeMirrorOptions;
    private [onMirrorCreated];
    private [onMirrorDestroy];
    private [onDragOver_4];
    private [resize];
}

declare type ResizeMirrorOptions = Record<string, unknown>;

declare const returnToOriginalDropzone: unique symbol;

declare interface ScrollableOptions {
    speed: number;
    sensitivity: number;
    scrollableElements: HTMLElement[];
}

/**
 * Base sensor class. Extend from this class to create a new or custom sensor
 */
declare class Sensor {
    /** Current containers */
    containers: Element[];
    /** Current options */
    options: SensorOptions;
    /** Current drag state */
    dragging: boolean;
    /** Current container */
    currentContainer: Element;
    /** Draggables original source element */
    originalSource: Element;
    /** The event of the initial sensor down */
    startEvent: Event;
    delay: SensorDelayOptions;
    lastEvent: SensorEvent;
    constructor(containers?: Element[] | NodeList | Element, options?: SensorOptions);
    attach(): Sensor | void;
    detach(): Sensor | void;
    /**
     * Adds container to this sensor instance
     * @param {...Element} containers - Containers you want to add to this sensor
     * @example draggable.addContainer(document.body)
     */
    addContainer(...containers: any[]): void;
    /**
     * Removes container from this sensor instance
     * @param {...Element} containers - Containers you want to remove from this sensor
     * @example draggable.removeContainer(document.body)
     */
    removeContainer(...containers: any[]): void;
    /**
     * Triggers event on target element
     * @param {Element} element - Element to trigger event on
     * @param {SensorEvent} sensorEvent - Sensor event to trigger
     */
    trigger(element: Element, sensorEvent: SensorEvent): SensorEvent;
}

declare interface SensorDelayOptions {
    mouse?: number;
    drag?: number;
    touch?: number;
}

declare class SensorEvent extends BaseEvent {
    data: SensorEventData;
    constructor(data?: SensorEventData);
    get originalEvent(): Event;
    get clientX(): number;
    get clientY(): number;
    get target(): HTMLElement;
    get container(): HTMLElement;
    get originalSource(): HTMLElement;
    get pressure(): number;
    clone(data: SensorEventData): SensorEvent;
}

declare type SensorEventData = {
    originalEvent?: Event;
    clientX?: number;
    clientY?: number;
    target?: HTMLElement;
    container?: HTMLElement;
    originalSource?: HTMLElement;
    type?: string;
    value?: unknown;
    pressure?: number;
};

declare interface SensorOptions {
    delay?: number | SensorDelayOptions;
    handle?: string | NodeList | Element[] | Element | ((currentElement: Element) => Element);
    draggable?: string | ((element: Element) => void) | NodeList | Array<Element> | Element;
    distance?: number;
}

declare namespace Sensors {
    export {
        Sensor,
        MouseSensor,
        TouchSensor,
        DragSensor,
        ForceTouchSensor,
        SensorEventData,
        SensorEvent,
        DragStartSensorEvent,
        DragMoveSensorEvent,
        DragStopSensorEvent,
        DragPressureSensorEvent
    }
}
export { Sensors }

/**
 * Snappable plugin which snaps draggable elements into place
 * @class Snappable
 * @module Snappable
 * @extends AbstractPlugin
 */
declare class Snappable extends BasePlugin {
    /*** Keeps track of the first source element */
    firstSource: HTMLElement | null;
    /*** Keeps track of the mirror element */
    mirror: HTMLElement | null;
    attach(): void;
    detach(): void;
    private [onDragStart_6];
    private [onDragStop_6];
    private [onDragOver_5];
    private [onDragOut];
    private [onMirrorCreated_2];
    private [onMirrorDestroy_2];
}

/**
 * Sortable is built on top of Draggable and allows sorting of draggable elements. Sortable will keep
 * track of the original index and emits the new index as you drag over draggable elements.
 */
export declare class Sortable extends Draggable {
    startIndex: number | null;
    startContainer: Element | null;
    constructor(containers?: HTMLElement[], options?: Partial<SortableOptions>);
    /**
     * Destroys Sortable instance.
     */
    destroy(): void;
    /**
     * Returns true index of element within its container during drag operation, i.e. excluding mirror and original source
     */
    index(element: Element): number;
    /**
     * Returns sortable elements for a given container, excluding the mirror and
     * original source element if present
     */
    getSortableElementsForContainer(container: Element): Element[];
    private [onDragStart_4];
    private [onDragOverContainer];
    private [onDragOver_2];
    private [onDragStop_4];
}

declare class SortableEvent extends BaseEvent {
    data: SortableEventData;
    get dragEvent(): DragEvent_2;
    clone(data: any): SortableEvent;
    static type: string;
}

declare type SortableEventData = {
    dragEvent?: DragEvent_2;
    over?: HTMLElement;
    startContainer?: HTMLElement;
    oldContainer?: HTMLElement;
    newContainer?: HTMLElement;
    currentIndex?: number;
    startIndex?: number;
    oldIndex: number;
    newIndex: number;
};

declare interface SortableOptions extends Omit<DraggableOptions, 'announcements'> {
    announcements: Record<string, (event: SortableEvent | BaseEvent) => unknown>;
}

declare class SortAnimation extends BasePlugin {
    options: SortAnimationOptions;
    lastAnimationFrame: number;
    lastElements: SortAnimationElement[];
    constructor(draggable: any);
    attach(): void;
    detach(): void;
    getOptions: () => {};
    private [onSortableSort];
    private [onSortableSorted_2];
}

declare interface SortAnimationElement {
    domEl: HTMLElement;
    offsetTop: number;
    offsetLeft: number;
}

declare interface SortAnimationOptions {
    duration: number;
    easingFunction: string;
}

declare const startDrag: unique symbol;

declare const startDrag_2: unique symbol;

/**
 * SwapAnimation plugin adds swap animations for sortable
 * @class SwapAnimation
 * @module SwapAnimation
 * @extends AbstractPlugin
 */
declare class SwapAnimation extends BasePlugin {
    options: SwapAnimationOptions;
    lastAnimationFrame: number;
    constructor(draggable: any);
    attach(): void;
    detach(): void;
    getOptions: () => {};
    private [onSortableSorted];
}

declare interface SwapAnimationOptions {
    duration: number;
    easingFunction: string;
    horizontal: boolean;
}

export declare class Swappable extends Draggable {
    lastOver: HTMLElement | null;
    constructor(containers?: HTMLElement[], options?: Partial<SwappableOptions>);
    destroy(): void;
    [onDragStart_3](event: any): void;
    [onDragOver](event: any): void;
    [onDragStop_3](event: any): void;
}

declare class SwappableEvent extends BaseEvent {
    data: SwappableEventData;
    get dragEvent(): DragEvent_2;
    clone(data: any): SwappableEvent;
    static type: string;
}

declare type SwappableEventData = {
    dragEvent: DragEvent_2;
    over?: Element;
    overContainer?: Element;
    swappedElement: Element;
};

declare interface SwappableOptions extends Omit<DraggableOptions, 'announcements'> {
    announcements: Record<string, (event: SwappableEvent | BaseEvent) => unknown>;
}

declare class TouchSensor extends Sensor {
    currentScrollableParent: HTMLElement;
    tapTimeout: number;
    touchMoved: boolean;
    onTouchStartAt: number;
    private pageX;
    private pageY;
    attach(): void;
    detach(): void;
    private [onTouchStart];
    private [startDrag_2];
    private [onDistanceChange_2];
    private [onTouchMove];
    private [onTouchEnd];
}

export { }
