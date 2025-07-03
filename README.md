# Weather App

A modern, TypeScript-based weather application built with Express.js that provides current weather, forecast data, and historical weather record management using the OpenWeatherMap API.

## Features

- Get current weather by **city name / ZIP code** *or* **direct GPS coordinates** (lat & lon)
- Get 5-day weather forecast
- **CRUD operations** for weather records
- Store and retrieve historical weather data
- Flexible input: provide `location` **or** both `lat` & `lon`
- Centralized error handling with descriptive messages
- Written in modern **TypeScript** with ES-module syntax
- Environment-driven configuration (.env)
- Ready for containerisation & cloud deployment

## Prerequisites

- Node.js (v18 or later)
- npm (v9 or later) or Yarn
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
│   ├── entities/        # TypeORM entity definitions
│   ├── repositories/    # Database repositories
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

### Weather Data

#### Post Current Weather

```
POST /api/weather/current?location={city|zip}&lat={latitude}&lon={longitude}
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

#### Post Weather Forecast

```
POST /api/weather/forecast?location={city|zip}&lat={latitude}&lon={longitude}
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
    }
  ]
}
```

### Weather Records (CRUD)

#### Create Weather Records

> **Note:** This endpoint requires an OpenWeatherMap API key with access to the History API (includes historical weather data from 1979 to 4 days of forecast). Make sure your API key has the necessary subscription level to access historical weather data.



```
POST /api/records
```

**Request Body (JSON):**
```json
{
  "location": "New York",
  "startDate": "2025-07-01",
  "endDate": "2025-07-05"
}
```

**Success Response (201 Created):**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "location": "New York",
    "date": "2025-07-01",
    "temperature": 28.5,
    "description": "clear sky"
  },
  // ... more records
]
```

#### Get All Records

```
GET /api/records
```

**Success Response (200 OK):**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "location": "New York",
    "date": "2025-07-01",
    "temperature": 28.5,
    "description": "clear sky"
  },
  // ... more records
]
```

#### Get Record by ID

```
GET /api/records/{id}
```

**Success Response (200 OK):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "location": "New York",
  "date": "2025-07-01",
  "temperature": 28.5,
  "description": "clear sky"
}
```

#### Update Record

```
PUT /api/records/{id}
```

**Request Body (JSON):**
```json
{
  "temperature": 30.2,
  "description": "sunny"
}
```

**Success Response:** 204 No Content

#### Delete Record

```
DELETE /api/records/{id}
```

**Success Response:** 204 No Content

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
- `404 Not Found`: Resource not found
- `422 Unprocessable Entity`: Validation error
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

## Environment Variables

- `PORT`: Port number for the server (default: 3000)
- `NODE_ENV`: Application environment (development, test, production)
- `OPENWEATHER_API_KEY`: Your OpenWeatherMap API key
- `DB_HOST`: Database host (default: localhost)
- `DB_PORT`: Database port (default: 5432)
- `DB_USERNAME`: Database username
- `DB_PASSWORD`: Database password
- `DB_NAME`: Database name

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

## 3. Running the App

1. **Compile TypeScript** (if using TS):

   ```bash
   npm run build
   ```
2. **Start the server**:

   ```bash
   npm start
   ```
3. **Access** the app at `http://localhost:${PORT}/weather?location=London`

---

## 4. Demo and Postman Collection

### 📽️ Demo

A comprehensive demonstration video is available, showcasing the application's core CRUD (Create, Read, Update, Delete) functionalities.

#### 🎬 What's in the Demo

- **Current Weather** - Real-time weather conditions
- **Forecast Data** - Upcoming weather predictions
- **Record Management** - Weather record management (CRUD operations)

#### 📺 How to Watch

**Option 1: Stream Online**
▶️ [Watch on Google Drive](https://drive.google.com/file/d/1yztdiUAXhYbFR3GzpJWi6IeE0oFXuYiM/view?usp=sharing)

**Option 2: Download Local Copy**
1. Download `demo.mp4` from the repository
2. Open with any video player
3. Enjoy the demonstration!

---

### 📦 Postman Collection

A Postman collection is available in the `WeatherApp.postman_collection.json` file. This collection includes all the endpoints for the application, making it easy to test and explore the API.

To import the collection into Postman:
1. Open Postman
2. Click on the "Import" button
3. Select the `WeatherApp.postman_collection.json` file
4. Import the collection

## License

This project is licensed under the **MIT License**.

