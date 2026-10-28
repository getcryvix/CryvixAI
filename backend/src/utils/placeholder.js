export function replacePlaceholders(template, data) {

let html = template;

for (const key in data) {

html = html.replaceAll(
`{{${key}}}`,
data[key] || ""
);

}

return html;

}