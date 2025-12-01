# webpack-template

- webpack template files with configuration and node modules prepared.
- ESLint and Prettier also installed and configured.
- Jest testing framework installed and configured.

## Getting Started

1. Run `npm install` to install all dependencies.
2. Start the development server with `npm run dev`.
3. Open your browser and navigate to the designated web address noted toward the top of the webpack serve dialog output in the terminal, e.g. `[webpack-dev-server] Loopback: http://localhost:8080/`.
4. After verifying the default webpack template page loads, you can delete the webpack test file `greeting.js` and clear the webpack test code from `style.css` and `index.js` (note: do not delete `import "./style.css";` in `index.js`, it is required for full webpack functionality).
5. To test Jest, stop your dev server with `Ctrl + C` or open a second terminal in the same project directory. Run `npm test` to confirm everything works, then delete the `sum.js` and `sum.test.js` files.

## Available Scripts

This template is set up to run webpack via scripts located in package.json.

### To run webpack:

Enter `npm run + script name` (`build`, `dev`, `deploy`) -- example `npm run dev`

`npm run build` is equivalent to running `npx webpack`,
`npm run dev` is equivalent to running `npx webpack serve`, and
`npm run deploy` runs `git subtree push --prefix dist origin gh-pages` which is the final step in the webpack deployment process.

### To run ESLint:

Enter `npx eslint yourfile.js` on any file or directory via the command line.

### To run Prettier:

Enter `npx prettier --write .` to format the entire project, or
`npx prettier --write app/` to format a certain directory, or
`npx prettier --write app/components/Button.js` to format a certain file.

### To run Jest tests:

Enter `npm test` to run all tests via the `package.json` script, or
`jest yourtestfile.test.js` to run a specific test file and can also pass flags and arguments on-the-fly without modifying `package.json`.

## Create a Production Build

1. After testing your application in development mode, stop the development server by pressing `Ctrl + C` in the terminal.
2. To create a production build, run `npm run build`.

## Deployment to GitHub Pages

1. To create and deploy a production build to GitHub Pages, run the following code in sequence:

- `git branch gh-pages`
- ensure everything is git committed on main, then continue
- `git checkout gh-pages && git merge main --no-edit`
- `npm run build`
- `git add dist -f && git commit -m "ops: deployment commit"`
- `npm run deploy`
