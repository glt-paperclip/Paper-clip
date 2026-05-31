# Paper Clip Frontend

Paper Clip is a static research workflow interface for the `MASTER_TRACKER` Google Sheet. It uses HTML, TailwindCSS CDN, Chart.js CDN, and vanilla JavaScript. No build tools are required.

## Pages

- `dashboard.html`: overview, charts, recent papers, and quick actions
- `search.html`: full 25-column tracker with search, filters, pagination, and export
- `month-view.html`: month selector for browsing papers filtered from `MONTH_YEAR`
- `assignee.html`: per-assignee workload cards, chart, table, and CSV export
- `analytics.html`: filterable month, assignee, workflow, and domain charts
- `index.html`: redirects to the dashboard

## Structure

```text
paper-clip/
  index.html
  dashboard.html
  month-view.html
  search.html
  assignee.html
  analytics.html
  css/styles.css
  js/api.js
  js/utils.js
  js/app.js
  js/dashboard.js
  js/month-view.js
  js/search.js
  js/assignee.js
  js/analytics.js
  assets/
```

## API

The configured Apps Script Web App URL is in `js/api.js`:

```js
const API_URL = 'https://script.google.com/macros/s/AKfycbxaRTFVJJPDwPdnWcSavK8VeZV8MX2NiDRHGccdDGWXSM0ZqDxGeug-qiT3r04-5SpE/exec';
```

Update that constant after deploying a new Apps Script Web App. The frontend expects the corrected 25-column API contract from the generated `Code.gs`.

## Local development

From the `paper-clip` directory, run:

```powershell
python -m http.server 8000
```

Then open `http://localhost:8000`.

## GitHub Pages deployment

1. Create a GitHub repository.
2. Upload the contents of this `paper-clip` folder to the repository root.
3. Open **Settings > Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select the repository branch and `/ (root)`.
6. Save and open the published Pages URL.

## Features

- Light and dark mode with `localStorage` persistence
- Five-minute cached tracker data for fast and offline-friendly rendering
- Full tracker table with empty-column visibility
- Add, edit, and delete modals
- Search, sorting-oriented filters, pagination, CSV export, and search persistence
- Dashboard, assignee, and analytics charts
- Keyboard shortcuts: `Ctrl N` adds a paper and `Ctrl K` opens search
- Formula-safe backend writes and safe outbound link handling

## Cross-origin note

Google Apps Script `ContentService` does not expose custom CORS headers. Test writes from the deployed GitHub Pages origin. If the browser blocks cross-origin writes, use the proxy or Apps Script `HtmlService` approach described in the backend deployment guide.
