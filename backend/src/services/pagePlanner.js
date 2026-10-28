export function getWebsitePages(prompt) {

  const text = prompt.toLowerCase();

  if (text.includes("restaurant")) {
    return [
      "Home",
      "About",
      "Menu",
      "Gallery",
      "Contact",
    ];
  }

  if (text.includes("hospital")) {
    return [
      "Home",
      "About",
      "Services",
      "Doctors",
      "Appointment",
      "Contact",
    ];
  }

  if (text.includes("gym")) {
    return [
      "Home",
      "Programs",
      "Trainers",
      "Pricing",
      "Contact",
    ];
  }

  return [
    "Home",
    "About",
    "Services",
    "Contact",
  ];
}