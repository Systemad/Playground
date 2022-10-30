<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/systemad/playground">
  
  ![default](https://user-images.githubusercontent.com/8531546/198888113-c01b3bd4-e715-4f44-b69b-54fae0fc063f.png)

  </a>
</div>
<h3 align="center">Playground</h3>

<!-- ABOUT THE PROJECT -->
## About The Project

![quizoverview](https://user-images.githubusercontent.com/8531546/198885999-53793d79-3e73-4793-831f-4f929ce30c97.png)

Fullstack game project with single and multiplayer* games. Backend is built with .NET and Orleans with Websockets (SignalR) to provide realtime communications with the frontend, in React 18.
OBS: For now, only Quiz / Trivia is added.

### Built With

* .NET 6 - ASPNET
* Orleans
* SignalR

* React 18 with Typescript
* ChakraUI
* Redux Toolkit and Redux Toolkit Query
* Framer motion


<!-- GETTING STARTED -->
## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Prerequisites

This is an example of how to list things you need to use the software and how to install them.
1. Install latest version of Node, if any problems, use Node 18.12.0 LTS 
2. Install Yarn
3. Install latest .NET 6 SDK [here](https://dotnet.microsoft.com/en-us/download/dotnet/6.0)

### Installation

1. Setup Azure AD B2C [API](https://learn.microsoft.com/en-us/samples/azure-samples/active-directory-aspnetcore-webapp-openidconnect-v2/how-to-secure-a-web-api-built-with-aspnet-core-using-the-azure-ad-b2c/) - [React 18](https://learn.microsoft.com/en-us/azure/active-directory-b2c/configure-authentication-sample-react-spa-app)
2. Confifure Appsettings.json in API and Client/utils/auth/AuthConfig.ts accordingly with credentials above 
2. Clone the repo
   ```sh
   git clone https://github.com/systemad/playground.git
   ```
3. Install NPM packages using Yarn
   ```sh
   cd Client && yarn install
   ```

<!-- ROADMAP -->
## Roadmap

- [ ] Guess the Flag
- [ ] Wordle Survivial Challange
- [ ] Other games

Distributed under the MIT License. See `LICENSE.txt` for more information.

<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

* [LOGO Made with NameCheap](https://www.namecheap.com/logo-maker/)
* To be updated
