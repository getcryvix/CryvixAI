import { hotelTemplate } from "../templates/hotelTemplate.js";
import { gymTemplate } from "../templates/gymTemplate.js";
import { restaurantTemplate } from "../templates/restaurantTemplate.js";
import { businessTemplate } from "../templates/businessTemplate.js";
import { portfolioTemplate } from "../templates/portfolioTemplate.js";

export function selectTemplate(prompt) {
  const text = prompt.toLowerCase();

  if (
    text.includes("hotel") ||
    text.includes("resort") ||
    text.includes("villa")
  ) {
    return hotelTemplate;
  }

  if (
    text.includes("gym") ||
    text.includes("fitness")
  ) {
    return gymTemplate;
  }

  if (
    text.includes("restaurant") ||
    text.includes("cafe") ||
    text.includes("food")
  ) {
    return restaurantTemplate;
  }

  if (
    text.includes("portfolio") ||
    text.includes("developer") ||
    text.includes("designer")
  ) {
    return portfolioTemplate;
  }

  return businessTemplate;
}