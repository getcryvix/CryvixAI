export function createHero(data) {
  return `
<section class="hero" id="home">

  <div class="hero-overlay">

    <div class="hero-content">

      <h1>${data.title}</h1>

      <p>${data.description}</p>

      <a href="#contact" class="hero-btn">
        Book Now
      </a>

    </div>

  </div>

</section>
`;
}