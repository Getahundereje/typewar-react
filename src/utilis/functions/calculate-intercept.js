function calculateIntercept(target, shooter, bulletSpeed) {
  const dx = target.x - shooter.x;
  const dy = target.y - shooter.y;

  const targetSpeed = Math.sqrt(target.dx ** 2 + target.dy ** 2);

  const a = targetSpeed ** 2 - bulletSpeed ** 2;
  const b = 2 * (dx * target.dx + dy * target.dy);
  const c = dx ** 2 + dy ** 2;

  const discriminant = b ** 2 - 4 * a * c;

  if (discriminant < 0) {
    return null;
  }

  const t1 = (-b - Math.sqrt(discriminant)) / (2 * a);
  const t2 = (-b + Math.sqrt(discriminant)) / (2 * a);

  const time = Math.max(t1, t2);

  if (time < 0) {
    return null;
  }

  const interceptX = target.x + target.dx * time;
  const interceptY = target.y + target.dy * time;
  // const magnitude = Math.sqrt(interceptX ** 2 + interceptY ** 2);

  const bulletVx = (interceptX - shooter.x) / time;
  const bulletVy = (interceptY - shooter.y) / time;

  return {
    velocity: { vx: bulletVx * 1.3, vy: bulletVy * 1.5 },
    position: { x: interceptX, y: interceptY },
  };
}

export default calculateIntercept;
