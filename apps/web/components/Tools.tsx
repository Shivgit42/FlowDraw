import { useRouter } from "next/navigation";
import { IconButton } from "./IconButton";
import {
  Hand,
  Square,
  Diamond,
  Circle,
  Minus,
  LayoutDashboard,
  Share2,
  Users,
  Plus,
  Pencil,
  Trash2,
  Undo,
  Redo,
  ArrowRight,
  Eraser,
  ImagePlus,
  Palette,
  Brush,
} from "lucide-react";
import { useCanvasStore, useSocketStore, useLoadingStore } from "@repo/store";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import Share from "./Share";
import CollabModel from "./CollaborativePopup";

export type Tool =
  | "circle"
  | "rect"
  | "rhombus"
  | "hand"
  | "line"
  | "freehand"
  | "arrow"
  | "rubber"
  | "image";

const COLORS = [
  "#e8e8e8",
  "#970707",
  "#fa8f8f",
  "#2f9e44",
  "#1971c2",
  "#f08c00",
];

const STROKE_WIDTHS = [1, 2, 4, 8, 12];

export default function Tools({
  selectedTool,
  setSelectedTool,
  canva,
  members,
  setMembers,
  isReadonly,
}: {
  selectedTool: Tool;
  setSelectedTool: (s: Tool) => void;
  canva: any;
  members: any[];
  setMembers: (m: any[]) => void;
  isReadonly: boolean;
}) {
  const { data: session } = useSession();
  const { setDocumentID, isCollaborative, getAllMembers } = useCanvasStore();
  const { convertToCollab, connectToSocket, socket, disconnect, onlineUsers } =
    useSocketStore();
  const loadingStore = useLoadingStore();
  const router = useRouter();
  const [scale, setScale] = useState(1);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [collaborativeOpen, setCollaborativeOpen] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showStrokePicker, setShowStrokePicker] = useState(false);
  const [selectedColor, setSelectedColor] = useState("#ffffff");
  const [selectedStrokeWidth, setSelectedStrokeWidth] = useState(2);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const colorPickerRef = useRef<HTMLDivElement>(null);
  const strokePickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateScale = () => {
      if (canva) {
        setScale(canva.getScale());
      }
    };

    const interval = setInterval(updateScale, 100);
    return () => clearInterval(interval);
  }, [canva]);

  // Update canvas color and stroke width whenever they change
  useEffect(() => {
    if (canva) {
      canva.setColor(selectedColor);
      canva.setStrokeWidth(selectedStrokeWidth);
    }
  }, [selectedColor, selectedStrokeWidth, canva]);

  // Also update tool when it changes
  useEffect(() => {
    if (canva) {
      canva.setTool(selectedTool);
    }
  }, [selectedTool, canva]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        showColorPicker &&
        colorPickerRef.current &&
        !colorPickerRef.current.contains(target)
      ) {
        setShowColorPicker(false);
      }

      if (
        showStrokePicker &&
        strokePickerRef.current &&
        !strokePickerRef.current.contains(target)
      ) {
        setShowStrokePicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showColorPicker, showStrokePicker]);

  const handleZoomIn = () => {
    if (canva) {
      const event = new WheelEvent("wheel", {
        deltaY: -400,
        clientX: window.innerWidth / 2,
        clientY: window.innerHeight / 2,
      });
      canva.handleZoom(event);
    }
  };

  const handleZoomOut = () => {
    if (canva) {
      const event = new WheelEvent("wheel", {
        deltaY: 400,
        clientX: window.innerWidth / 2,
        clientY: window.innerHeight / 2,
      });
      canva.handleZoom(event);
    }
  };

  const connectToRoom = async () => {
    try {
      if (!canva?.documentID) return;

      await convertToCollab(canva.documentID);

      connectToSocket(
        process.env.NEXT_PUBLIC_SOCKET_URL as string,
        canva.documentID
      );
      const res = await getAllMembers(canva.documentID);
      setMembers(res);
    } catch (error) {
      console.error("Failed to connect to room:", error);
      loadingStore.setError("Failed to enable collaborative mode");
    }
  };

  const handleCollaborativeClick = async () => {
    if (isReadonly) return;
    setCollaborativeOpen(!collaborativeOpen);
    if (!collaborativeOpen) {
      connectToRoom();
    }
  };

  const onClickDashboard = () => {
    setDocumentID("");
    router.push("/dashboard");
    disconnect();
  };

  const isUserOnline = (userId: string) => {
    return onlineUsers.some((user) => user.userId === userId);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && canva) {
      const centerX = (window.innerWidth / 2 - canva.offset.x) / canva.scale;
      const centerY = (window.innerHeight / 2 - canva.offset.y) / canva.scale;
      canva.addImageShape(file, centerX - 100, centerY - 100);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    setShowColorPicker(false);
  };

  const handleStrokeWidthSelect = (width: number) => {
    setSelectedStrokeWidth(width);
    setShowStrokePicker(false);
  };

  const handleToolSelect = (tool: Tool) => {
    setSelectedTool(tool);

    setShowColorPicker(false);
    setShowStrokePicker(false);
  };

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleImageUpload}
      />

      {isShareOpen && <Share OnClose={() => setIsShareOpen(false)} />}
      {collaborativeOpen && (
        <CollabModel setCollaborativeOpen={setCollaborativeOpen} />
      )}

      {/* Top toolbar */}
      <div
        style={{
          position: "fixed",
          top: 10,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1000,
        }}
        className="flex items-center justify-between w-full px-7"
      >
        {/* Dashboard button */}
        <div className="px-4 py-1 rounded-lg shadow-lg bg-zinc-800">
          <IconButton
            onClick={() => {
              if (isReadonly) {
                router.push("/api/auth/signin");
                return;
              } else {
                onClickDashboard();
              }
            }}
            icon={<LayoutDashboard size={20} color="white" />}
            title={isReadonly ? "Login" : "Dashboard"}
          />
        </div>

        {/* Main tools container */}
        <div className="flex gap-3 items-center justify-center">
          {/* Drawing tools */}
          <div className="flex items-center px-3 py-2 rounded-lg shadow-lg bg-zinc-800 gap-2">
            <IconButton
              onClick={() => handleToolSelect("hand")}
              activated={selectedTool === "hand"}
              icon={<Hand size={18} />}
              title="Select & Move"
            />

            <IconButton
              onClick={() => {
                if (isReadonly) return;
                handleToolSelect("rect");
              }}
              activated={selectedTool === "rect"}
              icon={<Square size={18} />}
              title={isReadonly ? "Read-only mode" : "Rectangle"}
            />

            <IconButton
              onClick={() => {
                if (isReadonly) return;
                handleToolSelect("rhombus");
              }}
              activated={selectedTool === "rhombus"}
              icon={<Diamond size={18} />}
              title={isReadonly ? "Read-only mode" : "Diamond"}
            />

            <IconButton
              onClick={() => {
                if (isReadonly) return;
                handleToolSelect("circle");
              }}
              activated={selectedTool === "circle"}
              icon={<Circle size={18} />}
              title={isReadonly ? "Read-only mode" : "Circle"}
            />

            <IconButton
              onClick={() => {
                if (isReadonly) return;
                handleToolSelect("arrow");
              }}
              activated={selectedTool === "arrow"}
              icon={<ArrowRight size={18} />}
              title={isReadonly ? "Read-only mode" : "Arrow"}
            />

            <IconButton
              onClick={() => {
                if (isReadonly) return;
                handleToolSelect("line");
              }}
              activated={selectedTool === "line"}
              icon={<Minus size={18} />}
              title={isReadonly ? "Read-only mode" : "Line"}
            />

            <IconButton
              onClick={() => {
                if (isReadonly) return;
                handleToolSelect("freehand");
              }}
              activated={selectedTool === "freehand"}
              icon={<Pencil size={18} />}
              title={isReadonly ? "Read-only mode" : "Pencil"}
            />

            <IconButton
              onClick={() => {
                if (isReadonly) return;
                handleToolSelect("rubber");
              }}
              activated={selectedTool === "rubber"}
              icon={<Eraser size={18} />}
              title={isReadonly ? "Read-only mode" : "Eraser"}
            />

            <IconButton
              onClick={() => {
                if (isReadonly || !fileInputRef.current) return;
                fileInputRef.current.click();
              }}
              icon={<ImagePlus size={18} />}
              title={isReadonly ? "Read-only mode" : "Upload Image"}
            />
          </div>

          {/* Style tools */}
          <div className="flex items-center px-3 py-2 rounded-lg shadow-lg bg-zinc-800 gap-2">
            {/* Color picker */}
            <div className="relative" ref={colorPickerRef}>
              <IconButton
                onClick={(e) => {
                  if (isReadonly) return;
                  e.stopPropagation();
                  setShowColorPicker(!showColorPicker);
                  setShowStrokePicker(false);
                }}
                icon={
                  <div className="flex items-center gap-1.5">
                    <Palette size={16} />
                    <div
                      className="w-4 h-4 rounded border border-zinc-400"
                      style={{ backgroundColor: selectedColor }}
                    />
                  </div>
                }
                title={isReadonly ? "Read-only mode" : "Color"}
              />

              {showColorPicker && !isReadonly && (
                <div className="absolute top-full left-0 mt-2 bg-zinc-800 rounded-lg shadow-xl p-3 z-[9999] border border-zinc-600 min-w-[140px]">
                  <div className="grid grid-cols-2 gap-2">
                    {COLORS.map((color) => (
                      <button
                        key={color}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleColorSelect(color);
                        }}
                        className={`w-10 h-10 rounded-md border-2 hover:scale-105 transition-all duration-200 ${
                          selectedColor === color
                            ? "border-blue-400 ring-2 ring-blue-400 ring-opacity-50"
                            : "border-zinc-600 hover:border-zinc-400"
                        }`}
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Stroke width picker */}
            <div className="relative" ref={strokePickerRef}>
              <IconButton
                onClick={(e) => {
                  if (isReadonly) return;
                  e.stopPropagation();
                  setShowStrokePicker(!showStrokePicker);
                  setShowColorPicker(false);
                }}
                icon={
                  <div className="flex items-center gap-1.5">
                    <Brush size={16} />
                    <span className="text-xs font-medium">
                      {selectedStrokeWidth}
                    </span>
                  </div>
                }
                title={isReadonly ? "Read-only mode" : "Stroke Width"}
              />

              {showStrokePicker && !isReadonly && (
                <div className="absolute top-full left-0 mt-2 bg-zinc-800 rounded-lg shadow-xl p-3 z-[9999] border border-zinc-600 min-w-[130px]">
                  <div className="flex flex-col gap-2">
                    {STROKE_WIDTHS.map((width) => (
                      <button
                        key={width}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStrokeWidthSelect(width);
                        }}
                        className={`flex items-center gap-3 px-3 py-2 rounded-md hover:bg-zinc-700 transition-colors duration-200 ${
                          selectedStrokeWidth === width
                            ? "bg-zinc-700 ring-1 ring-blue-400"
                            : ""
                        }`}
                        title={`${width}px`}
                      >
                        <div
                          className="bg-white rounded-full"
                          style={{
                            width: `${Math.max(width, 2)}px`,
                            height: `${Math.max(width, 2)}px`,
                          }}
                        />
                        <span className="text-white text-sm">{width}px</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action tools */}
          <div className="flex items-center px-3 py-2 rounded-lg shadow-lg bg-zinc-800 gap-2">
            <IconButton
              onClick={() => {
                if (isReadonly) return;
                canva.clearCanvas();
              }}
              icon={<Trash2 size={18} />}
              title={isReadonly ? "Read-only mode" : "Clear Canvas"}
            />

            <IconButton
              onClick={handleCollaborativeClick}
              icon={<Users size={18} />}
              activated={socket as any}
              title={isReadonly ? "Read-only mode" : "Collaborative mode"}
            />
          </div>
        </div>

        {/* Share button */}
        <div className="px-4 py-1 rounded-lg shadow-lg bg-zinc-800">
          <IconButton
            onClick={() => {
              if (isReadonly) return;
              setIsShareOpen(!isShareOpen);
            }}
            icon={<Share2 size={20} color="white" />}
            title={isReadonly ? "Read-only mode" : "Share"}
          />
        </div>
      </div>

      {/* Zoom controls - bottom left */}
      <div
        style={{
          position: "fixed",
          bottom: 15,
          left: 20,
          zIndex: 1000,
        }}
        className="flex items-center px-4 py-1 gap-4 bg-zinc-800 rounded-xl shadow-lg"
      >
        <button
          onClick={handleZoomOut}
          className="p-2 rounded-md hover:bg-zinc-700 transition-colors duration-200 cursor-pointer"
          title="Zoom Out"
        >
          <Minus size={18} className="text-white" />
        </button>

        <span
          className="text-white text-sm font-medium min-w-[50px] text-center cursor-pointer"
          title="Reset Zoom"
          onClick={() => {
            if (canva) {
              canva.resetZoom();
            }
          }}
        >
          {new Intl.NumberFormat("en-GB", { style: "percent" }).format(scale)}
        </span>

        <button
          onClick={handleZoomIn}
          className="p-2 rounded-md hover:bg-zinc-700 transition-colors duration-200 cursor-pointer"
          title="Zoom In"
        >
          <Plus size={18} className="text-white" />
        </button>
      </div>

      {/* Undo/Redo controls - bottom center */}
      {!isReadonly && (
        <div
          style={{
            position: "fixed",
            bottom: 15,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1000,
          }}
          className="flex gap-2 bg-zinc-800 px-2 py-1.5 rounded-lg shadow-lg"
        >
          <IconButton
            onClick={() => {
              if (isReadonly) return;
              canva.undo();
            }}
            icon={<Undo size={20} />}
            title="Undo"
          />

          <IconButton
            onClick={() => {
              if (isReadonly) return;
              canva.redo();
            }}
            icon={<Redo size={20} />}
            title="Redo"
          />
        </div>
      )}

      {/* Members list - bottom right */}
      {isCollaborative && (
        <div
          style={{
            position: "fixed",
            bottom: 20,
            right: 25,
            zIndex: 1000,
          }}
          className="bg-zinc-800 p-2.5 rounded-lg shadow-lg group"
        >
          <Users
            size={20}
            className="text-white cursor-pointer hover:text-gray-400 transition-colors duration-200"
          />
          <div className="absolute right-0 bottom-10 hidden group-hover:block bg-zinc-800 border border-green-100 text-white rounded-xl shadow-lg p-4 w-64 max-h-64 overflow-y-auto z-[9999]">
            <h4 className="text-sm font-semibold mb-2 border-b pb-2">
              Members
            </h4>
            {members.map((member) => (
              <div
                key={member.user.id}
                className="flex justify-between items-center py-1"
              >
                <Image
                  src={member.user.image}
                  alt={member.user.name}
                  width={30}
                  height={30}
                  className="rounded-full mr-2"
                />
                <span>{member.user.name}</span>
                {member.user.id == session?.user.id ? (
                  <span className="text-zinc-500">(You)</span>
                ) : null}
                <span
                  className={`w-2 h-2 rounded-full ${
                    isUserOnline(member.user.id)
                      ? "bg-green-500"
                      : "bg-gray-500"
                  }`}
                ></span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
