# Smart Farming India

This is the main repository for the Smart Farming India platform.

## Project Structure

This project follows an organized structure similar to enterprise-grade web applications.

- `/backend` - Express.js Node backend (API server)
- `/frontend` - Vite React Frontend application
  - `/src/assets` - Static assets like images and SVG
  - `/src/components` - Reusable UI components
    - `/ui` - Generic, base-level UI components (buttons, inputs)
    - `/shared` - Shared complex components across features
  - `/src/context` - React Context providers for global state
  - `/src/hooks` - Custom React hooks
  - `/src/layouts` - Page layout wrappers
  - `/src/pages` - Top-level page components (views)
  - `/src/services` - API integration and external service logic
  - `/src/types` - TypeScript interfaces and types
  - `/src/utils` - Utility and helper functions
  - `/src/constants` - Constants and configuration values
  - `/src/lib` - Library integrations and configurations (e.g., axios config, third-party setup)
- `/docs` - Project documentation
- `/scripts` - Automation and utility scripts for the project
- `/__tests__` - Unit and integration tests
- `/e2e` - End-to-end tests

## Getting Started

Please refer to the backend and frontend respective README files or setup scripts for instructions on running the development environment.

- To start the backend, see `/backend/README.md`.
- To start the frontend, use standard Vite commands from the root or frontend directory if separated.
