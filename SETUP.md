# Setting up all the required stuff to create a React+TypeScript+Bootstrap app

1. Install Visual Studio Code with the following extensions:
   - `Debugger for Chrome`
   - `ESLint`
   - `TSLint`

2. Install NodeJS with the following components:
   - `npm install -g tsc`
   - `npm install -g tslint typescript`
   - `npm install -g eslint`

3. Run: `npx create-react-app demo-app --typescript` to create the base code.

4. Switch to the newly created app folder.

5. Initialize linters:
   - `eslint --init` (EcmaScript linter)
   - `tslint --init` (TypeScript linter)

7. Run: `npm install --save react-dom`. No idea about its usefulness at the moment.

8. To install Bootstrap 4 and the React bridge, run:
   - `npm install --save reactstrap`
   - `npm install --save @types/reactstrap` (TypeScript definitions)
 
9. To build single page apps, install the following components:
    - `npm install --save react-router-dom`
    - `npm install --save @types/react-router-dom` (TypeScript definitions)

12. To install Font-Awesome (Bootstrap 4 does not include glyph icons):
    - `npm install --save @fortawesome/fontawesome-free`
    - `npm install --save @fortawesome/fontawesome-svg-core`
    - `npm install --save @fortawesome/free-solid-svg-icons`
