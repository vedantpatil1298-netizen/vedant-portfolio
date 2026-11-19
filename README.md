# Vedant Patil — Portfolio

A scroll-driven Three.js portfolio and an interactive case study of CareCircle. All runtime assets are included. The project runs offline.

## Open the portfolio

Unzip the folder and double-click **dist/index.html**. Select **Case study** to go straight to the CareCircle walkthrough.

## Edit and run

Open the extracted project folder in VS Code or Codex. With Node.js 18 or later, run:

```sh
npm run dev
```

Open the localhost address printed in the terminal. Refresh after editing. The dev server serves the source files directly and requires no package installation.

## Project layout

| Path | Responsibility |
| --- | --- |
| src/index.html | Portfolio sections, profile and navigation |
| src/projects/carecircle.html | Dedicated case study |
| src/styles/ | Responsive layouts, typography and motion fallbacks |
| src/scripts/helmet.js | Original silver-blue halftone helmet |
| src/scripts/backdrops.js | Fallback wireframe and city artwork |
| src/scripts/timeline.js | Scroll timing, navigation and chapter reveals |
| src/scripts/world.js | Three.js geometry, camera and scene clipping |
| src/scripts/approval-flow.js | Roles and state transitions for the fictional walkthrough |
| src/scripts/case-study.js | Walkthrough controls and accessible status updates |
| src/assets/vendor/ | Bundled Three.js and its license |
| tests/ | Permission-flow and internal link checks |
| dist/ | Built website, ready to open or host |

## Verify and deploy

```sh
npm test
npm run build
```

Publish the contents of dist/ to a static host. For a Git-based host, use **npm run build** as the build command and **dist** as the output directory.

## Add your next hackathon project

Create a new page in src/projects using carecircle.html as the layout reference. Replace the description, project links and walkthrough with material for that project. Link the new page from the work section in src/index.html, then run the tests and build.

CareCircle’s case study uses its [repository documentation](https://github.com/vedantpatil1298-netizen/carecircle). The walkthrough uses local fictional data and resets on reload.
