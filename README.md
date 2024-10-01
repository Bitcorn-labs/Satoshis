dragonwizards.club
DRAGON PALADIN WIZARD SOCIETY -- DKP DPW
                                                            ,   .
           `.                                               `. ,;
            Y.                                   ,oo8""      :oo
             8.                                ,d88"         :88
             `8.                         ,o. ,o88P          ,dP
              :8                      ,d888P,8888 ,od8ooood8"'
   `.          Y8.            ,-..,o888P"Y88888P8P"'  `""'
    `b.         Y8.          (  `Y88888b.d888888o.   ,
     `Yb.        Y8.           ,""88888888888888888P"       ,-
       "8bo       Y8o         ( :8888888888888""           db    ,-
         Y88o      Y8b.         `888888"""YP'             888' :88;
          `"88o.   ,Y88o        :88888'                   Y8P ,d8"'
             "88b. `8d88b.      :88888                    :8 ,88;  ,
`"oo.          "888.`88888o     :8888b                    d8b88P,od88"'
   `"888oo.      `Y888888888.    88888b                  ,888888888P'
       `Y88888boo'Y8888888888.   `888888b.              ,888888"'
          `"Y8888888888888888'    `88888888b.          d8888P'
              `"Y8888888888P'     ,d88o8888888.      .88888'
               "Y888888888'      d888888888888Y;   ,888P':P
                 ;88888888b.    d888888888888b   ,d88P'  8;
            ,ood888888888888o.,d8888888888888o ,d888"   ,88
         ,`"""""' ,8888888888888888Y"8P8d888888'888'    Y8"
        (        o888888888888888P:d888888888888'P'      `-
               ,d888Y88888888888P :Y8888888888888.
             ,o88P",8":P"8Y8P8P ,oY88888888888888b
           ,o88" ,d" `' ` YP  ,8P8888888888888888'         ,-
          (     `'        ,d88Y8888888888888888888.     :8o.
                       ,oo8P8d888888888888888888888.    88' ,o,-
                    ,:d8P88888888888888888888Y8888Y8b  d8'o888P
                   ,88Pb888888888888888888888d8;"8 Y88o88d88""
                 ,d8P888888888888888888Y88888;8     `Y8888'  ,o,-
                :88`8888888888888888o8bd8888P        ,88888888PY
               ,88`8888888888888888888888P"         d8"     ""
               Y8b88888888"88888888P"""'          ,d8P
               o8d888888Pb888""'                 :888'
              `8;888888b88P"          ,ooo88bo.  `:;
   -hrr-       o888888b88'          o8888888888b.  `-
              "8d88888d8'        ,o888888"Y888"8b
               :88888b88       o'88888Pbd888888.8;
               8;88888'88oooo8"b8888"o8P"""Y8888:;
               `8'88888dP""Ybd8888P88"      `888d
               `88'8888888888888Pb"'         88`P
                `88dY888888888Pb'           d88d'
                  `88bd8"""YoP"          ,d888P
                   `88888888'    ,oooo888888"'
                              ,o888888P"""
                             d88P""
                            :88'
                            88;
                            Y8b
                             "88o     )
                               `Ybo:-'


# Vite + React + Motoko

### Get started directly in your browser:

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/rvanasa/vite-react-motoko)

This template gives you everything you need to build a full-stack Web3 application on the [Internet Computer](https://internetcomputer.org/).

For an example of a real-world dapp built using this starter project, check out the [source code](https://github.com/dfinity/feedback) for DFINITY's [Developer Experience Feedback Board](https://dx.internetcomputer.org/).

## 📦 Create a New Project

Make sure that [Node.js](https://nodejs.org/en/) `>= 16` and [`dfx`](https://internetcomputer.org/docs/current/developer-docs/build/install-upgrade-remove) `>= 0.14` are installed on your system.

Run the following commands in a new, empty project directory:

```sh
npx degit rvanasa/vite-react-motoko # Download this starter project
dfx start --clean --background # Run dfx in the background
npm run setup # Install packages, deploy canisters, and generate type bindings

npm start # Start the development server
```

When ready, run `dfx deploy --network ic` to deploy your application to the Internet Computer.

## 🛠️ Technology Stack

- [Vite](https://vitejs.dev/): high-performance tooling for front-end web development
- [React](https://reactjs.org/): a component-based UI library
- [TypeScript](https://www.typescriptlang.org/): JavaScript extended with syntax for types
- [Sass](https://sass-lang.com/): an extended syntax for CSS stylesheets
- [Prettier](https://prettier.io/): code formatting for a wide range of supported languages
- [Motoko](https://github.com/dfinity/motoko#readme): a safe and simple programming language for the Internet Computer
- [Mops](https://mops.one): an on-chain community package manager for Motoko
- [mo-dev](https://github.com/dfinity/motoko-dev-server#readme): a live reload development server for Motoko
- [@ic-reactor](https://github.com/B3Pay/ic-reactor): A suite of JavaScript libraries for seamless frontend development on the Internet Computer

## 📚 Documentation

- [Vite developer docs](https://vitejs.dev/guide/)
- [React quick start guide](https://react.dev/learn)
- [Internet Computer docs](https://internetcomputer.org/docs/current/developer-docs/ic-overview)
- [`dfx.json` reference schema](https://internetcomputer.org/docs/current/references/dfx-json-reference/)
- [Motoko developer docs](https://internetcomputer.org/docs/current/developer-docs/build/cdks/motoko-dfinity/motoko/)
- [Mops usage instructions](https://j4mwm-bqaaa-aaaam-qajbq-cai.ic0.app/#/docs/install)
- [@ic-reactor/react](https://b3pay.github.io/ic-reactor/modules/react.html)

## 💡 Tips and Tricks

- Customize your project's code style by editing the `.prettierrc` file and then running `npm run format`.
- Reduce the latency of update calls by passing the `--emulator` flag to `dfx start`.
- Install a Motoko package by running `npx ic-mops add <package-name>`. Here is a [list of available packages](https://mops.one/).
- Split your frontend and backend console output by running `npm run frontend` and `npm run backend` in separate terminals.
