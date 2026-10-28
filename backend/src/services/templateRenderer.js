export function renderTemplate(template, data) {
  let html = template;

  for (const key in data) {
    const value = data[key] ?? "";
    html = html.replaceAll(`{{${key}}}`, value);
  }

  return html;
}