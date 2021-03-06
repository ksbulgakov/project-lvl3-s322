# project-lvl3-s322

[![Build Status](https://travis-ci.com/ksbulgakov/project-lvl3-s322.svg?branch=master)](https://travis-ci.com/ksbulgakov/project-lvl3-s322)

[![Maintainability](https://api.codeclimate.com/v1/badges/3668c147846a108ada03/maintainability)](https://codeclimate.com/github/ksbulgakov/project-lvl3-s322/maintainability)

[![Test Coverage](https://api.codeclimate.com/v1/badges/3668c147846a108ada03/test_coverage)](https://codeclimate.com/github/ksbulgakov/project-lvl3-s322/test_coverage)

## Setup

```sh
 npm install page-loader-kobu -g
```

## Description

Educational project based on TDD principles.

page-loader is command-line interface application which loads page content from a given web address.

### Interface

```sh
foo@bar:~$ page-loader --output <directory> <link>
```

### Example

```sh
page-loader --output /temp https://hexlet.io/courses
```

In this case page-loader will save data from <https://hexlet.io/courses> page into /tmp/hexlet-io-courses.html file.

### Asciinema

With logs
<https://asciinema.org/a/B0innkHbmWJsXzprOzk9xIuAm>

With work (4 - 5th step)
<https://asciinema.org/a/DDMLYm16xJyNdD31Mhfp6rTeN>