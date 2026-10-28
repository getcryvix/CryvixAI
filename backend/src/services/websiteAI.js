import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/* =========================================================
   FALLBACK
========================================================= */

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=80";

/* =========================================================
   IMAGE LIBRARY
========================================================= */

const imagePools = {
  gym: {
    hero: [
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=2000&q=85",
      "https://images.unsplash.com/photo-1546483875-ad9014c88eba?auto=format&fit=crop&w=2000&q=85",
    ],

    about: [
      "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=1400&q=85",
    ],

    services: [
      "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=1200&q=85",
    ],

    trainers: [
  // Trainer 1 — Male
  "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=900&q=85",

  // Trainer 2 — Female
  "https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&w=900&q=85",

  // Trainer 3 — Male
  "https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=900&q=85",

  // Trainer 4 — Female
  "https://images.unsplash.com/photo-1548690312-e3b507d8c110?auto=format&fit=crop&w=900&q=85",
],

    gallery: [
      "https://images.unsplash.com/photo-1579758629938-03607ccdbaba?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1534258936925-c58bed479fcb?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1599058917765-a780eda07a3e?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1546483875-ad9014c88eba?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1200&q=85",
    ],
  },

  restaurant: {
    hero: [
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=2000&q=85",
    ],

    about: [
      "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1400&q=85",
    ],

    services: [
      "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=85",
    ],

    gallery: [
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=85",
    ],
  },

  hotel: {
    hero: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=2000&q=85",
    ],

    about: [
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1400&q=85",
    ],

    services: [
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=1200&q=85",
    ],

    gallery: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&w=1200&q=85",
    ],
  },

  salon: {
    hero: [
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=2000&q=85",
    ],

    about: [
      "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1400&q=85",
    ],

    services: [
      "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?auto=format&fit=crop&w=1200&q=85",
    ],

    gallery: [
      "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1560869713-da86a9ec0744?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1487412912498-0447578fcca8?auto=format&fit=crop&w=1200&q=85",
    ],
  },

  realestate: {
    hero: [
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=2000&q=85",
    ],

    about: [
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1400&q=85",
    ],

    services: [
      "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=85",
    ],

    gallery: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=85",
    ],
  },

  portfolio: {
    hero: [
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=2000&q=85",
    ],

    about: [
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1400&q=85",
    ],

    services: [
      "https://images.unsplash.com/photo-1497215842964-222b430dc094?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1497366412874-3415097a27e7?auto=format&fit=crop&w=1200&q=85",
    ],

    gallery: [
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=85",
    ],
  },
};

/* =========================================================
   BUSINESS DETECTION
   GYM IS CHECKED FIRST
========================================================= */

function detectBusiness(prompt) {
  const text = String(prompt || "").toLowerCase();

  /* GYM FIRST */
  if (
    text.includes("gym") ||
    text.includes("fitness") ||
    text.includes("workout") ||
    text.includes("crossfit") ||
    text.includes("personal trainer") ||
    text.includes("fitness center") ||
    text.includes("fitness centre") ||
    text.includes("bodybuilding")
  ) {
    return "gym";
  }

  if (
    text.includes("restaurant") ||
    text.includes("cafe") ||
    text.includes("café") ||
    text.includes("food") ||
    text.includes("dining") ||
    text.includes("pizza") ||
    text.includes("bakery")
  ) {
    return "restaurant";
  }

  if (
    text.includes("hotel") ||
    text.includes("resort") ||
    text.includes("villa")
  ) {
    return "hotel";
  }

  if (
    text.includes("salon") ||
    text.includes("beauty") ||
    text.includes("spa") ||
    text.includes("barber")
  ) {
    return "salon";
  }

  if (
    text.includes("real estate") ||
    text.includes("realestate") ||
    text.includes("property") ||
    text.includes("realty") ||
    text.includes("house") ||
    text.includes("apartment")
  ) {
    return "realestate";
  }

  if (
    text.includes("portfolio") ||
    text.includes("photographer") ||
    text.includes("designer") ||
    text.includes("developer") ||
    text.includes("creative agency")
  ) {
    return "portfolio";
  }

  return "gym";
}

/* =========================================================
   AI PROMPT
========================================================= */

const SYSTEM_PROMPT = `
You are CryvixAI Universal Website Builder.

Create a complete premium responsive business website.

RETURN ONLY COMPLETE HTML.

Start with:
<!DOCTYPE html>

End with:
</html>

Do not use Markdown.
Do not use code fences.
Do not explain anything.

==================================================
WEBSITE STRUCTURE
==================================================

Create:

1. Navigation
2. Hero
3. About
4. Services / Programs
5. Business-specific section
6. Gallery
7. Testimonials
8. Pricing / Membership when useful
9. FAQ
10. Contact
11. Footer

==================================================
VERY IMPORTANT IMAGE RULE
==================================================

DO NOT create any image URL.

DO NOT create Unsplash URLs.

Use ONLY these exact placeholders inside img src:

CRYVIX_IMAGE_HERO

CRYVIX_IMAGE_ABOUT

CRYVIX_IMAGE_SERVICE_1
CRYVIX_IMAGE_SERVICE_2
CRYVIX_IMAGE_SERVICE_3
CRYVIX_IMAGE_SERVICE_4

CRYVIX_IMAGE_TRAINER_1
CRYVIX_IMAGE_TRAINER_2
CRYVIX_IMAGE_TRAINER_3
CRYVIX_IMAGE_TRAINER_4

CRYVIX_IMAGE_GALLERY_1
CRYVIX_IMAGE_GALLERY_2
CRYVIX_IMAGE_GALLERY_3
CRYVIX_IMAGE_GALLERY_4
CRYVIX_IMAGE_GALLERY_5
CRYVIX_IMAGE_GALLERY_6

Do not use any other image source.

==================================================
GYM
==================================================

If business is a gym:

Hero = fitness/gym environment.

About = professional gym environment.

Programs = workout/fitness images.

Trainers = REAL fitness trainer/coach images.

Gallery = gym equipment, workout areas, classes and training environment.

Never use restaurant images.

Never use food images.

Never use hotel images.

Never use office images.

Never use landscape images.

Never use trainer portraits inside Gallery.

Trainer cards must contain:
- image
- name
- role
- professional description

Each trainer should look visually different.

Gym sections:

Hero
About
Programs
Why Choose Us
Trainers
Gallery
Membership
Testimonials
FAQ
Contact
Footer

==================================================
DESIGN
==================================================

Use:

- premium typography
- modern cards
- rounded corners
- subtle shadows
- responsive grids
- professional spacing
- hover effects
- smooth scrolling
- strong visual hierarchy

Hero:

min-height:80vh

Use:
- eyebrow
- H1
- paragraph
- CTA buttons

Do not overlap hero content.

==================================================
RESPONSIVE
==================================================

Desktop professional.

Tablet responsive.

Mobile properly stacked.

No horizontal overflow.

Images must fit cards.

Buttons must remain usable.

Use mobile hamburger menu.

==================================================
CONTENT
==================================================

Use realistic business-specific content.

Never use:

Lorem ipsum
John Doe
Jane Smith
Test User
Dummy text
Placeholder text

==================================================
JAVASCRIPT
==================================================

Add:

- mobile menu
- FAQ accordion
- smooth navigation
- simple reveal animation

Return ONLY complete HTML.
`;

/* =========================================================
   GET POOLS
========================================================= */

function getPools(businessType) {
  const pool =
    imagePools[businessType] || imagePools.portfolio;

  return {
    hero: pool.hero || [FALLBACK_IMAGE],
    about: pool.about || [FALLBACK_IMAGE],
    services:
      pool.services ||
      pool.programs ||
      [FALLBACK_IMAGE],
    trainers:
      pool.trainers ||
      [FALLBACK_IMAGE],
    gallery:
      pool.gallery ||
      [FALLBACK_IMAGE],
  };
}

/* =========================================================
   UNIQUE IMAGE PICKER
========================================================= */

function createImagePicker(pools) {
  const used = new Set();

  function pick(list, preferredIndex = 0) {
    if (!list || !list.length) {
      return FALLBACK_IMAGE;
    }

    const start =
      preferredIndex % list.length;

    for (let i = 0; i < list.length; i++) {
      const index =
        (start + i) % list.length;

      const image = list[index];

      if (!used.has(image)) {
        used.add(image);
        return image;
      }
    }

    return list[start];
  }

  return {
    hero: () => pick(pools.hero, 0),

    about: () => pick(pools.about, 0),

    service: (index) =>
      pick(pools.services, index),

    trainer: (index) =>
      pick(pools.trainers, index),

    gallery: (index) =>
      pick(pools.gallery, index),
  };
}

/* =========================================================
   PLACEHOLDER INJECTION
========================================================= */

function injectImages(html, businessType) {
  const pools = getPools(businessType);
  const picker = createImagePicker(pools);

  html = html.replace(
    /CRYVIX_IMAGE_HERO/gi,
    picker.hero()
  );

  html = html.replace(
    /CRYVIX_IMAGE_ABOUT/gi,
    picker.about()
  );

  html = html.replace(
    /CRYVIX_IMAGE_SERVICE_1/gi,
    picker.service(0)
  );

  html = html.replace(
    /CRYVIX_IMAGE_SERVICE_2/gi,
    picker.service(1)
  );

  html = html.replace(
    /CRYVIX_IMAGE_SERVICE_3/gi,
    picker.service(2)
  );

  html = html.replace(
    /CRYVIX_IMAGE_SERVICE_4/gi,
    picker.service(3)
  );

  html = html.replace(
    /CRYVIX_IMAGE_TRAINER_1/gi,
    picker.trainer(0)
  );

  html = html.replace(
    /CRYVIX_IMAGE_TRAINER_2/gi,
    picker.trainer(1)
  );

  html = html.replace(
    /CRYVIX_IMAGE_TRAINER_3/gi,
    picker.trainer(2)
  );

  html = html.replace(
    /CRYVIX_IMAGE_TRAINER_4/gi,
    picker.trainer(3)
  );

  html = html.replace(
    /CRYVIX_IMAGE_GALLERY_1/gi,
    picker.gallery(0)
  );

  html = html.replace(
    /CRYVIX_IMAGE_GALLERY_2/gi,
    picker.gallery(1)
  );

  html = html.replace(
    /CRYVIX_IMAGE_GALLERY_3/gi,
    picker.gallery(2)
  );

  html = html.replace(
    /CRYVIX_IMAGE_GALLERY_4/gi,
    picker.gallery(3)
  );

  html = html.replace(
    /CRYVIX_IMAGE_GALLERY_5/gi,
    picker.gallery(4)
  );

  html = html.replace(
    /CRYVIX_IMAGE_GALLERY_6/gi,
    picker.gallery(5)
  );

  return html;
}

/* =========================================================
   SECTION DETECTION
========================================================= */

function getImageSection(source, offset) {
  const before =
    source
      .slice(
        Math.max(0, offset - 9000),
        offset
      )
      .toLowerCase();

  const sectionStart =
    before.lastIndexOf("<section");

  const section =
    sectionStart >= 0
      ? before.slice(sectionStart)
      : before;

  return section;
}

function classifyImage(fullMatch, source, offset) {
  const altMatch =
    fullMatch.match(
      /\balt\s*=\s*["']([^"']*)["']/i
    );

  const classMatch =
    fullMatch.match(
      /\bclass\s*=\s*["']([^"']*)["']/i
    );

  const idMatch =
    fullMatch.match(
      /\bid\s*=\s*["']([^"']*)["']/i
    );

  const alt =
    altMatch
      ? altMatch[1].toLowerCase()
      : "";

  const cls =
    classMatch
      ? classMatch[1].toLowerCase()
      : "";

  const id =
    idMatch
      ? idMatch[1].toLowerCase()
      : "";

  const section =
    getImageSection(source, offset);

  const text =
    `${alt} ${cls} ${id} ${section}`;

  /* TRAINERS FIRST */
  if (
    /trainer|coach|fitness professional|personal trainer|strength coach|our trainers|meet our trainers/i.test(
      text
    )
  ) {
    return "trainer";
  }

  /* GALLERY */
  if (
    /gallery|photo gallery|gym gallery|fitness gallery|training environment/i.test(
      text
    )
  ) {
    return "gallery";
  }

  /* ABOUT */
  if (
    /about us|about powerfit|about section|who we are|our mission/i.test(
      text
    )
  ) {
    return "about";
  }

  /* SERVICES / PROGRAMS */
  if (
    /program|programs|service|services|strength training|personal training|weight loss|crossfit|cardio|hiit|workout class|fitness class/i.test(
      text
    )
  ) {
    return "service";
  }

  /* HERO */
  if (
    /hero|banner|masthead/i.test(text)
  ) {
    return "hero";
  }

  return "other";
}

/* =========================================================
   CRITICAL FIX
   FORCE ALL AI-GENERATED IMAGE URLS
========================================================= */

function forceCorrectImages(html, businessType) {
  const pools = getPools(businessType);

  const used = {
    hero: new Set(),
    about: new Set(),
    service: new Set(),
    trainer: new Set(),
    gallery: new Set(),
  };

  const counters = {
    hero: 0,
    about: 0,
    service: 0,
    trainer: 0,
    gallery: 0,
  };

  function choose(list, type) {
    if (!Array.isArray(list) || list.length === 0) {
      return FALLBACK_IMAGE;
    }

    const usedSet = used[type] || new Set();

    // First try unused images
    for (let i = 0; i < list.length; i++) {
      const index =
        (counters[type] + i) % list.length;

      const image = list[index];

      if (!usedSet.has(image)) {
        usedSet.add(image);
        counters[type] = index + 1;
        return image;
      }
    }

    // If all images were already used,
    // start reusing from the beginning.
    const index =
      counters[type] % list.length;

    counters[type]++;

    return list[index];
  }

  /*
   * Get section from nearby HTML.
   */
  function getImageSection(source, offset) {
    const before =
      source
        .slice(
          Math.max(0, offset - 8000),
          offset
        )
        .toLowerCase();

    const lastSection =
      before.lastIndexOf("<section");

    const lastClose =
      before.lastIndexOf("</section>");

    if (lastSection > lastClose) {
      return before.slice(lastSection);
    }

    return before.slice(-4000);
  }

  /*
   * Detect exact image purpose.
   */
  function detectImageType(
    fullMatch,
    source,
    offset
  ) {
    const altMatch =
      fullMatch.match(
        /\balt\s*=\s*["']([^"']*)["']/i
      );

    const classMatch =
      fullMatch.match(
        /\bclass\s*=\s*["']([^"']*)["']/i
      );

    const idMatch =
      fullMatch.match(
        /\bid\s*=\s*["']([^"']*)["']/i
      );

    const alt =
      altMatch
        ? altMatch[1].toLowerCase()
        : "";

    const cls =
      classMatch
        ? classMatch[1].toLowerCase()
        : "";

    const id =
      idMatch
        ? idMatch[1].toLowerCase()
        : "";

    const section =
      getImageSection(
        source,
        offset
      );

    const text =
      `${alt} ${cls} ${id} ${section}`;

    /*
     * HERO FIRST
     */
    if (
      /\bhero\b|\bbanner\b|\bmasthead\b/i.test(
        text
      )
    ) {
      return "hero";
    }

    /*
     * TRAINERS
     */
    if (
      /\btrainer\b|\btrainers\b|\bcoach\b|\bcoaches\b|\bfitness professional\b|\bpersonal trainer\b|\bstrength coach\b|\bmeet our trainers\b/i.test(
        text
      )
    ) {
      return "trainer";
    }

    /*
     * GALLERY
     */
    if (
      /\bgallery\b|\bphoto gallery\b|\bgym gallery\b|\bfitness gallery\b|\btraining environment\b/i.test(
        text
      )
    ) {
      return "gallery";
    }

    /*
     * ABOUT
     */
    if (
      /\babout us\b|\babout powerfit\b|\babout section\b|\bwho we are\b|\bour mission\b/i.test(
        text
      )
    ) {
      return "about";
    }

    /*
     * PROGRAMS / SERVICES
     */
    if (
      /\bprogram\b|\bprograms\b|\bservice\b|\bservices\b|\bstrength training\b|\bpersonal training\b|\bweight loss\b|\bcrossfit\b|\bcardio\b|\bhiit\b|\bworkout\b|\bfitness class\b/i.test(
        text
      )
    ) {
      return "service";
    }

    return "other";
  }

  /*
   * Replace ALL AI-generated <img> URLs.
   */
  html = html.replace(
    /<img\b[^>]*>/gi,
    function (
      fullMatch,
      offset,
      source
    ) {
      const srcMatch =
        fullMatch.match(
          /\bsrc\s*=\s*["']([^"']*)["']/i
        );

      if (!srcMatch) {
        return fullMatch;
      }

      const src =
        srcMatch[1];

      const lowerSrc =
        src.toLowerCase();

      /*
       * Keep local / uploaded images untouched.
       */
      if (
        lowerSrc.startsWith("data:") ||
        lowerSrc.startsWith("blob:") ||
        lowerSrc.startsWith("/") ||
        lowerSrc.startsWith("./") ||
        lowerSrc.startsWith("../")
      ) {
        return fullMatch;
      }

      const type =
        detectImageType(
          fullMatch,
          source,
          offset
        );

      let selected;

      /*
       * HERO
       */
      if (type === "hero") {
        selected = choose(
          pools?.hero,
          "hero"
        );
      }

      /*
       * ABOUT
       */
      else if (type === "about") {
        selected = choose(
          pools?.about,
          "about"
        );
      }

      /*
       * TRAINERS
       */
      else if (type === "trainer") {
        selected = choose(
          pools?.trainers,
          "trainer"
        );
      }

      /*
       * GALLERY
       */
      else if (type === "gallery") {
        selected = choose(
          pools?.gallery,
          "gallery"
        );
      }

      /*
       * PROGRAMS / SERVICES
       */
      else if (type === "service") {
        selected = choose(
          pools?.services ||
            pools?.programs ||
            pools?.gallery,
          "service"
        );
      }

      /*
       * UNKNOWN IMAGE
       *
       * Do NOT send unknown images
       * into Programs automatically.
       */
      else {
        selected =
          choose(
            pools?.gallery ||
              pools?.services ||
              pools?.programs,
            "gallery"
          );
      }

      return fullMatch.replace(
        srcMatch[0],
        `src="${selected}"`
      );
    }
  );

  /*
   * ========================================================
   * HERO SIZE FIX
   * ========================================================
   *
   * Prevent the hero from becoming a small image.
   */
  const heroCSS = `
<style id="cryvixai-hero-fix">

/* Main hero */
.hero,
.hero-section,
.hero-banner,
.masthead,
section.hero,
section.hero-section {
  min-height: 80vh !important;
  width: 100% !important;
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  justify-content: center !important;
  position: relative !important;
  overflow: hidden !important;
}

/* Hero image */
.hero img,
.hero-section img,
.hero-banner img,
.masthead img,
section.hero img,
section.hero-section img {
  width: 100% !important;
  max-width: none !important;
  min-height: 80vh !important;
  height: 80vh !important;
  object-fit: cover !important;
  display: block !important;
}

/* If hero uses background image */
.hero,
.hero-section,
.hero-banner,
.masthead {
  background-size: cover !important;
  background-position: center !important;
  background-repeat: no-repeat !important;
}

/* Hero content stays above image */
.hero > *,
.hero-section > *,
.hero-banner > *,
.masthead > * {
  position: relative;
  z-index: 2;
}

/* Mobile hero */
@media (max-width: 767px) {

  .hero,
  .hero-section,
  .hero-banner,
  .masthead,
  section.hero,
  section.hero-section {
    min-height: 75vh !important;
  }

  .hero img,
  .hero-section img,
  .hero-banner img,
  .masthead img,
  section.hero img,
  section.hero-section img {
    height: 75vh !important;
    min-height: 75vh !important;
  }
}

</style>
`;

  /*
   * Inject hero CSS once.
   */
  if (
    !html.includes(
      "cryvixai-hero-fix"
    )
  ) {
    if (
      html.includes("</head>")
    ) {
      html = html.replace(
        "</head>",
        heroCSS + "</head>"
      );
    } else {
      html =
        heroCSS + html;
    }
  }

  return html;
}


/* =========================================================
   REPAIR MISSING / INVALID IMAGES
========================================================= */

function repairMissingImages(html, businessType) {
  const pools = getPools(businessType);

  let index = 0;

  const fallbackImages = [
    ...pools.gallery,
    ...pools.services,
    ...pools.about,
    ...pools.hero,
  ];

  html = html.replace(
    /(<img\b[^>]*\bsrc\s*=\s*["'])([^"']*)(["'][^>]*>)/gi,
    function (
      fullMatch,
      start,
      src,
      end
    ) {
      const bad =
        !src ||
        src.includes("CRYVIX_IMAGE_") ||
        src.includes("undefined") ||
        src.includes("null");

      if (!bad) {
        return fullMatch;
      }

      const image =
        fallbackImages[
          index++ %
            fallbackImages.length
        ] || FALLBACK_IMAGE;

      return (
        start +
        image +
        end
      );
    }
  );

  return html;
}

/* =========================================================
   REMOVE RANDOM BACKGROUND IMAGES
========================================================= */

function cleanBackgroundImages(
  html,
  businessType
) {
  const pools =
    getPools(businessType);

  const heroImage =
    pools.hero[0] ||
    FALLBACK_IMAGE;

  /*
   * Remove AI-created background URLs.
   * This prevents restaurant images from
   * appearing in a gym website.
   */

  html = html.replace(
    /background-image\s*:\s*url\((['"]?)(.*?)\1\)\s*;?/gi,
    ""
  );

  html = html.replace(
    /background\s*:\s*([^;]*url\([^;]*\)[^;]*);?/gi,
    function (fullMatch) {
      return "";
    }
  );

  /*
   * Force hero background to correct
   * business image.
   */

  const heroCSS = `
<style id="cryvix-business-image-fix">
.hero,
.hero-section,
#hero,
[id*="hero"] {
  background-image:
    linear-gradient(
      rgba(0,0,0,.52),
      rgba(0,0,0,.52)
    ),
    url("${heroImage}") !important;

  background-size: cover !important;
  background-position: center !important;
}
</style>
`;

  if (html.includes("</head>")) {
    html = html.replace(
      "</head>",
      heroCSS + "</head>"
    );
  } else {
    html =
      heroCSS +
      html;
  }

  return html;
}

/* =========================================================
   IMAGE CSS
========================================================= */

function injectImageCSS(html) {
  const css = `
<style id="cryvix-image-fix">

img {
  max-width: 100%;
  display: block;
}

img:not(.logo) {
  object-fit: cover;
}

.hero img,
.hero-image,
.hero-media {
  width: 100%;
  max-height: 650px;
  object-fit: cover;
}

.card img,
.service-card img,
.program-card img {
  width: 100%;
  aspect-ratio: 16 / 10;
  object-fit: cover;
}

.trainer-card img,
.trainer img {
  width: 100%;
  aspect-ratio: 4 / 5;
  object-fit: cover;
}

.gallery img {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
}

@media (max-width: 767px) {

  .hero {
    min-height: 75vh !important;
  }

  .hero img,
  .hero-image {
    max-height: 420px;
  }

  .gallery img {
    aspect-ratio: 4 / 3;
  }

}

</style>
`;

  if (html.includes("</head>")) {
    html = html.replace(
      "</head>",
      css + "</head>"
    );
  } else {
    html =
      css +
      html;
  }

  return html;
}

/* =========================================================
   VALIDATION
========================================================= */

function validateHTML(value) {
  const lower =
    String(value || "").toLowerCase();

  return {
    valid:
      lower.includes("<!doctype html") &&
      lower.includes("<html") &&
      lower.includes("<head") &&
      lower.includes("<body") &&
      lower.includes("</body>") &&
      lower.includes("</html>"),

    sections:
      (lower.match(/<section\b/g) || [])
        .length,

    hasNav:
      lower.includes("<nav"),

    hasHero:
      lower.includes("hero"),

    hasFooter:
      lower.includes("<footer"),

    hasContact:
      lower.includes("contact"),

    hasFAQ:
      lower.includes("faq"),
  };
}

/* =========================================================
   MAIN GENERATOR
========================================================= */

export async function generateWebsiteAI(
  userPrompt,
  options = {}
) {
  const businessType =
    detectBusiness(userPrompt);

  console.log(
    "======================================"
  );

  console.log(
    "CRYVIXAI WEBSITE BUILDER"
  );

  console.log(
    "BUSINESS TYPE:",
    businessType
  );

  console.log(
    "======================================"
  );

  let completion;

  /* =======================================================
     FIRST AI REQUEST
  ======================================================= */

  try {
    completion =
      await groq.chat.completions.create({
        model:
          "openai/gpt-oss-20b",

        temperature:
          0.45,

        max_completion_tokens:
          Math.min(
            Number(
              options.maxCompletionTokens ||
                7000
            ),
            7000
          ),

        messages: [
          {
            role: "system",
            content:
              SYSTEM_PROMPT,
          },

          {
            role: "user",
            content:
              String(
                userPrompt || ""
              ).slice(0, 5000),
          },
        ],
      });
  } catch (error) {
    console.error(
      "CRYVIXAI GROQ ERROR:",
      error
    );

    throw error;
  }

  /* =======================================================
     GET HTML
  ======================================================= */

  let html =
    completion
      ?.choices?.[0]
      ?.message?.content || "";

  console.log(
    "AI HTML LENGTH:",
    html.length
  );

  /* =======================================================
     CLEAN MARKDOWN
  ======================================================= */

  html = html
    .replace(/```html/gi, "")
    .replace(/```/g, "")
    .trim();

  /* =======================================================
     EXTRACT HTML
  ======================================================= */

  const start =
    html.indexOf(
      "<!DOCTYPE html>"
    );

  const end =
    html.lastIndexOf(
      "</html>"
    );

  if (
    start !== -1 &&
    end !== -1 &&
    end > start
  ) {
    html =
      html.substring(
        start,
        end + 7
      );
  }

  /* =======================================================
     VALIDATION
  ======================================================= */

  let validation =
    validateHTML(html);

  console.log(
    "INITIAL VALIDATION:",
    validation
  );

  /* =======================================================
     RETRY
  ======================================================= */

  if (
    !validation.valid ||
    validation.sections < 5 ||
    !validation.hasNav ||
    !validation.hasHero ||
    !validation.hasFooter
  ) {
    console.log(
      "AI OUTPUT INCOMPLETE — RUNNING RETRY"
    );

    try {
      const retry =
        await groq.chat.completions.create({
          model:
            "openai/gpt-oss-20b",

          temperature:
            0.35,

          max_completion_tokens:
            5500,

          messages: [
            {
              role: "system",
              content: `
Return ONLY complete HTML.

Create:

Navbar
Hero
About
Services / Programs
Business-specific section
Gallery
Testimonials
FAQ
Contact
Footer

Use responsive CSS.

IMPORTANT:
Never create image URLs.

Use ONLY:

CRYVIX_IMAGE_HERO
CRYVIX_IMAGE_ABOUT

CRYVIX_IMAGE_SERVICE_1
CRYVIX_IMAGE_SERVICE_2
CRYVIX_IMAGE_SERVICE_3
CRYVIX_IMAGE_SERVICE_4

CRYVIX_IMAGE_TRAINER_1
CRYVIX_IMAGE_TRAINER_2
CRYVIX_IMAGE_TRAINER_3
CRYVIX_IMAGE_TRAINER_4

CRYVIX_IMAGE_GALLERY_1
CRYVIX_IMAGE_GALLERY_2
CRYVIX_IMAGE_GALLERY_3
CRYVIX_IMAGE_GALLERY_4
CRYVIX_IMAGE_GALLERY_5
CRYVIX_IMAGE_GALLERY_6

For gym:
Programs = workout images.
Trainers = professional trainer images.
Gallery = gym environment.
Never use restaurant or food images.

Return only HTML.
`,
            },

            {
              role: "user",
              content:
                String(
                  userPrompt || ""
                ).slice(0, 4000),
            },
          ],
        });

      let retryHTML =
        retry
          ?.choices?.[0]
          ?.message?.content || "";

      retryHTML = retryHTML
        .replace(/```html/gi, "")
        .replace(/```/g, "")
        .trim();

      const retryStart =
        retryHTML.indexOf(
          "<!DOCTYPE html>"
        );

      const retryEnd =
        retryHTML.lastIndexOf(
          "</html>"
        );

      if (
        retryStart !== -1 &&
        retryEnd !== -1 &&
        retryEnd > retryStart
      ) {
        retryHTML =
          retryHTML.substring(
            retryStart,
            retryEnd + 7
          );
      }

      const retryValidation =
        validateHTML(
          retryHTML
        );

      console.log(
        "RETRY VALIDATION:",
        retryValidation
      );

      if (
        retryValidation.valid &&
        retryValidation.sections >= 4
      ) {
        html =
          retryHTML;

        validation =
          retryValidation;
      }
    } catch (retryError) {
      console.error(
        "CRYVIXAI RETRY ERROR:",
        retryError
      );
    }
  }

  /* =======================================================
     IMAGE SYSTEM
  ======================================================= */

  console.log(
    "INJECTING BUSINESS IMAGES..."
  );

  /*
   * STEP 1
   * Replace our official placeholders.
   */

  html =
    injectImages(
      html,
      businessType
    );

  /*
   * STEP 2
   * Replace EVERY external/random AI image.
   *
   * THIS IS THE MAIN FIX.
   */

  /*
html =
  forceCorrectImages(
    html,
    businessType
  );
*/

  /*
   * STEP 3
   * Repair missing images.
   */

 /*
html =
  repairMissingImages(
    html,
    businessType
  );
*/

  /*
   * STEP 4
   * Remove random background URLs
   * and force correct hero image.
   */

  html =
    cleanBackgroundImages(
      html,
      businessType
    );

  /*
   * STEP 5
   * Image CSS.
   */

  html =
    injectImageCSS(
      html
    );

  /* =======================================================
     FINAL CLEANUP
  ======================================================= */

  html = html
    .replace(
      /source\.unsplash\.com/gi,
      ""
    )
    .trim();

  /* =======================================================
     FINAL VALIDATION
  ======================================================= */

  const finalValidation =
    validateHTML(html);

  console.log(
    "======================================"
  );

  console.log(
    "FINAL VALIDATION:",
    finalValidation
  );

  console.log(
    "FINAL HTML LENGTH:",
    html.length
  );

  console.log(
    "BUSINESS:",
    businessType
  );

  console.log(
    "IMAGE SYSTEM: ACTIVE"
  );

  console.log(
    "======================================"
  );

  return html;
}