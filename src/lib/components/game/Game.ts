import {Canvas} from './Canvas';

interface KeyInput {
  [key: string]: boolean
}
export type MouseClick = { left: boolean, middle: boolean, right: boolean };
export type MousePosition = { x: number, y: number };

export enum MouseButtons {
  right = "right",
  left = "left",
  middle = "middle"
}
export enum EventStates {
  RELEASED = "released",
  PRESSED = "pressed",
  ISPRESSED = "isPressed"
}
export type OnMouse = (type: MouseButtons, eventState: EventStates, cb?: Function) => boolean;
export type OnKey = (type: string, eventState: EventStates, cb?: Function) => boolean;
export type DTO = { key: KeyInput, mousePos: MousePosition, mouseClick: MouseClick, eventStack: any[], onMouse: OnMouse, onKey: OnKey };

export class Input {
  public static readonly mouseMap: any = {
    "0": MouseButtons.left,
    "1": MouseButtons.middle,
    "2": MouseButtons.left
  };
  public readonly key: KeyInput;
  public readonly mousePos: MousePosition;
  public readonly mouseClick: MouseClick;
  public readonly eventStack: String[];
  public readonly DTO: DTO;

  public readonly canvas: Canvas;
  constructor(game: Game) {
    this.canvas = game.mainCanvas;
    this.eventStack = [];
    this.key = {};
    this.initializeKey();
    this.mousePos = { x: 0, y: 0 };
    this.mouseClick = { left: false, middle: false, right: false };
    this.DTO = {
      key: this.key, mousePos: this.mousePos, mouseClick: this.mouseClick, eventStack: this.eventStack, onMouse(type: MouseButtons, eventState: EventStates, cb?: Function) {
        if (eventState === EventStates.ISPRESSED) {
          let happened = this.mouseClick[type];
          if (happened && typeof cb === "function") cb();
          return happened;
        }
        if (eventState === EventStates.PRESSED) {
          let happened = this.eventStack.reduce((prev, next: string) => {
            return prev || (next.startsWith(type) && next.endsWith(EventStates.PRESSED));
          }, false);
          if (happened && typeof cb === "function") cb();
          return happened;
        }
        if (eventState === EventStates.RELEASED) {
          let happened = this.eventStack.filter((val: string) => val.endsWith("liberated")).reduce((prev, next: string) => {
            return prev || next.startsWith(type);
          }, false);
          if (happened && typeof cb === "function") cb();
          return happened;
        }
        throw new Error(eventState + " isn't a valid state");

      }, onKey(type: string, eventState: EventStates, cb?: Function) {
        if (eventState === EventStates.ISPRESSED) {
          if (!Object.keys(this.key).includes(type)) return false;
          let happened = this.key[type];
          if (happened && typeof cb === "function") cb();
          return happened;
        }
        if (eventState === EventStates.PRESSED) {
          let happened = this.eventStack.filter((val: string) => val.endsWith("pressed")).reduce((prev, next: string) => {
            return prev || next.startsWith(type);
          }, false);
          if (happened && typeof cb === "function") cb();
          return happened;
        }
        if (eventState === EventStates.RELEASED) {
          let happened = this.eventStack.filter((val: string) => val.endsWith("released")).reduce((prev, next: string) => {
            return prev || next.startsWith(type);
          }, false);
          if (happened && typeof cb === "function") cb();
          return happened;
        }
        throw new Error(eventState + " isn't a valid state");
      }
    };
  }

  initializeKey() {
    [..."abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""), "Alt", "Control", "Shift", "AltGraph", "ArrowRight", "ArrowUp", "ArrowLeft", "ArrowDown"].forEach((val) => {
      this.key[val] = false;
    });
  }

  setClickFromButtons(c: number) {
    this.mouseClick.left = c === 1 || c === 3 || c === 5 || c === 7;
    this.mouseClick.right = c === 2 || c === 3 || c === 6 || c === 7;
    this.mouseClick.middle = c === 4 || c === 5 || c === 6 || c === 7;
  }

  mouseSwitch(c: number) {
    return Input.mouseMap[c.toString()];
  }

  clearStack() {
    this.eventStack.length = 0;
  }

  /**
   * starts the eventlistener which
   * set the events
   */
  gatherInputs = () => {
    window.addEventListener("keydown", (keyevent) => {
      if(!keyevent.repeat){
        this.eventStack.push(keyevent.key + " pressed");
      }
      this.key[keyevent.key] = true;
    });
    window.addEventListener("keyup", (keyevent) => {
      if (!keyevent.repeat) {
        this.eventStack.push(keyevent.key + " released");
      }
      this.key[keyevent.key] = false;
    });

    this.canvas.element.addEventListener("mousedown", (mouse) => {
      this.eventStack.push(this.mouseSwitch(mouse.button) + " clicked");
      this.setClickFromButtons(mouse.buttons);
    });
    window.addEventListener("mouseup", (mouse) => {
      this.eventStack.push(this.mouseSwitch(mouse.button) + " liberated");
      this.setClickFromButtons(mouse.buttons);
    });
    window.addEventListener("mousemove", (mouse) => {
      this.setClickFromButtons(mouse.buttons);
      let boundingBox = this.canvas.element.getBoundingClientRect();
      this.mousePos.x =
        (mouse.clientX - boundingBox.left) *
        (this.canvas.width / boundingBox.width);

      this.mousePos.y =
        (mouse.clientY - boundingBox.top) *
        (this.canvas.height / boundingBox.height);
    });
  };

}
export class Game {
  public input: Input;
  public mainCanvas: Canvas;
  public update: (canvas: Canvas, events: DTO, frames: number) => void = () => { };
  public frames: number;
  public fps: number;
  public stopped: boolean;

  constructor(w: number, h: number) {
    this.stopped = true;
    this.frames = 0;
    this.fps = 0;
    this.mainCanvas = new Canvas(w, h);
    this.input = new Input(this);
    this.input.gatherInputs();
  }

  mount(element: string) {
    this.mainCanvas.mount(element);
  }

  get inputs() {
    return this.input.DTO;
  }
  async load() { }

  private mainLoop = () => {
    this.update(this.mainCanvas, this.inputs, this.frames);
    if (!this.stopped) {
      requestAnimationFrame(this.mainLoop);
    }
    this.input.clearStack();
    this.frames++;
    //call requestAnimationFrame;
  };
  start() {
    this.stopped = false;
    requestAnimationFrame(this.mainLoop);
  }
  stop() {
    this.stopped = true;
    // stop
  }

  get height() {
    return this.mainCanvas.height;
  }
  get width() {
    return this.mainCanvas.width;
  }
  set height(height) {
    this.mainCanvas.height = height;
  }
  set width(width) {
    this.mainCanvas.width = width;
  }
}