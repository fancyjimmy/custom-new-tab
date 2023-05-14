export class Canvas {
  public element: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;
  static DRAW_DEFAULT_PIXELATED = true;


  constructor(width: number, height: number) {
    this.element = document.createElement("canvas");
    this.element.width = width;
    this.element.height = height;

    let context = this.element.getContext("2d");
    if (context === null)
      throw new Error("Context wasn't created successfully");

    this.ctx = context;

    if(Canvas.DRAW_DEFAULT_PIXELATED){
      this.ctx.imageSmoothingEnabled = false;
    }
    this.init();
  }

  init() { }
  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  fill(fillStyle?:string){
    this.ctx.save();
    this.ctx.fillStyle = fillStyle || "#00ff00";
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.ctx.restore();
  }

  mount(id: string): void {
    let parent = document.querySelector(id);
    if (parent === null) throw new Error("No Canvas with " + id + " found");
    parent.appendChild(this.element);
  }

  /**
   *
   * @param image Image which gets drawn
   * @param dx x of Canvas which gets drawn to
   * @param dy y of Canvas which gets drawn to
   * @param dWidth width of Image on Canvas
   * @param dHeight height of Image on Canvas
   */
  draw(
    image: CanvasImageSource,
    dx: number,
    dy: number,
    dWidth?: number,
    dHeight?: number
  ) {
    if (typeof dWidth === "number" && typeof dHeight === "number") {
      this.ctx.drawImage(image, dx, dy, dWidth, dHeight);
      return;
    }
    this.ctx.drawImage(image, dx, dy);
  }

  static resolveSize(n: number | SVGAnimatedLength): number {
    if (typeof n === "number") {
      return n;
    }
    return n.baseVal.value;
  }

  drawCentered(image: CanvasImageSource, x: number, y:number, width?: number, height?:number){
    width = width || Canvas.resolveSize(image.width);
    height = height || Canvas.resolveSize(image.height);
    this.draw(image, x - (width / 2), y - (height / 2), width, height);
  }

  static DRAW_TRANSFORM_DEFAULT_CENTERED = true;
  /**
   *
   * @param image just the image
   * @param x x position (Round for smoother display)
   * @param y y  position (Round for smoother display)
   * @param deg degrees in radiants
   * @param flip boolean if it should be flipped
   * @param rotationPointX rotation point x relative to the right top pixel
   * @param rotationPointY rotation point y relative to the left top pixel
   * @param width width as number
   * @param height height as number
   */
  drawTransformed(image: CanvasImageSource, x: number, y: number, width?: number, height?: number, deg?: number, flipHorizontally?: boolean, flipVertically?:boolean, rotationPointX?: number, rotationPointY?: number) {
    width = width || Canvas.resolveSize(image.width);
    height = height || Canvas.resolveSize(image.height);
    deg = deg || 0;
    flipHorizontally = flipHorizontally || false;
    flipVertically = flipVertically || false;
    rotationPointX = rotationPointX || - width + (Canvas.DRAW_TRANSFORM_DEFAULT_CENTERED ? (width / 2) : 0);
    rotationPointY = rotationPointY || - height + (Canvas.DRAW_TRANSFORM_DEFAULT_CENTERED ? (height / 2): 0);
    this.ctx.save();
    this.ctx.setTransform(1 * (flipHorizontally?-1:1), 0, 0, 1 * (flipVertically?-1:1), x, y);
    this.ctx.rotate(deg);
    this.ctx.drawImage(image, rotationPointX, rotationPointY, width, height);
    this.ctx.restore();
  }

  drawPart(
    image: CanvasImageSource,
    sx: number,
    sy: number,
    sWidth: number,
    sHeight: number,
    dx: number,
    dy: number,
    dWidth: number,
    dHeight: number
  ) {
    this.ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
  }

  static DEFAULT_RECT_LINEWIDTH = 2;
  static DEFAULT_RECT_LINECOLOR = "#000000";
  drawRectOutlined(x: number, y: number, widht: number, height: number, lineWidth?: number, strokeStyle?: string) {
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.lineWidth = lineWidth || Canvas.DEFAULT_RECT_LINEWIDTH;
    this.ctx.strokeStyle = strokeStyle || Canvas.DEFAULT_RECT_LINECOLOR;
    this.ctx.rect(x, y, widht, height);
    this.ctx.stroke();
    this.ctx.restore();
  }

  static DEFAULT_RECT_FILLCOLOR = "#000000";

  drawRectFilled(x: number, y: number, widht: number, height: number, fillStyle?: string) {
    this.ctx.save();
    this.ctx.fillStyle = fillStyle || Canvas.DEFAULT_RECT_FILLCOLOR;
    this.ctx.fillRect(x, y, widht, height);
    this.ctx.restore();
  }

  stack(canvas: Canvas, x?: number, y?: number, widht?: number, height?: number) {
    x = x || 0;
    y = y || 0;
    this.draw(canvas.element, x, y, widht, height);
  }

  get height() {
    return this.element.height;
  }
  get width() {
    return this.element.width;
  }
  set height(height) {
    this.element.height = height;
  }
  set width(width) {
    this.element.width = width;
  }
}
export type SpritePosition = { x: number; y: number; w: number; h: number };
export type Offset = { x: number; y: number };

interface Displayable {
  display(
    canvas: Canvas,
    x: number,
    y: number,
    width?: number,
    height?: number
  ): void;

  displayTransformed(
    canvas: Canvas,
    x: number,
    y: number,
    width?: number,
    height?: number,
    deg?: number,
    flipHorizontally?: boolean,
    flipVertically?: boolean,
    rotationPointX?: number,
    rotationPointY?: number,
  ): void;
}

export class ImageResource {
  /**
   * Static Class for Loading
   * @param path
   * @returns Promise of a loaded HTMLImage
   */
  static async load(path: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      let img = new Image();
      img.src = path;
      img.onload = () => {
        resolve(img);
      };

      img.onerror = (err) => {
        reject("Error Occured during loading of " + path);
      };
    });
  }
  static async loadAll(...paths: string[]) {
    return Promise.all(paths.map((val) => ImageResource.load(val)));
  }
}

export class Sprite implements Displayable {
  private image: CanvasImageSource;
  private width: number;
  private height: number;

  static resolveSize(n: number | SVGAnimatedLength): number {
    if (typeof n === "number") {
      return n;
    }
    return n.baseVal.value;
  }
  constructor(image: CanvasImageSource) {
    this.image = image;
    this.width = Sprite.resolveSize(image.width);
    this.height = Sprite.resolveSize(image.height);
  }

  display(
    canvas: Canvas,
    x: number,
    y: number,
    width?: number,
    height?: number
  ) {
    canvas.draw(this.image, x, y, width, height);
    /*
    canvas.beginPath();
    canvas.rect(x, y, this.width, this.height);
    canvas.stroke();
    */
  }
  displayTransformed(canvas: Canvas, x: number, y: number, width?: number , height?: number , deg?: number , flipHorizontally?: boolean , flipVertically?: boolean, rotationPointX?: number, rotationPointY?: number): void {
    canvas.drawTransformed(this.image, x, y, width, height, deg, flipHorizontally, flipVertically, rotationPointX, rotationPointY);
  }
}

export class SpriteSheet {
  private sheet: HTMLCanvasElement;

  static resolveSize(n: number | SVGAnimatedLength): number {
    if (typeof n === "number") {
      return n;
    }
    return n.baseVal.value;
  }

  constructor(image: CanvasImageSource) {
    this.sheet = document.createElement("canvas");
    this.sheet.width = SpriteSheet.resolveSize(image.width);
    this.sheet.height = SpriteSheet.resolveSize(image.height);
    let ctx = this.sheet.getContext("2d");
    ctx?.drawImage(image, 0, 0);
  }

  static canvasSized(width: number, height: number): HTMLCanvasElement {
    let a = document.createElement("canvas");
    a.width = width;
    a.height = height;
    return a;
  }

  static async of(path: string) {
    let img = await ImageResource.load(path);

    return new SpriteSheet(img);
  }

  createSprites(...positions: SpritePosition[]) {
    let sprites = [];
    for (let i = 0; i < positions.length; i++) {
      let pos = positions[i];
      sprites.push(this.createSprite(pos.x, pos.y, pos.w, pos.h));
    }
    return sprites;
  }

  get height() {
    return this.sheet.height;
  }
  get width() {
    return this.sheet.width;
  }
  set height(height) {
    this.sheet.height = height;
  }
  set width(width) {
    this.sheet.width = width;
  }

  fromSpriteTable(col: number, row: number) {
    let positions = [];
    if (row < 1 && col < 1) new Error("Col or Rows not valid");
    let w = this.width / col;
    let h = this.height / row;
    for (let i = 0; i < row; i++) {
      for (let j = 0; j < col; j++) {
        positions.push({ x: w * j, y: h * i, w, h });
      }
    }
    return this.createSprites(...positions);
  }
  sub(sx: number, sy: number, sWidth: number, sHeight: number) {
    let canvas = SpriteSheet.canvasSized(sWidth, sHeight);
    let tempCTX = canvas.getContext("2d");
    if (tempCTX)
      tempCTX?.drawImage(
        this.sheet,
        sx,
        sy,
        sWidth,
        sHeight,
        0,
        0,
        sWidth,
        sHeight
      );

    return new SpriteSheet(canvas);
  }

  createSprite(
    sx: number,
    sy: number,
    sWidth: number,
    sHeight: number
  ): Sprite {
    //TODO implement memoize function for this
    if (
      sx < 0 ||
      sy < 0 ||
      sx + sWidth > this.sheet.width ||
      sy + sHeight > this.sheet.height ||
      sWidth <= 0 ||
      sHeight <= 0
    )
      throw new Error("Widht, Height, x, y not right");

    let canvas = SpriteSheet.canvasSized(sWidth, sHeight);
    let tempCTX = canvas.getContext("2d");
    if (tempCTX)
      tempCTX?.drawImage(
        this.sheet,
        sx,
        sy,
        sWidth,
        sHeight,
        0,
        0,
        sWidth,
        sHeight
      );

    let image = new Image(sWidth, sHeight);
    image.src = canvas.toDataURL("image/png");

    return new Sprite(image);
  }
}

export class AnimationFrames {
  private offsets: Offset[];
  private sprites: Sprite[];
  constructor(...sprites: Sprite[]) {
    this.offsets = [];
    this.sprites = [];
    this.addSprites(...sprites);
  }
  addSprites(...sprites: Sprite[]) {
    sprites.forEach((sprite) => {
      this.put(sprite, { x: 0, y: 0 });
    });
    return this;
  }

  put(sprite: Sprite, offset: Offset = { x: 0, y: 0 }) {
    this.sprites.push(sprite);
    this.offsets.push(offset);
  }

  get length() {
    return this.sprites.length;
  }

  getSprite(x: number) {
    return this.sprites[x % this.length];
  }

  display(
    frame: number,
    canvas: Canvas,
    x: number,
    y: number,
    width?: number,
    height?: number
  ): void {
    frame = frame % this.sprites.length;
    this.sprites[frame].display(
      canvas,
      x + this.offsets[frame].x,
      y + this.offsets[frame].y,
      width,
      height
    );
  }

  displayTransformed(frame:number, canvas: Canvas, x: number, y: number, width?: number , height?: number , deg?: number , flipHorizontally?: boolean , flipVertically?: boolean, rotationPointX?: number, rotationPointY?: number){
    this.sprites[frame].displayTransformed(canvas, x, y, width, height, deg, flipHorizontally, flipVertically, rotationPointX, rotationPointY);
  }

  createAnimation() {
    return new AnimatedSprite(this);
  }
}

export class AnimatedSprite implements Displayable {
  public animationFrames: AnimationFrames;
  private curr: number;
  constructor(animationFrames: AnimationFrames) {
    this.animationFrames = animationFrames;
    this.curr = 0;
  }

  nextFrame() {
    this.currentImage++;
  }
  prevFrame() {
    this.currentImage--;
  }

  display(
    canvas: Canvas,
    x: number,
    y: number,
    widht?: number,
    height?: number
  ) {
    this.animationFrames.display(this.currentImage, canvas, x, y, widht, height);
  }

  displayTransformed(canvas: Canvas, x: number, y: number, width?: number | undefined, height?: number | undefined, deg?: number | undefined, flipHorizontally?: boolean | undefined, flipVertically?: boolean | undefined, rotationPointX?: number | undefined, rotationPointY?: number | undefined): void {
    this.animationFrames.displayTransformed(this.currentImage, canvas, x, y, width, height, deg, flipHorizontally, flipVertically, rotationPointX, rotationPointY);
  }
  get currentImage() {
    return this.curr;
  }

  set currentImage(c: number) {
    this.curr = c % this.animationFrames.length;
  }
}