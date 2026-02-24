<template>
  <div class="glow-orb glow-orb-blue" />
  <div class="glow-orb glow-orb-pink" />
  <div class="glow-orb glow-orb-yellow" />
  <div class="slide-accent-line" />
</template>

<style>
.glow-orb {
  position: fixed;
  border-radius: 50%;
  filter: blur(120px);
  pointer-events: none;
  z-index: 0;
}

.glow-orb-blue {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(4, 92, 252, 0.08) 0%, transparent 70%);
  bottom: -140px;
  right: -100px;
  opacity: 0.5;
}

.glow-orb-pink {
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(242, 158, 254, 0.06) 0%, transparent 70%);
  top: -80px;
  left: -60px;
  opacity: 0.4;
}

.glow-orb-yellow {
  width: 250px;
  height: 250px;
  background: radial-gradient(circle, rgba(249, 255, 71, 0.04) 0%, transparent 70%);
  top: 50%;
  right: -40px;
  transform: translateY(-50%);
  opacity: 0.3;
}

.slide-accent-line {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(242, 158, 254, 0.4) 20%,
    rgba(4, 92, 252, 0.5) 50%,
    rgba(249, 255, 71, 0.35) 80%,
    transparent 100%
  );
  z-index: 10;
  pointer-events: none;
}
</style>
