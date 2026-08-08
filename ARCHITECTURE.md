# Architecture

## Notes
* Keep UI components separate from API communication
* Handle API communication in services/
* Keep API models in interfaces/ and shared union types in types/
* Use an environment variable for the API URL
* Use native fetch for API requests rather than adding another dependency
* Keep the architecture lightweight for the scope of the application
