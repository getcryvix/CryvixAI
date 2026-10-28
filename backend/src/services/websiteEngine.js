import { askGroq } from "./groq.js";
import { createWebsitePlan } from "./websitePlanner.js";
import { createContentPrompt } from "./contentGenerator.js";
import { selectTemplate } from "./templateSelector.js";
import { replacePlaceholders } from "../utils/placeholder.js";
import { createBusinessData } from "./businessData.js";
import { generateWebsiteAI } from "./websiteAI.js";
import { getTheme } from "./themeEngine.js";
import { getLayout } from "./layoutEngine.js";
import { getImagePrompt } from "./imageEngine.js";

export async function generateWebsite(prompt) {
  const template = selectTemplate(prompt);
  const theme = getTheme(prompt);
  const layout = getLayout(prompt);
  const imagePrompt = getImagePrompt(prompt);
 const websitePrompt = `
You are CryvixAI's senior AI website generator, elite UI/UX designer, frontend engineer and visual branding specialist.

Your task is to generate a COMPLETE, production-ready, visually rich business website from the user's request.

USER REQUEST:
${prompt}

THE MOST IMPORTANT RULE:

DO NOT generate a website containing only a Hero section.

The website MUST contain complete, meaningful and visually populated sections.

Every major section must contain real business-specific content AND appropriate visual elements.

Never create large empty white/grey areas.

Never create empty sections.

Never create placeholder sections.

Never generate Lorem ipsum.

Never generate fake unfinished content.

Never output explanations.

Return ONLY complete valid HTML.

==================================================
OUTPUT FORMAT
==================================================

Start exactly with:

<!DOCTYPE html>

End exactly with:

</html>

Return one complete HTML document.

Everything must be inside ONE HTML file.

Use:

- HTML
- CSS
- JavaScript

No Markdown.
No code fences.
No explanation.

==================================================
WEBSITE STRUCTURE
==================================================

The generated website should normally contain:

1. Navigation
2. Hero
3. About
4. Services / Programs / Features
5. Why Choose Us / Benefits
6. Gallery / Visual Showcase
7. Team / Trainers when appropriate
8. Testimonials
9. FAQ when appropriate
10. Contact
11. Footer

The exact section names can change according to the business.

However, the website MUST have multiple meaningful sections.

Minimum requirement:

At least 6 substantial sections excluding navbar and footer.

==================================================
HERO SECTION
==================================================

Create a premium full-width hero.

Hero MUST contain:

- eyebrow/badge
- large H1
- supporting paragraph
- CTA buttons

Hero content MUST be vertically stacked.

Use:

.hero-content {
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  text-align:center;
  gap:20px;
  max-width:850px;
  margin:auto;
}

Hero:

- min-height:80vh
- width:100%
- display:flex
- align-items:center
- justify-content:center
- background-size:cover
- background-position:center
- background-repeat:no-repeat

Hero must have a real high-quality business-specific image.

Use reliable:

https://images.unsplash.com/

URLs.

Add a dark overlay so text remains readable.

Hero content must remain above the overlay.

Never use absolute positioning for the main hero text.

Never overlap H1, paragraph or buttons.

Desktop H1:

42px–64px

Mobile H1:

30px–42px

CTA buttons must appear BELOW the paragraph.

==================================================
IMAGE SYSTEM
==================================================

THIS IS MANDATORY.

Do not make the website dependent on Hero image only.

Every important content section should have visual content.

Use real images from:

https://images.unsplash.com/

Never use:

source.unsplash.com

Never use broken image URLs.

Never use placeholder.com.

Never use random unrelated images.

Images must match the business.

For example:

GYM / FITNESS:

- gym equipment
- strength training
- workout
- trainer
- fitness class
- athlete
- gym interior

RESTAURANT:

- food
- restaurant interior
- chef
- dishes
- dining
- kitchen

HOTEL:

- hotel room
- lobby
- pool
- luxury interior
- resort

SALON:

- salon interior
- hairstyling
- beauty treatment
- barber
- spa

REAL ESTATE:

- modern houses
- apartments
- interiors
- architecture
- property exterior

==================================================
ABOUT SECTION
==================================================

About section MUST NOT be text-only.

Use a two-column layout:

LEFT:
Business-specific heading + paragraph + bullet points

RIGHT:
Large relevant image

Example structure:

<section id="about">
  <div class="about-content">
    ...
  </div>

  <div class="about-image">
    <img src="VALID_UNSPLASH_URL" ...>
  </div>
</section>

Image must actually render.

Do not leave the image container empty.

==================================================
SERVICES / PROGRAMS
==================================================

Create a visually rich card/grid layout.

Each major service/program should contain:

- relevant image or visual
- title
- description
- CTA or useful information

For example, a gym may contain:

Strength Training
Personal Training
Weight Loss
CrossFit
Cardio
Group Classes

Each card should look professional.

Do NOT create cards with huge empty areas.

Use actual images.

==================================================
WHY CHOOSE US / BENEFITS
==================================================

Create a visually attractive section.

Use:

- icons
- cards
- numbers
- short descriptions
- supporting image where appropriate

Avoid plain text walls.

==================================================
TEAM / TRAINERS
==================================================

If the business naturally has people/team/trainers:

Create a professional team section.

Each person card should contain:

- real-looking professional image
- name
- role
- short description

Do not use:

John Doe
Jane Smith
Test User

Use realistic business-specific names.

If team imagery is not appropriate for the business, create another relevant visual section instead.

==================================================
GALLERY
==================================================

Gallery MUST contain actual images.

Minimum:

6 visual images when appropriate.

Use CSS Grid.

Example:

.gallery-grid {
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:20px;
}

Images:

width:100%;
height:280px;
object-fit:cover;
border-radius:20px;

Gallery must NEVER be empty.

==================================================
TESTIMONIALS
==================================================

Create realistic business-specific testimonials.

Use:

- customer name
- short review
- optional role/location
- rating visual

Do not use placeholder text.

==================================================
FAQ
==================================================

Create useful business-specific questions.

Use interactive accordion JavaScript.

Questions must be relevant to the business.

==================================================
CONTACT
==================================================

Create a professional contact section.

Include:

- name
- email
- phone
- message
- submit button
- address/location when appropriate
- business hours when appropriate

Use responsive layout.

==================================================
NAVIGATION
==================================================

Create ONE navbar only.

Desktop:

- logo/business name
- navigation links
- CTA button

Mobile:

- hamburger button
- vertically stacked mobile menu

Desktop and mobile navigation must NOT appear simultaneously.

No duplicate navigation.

No horizontal overflow.

==================================================
DESIGN SYSTEM
==================================================

Use the supplied theme colors:

Primary:
${theme.primary}

Secondary:
${theme.secondary}

Accent:
${theme.accent}

Use these consistently.

Do not randomly introduce unrelated colors.

Use:

- premium typography
- strong visual hierarchy
- rounded cards
- subtle shadows
- modern spacing
- professional buttons
- smooth hover effects
- smooth scrolling
- elegant gradients
- professional borders
- responsive grids

==================================================
RESPONSIVE DESIGN
==================================================

Desktop:
professional wide layout.

Tablet:
adapt columns and spacing.

Mobile:

- stack columns vertically
- hide desktop nav
- show hamburger
- make images full width
- buttons remain usable
- no horizontal scrolling
- no overlapping content

Use media queries.

==================================================
IMAGE FAILURE PROTECTION
==================================================

Every important image must have an image fallback.

Use JavaScript to detect failed images.

If an image fails:

replace it with another valid Unsplash image.

Never allow broken images to create empty sections.

Example:

img.addEventListener("error", function() {
  this.src = fallbackImage;
});

Do not create an infinite error loop.

==================================================
VISUAL QUALITY
==================================================

The website must look like a real professional business website.

NOT:

- basic HTML demo
- empty template
- plain white page
- plain grey page
- Hero + empty sections
- text-only website

YES:

- premium business website
- rich imagery
- complete sections
- strong typography
- realistic content
- professional cards
- visual hierarchy
- responsive design
- polished UI

==================================================
NO EMPTY SECTIONS
==================================================

Before returning HTML, inspect every section.

For every section ask:

Does it contain meaningful content?

Does it contain visual hierarchy?

Does it have appropriate spacing?

Does it need an image?

If yes, add the image.

Never return an empty section.

Never create:

<section></section>

Never create:

<div class="gallery"></div>

without content.

==================================================
FINAL VALIDATION
==================================================

Before returning the HTML, perform a complete internal validation.

CHECK:

- valid DOCTYPE
- html
- head
- body
- one navbar
- hero exists
- hero image exists
- hero content visible
- About exists
- About has image
- Services/Programs exists
- Services/Programs have visual cards
- Gallery exists
- Gallery contains images
- Team exists when appropriate
- Testimonials exist
- FAQ exists when appropriate
- Contact exists
- Footer exists
- no Lorem ipsum
- no placeholder names
- no empty sections
- no broken image URLs
- no duplicate navbar
- no duplicate mobile menu
- no horizontal overflow
- mobile responsive
- desktop responsive
- all images have object-fit:cover
- all major images have valid src
- failed images have fallback handling

MOST IMPORTANT:

The final website must NOT be only Hero + text.

The final website must be visually complete from top to bottom.

Return ONLY the final HTML.
`;

  const finalPrompt = websitePrompt;
 const html = await generateWebsiteAI(finalPrompt);

const finalHtml = html
  .replaceAll("{{primaryColor}}", theme.primary)
  .replaceAll("{{secondaryColor}}", theme.secondary)
  .replaceAll("{{accentColor}}", theme.accent);

const promptText = String(prompt || "").toLowerCase();

let heroImage =
  "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=2000&q=85";

if (
  promptText.includes("gym") ||
  promptText.includes("fitness") ||
  promptText.includes("workout") ||
  promptText.includes("bodybuilding") ||
  promptText.includes("crossfit")
) {
  heroImage =
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=2000&q=85";
} else if (
  promptText.includes("restaurant") ||
  promptText.includes("cafe") ||
  promptText.includes("coffee") ||
  promptText.includes("food") ||
  promptText.includes("dining")
) {
  heroImage =
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=2000&q=85";
} else if (
  promptText.includes("hotel") ||
  promptText.includes("resort") ||
  promptText.includes("villa")
) {
  heroImage =
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=2000&q=85";
} else if (
  promptText.includes("salon") ||
  promptText.includes("beauty") ||
  promptText.includes("spa") ||
  promptText.includes("barber")
) {
  heroImage =
    "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=2000&q=85";
} else if (
  promptText.includes("real estate") ||
  promptText.includes("property") ||
  promptText.includes("realty") ||
  promptText.includes("house") ||
  promptText.includes("apartment")
) {
  heroImage =
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2000&q=85";
}
const heroImageStyle = `
<style id="cryvixai-dynamic-hero">

/* ==============================
   CRYVIXAI PREMIUM HERO
================================ */

.hero,
.hero-section,
#hero,
header.hero,
section.hero,
section.hero-section {
  position: relative !important;
  min-height: 80vh !important;
  height: auto !important;

  background-image:
    linear-gradient(
      rgba(0,0,0,0.45),
      rgba(0,0,0,0.62)
    ),
    url("${heroImage}") !important;

  background-size: cover !important;
  background-position: center center !important;
  background-repeat: no-repeat !important;

  display: flex !important;
  align-items: center !important;
  justify-content: center !important;

  padding: 100px 30px !important;
  box-sizing: border-box !important;

  overflow: hidden !important;

  background-color: #3b1f16 !important;
}

/* Hero content */

.hero .hero-content,
.hero-section .hero-content,
#hero .hero-content,
header.hero .hero-content,
section.hero .hero-content,
section.hero-section .hero-content {
  position: relative !important;
  z-index: 2 !important;

  width: 100% !important;
  max-width: 850px !important;

  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  justify-content: center !important;

  gap: 22px !important;

  margin: 0 auto !important;
  text-align: center !important;
}

/* Hero heading */

.hero h1,
.hero-section h1,
#hero h1 {
  position: relative !important;
  z-index: 2 !important;

  max-width: 850px !important;
  margin: 0 !important;

  font-size: clamp(42px, 5vw, 64px) !important;
  line-height: 1.08 !important;

  color: #ffffff !important;
}

/* Hero paragraph */

.hero p,
.hero-section p,
#hero p {
  position: relative !important;
  z-index: 2 !important;

  max-width: 720px !important;
  margin: 0 !important;

  font-size: 18px !important;
  line-height: 1.7 !important;

  color: rgba(255,255,255,0.92) !important;
}

/* CTA buttons */

.hero .hero-content > div:last-child,
.hero .cta-group,
.hero .hero-buttons,
.hero-section .cta-group,
.hero-section .hero-buttons {
  position: relative !important;
  z-index: 2 !important;

  display: flex !important;
  flex-direction: row !important;
  align-items: center !important;
  justify-content: center !important;

  gap: 14px !important;

  margin-top: 8px !important;
}

/* Mobile */

@media (max-width: 600px) {

  .hero,
  .hero-section,
  #hero,
  header.hero,
  section.hero,
  section.hero-section {
    min-height: 75vh !important;
    padding: 80px 20px !important;
  }

  .hero .hero-content,
  .hero-section .hero-content,
  #hero .hero-content {
    gap: 18px !important;
  }

  .hero h1,
  .hero-section h1,
  #hero h1 {
    font-size: clamp(30px, 9vw, 42px) !important;
  }

  .hero p,
  .hero-section p,
  #hero p {
    font-size: 16px !important;
    line-height: 1.6 !important;
  }

  .hero .hero-content > div:last-child,
  .hero .cta-group,
  .hero .hero-buttons,
  .hero-section .cta-group,
  .hero-section .hero-buttons {
    flex-direction: column !important;
    width: 100% !important;
  }

}

</style>
`;

const navbarFix = `
<style id="cryvixai-navbar-fix">

nav {
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  gap: 24px !important;
  flex-wrap: nowrap !important;
}

nav ul,
nav .nav-links,
.nav-links {
  display: flex !important;
  align-items: center !important;
  gap: 20px !important;
  flex-wrap: nowrap !important;
}

nav a {
  white-space: nowrap !important;
}

nav button,
nav .cta,
nav .nav-cta {
  white-space: nowrap !important;
  flex-shrink: 0 !important;
}

</style>
`;

const finalWebsite = finalHtml.includes("</head>")
  ? finalHtml.replace(
      "</head>",
      heroImageStyle + navbarFix + "</head>"
    )
  : heroImageStyle + navbarFix + finalHtml;
const imageRepairScript = `
<script id="cryvixai-image-repair">
(function () {

  const fallbackImages = [
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1200&q=85"
  ];

  const imageMap = {
    gym:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=85",

    strength:
      "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1200&q=85",

    training:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1200&q=85",

    trainer:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1200&q=85",

    fitness:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=85"
  };

  function getRepairImage(img, index) {

    const text = (
      (img.alt || "") +
      " " +
      (img.className || "") +
      " " +
      (img.parentElement?.innerText || "")
    ).toLowerCase();

    for (const key in imageMap) {
      if (text.includes(key)) {
        return imageMap[key];
      }
    }

    return fallbackImages[index % fallbackImages.length];
  }

  document.querySelectorAll("img").forEach(function (img, index) {

    img.addEventListener("error", function () {

      if (img.dataset.cryvixFixed === "true") {
        return;
      }

      img.dataset.cryvixFixed = "true";

      img.src = getRepairImage(img, index);

    });

  });

})();
</script>
`;

const sectionVisuals = `
<style id="cryvixai-section-visuals">

.cryvixai-visual-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
  width: 100%;
  margin: 28px 0 36px;
}

.cryvixai-visual-card {
  min-height: 240px;
  border-radius: 20px;
  overflow: hidden;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  box-shadow: 0 12px 30px rgba(0,0,0,.14);
}

@media (max-width: 900px) {
  .cryvixai-visual-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 600px) {
  .cryvixai-visual-grid {
    grid-template-columns: 1fr;
  }

  .cryvixai-visual-card {
    min-height: 220px;
  }
}

</style>
`;

const sectionImage1 =
  "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=85";

const sectionImage2 =
  "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1200&q=85";

const sectionImage3 =
  "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1200&q=85";

const sectionImage4 =
  "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=85";

const visualGrid = `
<div class="cryvixai-visual-grid">

  <div class="cryvixai-visual-card"
    style="background-image:url('${sectionImage1}');">
  </div>

  <div class="cryvixai-visual-card"
    style="background-image:url('${sectionImage2}');">
  </div>

  <div class="cryvixai-visual-card"
    style="background-image:url('${sectionImage3}');">
  </div>

  <div class="cryvixai-visual-card"
    style="background-image:url('${sectionImage4}');">
  </div>

</div>
`;

const aboutVisual = `
<div class="cryvixai-visual-grid">
  <div class="cryvixai-visual-card"
    style="background-image:url('${sectionImage1}');">
  </div>
</div>
`;

const programsVisual = `
<div class="cryvixai-visual-grid">
  <div class="cryvixai-visual-card"
    style="background-image:url('${sectionImage2}');">
  </div>

  <div class="cryvixai-visual-card"
    style="background-image:url('${sectionImage3}');">
  </div>

  <div class="cryvixai-visual-card"
    style="background-image:url('${sectionImage4}');">
  </div>
</div>
`;

const trainersVisual = `
<div class="cryvixai-visual-grid">
  <div class="cryvixai-visual-card"
    style="background-image:url('${sectionImage3}');">
  </div>

  <div class="cryvixai-visual-card"
    style="background-image:url('${sectionImage4}');">
  </div>
</div>
`;

const galleryVisual = `
<div class="cryvixai-visual-grid">
  <div class="cryvixai-visual-card"
    style="background-image:url('${sectionImage1}');">
  </div>

  <div class="cryvixai-visual-card"
    style="background-image:url('${sectionImage2}');">
  </div>

  <div class="cryvixai-visual-card"
    style="background-image:url('${sectionImage3}');">
  </div>

  <div class="cryvixai-visual-card"
    style="background-image:url('${sectionImage4}');">
  </div>
</div>
`;


/* =========================================
   INJECT VISUALS INTO FINAL WEBSITE
========================================= */

let visualWebsite = finalWebsite;

/* =========================================
   CRYVIXAI VISUAL SECTIONS
========================================= */

if (visualWebsite.includes("</body>")) {

  visualWebsite = visualWebsite.replace(
    "</body>",
    `
      ${visualGrid}
      ${aboutVisual}
      ${programsVisual}
      ${trainersVisual}
      ${galleryVisual}

      ${imageRepairScript}

    </body>
    `
  );

} else {

  visualWebsite +=
    visualGrid +
    aboutVisual +
    programsVisual +
    trainersVisual +
    galleryVisual +
    imageRepairScript;
}


/* =========================================
   FINAL WEBSITE
========================================= */

console.log(
  "CRYVIXAI FINAL VISUAL LAYOUT: ENABLED"
);

return {
  template,
  html: visualWebsite,
  theme,
  layout,
};
}