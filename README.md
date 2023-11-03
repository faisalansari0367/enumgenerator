


# Enum Extensions Generator for Dart (VSCode Extension)

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Extension Settings](#extension-settings)
- [Contributing](#contributing)
- [License](#license)

## Introduction
The "Enum Extensions Generator for Dart" is a Visual Studio Code (VSCode) extension designed to streamline the process of generating enum extensions in Dart. With this extension, you can quickly create extensions for your Dart enums, making your code more readable and maintainable. This extension simplifies the generation of enum extensions, saving you time and effort.

## Features
- Automatically generate enum extensions from your Dart enums.
- Provides support for customizing the generated extension code.
- Improve code readability by easily accessing enum values.
- Enhance code maintainability with clear and concise extensions.

## Installation
You can install this extension from the Visual Studio Code Marketplace by following these steps:
1. Open Visual Studio Code.
2. Go to the Extensions view by clicking on the square icon on the sidebar or pressing `Ctrl+Shift+X`.
3. Search for "Enum Extensions Generator for Dart" in the search bar.
4. Click "Install" to install the extension.
5. After installation, the extension will be available for use.

## Usage
1. Open a Dart file containing an enum.
2. Place the cursor within the enum you want to generate extensions for.
3. Right-click inside the enum or use the command palette to access the extension's commands.
4. Choose the "Generate Enum Extensions" command.
5. The extension will generate the appropriate extensions for your enum, based on the naming convention used in Dart.

**Example:**

Given the following enum:
```dart
enum Status {
  none,
  hello,
  success,
}
```

Running the extension will generate the following code:
```dart
extension StatusExt on Status {
  bool get isNone => this == Status.none;
  bool get isHello => this == Status.hello;
  bool get isSuccess => this == Status.success;
}
```


## Contributing
Contributions to this extension are welcome. If you have ideas for new features or improvements, please open an issue or create a pull request on the [GitHub repository](https://github.com/faisalansari0367/enumgenerator).

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

**Enjoy using the "Enum Extensions Generator for Dart" extension!** If you find it useful, please consider giving it a star on [GitHub](https://github.com/faisalansari0367/enumgenerator). If you encounter any issues or have suggestions for improvements, feel free to open an issue. Happy coding!
