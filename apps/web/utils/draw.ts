import { Tool } from "../components/Tools";
import { useCanvasStore, useLoadingStore } from "@repo/store";

type Shape =
  | {
      type: "rect";
      x: number;
      y: number;
      width: number;
      height: number;
      color?: string;
      strokeWidth?: number;
    }
  | {
      type: "circle";
      x: number;
      y: number;
      width: number;
      height: number;
      color?: string;
      strokeWidth?: number;
    }
  | {
      type: "rhombus";
      x: number;
      y: number;
      width: number;
      height: number;
      color?: string;
      strokeWidth?: number;
    }
  | {
      type: "line";
      x: number;
      y: number;
      x2: number;
      y2: number;
      color?: string;
      strokeWidth?: number;
    }
  | {
      type: "arrow";
      x: number;
      y: number;
      x2: number;
      y2: number;
      color?: string;
      strokeWidth?: number;
    }
  | {
      type: "freehand";
      points: { x: number; y: number }[];
      color?: string;
      strokeWidth?: number;
    }
  | {
      type: "image";
      x: number;
      y: number;
      width: number;
      height: number;
      src: string;
      imageData?: HTMLImageElement;
    };

export class Draw {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private existingShapes: Shape[] = [];
  private clicked: boolean;
  private startX = 0;
  private startY = 0;
  private freehandPoints: { x: number; y: number }[] = [];
  private selectedTool: Tool = "rect";
  private documentID: string;
  private addShape: (shape: Shape, documentID: string) => void;
  private getShapes: (documentId: string) => Promise<Shape[]>;
  private socket: any = null;
  private isCollaborative: boolean = false;
  private socketStore: any;
  private isPanning: boolean = false;
  public offset: { x: number; y: number } = { x: 0, y: 0 };
  private panStart: { x: number; y: number } = { x: 0, y: 0 };
  public scale: number = 1;
  private isReadonly: boolean = false;
  private undoStack: Shape[][] = [];
  private redoStack: Shape[][] = [];
  private currentColor: string = "#ffffff";
  private currentStrokeWidth: number = 2;
  private loadedImages: Map<string, HTMLImageElement> = new Map();
  private selectedShapeIndex: number = -1;
  private isDragging: boolean = false;
  private dragOffset: { x: number; y: number } = { x: 0, y: 0 };

  constructor(
    canvas: HTMLCanvasElement,
    documentID: string,
    isReadonly: boolean = false,
    getShapes: (documentId: string) => Promise<Shape[]>,
    addShape?: (shape: Shape, documentID: string) => void,
    socketStore?: any
  ) {
    this.canvas = canvas;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.ctx = canvas.getContext("2d")!;
    this.clicked = false;
    this.isReadonly = isReadonly;
    this.documentID = documentID;
    this.getShapes = getShapes;

    this.socketStore = socketStore ?? {};
    this.addShape = addShape ?? (() => {});
    this.socket = socketStore?.socket || null;
    this.isCollaborative = !!socketStore?.isConnected;

    this.init();
    this.initMouseHandlers();
  }

  async init() {
    if (!this.documentID) return;

    try {
      const shapes = await this.getShapes(this.documentID);
      this.existingShapes = Array.isArray(shapes) ? shapes.filter(Boolean) : [];
      await this.preloadImages();

      if (this.isCollaborative && this.socket) {
        this.initSocketEvents();
      }

      this.redraw();
    } catch (error) {
      console.error("Failed to initialize canvas:", error);
      useLoadingStore.getState().setError("Failed to load shapes");
    }
  }

  async preloadImages() {
    const imageShapes = this.existingShapes.filter(
      (shape): shape is Extract<Shape, { type: "image" }> =>
        shape?.type === "image"
    );

    for (const shape of imageShapes) {
      if (!this.loadedImages.has(shape.src)) {
        try {
          const img = new Image();
          img.crossOrigin = "anonymous";
          await new Promise<void>((resolve, reject) => {
            img.onload = () => resolve();
            img.onerror = () => reject();
            img.src = shape.src;
          });
          this.loadedImages.set(shape.src, img);
          shape.imageData = img;
        } catch (error) {
          console.error("Failed to load image:", shape.src);
        }
      } else {
        const loadedImg = this.loadedImages.get(shape.src);
        if (loadedImg) {
          shape.imageData = loadedImg;
        }
      }
    }
  }

  initSocketEvents() {
    if (!this.isCollaborative || !this.socket) return;

    this.socket.on("draw", (data: Shape) => {
      if (!data) return;
      this.existingShapes.push(data);
      this.redraw();
    });

    this.socket.on("clear-canvas", () => {
      this.existingShapes = [];
      this.redraw();
    });

    this.socket.on("undo-shape", () => {
      if (this.undoStack.length > 0) {
        const lastState = this.undoStack.pop();
        if (lastState) {
          this.redoStack.push([...this.existingShapes]);
          this.existingShapes = [...lastState];
          this.redraw();
          this.syncWithServer();
        }
      }
    });

    this.socket.on("redo-shape", () => {
      if (this.redoStack.length > 0) {
        const lastState = this.redoStack.pop();
        if (lastState) {
          this.undoStack.push([...this.existingShapes]);
          this.existingShapes = [...lastState];
          this.redraw();
          this.syncWithServer();
        }
      }
    });

    this.socket.on("shape-deleted", (data: { shapeIndex: number }) => {
      if (
        data.shapeIndex >= 0 &&
        data.shapeIndex < this.existingShapes.length
      ) {
        this.existingShapes.splice(data.shapeIndex, 1);
        this.redraw();
      }
    });
  }

  setTool(tool: Tool) {
    this.selectedTool = tool;
    this.selectedShapeIndex = -1;
    if (tool === "hand") {
      this.canvas.style.cursor = "grab";
    } else if (tool === "rubber") {
      this.canvas.style.cursor = "crosshair";
    } else {
      this.canvas.style.cursor = "crosshair";
    }
  }

  setColor(color: string) {
    this.currentColor = color;
  }

  setStrokeWidth(width: number) {
    this.currentStrokeWidth = width;
  }

  getCurrentColor(): string {
    return this.currentColor;
  }

  getCurrentStrokeWidth(): number {
    return this.currentStrokeWidth;
  }

  private cleanShapesForServer(shapes: Shape[]): Shape[] {
    return shapes
      .filter(Boolean)
      .map((shape): Shape | null => {
        if (!shape || !shape.type) return null;

        switch (shape.type) {
          case "rect":
          case "rhombus":
          case "circle":
            return {
              type: shape.type,
              x: Number(shape.x) || 0,
              y: Number(shape.y) || 0,
              width: Number(shape.width) || 0,
              height: Number(shape.height) || 0,
              color: shape.color || this.currentColor,
              strokeWidth: shape.strokeWidth || this.currentStrokeWidth,
            } as Shape;

          case "line":
          case "arrow":
            const lineShape = shape as Extract<
              Shape,
              { type: "line" | "arrow" }
            >;
            return {
              type: shape.type,
              x: Number(lineShape.x) || 0,
              y: Number(lineShape.y) || 0,
              x2: Number(lineShape.x2) || 0,
              y2: Number(lineShape.y2) || 0,
              color: lineShape.color || this.currentColor,
              strokeWidth: lineShape.strokeWidth || this.currentStrokeWidth,
            } as Shape;

          case "freehand":
            const freehandShape = shape as Extract<Shape, { type: "freehand" }>;
            return {
              type: "freehand",
              points: Array.isArray(freehandShape.points)
                ? freehandShape.points.map((p) => ({
                    x: Number(p?.x) || 0,
                    y: Number(p?.y) || 0,
                  }))
                : [],
              color: freehandShape.color || this.currentColor,
              strokeWidth: freehandShape.strokeWidth || this.currentStrokeWidth,
            } as Shape;

          case "image":
            const imageShape = shape as Extract<Shape, { type: "image" }>;
            return {
              type: "image",
              x: Number(imageShape.x) || 0,
              y: Number(imageShape.y) || 0,
              width: Number(imageShape.width) || 0,
              height: Number(imageShape.height) || 0,
              src: imageShape.src,
            } as Shape;

          default:
            return null;
        }
      })
      .filter((shape): shape is Shape => shape !== null);
  }

  drawReact(shape: Extract<Shape, { type: "rect" }>) {
    this.ctx.strokeStyle = shape.color || this.currentColor;
    this.ctx.lineWidth = shape.strokeWidth || this.currentStrokeWidth;
    this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
  }

  drawRhombus(shape: Extract<Shape, { type: "rhombus" }>) {
    this.ctx.strokeStyle = shape.color || this.currentColor;
    this.ctx.lineWidth = shape.strokeWidth || this.currentStrokeWidth;
    this.ctx.beginPath();

    const centerX = shape.x + shape.width / 2;
    const centerY = shape.y + shape.height / 2;

    this.ctx.moveTo(centerX, shape.y);
    this.ctx.lineTo(shape.x + shape.width, centerY);
    this.ctx.lineTo(centerX, shape.y + shape.height);
    this.ctx.lineTo(shape.x, centerY);
    this.ctx.closePath();
    this.ctx.stroke();
  }

  drawCircle(shape: Extract<Shape, { type: "circle" }>) {
    this.ctx.beginPath();
    this.ctx.ellipse(
      shape.x, // centerX
      shape.y, // centerY
      shape.width, // radiusX
      shape.height, // radiusY
      0,
      0,
      Math.PI * 2
    );
    this.ctx.strokeStyle = shape.color || this.currentColor;
    this.ctx.lineWidth = shape.strokeWidth || this.currentStrokeWidth;
    this.ctx.stroke();
  }

  drawLine(shape: Extract<Shape, { type: "line" }>) {
    this.ctx.beginPath();
    this.ctx.moveTo(shape.x, shape.y);
    this.ctx.lineTo(shape.x2, shape.y2);
    this.ctx.strokeStyle = shape.color || this.currentColor;
    this.ctx.lineWidth = shape.strokeWidth || this.currentStrokeWidth;
    this.ctx.stroke();
  }

  drawArrow(shape: Extract<Shape, { type: "arrow" }>) {
    const headlen = 15;
    const dx = shape.x2 - shape.x;
    const dy = shape.y2 - shape.y;
    const angle = Math.atan2(dy, dx);

    this.ctx.strokeStyle = shape.color || this.currentColor;
    this.ctx.lineWidth = shape.strokeWidth || this.currentStrokeWidth;
    this.ctx.fillStyle = shape.color || this.currentColor;

    this.ctx.beginPath();
    this.ctx.moveTo(shape.x, shape.y);
    this.ctx.lineTo(shape.x2, shape.y2);
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.moveTo(shape.x2, shape.y2);
    this.ctx.lineTo(
      shape.x2 - headlen * Math.cos(angle - Math.PI / 6),
      shape.y2 - headlen * Math.sin(angle - Math.PI / 6)
    );
    this.ctx.moveTo(shape.x2, shape.y2);
    this.ctx.lineTo(
      shape.x2 - headlen * Math.cos(angle + Math.PI / 6),
      shape.y2 - headlen * Math.sin(angle + Math.PI / 6)
    );
    this.ctx.stroke();
  }

  drawFreehand(shape: Extract<Shape, { type: "freehand" }>) {
    if (!shape.points || shape.points.length < 2) return;

    this.ctx.beginPath();
    const points = shape.points;

    if (points[0]) {
      this.ctx.moveTo(points[0].x, points[0].y);

      for (let i = 1; i < points.length; i++) {
        const point = points[i];
        if (point) {
          this.ctx.lineTo(point.x, point.y);
        }
      }
    }

    this.ctx.strokeStyle = shape.color || this.currentColor;
    this.ctx.lineWidth = shape.strokeWidth || this.currentStrokeWidth;
    this.ctx.lineCap = "round";
    this.ctx.lineJoin = "round";
    this.ctx.stroke();
  }

  drawImage(shape: Extract<Shape, { type: "image" }>) {
    if (shape.imageData) {
      this.ctx.drawImage(
        shape.imageData,
        shape.x,
        shape.y,
        shape.width,
        shape.height
      );
    }
  }

  isPointInShape(x: number, y: number, shape: Shape): boolean {
    if (!shape) return false;

    const tolerance = Math.max(
      10,
      (shape.type === "image" ? 0 : (shape as any).strokeWidth || 2) + 5
    );

    switch (shape.type) {
      case "rect":
      case "rhombus":
      case "image":
        return (
          x >= shape.x - tolerance &&
          x <= shape.x + shape.width + tolerance &&
          y >= shape.y - tolerance &&
          y <= shape.y + shape.height + tolerance
        );

      case "circle":
        const dx = x - shape.x;
        const dy = y - shape.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxRadius = Math.max(shape.width, shape.height);
        return distance <= maxRadius + tolerance;

      case "line":
      case "arrow":
        return (
          this.distanceToLineSegment(
            x,
            y,
            shape.x,
            shape.y,
            shape.x2,
            shape.y2
          ) <= tolerance
        );

      case "freehand":
        if (!shape.points || shape.points.length < 2) return false;
        for (let i = 0; i < shape.points.length - 1; i++) {
          const p1 = shape.points[i];
          const p2 = shape.points[i + 1];
          if (p1 && p2) {
            const dist = this.distanceToLineSegment(
              x,
              y,
              p1.x,
              p1.y,
              p2.x,
              p2.y
            );
            if (dist <= tolerance) return true;
          }
        }
        return false;

      default:
        return false;
    }
  }

  distanceToLineSegment(
    px: number,
    py: number,
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ): number {
    const dx = x2 - x1;
    const dy = y2 - y1;
    if (dx !== 0 || dy !== 0) {
      const t = Math.max(
        0,
        Math.min(1, ((px - x1) * dx + (py - y1) * dy) / (dx * dx + dy * dy))
      );
      const projX = x1 + t * dx;
      const projY = y1 + t * dy;
      return Math.sqrt(
        (px - projX) * (px - projX) + (py - projY) * (py - projY)
      );
    }
    return Math.sqrt((px - x1) * (px - x1) + (py - y1) * (py - y1));
  }

  async uploadImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        resolve(result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async addImageShape(
    file: File,
    x: number,
    y: number,
    width: number = 200,
    height: number = 200
  ) {
    try {
      const src = await this.uploadImage(file);
      const img = new Image();
      img.crossOrigin = "anonymous";

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject();
        img.src = src;
      });

      const aspectRatio = img.naturalWidth / img.naturalHeight;
      let finalWidth = width;
      let finalHeight = height;

      if (aspectRatio > 1) {
        finalHeight = width / aspectRatio;
      } else {
        finalWidth = height * aspectRatio;
      }

      this.loadedImages.set(src, img);

      const imageShape: Extract<Shape, { type: "image" }> = {
        type: "image",
        x,
        y,
        width: finalWidth,
        height: finalHeight,
        src,
        imageData: img,
      };

      this.undoStack.push([...this.existingShapes]);
      this.redoStack = [];
      this.existingShapes.push(imageShape);
      this.redraw();

      if (this.isCollaborative) {
        if (!this.socket?.connected) {
          useLoadingStore.getState().setMsg("Please refresh the page");
          return;
        }
        const cleanImageShape = this.cleanShapesForServer([imageShape])[0];
        if (cleanImageShape) {
          this.socket.emit("draw", {
            shape: cleanImageShape,
            roomId: this.documentID,
          });
        }
      } else {
        const cleanImageShape = this.cleanShapesForServer([imageShape])[0];
        if (cleanImageShape) {
          this.addShape(cleanImageShape, this.documentID);
        }
      }
    } catch (error) {
      console.error("Failed to add image:", error);
      useLoadingStore.getState().setError("Failed to add image");
    }
  }

  clearCanvas = async () => {
    try {
      const res = await useCanvasStore.getState().clearCanvas(this.documentID);
      if (res) {
        this.existingShapes = [];
        this.redraw();
      }
    } catch (error) {
      console.error("Failed to clear canvas:", error);
      return;
    }

    if (this.isCollaborative) {
      if (!this.socket?.connected) {
        useLoadingStore.getState().setMsg("Please refresh the page");
        return;
      }
      this.socket.emit("clear-canvas", { roomId: this.documentID });
    }
  };

  redraw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "#18181B";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.save();
    this.ctx.translate(this.offset.x, this.offset.y);
    this.ctx.scale(this.scale, this.scale);

    this.existingShapes.forEach((shape, index) => {
      if (!shape) return;

      if (index === this.selectedShapeIndex && this.selectedTool === "hand") {
        this.ctx.save();
        this.ctx.shadowColor = "#60a5fa";
        this.ctx.shadowBlur = 10;
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;
      }

      switch (shape.type) {
        case "rect":
          this.drawReact(shape);
          break;
        case "circle":
          this.drawCircle(shape);
          break;
        case "rhombus":
          this.drawRhombus(shape);
          break;
        case "line":
          this.drawLine(shape);
          break;
        case "arrow":
          this.drawArrow(shape);
          break;
        case "freehand":
          this.drawFreehand(shape);
          break;
        case "image":
          this.drawImage(shape);
          break;
      }

      if (index === this.selectedShapeIndex && this.selectedTool === "hand") {
        this.ctx.restore();
      }
    });
    this.ctx.restore();
  }

  mouseDownHandler = (e: MouseEvent) => {
    const worldX = (e.clientX - this.offset.x) / this.scale;
    const worldY = (e.clientY - this.offset.y) / this.scale;

    if (this.selectedTool === "hand") {
      for (let i = this.existingShapes.length - 1; i >= 0; i--) {
        const shape = this.existingShapes[i];
        if (shape && this.isPointInShape(worldX, worldY, shape)) {
          if (!this.isReadonly) {
            this.selectedShapeIndex = i;
            this.isDragging = true;

            switch (shape.type) {
              case "circle":
                this.dragOffset = { x: worldX - shape.x, y: worldY - shape.y };
                break;
              case "line":
              case "arrow":
                this.dragOffset = { x: worldX - shape.x, y: worldY - shape.y };
                break;
              case "freehand":
                const firstPoint = shape.points[0];
                if (firstPoint) {
                  this.dragOffset = {
                    x: worldX - firstPoint.x,
                    y: worldY - firstPoint.y,
                  };
                }
                break;
              default:
                this.dragOffset = { x: worldX - shape.x, y: worldY - shape.y };
                break;
            }

            this.canvas.style.cursor = "grabbing";
            this.redraw();
            return;
          }
        }
      }
      this.selectedShapeIndex = -1;
      this.isPanning = true;
      this.panStart = { x: e.clientX, y: e.clientY };
      this.canvas.style.cursor = "grabbing";
      return;
    }

    if (this.selectedTool === "rubber") {
      if (this.isReadonly) return;

      for (let i = this.existingShapes.length - 1; i >= 0; i--) {
        const shape = this.existingShapes[i];
        if (shape && this.isPointInShape(worldX, worldY, shape)) {
          this.undoStack.push([...this.existingShapes]);
          this.redoStack = [];

          if (this.isCollaborative) {
            if (!this.socket?.connected) {
              useLoadingStore.getState().setMsg("Please refresh the page");
              return;
            }
            this.socket.emit("delete-shape", {
              shapeIndex: i,
              roomId: this.documentID,
            });
          }

          this.existingShapes.splice(i, 1);
          this.redraw();

          if (!this.isCollaborative) {
            this.syncWithServer();
          }
          break;
        }
      }
      return;
    }

    if (this.isReadonly) return;

    if (this.selectedTool === "freehand") {
      this.freehandPoints = [{ x: worldX, y: worldY }];
    }

    this.clicked = true;
    this.startX = worldX;
    this.startY = worldY;
  };

  mouseUpHandler = (e: MouseEvent) => {
    if (this.isPanning) {
      this.isPanning = false;
      this.canvas.style.cursor =
        this.selectedTool === "hand" ? "grab" : "crosshair";
      return;
    }

    if (this.isDragging && this.selectedShapeIndex >= 0) {
      this.isDragging = false;
      this.canvas.style.cursor = "grab";
      this.syncWithServer();
      return;
    }

    if (!this.clicked || this.selectedTool === "rubber") return;

    this.clicked = false;
    const x = (e.clientX - this.offset.x) / this.scale;
    const y = (e.clientY - this.offset.y) / this.scale;
    const width = x - this.startX;
    const height = y - this.startY;

    let shape: Shape | null = null;

    switch (this.selectedTool) {
      case "rect":
        shape = {
          type: "rect",
          x: Math.min(this.startX, x),
          y: Math.min(this.startY, y),
          width: Math.abs(width),
          height: Math.abs(height),
          color: this.currentColor,
          strokeWidth: this.currentStrokeWidth,
        };
        break;
      case "circle":
        const centerX = (this.startX + x) / 2;
        const centerY = (this.startY + y) / 2;
        shape = {
          type: "circle",
          x: centerX,
          y: centerY,
          width: Math.abs(width / 2),
          height: Math.abs(height / 2),
          color: this.currentColor,
          strokeWidth: this.currentStrokeWidth,
        };
        break;
      case "rhombus":
        shape = {
          type: "rhombus",
          x: Math.min(this.startX, x),
          y: Math.min(this.startY, y),
          width: Math.abs(width),
          height: Math.abs(height),
          color: this.currentColor,
          strokeWidth: this.currentStrokeWidth,
        };
        break;
      case "line":
        shape = {
          type: "line",
          x: this.startX,
          y: this.startY,
          x2: x,
          y2: y,
          color: this.currentColor,
          strokeWidth: this.currentStrokeWidth,
        };
        break;
      case "arrow":
        shape = {
          type: "arrow",
          x: this.startX,
          y: this.startY,
          x2: x,
          y2: y,
          color: this.currentColor,
          strokeWidth: this.currentStrokeWidth,
        };
        break;
      case "freehand":
        if (this.freehandPoints.length > 1) {
          shape = {
            type: "freehand",
            points: this.freehandPoints,
            color: this.currentColor,
            strokeWidth: this.currentStrokeWidth,
          };
        }
        this.freehandPoints = [];
        break;
    }

    if (!shape) return;

    this.undoStack.push([...this.existingShapes]);
    this.redoStack = [];
    this.existingShapes.push(shape);
    this.redraw();

    if (this.isCollaborative) {
      if (!this.socket?.connected) {
        useLoadingStore.getState().setMsg("Please refresh the page");
        return;
      }
      const cleanShape = this.cleanShapesForServer([shape])[0];
      if (cleanShape) {
        this.socket.emit("draw", {
          shape: cleanShape,
          roomId: this.documentID,
        });
      }
    } else {
      const cleanShape = this.cleanShapesForServer([shape])[0];
      if (cleanShape) {
        this.addShape(cleanShape, this.documentID);
      }
    }
  };

  mouseMoveHandler = (e: MouseEvent) => {
    if (this.isPanning) {
      const dx = e.clientX - this.panStart.x;
      const dy = e.clientY - this.panStart.y;
      this.offset.x += dx;
      this.offset.y += dy;
      this.panStart = { x: e.clientX, y: e.clientY };
      this.redraw();
      return;
    }

    if (this.isDragging && this.selectedShapeIndex >= 0) {
      const worldX = (e.clientX - this.offset.x) / this.scale;
      const worldY = (e.clientY - this.offset.y) / this.scale;
      const shape = this.existingShapes[this.selectedShapeIndex];

      if (!shape) return;

      const newX = worldX - this.dragOffset.x;
      const newY = worldY - this.dragOffset.y;

      switch (shape.type) {
        case "line":
        case "arrow":
          const deltaX = newX - shape.x;
          const deltaY = newY - shape.y;
          (shape as any).x = newX;
          (shape as any).y = newY;
          (shape as any).x2 = shape.x2 + deltaX;
          (shape as any).y2 = shape.y2 + deltaY;
          break;
        case "freehand":
          const firstPoint = shape.points[0];
          if (firstPoint) {
            const deltaX = newX - firstPoint.x;
            const deltaY = newY - firstPoint.y;
            shape.points = shape.points.map((point) => ({
              x: point.x + deltaX,
              y: point.y + deltaY,
            }));
          }
          break;
        default:
          (shape as any).x = newX;
          (shape as any).y = newY;
          break;
      }

      this.redraw();
      return;
    }

    if (this.isReadonly || !this.clicked) return;

    const x = (e.clientX - this.offset.x) / this.scale;
    const y = (e.clientY - this.offset.y) / this.scale;
    const width = x - this.startX;
    const height = y - this.startY;

    this.redraw();
    this.ctx.save();
    this.ctx.translate(this.offset.x, this.offset.y);
    this.ctx.scale(this.scale, this.scale);

    if (this.selectedTool === "rect") {
      this.drawReact({
        type: "rect",
        x: Math.min(this.startX, x),
        y: Math.min(this.startY, y),
        width: Math.abs(width),
        height: Math.abs(height),
        color: this.currentColor,
        strokeWidth: this.currentStrokeWidth,
      });
    } else if (this.selectedTool === "circle") {
      const centerX = (this.startX + x) / 2;
      const centerY = (this.startY + y) / 2;
      this.drawCircle({
        type: "circle",
        x: centerX,
        y: centerY,
        width: Math.abs(width / 2),
        height: Math.abs(height / 2),
        color: this.currentColor,
        strokeWidth: this.currentStrokeWidth,
      });
    } else if (this.selectedTool === "rhombus") {
      this.drawRhombus({
        type: "rhombus",
        x: Math.min(this.startX, x),
        y: Math.min(this.startY, y),
        width: Math.abs(width),
        height: Math.abs(height),
        color: this.currentColor,
        strokeWidth: this.currentStrokeWidth,
      });
    } else if (this.selectedTool === "line") {
      this.drawLine({
        type: "line",
        x: this.startX,
        y: this.startY,
        x2: x,
        y2: y,
        color: this.currentColor,
        strokeWidth: this.currentStrokeWidth,
      });
    } else if (this.selectedTool === "arrow") {
      this.drawArrow({
        type: "arrow",
        x: this.startX,
        y: this.startY,
        x2: x,
        y2: y,
        color: this.currentColor,
        strokeWidth: this.currentStrokeWidth,
      });
    } else if (this.selectedTool === "freehand") {
      this.freehandPoints.push({ x, y });
      this.drawFreehand({
        type: "freehand",
        points: this.freehandPoints,
        color: this.currentColor,
        strokeWidth: this.currentStrokeWidth,
      });
    }

    this.ctx.restore();
  };

  handleZoom = (e: WheelEvent) => {
    e.preventDefault();

    const zoomIntensity = 0.05;
    const zoom = e.deltaY < 0 ? 1 + zoomIntensity : 1 - zoomIntensity;

    const mouseX = e.clientX;
    const mouseY = e.clientY;

    const worldX = (mouseX - this.offset.x) / this.scale;
    const worldY = (mouseY - this.offset.y) / this.scale;

    this.scale *= zoom;
    this.scale = Math.min(Math.max(this.scale, 0.2), 10);

    this.offset.x = mouseX - worldX * this.scale;
    this.offset.y = mouseY - worldY * this.scale;

    this.redraw();
  };

  undo() {
    if (this.undoStack.length > 0) {
      if (this.isCollaborative) {
        if (this.socket?.connected) {
          this.socket.emit("undo-shape", { roomId: this.documentID });
        } else {
          useLoadingStore.getState().setMsg("Something went wrong");
        }
        return;
      }

      const lastState = this.undoStack.pop();
      if (lastState) {
        this.redoStack.push([...this.existingShapes]);
        this.existingShapes = [...lastState];
        this.redraw();
        this.syncWithServer();
      }
    }
  }

  redo() {
    if (this.redoStack.length > 0) {
      if (this.isCollaborative) {
        if (this.socket?.connected) {
          this.socket.emit("redo-shape", { roomId: this.documentID });
        } else {
          useLoadingStore.getState().setMsg("Something went wrong");
        }
        return;
      }

      const lastState = this.redoStack.pop();
      if (lastState) {
        this.undoStack.push([...this.existingShapes]);
        this.existingShapes = [...lastState];
        this.redraw();
        this.syncWithServer();
      }
    }
  }

  async syncWithServer() {
    try {
      const validShapes = this.existingShapes.filter((shape) => {
        if (!shape || typeof shape !== "object" || !shape.type) {
          console.warn("Invalid shape detected:", shape);
          return false;
        }
        return true;
      });

      const cleanShapes = this.cleanShapesForServer(validShapes);

      // Add debugging
      console.log(
        "Shapes being sent to server:",
        JSON.stringify(cleanShapes, null, 2)
      );

      if (cleanShapes.length === 0) {
        console.warn("No valid shapes to sync");
        return;
      }

      await useCanvasStore
        .getState()
        .overwriteCanvas(this.documentID, cleanShapes);
    } catch (error) {
      console.error("Failed to sync with server:", error);

      if (error instanceof Error) {
        useLoadingStore.getState().setError(`Sync failed: ${error.message}`);
      } else {
        useLoadingStore.getState().setError("Failed to sync with server");
      }
    }
  }

  handleCursor = (e: MouseEvent) => {
    if (this.isCollaborative && this.socket?.connected) {
      const mouseX = (e.clientX - this.offset.x) / this.scale;
      const mouseY = (e.clientY - this.offset.y) / this.scale;
      this.socket.emit("cursor-move", {
        x: mouseX,
        y: mouseY,
        roomId: this.documentID,
      });
    }
  };

  getScale(): number {
    return this.scale;
  }

  resetZoom() {
    this.scale = 1;
    this.offset.x = 0;
    this.offset.y = 0;
    this.redraw();
  }

  initMouseHandlers() {
    this.canvas.addEventListener("mousedown", this.mouseDownHandler);
    this.canvas.addEventListener("mouseup", this.mouseUpHandler);
    this.canvas.addEventListener("mousemove", this.mouseMoveHandler);
    this.canvas.addEventListener("wheel", this.handleZoom);
    this.canvas.addEventListener("mousemove", this.handleCursor);
  }

  destroy() {
    this.canvas.removeEventListener("mousedown", this.mouseDownHandler);
    this.canvas.removeEventListener("mouseup", this.mouseUpHandler);
    this.canvas.removeEventListener("mousemove", this.mouseMoveHandler);
    this.canvas.removeEventListener("wheel", this.handleZoom);
    this.canvas.removeEventListener("mousemove", this.handleCursor);
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
