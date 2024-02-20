# Frontend - browser extension

## Firefox

### Technology
- `JS + html` - to interact with DOM and user clicks
- [WebRequest API](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest) - to intercept HTTP requests/responses (like MITM). We'll read data from request/response payload

### Files
- `manifest.json` - describes extension permissions, dependencies, versions
- `background.js` - script that runs as a background task
- `popup.html` - floating window that appears after clicking on extension icon (may contain some toggles)
- `popup.js`


## Other browsers
Not supported

# Backend

## Database - stores answers for all questions.

| question id `string` | answer (single or multiple) `int/int[]` | is_correct `bool` |
| -- | -- | -- |
| question-12345 | [3, 5] | false |
| question-12345 | [1, 3, 5] | true |
| question-12346 | 0 | true |

## Services

- `Collector` - receives user answers from browser extension and persists them in database
- `Suggester` - receives question id and returns possible answers
- `Predictor` - predicts possible answers based on multiple incorrect answers


# Interaction between backend and frontend
simple HTTP and JSON Rest API
