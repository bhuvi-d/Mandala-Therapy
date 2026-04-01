import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useTheme } from '../ThemeContext';

/* ── Curated color palette organized by hue families ── */
const colorGroups = [
  {
    name: 'Reds & Pinks',
    colors: ['#ff6b6b', '#ee5a24', '#e84393', '#fd79a8', '#f8a5c2', '#c44569', '#f78fb3'],
  },
  {
    name: 'Purples & Violets',
    colors: ['#a29bfe', '#6c5ce7', '#8854d0', '#be2edd', '#5f27cd', '#b8e994', '#d6a2e8'],
  },
  {
    name: 'Blues & Cyans',
    colors: ['#0984e3', '#00b894', '#00cec9', '#48dbfb', '#54a0ff', '#2e86de', '#01a3a4'],
  },
  {
    name: 'Greens',
    colors: ['#00b894', '#55efc4', '#badc58', '#6ab04c', '#78e08f', '#26de81', '#20bf6b'],
  },
  {
    name: 'Warm',
    colors: ['#fdcb6e', '#ffeaa7', '#fab1a0', '#f9ca24', '#f0932b', '#ff9f43', '#e17055'],
  },
  {
    name: 'Neutrals',
    colors: ['#ffffff', '#dfe6e9', '#b2bec3', '#636e72', '#2d3436', '#000000', '#a0785b'],
  },
];

const MandalaColoringPopup = ({ onClose, mandalaUrl }) => {
  const { theme } = useTheme();
  const canvasRef = useRef(null);
  const overlayCanvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#e84393');
  const [lineWidth, setLineWidth] = useState(6);
  const [opacity, setOpacity] = useState(1);
  const [tool, setTool] = useState('brush'); // brush, eraser, fill
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [paletteOpen, setPaletteOpen] = useState(true);
  const [recentColors, setRecentColors] = useState(['#e84393', '#6c5ce7', '#00b894', '#fdcb6e', '#ff6b6b']);
  const lastPosRef = useRef(null);

  /* ─── Canvas coordinate helper ─── */
  const getPos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if (e.touches) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  /* ─── Save state for undo ─── */
  const saveState = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      setHistory(prev => [...prev.slice(-30), canvas.toDataURL()]);
      setRedoStack([]);
    }
  }, []);

  /* ─── Drawing ─── */
  const startDrawing = (e) => {
    e.preventDefault();
    if (tool === 'fill') {
      const { x, y } = getPos(e);
      floodFill(Math.round(x), Math.round(y), color, opacity);
      return;
    }
    saveState();
    const { x, y } = getPos(e);
    const ctx = canvasRef.current.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(x, y);
    // draw a dot for single clicks
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = lineWidth * 3;
      ctx.globalAlpha = 1;
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.globalAlpha = opacity;
    }
    ctx.lineTo(x + 0.1, y + 0.1);
    ctx.stroke();
    lastPosRef.current = { x, y };
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const { x, y } = getPos(e);
    const ctx = canvasRef.current.getContext('2d');

    if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = lineWidth * 3;
      ctx.globalAlpha = 1;
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.globalAlpha = opacity;
    }
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineTo(x, y);
    ctx.stroke();
    lastPosRef.current = { x, y };
  };

  const stopDrawing = () => {
    if (isDrawing) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
    }
    setIsDrawing(false);
    lastPosRef.current = null;
  };

  /* ─── Flood fill (paint bucket) ─── */
  const floodFill = (startX, startY, fillColor, fillOpacity) => {
    saveState();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const width = canvas.width;
    const height = canvas.height;

    // Parse fill color
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = 1;
    tempCanvas.height = 1;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.fillStyle = fillColor;
    tempCtx.globalAlpha = fillOpacity;
    tempCtx.fillRect(0, 0, 1, 1);
    const fillPixel = tempCtx.getImageData(0, 0, 1, 1).data;

    const startIdx = (startY * width + startX) * 4;
    const startR = data[startIdx];
    const startG = data[startIdx + 1];
    const startB = data[startIdx + 2];
    const startA = data[startIdx + 3];

    if (startR === fillPixel[0] && startG === fillPixel[1] && startB === fillPixel[2] && startA === fillPixel[3]) return;

    const tolerance = 32;
    const matchColor = (idx) => {
      return Math.abs(data[idx] - startR) <= tolerance &&
        Math.abs(data[idx + 1] - startG) <= tolerance &&
        Math.abs(data[idx + 2] - startB) <= tolerance &&
        Math.abs(data[idx + 3] - startA) <= tolerance;
    };

    const stack = [[startX, startY]];
    const visited = new Set();

    while (stack.length > 0) {
      const [x, y] = stack.pop();
      const idx = (y * width + x) * 4;
      const key = y * width + x;

      if (x < 0 || x >= width || y < 0 || y >= height) continue;
      if (visited.has(key)) continue;
      if (!matchColor(idx)) continue;

      visited.add(key);
      data[idx] = fillPixel[0];
      data[idx + 1] = fillPixel[1];
      data[idx + 2] = fillPixel[2];
      data[idx + 3] = fillPixel[3];

      stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
    }

    ctx.putImageData(imageData, 0, 0);
  };

  /* ─── Tool actions ─── */
  const undoLast = () => {
    if (history.length === 0) return;
    const currentState = canvasRef.current.toDataURL();
    setRedoStack(prev => [...prev, currentState]);
    const prev = history[history.length - 1];
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
    img.src = prev;
    setHistory(h => h.slice(0, -1));
  };

  const redoLast = () => {
    if (redoStack.length === 0) return;
    const currentState = canvasRef.current.toDataURL();
    setHistory(prev => [...prev, currentState]);
    const next = redoStack[redoStack.length - 1];
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
    img.src = next;
    setRedoStack(r => r.slice(0, -1));
  };

  const clearCanvas = () => {
    saveState();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackgroundImage();
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = 'mandala_coloring.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  const addToRecent = (c) => {
    setRecentColors(prev => {
      const filtered = prev.filter(rc => rc !== c);
      return [c, ...filtered].slice(0, 8);
    });
  };

  const selectColor = (c) => {
    setColor(c);
    setTool('brush');
    addToRecent(c);
  };

  /* ─── Background image ─── */
  const drawBackgroundImage = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.src = mandalaUrl;
    image.onload = () => {
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    };
    image.onerror = () => console.error('Failed to load image:', mandalaUrl);
  }, [mandalaUrl]);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 800;
    canvas.height = 800;
    drawBackgroundImage();
  }, [drawBackgroundImage]);

  /* ─── Brush preview cursor (overlay) ─── */
  const updateCursorPreview = useCallback((e) => {
    const overlay = overlayCanvasRef.current;
    if (!overlay) return;
    const ctx = overlay.getContext('2d');
    const rect = overlay.getBoundingClientRect();
    const scaleX = overlay.width / rect.width;
    const scaleY = overlay.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    ctx.clearRect(0, 0, overlay.width, overlay.height);
    ctx.beginPath();
    const radius = tool === 'eraser' ? (lineWidth * 3) / 2 : lineWidth / 2;
    ctx.arc(x, y, Math.max(radius, 2), 0, Math.PI * 2);
    ctx.strokeStyle = tool === 'eraser' ? 'rgba(255,0,0,0.5)' : color;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.stroke();
    ctx.setLineDash([]);
  }, [tool, lineWidth, color]);

  useEffect(() => {
    const overlay = overlayCanvasRef.current;
    if (!overlay) return;
    overlay.width = 800;
    overlay.height = 800;
  }, []);

  const tools = [
    { id: 'brush', label: 'Brush', icon: '✏️' },
    { id: 'eraser', label: 'Eraser', icon: '🧹' },
    { id: 'fill', label: 'Fill', icon: '🪣' },
  ];

  const getCursorStyle = () => {
    if (tool === 'fill') return 'crosshair';
    if (tool === 'eraser') return 'cell';
    return 'crosshair';
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center p-2 sm:p-4 animate-fade-in" onClick={onClose}>
      <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" />

      <div
        className="relative glass-strong rounded-2xl shadow-2xl w-full max-w-5xl animate-scale-in max-h-[98vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
          <h2 className={`font-display text-2xl font-bold ${theme.text} tracking-wide`}>
            Mandala Colouring Studio
          </h2>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-gray-200/50 dark:bg-gray-700/50 hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-600 dark:text-gray-300 hover:text-red-500 flex items-center justify-center transition-all text-lg"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* ── Main content: sidebar + canvas ── */}
        <div className="flex flex-1 overflow-hidden">

          {/* ── Left Sidebar: Tools & Palette ── */}
          <div className="w-64 min-w-[240px] border-r border-white/10 overflow-y-auto p-4 space-y-5 hidden md:block">

            {/* Tool Buttons */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2 font-body">Tools</p>
              <div className="flex gap-2">
                {tools.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setTool(t.id)}
                    className={`flex-1 px-3 py-2 rounded-xl text-xs font-medium transition-all flex flex-col items-center gap-1 ${
                      tool === t.id
                        ? `${theme.btnPrimary} shadow-md`
                        : 'glass text-gray-600 dark:text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    <span className="text-base">{t.icon}</span>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Brush Size */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2 font-body">
                Brush Size — {lineWidth}px
              </p>
              <input
                type="range"
                min="1"
                max="40"
                value={lineWidth}
                onChange={(e) => setLineWidth(parseInt(e.target.value))}
                className="ambient-slider w-full"
              />
              <div className="flex items-center justify-center mt-2">
                <div
                  className="rounded-full border border-gray-300 dark:border-gray-600 transition-all"
                  style={{
                    width: `${Math.max(lineWidth, 4)}px`,
                    height: `${Math.max(lineWidth, 4)}px`,
                    backgroundColor: tool === 'eraser' ? 'rgba(200,200,200,0.5)' : color,
                    opacity: opacity,
                  }}
                />
              </div>
            </div>

            {/* Opacity */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2 font-body">
                Opacity — {Math.round(opacity * 100)}%
              </p>
              <input
                type="range"
                min="5"
                max="100"
                value={Math.round(opacity * 100)}
                onChange={(e) => setOpacity(parseInt(e.target.value) / 100)}
                className="ambient-slider w-full"
              />
            </div>

            {/* Recent Colors */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2 font-body">Recent</p>
              <div className="flex flex-wrap gap-1.5">
                {recentColors.map((c, i) => (
                  <button
                    key={`${c}-${i}`}
                    onClick={() => selectColor(c)}
                    className={`w-7 h-7 rounded-lg border-2 transition-all hover:scale-110 ${
                      color === c && tool !== 'eraser' ? 'border-gray-800 dark:border-white scale-110 shadow-lg' : 'border-transparent shadow-sm'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            {/* Color Palette Toggle */}
            <div>
              <button
                onClick={() => setPaletteOpen(!paletteOpen)}
                className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2 font-body flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
              >
                Full Palette {paletteOpen ? '▾' : '▸'}
              </button>
              {paletteOpen && (
                <div className="space-y-3 animate-fade-in">
                  {colorGroups.map((group) => (
                    <div key={group.name}>
                      <p className="text-[10px] text-gray-400 dark:text-gray-500 mb-1 font-body">{group.name}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {group.colors.map((c) => (
                          <button
                            key={c}
                            onClick={() => selectColor(c)}
                            className={`w-6 h-6 rounded-md border-2 transition-all hover:scale-125 ${
                              color === c && tool !== 'eraser'
                                ? 'border-gray-800 dark:border-white scale-110 shadow-lg ring-2 ring-offset-1 ring-pink-400/50'
                                : 'border-transparent shadow-sm'
                            }`}
                            style={{ backgroundColor: c }}
                            title={c}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                  {/* Custom color picker */}
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => selectColor(e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer border-0"
                      title="Pick any color"
                    />
                    <span className="text-xs text-gray-400 dark:text-gray-500 font-body">Custom color</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Canvas Area ── */}
          <div className="flex-1 flex flex-col items-center justify-center p-4 overflow-auto bg-gray-100/30 dark:bg-black/20">
            {/* Mobile toolbar (shown only on small screens) */}
            <div className="md:hidden flex flex-wrap gap-2 mb-3 items-center justify-center">
              {tools.map(t => (
                <button
                  key={t.id}
                  onClick={() => setTool(t.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    tool === t.id ? `${theme.btnPrimary} shadow-md` : 'glass text-gray-600 dark:text-gray-300'
                  }`}
                >
                  {t.icon} {t.label}
                </button>
              ))}
              <input
                type="range" min="1" max="40" value={lineWidth}
                onChange={(e) => setLineWidth(parseInt(e.target.value))}
                className="ambient-slider w-24"
              />
              <input
                type="color" value={color}
                onChange={(e) => selectColor(e.target.value)}
                className="w-7 h-7 rounded-lg cursor-pointer border-0"
              />
              {/* Mobile mini palette */}
              <div className="flex gap-1 flex-wrap justify-center">
                {['#ff6b6b', '#e84393', '#6c5ce7', '#0984e3', '#00b894', '#fdcb6e', '#2d3436', '#ffffff'].map(c => (
                  <button
                    key={c}
                    onClick={() => selectColor(c)}
                    className={`w-6 h-6 rounded-md border transition-all ${color === c ? 'border-gray-800 dark:border-white scale-110' : 'border-transparent'}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            {/* Canvas wrapper */}
            <div className="relative inline-block rounded-xl overflow-hidden shadow-2xl border border-white/20">
              <canvas
                ref={canvasRef}
                className="block max-w-full max-h-[65vh] bg-white dark:bg-gray-900 touch-none"
                style={{ cursor: getCursorStyle(), width: '100%', height: 'auto' }}
                onMouseDown={startDrawing}
                onMouseMove={(e) => { draw(e); updateCursorPreview(e); }}
                onMouseUp={stopDrawing}
                onMouseLeave={(e) => { stopDrawing(); const ctx = overlayCanvasRef.current?.getContext('2d'); if (ctx) ctx.clearRect(0, 0, 800, 800); }}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
              />
              {/* Cursor preview overlay */}
              <canvas
                ref={overlayCanvasRef}
                className="absolute inset-0 pointer-events-none"
                style={{ width: '100%', height: '100%' }}
              />
            </div>
          </div>
        </div>

        {/* ── Bottom Toolbar ── */}
        <div className="flex flex-wrap justify-center gap-3 px-5 py-3 border-t border-white/10">
          <button
            onClick={undoLast}
            disabled={history.length === 0}
            className="btn-premium glass px-4 py-2 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 disabled:opacity-30 flex items-center gap-1.5 font-body"
          >
            ↩️ Undo
          </button>
          <button
            onClick={redoLast}
            disabled={redoStack.length === 0}
            className="btn-premium glass px-4 py-2 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 disabled:opacity-30 flex items-center gap-1.5 font-body"
          >
            ↪️ Redo
          </button>
          <button
            onClick={clearCanvas}
            className="btn-premium glass px-4 py-2 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center gap-1.5 font-body"
          >
            🗑️ Reset
          </button>
          <button
            onClick={downloadCanvas}
            className={`btn-premium ${theme.btnPrimary} px-5 py-2 rounded-xl text-sm shadow-md flex items-center gap-1.5 font-body`}
          >
            💾 Download
          </button>
        </div>
      </div>
    </div>
  );
};

export default MandalaColoringPopup;
