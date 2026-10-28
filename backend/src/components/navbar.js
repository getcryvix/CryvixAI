export function createNavbar(title) {
  return `
<nav class="navbar">

  <div class="logo">
    ${title}
  </div>

  <ul class="nav-links">
    <li><a href="#home">Home</a></li>
    <li><a href="#about">About</a></li>
    <li><a href="#rooms">Rooms</a></li>
    <li><a href="#contact">Contact</a></li>
  </ul>

</nav>
`;
}