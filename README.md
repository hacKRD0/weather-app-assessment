# Weather App

A modern, TypeScript-based weather application built with Express.js that provides current weather and forecast data using the OpenWeatherMap API.

## Features

- Get current weather by **city name / ZIP code** *or* **direct GPS coordinates** (lat & lon)
- Get 5-day weather forecast
- Flexible input: provide `location` **or** both `lat` & `lon`
- Centralized error handling with descriptive messages
- Written in modern **TypeScript** with ES-module syntax
- Environment-driven configuration (.env)
- Ready for containerisation & cloud deployment

## Prerequisites

- Node.js (v14 or later)
- npm (v7 or later) or Yarn
- OpenWeatherMap API key (get one [here](https://openweathermap.org/api))

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/weather-app.git
   cd weather-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Copy `.env.example` to `.env`
   - Add your OpenWeatherMap API key:
     ```
     OPENWEATHER_API_KEY=your_api_key_here
     PORT=3000
     NODE_ENV=development
     ```

## Project Structure

```
weather-app/
├── src/
│   ├── config/          # Configuration and constants
│   ├── controllers/     # Request handlers
│   ├── services/        # Business logic and external API calls
│   ├── routes/          # Route definitions
│   ├── utils/           # Helper functions and validators
│   ├── tests/           # Test files
│   └── app.ts           # Express application setup
├── .env                 # Environment variables
├── .gitignore
├── jest.config.js       # Jest configuration
├── package.json
├── README.md
└── tsconfig.json       # TypeScript configuration
```

## API Endpoints

### Get Current Weather

```
GET /api/weather/current?location={city|zip}&lat={latitude}&lon={longitude}
```

**Parameters:**
- Provide **either** `location` (city or ZIP) **OR** both `lat` & `lon`.
  - Examples:
    - `/api/weather/current?location=London`
    - `/api/weather/current?lat=51.5074&lon=-0.1278`

**Success Response:**
```json
{
  "success": true,
  "data": {
    "temp": 20,
    "feels_like": 19,
    "temp_min": 18,
    "temp_max": 22,
    "pressure": 1012,
    "humidity": 70,
    "description": "clear sky",
    "icon": "01d",
    "city": "London",
    "country": "GB"
  }
}
```

### Get Weather Forecast

```
GET /api/weather/forecast?location={city|zip}&lat={latitude}&lon={longitude}
```

**Parameters:**
- Provide **either** `location` (city or ZIP) **OR** both `lat` & `lon`.
  - Examples:
    - `/api/weather/current?location=London`
    - `/api/weather/current?lat=51.5074&lon=-0.1278`

**Success Response:**
```json
{
  "success": true,
  "data": [
    {
      "temp": 20,
      "feels_like": 19,
      "temp_min": 18,
      "temp_max": 22,
      "pressure": 1012,
      "humidity": 70,
      "description": "clear sky",
      "icon": "01d",
      "city": "London",
      "country": "GB",
      "dt": 1620000000
    },
    // ... more forecast items
  ]
}
```

## Running the Application

### Development Mode

```bash
npm run dev
```

This will start the development server with hot-reload enabled.

### Production Mode

```bash
npm run build
npm start
```











## Error Handling

The API returns appropriate HTTP status codes along with error messages in the following format:

```json
{
  "success": false,
  "error": "Error message here"
}
```

### Common Error Status Codes

- `400 Bad Request`: Invalid or missing parameters
- `401 Unauthorized`: Missing or invalid API key
- `404 Not Found`: Location not found
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

## Environment Variables

- `PORT`: Port number for the server (default: 3000)
- `NODE_ENV`: Application environment (development, test, production)
- `OPENWEATHER_API_KEY`: Your OpenWeatherMap API key

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [OpenWeatherMap](https://openweathermap.org/) for the weather data API
- [Express.js](https://expressjs.com/) for the web framework
- [TypeScript](https://www.typescriptlang.org/) for type safety
- [Jest](https://jestjs.io/) for testing

   ```bash
   git clone https://github.com/your-username/weather-app.git
   cd weather-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

---

## 2. Configuration

1. **Obtain an OpenWeatherMap API key** by signing up at [https://openweathermap.org/api](https://openweathermap.org/api) ([openweathermap.org][5]).
2. **Create a `.env` file** in the project root:

   ```dotenv
   OPENWEATHER_API_KEY=your_api_key_here
   PORT=3000
   ```
3. **Load environment variables** at startup by using [dotenv](https://www.npmjs.com/package/dotenv), which populates `process.env` securely ([npmjs.com][6]).

---

## 3. Project Structure

Follow a modular layout to keep growth manageable:

```
weather-app/
├── src/
│   ├── controllers/      # Route handlers (Express controllers)
│   ├── services/         # Business logic (e.g., OpenWeather API calls)
│   ├── routes/           # Express route definitions
│   ├── utils/            # Utility functions (e.g., input validation)
│   ├── config/           # Configuration loaders (dotenv, constants)
│   └── app.ts            # Express app initialization
├── tests/                # Jest & SuperTest test suites
├── .env                  # Environment variables (not committed)
├── package.json
└── tsconfig.json
```

This separation of concerns follows **best practices for Express** projects, improving clarity and scalability ([dev.to][2]) and aligns with a **3-layer architecture** that isolates business logic from routing ([softwareontheroad.com][7]).

---

## 4. Running the App

1. **Compile TypeScript** (if using TS):

   ```bash
   npm run build
   ```
2. **Start the server**:

   ```bash
   npm start
   ```
3. **Access** the app at `http://localhost:${PORT}/weather?location=Seattle`

---

## 5. Testing

We use **Jest** and **SuperTest** to verify all HTTP endpoints and input-handling logic:

1. **Install dev dependencies**:

   ```bash
   npm install --save-dev jest ts-jest supertest @types/jest @types/supertest
   ```
2. **Configure Jest** in `jest.config.js`:

   ```js
   module.exports = {
     preset: 'ts-jest',
     testEnvironment: 'node',
     testMatch: ['**/tests/**/*.spec.ts']
   };
   ```
3. **Write tests** (e.g., `tests/weather.spec.ts`) to assert:

   * **400** responses for invalid inputs
   * **200** responses with correct JSON schema for valid cities, ZIP codes, and GPS coords
   * Proper error messages on API failures
4. **Run tests**:

   ```bash
   npm test
   ```

Using this approach ensures **complete coverage** of required behaviors for Tech Assessment 1 ([medium.com][4]) and leverages patterns from “Mastering API Testing” ([dennisokeeffe.com][8]).

---

## 6. Extending for Technical Assessment 2

To prepare for CRUD functionality and additional integrations:

1. **Introduce a data-access layer** in `src/repositories/` to interact with SQL/noSQL databases.
2. **Design controllers** to call repository methods for **CREATE**, **READ**, **UPDATE**, and **DELETE**, validating inputs per robust **CRUD API principles** ([forestadmin.com][9]).
3. **Implement standard REST patterns**—use plural nouns, JSON responses, consistent error codes, and versioning support ([stackoverflow.blog][10]).
4. **Add optional modules** under `src/services/` for:

   * YouTube data fetching
   * Google Maps geocoding
   * Data export to CSV/JSON/PDF

This scaffolding ensures a smooth transition into Tech Assessment 2’s persistence and integration requirements.

---

## 7. Contributing

Contributions are welcome! Please:

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/XYZ`)
3. Commit your changes (`git commit -m 'Add XYZ'`)
4. Push to the branch (`git push origin feature/XYZ`)
5. Open a pull request

---

## License

This project is licensed under the **MIT License**.

[1]: https://openweathermap.org/price?utm_source=chatgpt.com "Pricing - OpenWeatherMap"
[2]: https://dev.to/moibra/best-practices-for-structuring-an-expressjs-project-148i?utm_source=chatgpt.com "Best Practices for Structuring an Express.js Project - DEV Community"
[3]: https://stackoverflow.com/questions/26973484/how-do-i-setup-the-dotenv-file-in-node-js?utm_source=chatgpt.com "How do I setup the dotenv file in Node.js? - Stack Overflow"
[4]: https://medium.com/%40it.ermias.asmare/node-js-express-with-jest-and-supertest-e58aaf4c4514?utm_source=chatgpt.com "Node.js Express testing with Jest and SuperTest | by Ermias Asmare"
[5]: https://openweathermap.org/api?utm_source=chatgpt.com "Weather API - OpenWeatherMap"
[6]: https://www.npmjs.com/package/dotenv?utm_source=chatgpt.com "dotenv - NPM"
[7]: https://softwareontheroad.com/ideal-nodejs-project-structure/?utm_source=chatgpt.com "Bulletproof node.js project architecture 🛡️ - Software on the Road"
[8]: https://www.dennisokeeffe.com/blog/2023-10-27-testing-express-apps-with-jest-and-supertest?utm_source=chatgpt.com "Mastering API Testing with Supertest, Express.js, and Jest"
[9]: https://www.forestadmin.com/blog/an-experts-guide-to-crud-apis-designing-a-robust-one/?utm_source=chatgpt.com "An expert's guide to CRUD APIs: designing a robust one"
[10]: https://stackoverflow.blog/2020/03/02/best-practices-for-rest-api-design/?utm_source=chatgpt.com "Best practices for REST API design - The Stack Overflow Blog"
