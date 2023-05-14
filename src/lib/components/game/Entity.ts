import {Canvas} from './Canvas';
import type {DTO} from './Game';

type Update = (input: DTO, ...args: any) => {}
type Render = (canvas: Canvas, ...args: any) => {};
export class Entity {
  public update: Update;
  public render: Render;
  constructor(update: Update, render: Render) {
    this.update = update;
    this.render = render;
  }
}

export class EntityList {
  public entities: Entity[];
  public update: Update;
  public render: Render;
  constructor(update: Update, render: Render, ...entities: Entity[]) {
    this.update = update;
    this.render = render;
    this.entities = entities;
  }

  push(...entities: Entity[]) {
    this.entities.push(...entities);
  }

  remove(entity: Entity) {
    this.entities.filter((val) => val !== entity);
  }

  filter(predicate: (value: Entity, index: number, array: Entity[]) => unknown, thisArg?: any){
    return this.entities.filter(predicate, thisArg);
  }

  splice(start:number, deleteCount?:number){
    this.entities.splice(start, deleteCount);
  }

  pop(): Entity | undefined {
    return this.entities.pop();
  }
}

interface EntityListCollection {
  [key: string]: Entity;
}
interface Layers {
  [key: string]: Canvas;
}

export class State {
  private entityList: EntityListCollection;
  private layers: Layers;

  public update: Update;
  public render: Render;
  public initialize: () => {};
  public stateStack: StateStack;
  constructor(stateStack: StateStack, update: Update, render: Render, initialize: ()=>{}) {
    this.stateStack = stateStack;
    this.update = update;
    this.render = render;
    this.initialize = initialize;
    this.layers = {};
    this.entityList = {};
  }
}

export class StateStack {
  private states: State[];
  constructor(...states: State[]) {
    this.states = states|| [];
  }
  push(state: State) {
    state.initialize();
    this.states.push(state);
  }

  pop() {
    this.states.pop();
  }
  update(input: DTO, ...args: any[]) {
    this.states[this.states.length - 1].update(input, ...args);
  }
  render(canvas: Canvas, ...args: any[]) {
    this.states.forEach(state => state.render(canvas, ...args));
  }
}