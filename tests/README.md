# Callsight Testing

Using [Robot Framework](https://docs.robotframework.org/)

## Installation

```bash
uv pip install -r requirements.txt
uv run rfbrowser init
```

## Resources

- [How to create the file structure](https://docs.robotframework.org/docs/examples/project_structure#resources)
- [Libraries available](https://docs.robotframework.org/docs/different_libraries/how_to_find_library)
- [Intro to structure of testcases](https://docs.robotframework.org/docs/getting_started/how_to_write_rf)

## Intro

- **Resources** are files where we define common keywords, variables, setup, helpers, etc. Resources are imported using the `Resource` keyword, along with the path of the given resource.
- **Keywords** are like functions. They can be user defined and later be called as such. We use them to define the behavior of our scripts, like importing resources or libraries, or funning testcases.
- **Libraries** are like python modules that we import and use in our `.robot` scripts, like (using keywords, etc.). There's many built-in ones, like Selenium or Browser. When defining a custom one, we define a `MyLibrary` class inside a `MyLibrary.py` and define class methods. [More info here](https://docs.robotframework.org/docs/extending_robot_framework/custom-libraries/python_library).
- **Reports** are user interfaces to explore the result of the tests. They can automatically be generated after running the tests as a static website.
