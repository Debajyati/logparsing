A NodeJS based CLI for parsing your local Windows Update log files.

## Installation

```bash
npm install -g logparsing
```

## Usage

```bash
logparsing --help
```

## Example

```bash
logparsing path-to-your-log-file.log
```
This will output a JSON file with the parsed data in the current working directory.

If the filepath is omitted, it will default to a sample log file included in the CLI package for your reference.

## License

ISC
