<template>
  <div class="skeleton-container">
    <!-- 導航欄骨架 -->
    <div class="skeleton-nav">
      <div class="skeleton-logo"></div>
      <div class="skeleton-menu">
        <div class="skeleton-menu-item"></div>
        <div class="skeleton-menu-item"></div>
        <div class="skeleton-menu-item"></div>
        <div class="skeleton-menu-item"></div>
      </div>
    </div>

    <!-- Hero 骨架 -->
    <div class="skeleton-hero">
      <div class="skeleton-avatar"></div>
      <div class="skeleton-title"></div>
      <div class="skeleton-subtitle"></div>
      <div class="skeleton-text"></div>
      <div class="skeleton-buttons">
        <div class="skeleton-button"></div>
        <div class="skeleton-button"></div>
      </div>
    </div>

    <!-- About 骨架 -->
    <div class="skeleton-section">
      <div class="skeleton-section-title"></div>
      <div class="skeleton-card">
        <div class="skeleton-text-line"></div>
        <div class="skeleton-text-line"></div>
        <div class="skeleton-text-line short"></div>
      </div>
    </div>

    <!-- Projects 骨架 -->
    <div class="skeleton-section">
      <div class="skeleton-section-title"></div>
      <div class="skeleton-projects-grid">
        <div class="skeleton-project-card">
          <div class="skeleton-project-image"></div>
          <div class="skeleton-project-content">
            <div class="skeleton-text-line"></div>
            <div class="skeleton-text-line short"></div>
          </div>
        </div>
        <div class="skeleton-project-card">
          <div class="skeleton-project-image"></div>
          <div class="skeleton-project-content">
            <div class="skeleton-text-line"></div>
            <div class="skeleton-text-line short"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.skeleton-container {
  width: 100%;
  min-height: 100vh;
  background: #fdfdf8;
}

/* 骨架動畫 */
@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

.skeleton-nav,
.skeleton-avatar,
.skeleton-title,
.skeleton-subtitle,
.skeleton-text,
.skeleton-button,
.skeleton-section-title,
.skeleton-text-line,
.skeleton-project-image,
.skeleton-card,
.skeleton-logo,
.skeleton-menu-item {
  background: linear-gradient(
    90deg,
    #f0f0f0 0%,
    #e0e0e0 50%,
    #f0f0f0 100%
  );
  background-size: 1000px 100%;
  animation: shimmer 2s infinite linear;
}

/* 導航欄骨架 */
.skeleton-nav {
  height: 70px;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.skeleton-logo {
  width: 150px;
  height: 30px;
  border-radius: 4px;
}

.skeleton-menu {
  display: flex;
  gap: 2rem;
}

.skeleton-menu-item {
  width: 80px;
  height: 20px;
  border-radius: 4px;
}

/* Hero 骨架 */
.skeleton-hero {
  padding: 6rem 2rem;
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
}

.skeleton-avatar {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  margin: 0 auto 2rem;
}

.skeleton-title {
  width: 300px;
  height: 50px;
  margin: 0 auto 1rem;
  border-radius: 8px;
}

.skeleton-subtitle {
  width: 200px;
  height: 30px;
  margin: 0 auto 1rem;
  border-radius: 6px;
}

.skeleton-text {
  width: 400px;
  height: 20px;
  margin: 0 auto 2rem;
  border-radius: 4px;
}

.skeleton-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.skeleton-button {
  width: 150px;
  height: 50px;
  border-radius: 25px;
}

/* Section 骨架 */
.skeleton-section {
  padding: 4rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.skeleton-section-title {
  width: 200px;
  height: 40px;
  margin-bottom: 2rem;
  border-radius: 6px;
}

.skeleton-card {
  padding: 2rem;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.skeleton-text-line {
  height: 16px;
  margin-bottom: 1rem;
  border-radius: 4px;
}

.skeleton-text-line.short {
  width: 60%;
}

/* Projects 骨架 */
.skeleton-projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 3rem;
}

.skeleton-project-card {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.skeleton-project-image {
  width: 100%;
  height: 300px;
}

.skeleton-project-content {
  padding: 2rem;
}

/* 響應式 */
@media (max-width: 768px) {
  .skeleton-menu {
    display: none;
  }

  .skeleton-projects-grid {
    grid-template-columns: 1fr;
  }

  .skeleton-hero {
    padding: 4rem 1rem;
  }

  .skeleton-title {
    width: 250px;
    height: 40px;
  }

  .skeleton-text {
    width: 300px;
  }
}
</style>
