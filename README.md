
# Foxglove Extension with OpenBridge Components

Foxglove panel for maritime navigation with OpenBridge components.

## Instruments

- Azimuth Thruster
- Main Engine
- Compass

## Features

- Subscribe to ROS Topics
- Demo Mode
- Select Theme (Day, Dusk, Night, Bright)
- Change Size of Instruments

**Azimuth Thruster:**

- Select State (In Command, Active, Loading, Off)
- Change Angle Unit (Degrees/Radians)
- Toggle Single Direction
- Select Top/Bottom Propeller (None, Cap, Single)
- Customize Angle/Thrust Advices (JSON)

**Main Engine**

- Select State (In Command, Active, Loading, Off)

**Compass**

- Toggle Show Direction
## Clone the project

```bash
git clone git@github.com:kano2710/Lemovs-Task.git
```

Go to the project directory

```bash
cd Lemovs-Task
```

## Prerequisites

- Node.js
- npm
- Foxglove Studio

## Run Locally

Install dependencies

```bash
npm install
```

Build for Foxglove Studio and Add to Panels

```bash
npm run local-install
```

Open Foxglove Studio App and Look for **OpenBridge [local]** at Panels.

## Package and Add Extension to Foxglove Studio

Install dependencies

```bash
npm install
```

Package Extension

```bash
npm run package
```

**_NOTE:_**  Packaged Extension could be found under /packages folder.

Open Foxglove Studio and install extention. The extention will be avaiable to use at panels.

## Version History

[Changelog](./CHANGELOG.md)

## Demo

[Demo Video](https://drive.google.com/file/d/1iNSA32WYxhYrqkULtYmPDte-GmvAhDFp/view?usp=sharing)

## Authors

[@kano2710](https://github.com/kano2710)

## Links

[![portfolio](https://img.shields.io/badge/my_portfolio-000?style=for-the-badge&logo=ko-fi&logoColor=white)](https://dhameliya.com/)
[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/dharamdhameliya/)
