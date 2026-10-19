<p align="center">
  <img src="docs/images/readme/banner.svg" alt="POWER CABLE — intelligent motorised cable training" width="100%">
</p>

<p align="center">
  A research prototype that creates programmable cable resistance and provides live workout feedback through an iOS app or a local Wi-Fi dashboard.
</p>

<p align="center">
  <img alt="ESP32-C3" src="https://img.shields.io/badge/controller-ESP32--C3-00979D?style=flat-square">
  <img alt="ODrive" src="https://img.shields.io/badge/motor_control-ODrive-4C8BF5?style=flat-square">
  <img alt="Swift" src="https://img.shields.io/badge/iOS-Swift-F05138?style=flat-square&logo=swift&logoColor=white">
  <img alt="Web" src="https://img.shields.io/badge/web-HTML%20%7C%20CSS%20%7C%20JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=111111">
</p>

<p align="center">
  <a href="#the-problem">The problem</a> ·
  <a href="#how-it-works">How it works</a> ·
  <a href="#user-interfaces">Interfaces</a> ·
  <a href="#repository-guide">Repository</a> ·
  <a href="#getting-started">Get started</a>
</p>

<p align="center">
  <img src="pictures/3dModell-PowerCable.png" alt="POWER CABLE prototype design" width="720">
</p>

<a id="the-problem"></a>
## 🎯 The problem

Traditional cable machines depend on large weight stacks. They take up space, limit portability and provide little information about movement quality. POWER CABLE explores a compact alternative in which a motor produces controllable resistance while an encoder measures cable movement.

The V2 prototype adds digital workout control, repetition tracking, cable-speed feedback and an adaptive recommendation for the following set.

<a id="how-it-works"></a>
## ⚙️ How it works

```mermaid
flowchart LR
    U[User] --> A[iOS app<br/>Bluetooth]
    U --> W[Web dashboard<br/>Local Wi-Fi]
    A <--> E[ESP32-C3]
    W <--> E
    E <--> O[ODrive]
    O <--> M[Motor + encoder]
    M <--> C[Cable mechanism]
```

1. The user calibrates the system and selects the weight, repetitions and sets.
2. The ESP32-C3 translates the workout commands into ODrive motor-control commands.
3. The motor resists the cable movement while the encoder measures position and velocity.
4. The interface displays repetitions, set time, cable speed and workout status.
5. After a set, velocity loss can be used to recommend the next-set weight.

### Main components

| Component | Role |
|---|---|
| ESP32-C3 | Coordinates the prototype and communicates with the user interfaces |
| ODrive | Controls motor current, velocity and position |
| Motor and encoder | Produce resistance and measure cable movement |
| Cable mechanism | Transfers motor resistance to the training handle |
| iOS application | Portable Bluetooth workout control and audio feedback |
| Web dashboard | Browser-based control and live visualization over local Wi-Fi |

<a id="user-interfaces"></a>
## 📱 User interfaces

<details open>
<summary><strong>iOS application — Bluetooth Low Energy</strong></summary>

The SwiftUI application connects directly to the ESP32-C3. It supports motor calibration, workout configuration, start/stop control, cable return, live repetition tracking, set timing, cable-speed feedback and spoken/audio feedback.

Source: [`V2/iOS-APP`](V2/iOS-APP)

</details>

<details>
<summary><strong>Web dashboard — local Wi-Fi</strong></summary>

The browser interface is designed to run from the ESP32 itself. The user joins the local `POWER-CABLE` Wi-Fi network and opens the dashboard without requiring an internet connection or app installation. It provides workout controls, live measurements, a speed graph and next-set feedback.

Source: [`V2/Web`](V2/Web)

</details>

<details>
<summary><strong>Firmware and safety controls</strong></summary>

The ESP32 firmware manages BLE commands, ODrive communication, calibration checks, training state, cable feedback and safe return-to-start behavior. Training is blocked until the required calibration and start-position checks pass.

Source: [`V2/Firmware`](V2/Firmware)

</details>

## ✨ Current V2 functions

- Select resistance, target repetitions and target sets
- Calibrate the motor before training
- Start and stop training from the interface
- Count repetitions and sets
- Measure cable position and velocity
- Display live speed and set time
- Return the cable to its saved start position
- Provide audio feedback in the iOS app
- Estimate velocity loss and recommend the next-set weight
- Use either Bluetooth or a local Wi-Fi interface

<a id="repository-guide"></a>
## 📁 Repository guide

```text
POWER-CABLE-V2/
├── V2/
│   ├── Firmware/       ESP32-C3 and ODrive control
│   ├── Hardware/PCB/   KiCad design and manufacturing files
│   ├── iOS-APP/        SwiftUI Bluetooth application
│   ├── Web/            Browser dashboard
│   └── Documentation/  V2 notes and supporting material
├── Machine/            Original POWER CABLE implementation
├── docs/               Reports, validation and measurements
└── pictures/           Project figures and prototype images
```

<a id="getting-started"></a>
## 🚀 Getting started

### Firmware

1. Open [`V2/Firmware/WeightLifting_ODrive_RepTracking.ino`](V2/Firmware/WeightLifting_ODrive_RepTracking.ino) in Arduino IDE.
2. Install the ESP32 board package and select **ESP32C3 Dev Module**.
3. Select the correct serial port and a partition scheme with enough application space.
4. Verify the sketch, connect the prototype and upload it to the ESP32-C3.

### iOS application

1. Open [`V2/iOS-APP/Weightlifting.xcodeproj`](V2/iOS-APP/Weightlifting.xcodeproj) in Xcode.
2. Select your Apple development team and an iPhone target.
3. Build and run the application.
4. Allow Bluetooth access, power the prototype and connect to the device.

### Web dashboard

The web source is located in [`V2/Web`](V2/Web). For the embedded version, place the current web files in the firmware sketch's `data` folder and upload the LittleFS filesystem after uploading the firmware. Then join the `POWER-CABLE` Wi-Fi network and open `http://192.168.4.1`.

> [!CAUTION]
> POWER CABLE is a supervised research prototype, not certified fitness equipment. Test with conservative current and resistance limits, keep the emergency stop accessible and never operate the motor with an unsafe cable path.

## 📊 Documentation and results

- [Project documentation](docs)
- [V2 documentation](V2/Documentation)
- [Measurements](docs/Measurements)
- [Method](docs/Method.pdf)
- [Results](docs/Results.pdf)
- [Short paper](docs/ShortPaper.pdf)

## 🧭 Limitations and next steps

- Complete long-duration testing of the motor-control and communication paths
- Improve connection recovery and status feedback in the Wi-Fi interface
- Package the electronics and cable mechanism in a safer enclosure
- Validate repetition and velocity measurements with more users and exercises
- Refine adaptive resistance using a larger training dataset

## 🙏 Acknowledgements

POWER CABLE V2 continues the original [POWER-CABLE](https://github.com/HugoPersson01/POWER-CABLE) student project. The original machine and software were developed with support from Linus Remahl, research engineer at KTH Royal Institute of Technology.

This repository contains a student research prototype developed at KTH within a technology and health project course.
