<template>
  <div class="skeleton">
    <div class="skeleton-logo" />
    <div class="skeleton-title" />
    <div class="skeleton-description" />
  </div>
</template>

<style scoped>
.skeleton-logo {
  width: 64px;
  height: 64px;
  background-color: var(--skeleton-bg);
  border-radius: 6px;
  margin-bottom: 1rem;
}

.skeleton-title,
.skeleton-description {
  background-color: var(--skeleton-bg);
  border-radius: 4px;
}

.skeleton-title {
  height: 16px;
  width: 70%;
  margin-bottom: 0.5rem;
}

.skeleton-description {
  height: 16px;
  width: 60%;
}
</style>
