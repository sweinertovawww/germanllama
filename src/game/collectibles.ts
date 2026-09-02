// Shared star/sombrero collectible visuals, used by both LlamaGame (Llama Run)
// and LlamaJump so the two games look consistent.

export interface Star {
  x: number;
  y: number;
  collected: boolean;
}

export interface Sombrero {
  x: number;
  y: number;
  collected: boolean;
}

export const drawStar = (ctx: CanvasRenderingContext2D, x: number, y: number, frame: number) => {
  const pulse = 1 + Math.sin(frame * 0.1) * 0.15;
  const size = 10 * pulse;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(frame * 0.05);
  ctx.fillStyle = "#FFD700";
  ctx.strokeStyle = "#FFA500";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
    const method = i === 0 ? "moveTo" : "lineTo";
    ctx[method](Math.cos(angle) * size, Math.sin(angle) * size);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  // Glow
  ctx.shadowColor = "#FFD700";
  ctx.shadowBlur = 8;
  ctx.fill();
  ctx.restore();
};

export const drawSombrero = (ctx: CanvasRenderingContext2D, x: number, y: number, frame: number) => {
  const bob = Math.sin(frame * 0.08) * 3;
  const dy = y + bob;
  ctx.save();

  // Brim - straw colored with colorful stripe edge
  ctx.fillStyle = "#d4b96a";
  ctx.beginPath();
  ctx.ellipse(x, dy + 8, 18, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  // Colorful brim edge
  ctx.strokeStyle = "#c0392b";
  ctx.lineWidth = 2.5;
  ctx.stroke();
  ctx.strokeStyle = "#2980b9";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.ellipse(x, dy + 8, 19.5, 7, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = "#27ae60";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.ellipse(x, dy + 8, 21, 8, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Crown base
  ctx.fillStyle = "#d4b96a";
  ctx.beginPath();
  ctx.ellipse(x, dy + 2, 9, 4, 0, Math.PI, 0);
  ctx.fill();
  ctx.fillRect(x - 9, dy - 8, 18, 10);

  // Crown top dome
  ctx.beginPath();
  ctx.ellipse(x, dy - 8, 9, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  // Colorful band around crown
  const bandColors = ["#c0392b", "#27ae60", "#2980b9", "#c0392b", "#27ae60"];
  bandColors.forEach((color, i) => {
    ctx.fillStyle = color;
    ctx.fillRect(x - 9 + i * 3.6, dy + 0, 3.6, 3);
  });

  ctx.restore();
};
