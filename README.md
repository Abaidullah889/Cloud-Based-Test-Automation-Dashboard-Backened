# Test Automation Dashboard Backend

A cloud-based test automation dashboard backend built with Node.js, Express, and TypeScript. This system allows you to execute test scripts (Python/Bash) and track their results through a RESTful API.

## 🚀 Features

- **Test Execution**: Run Python and Bash test scripts from the `tests/` folder
- **Result Storage**: Store test results in-memory and optionally in JSON files
- **RESTful API**: Comprehensive API for test execution and result retrieval
- **TypeScript**: Full TypeScript support with proper typing
- **CORS Support**: Cross-origin resource sharing for frontend integration
- **Error Handling**: Robust error handling and logging
- **Pagination**: Support for paginated result retrieval

## 📁 Project Structure

```
├── src/
│   ├── types/           # TypeScript interfaces and types
│   ├── utils/           # Utility functions (file operations, test execution)
│   ├── services/        # Business logic services
│   ├── controllers/     # Route controllers
│   ├── routes/          # Express route definitions
│   └── server.ts        # Main server file
├── tests/               # Test scripts (Python/Bash)
├── dist/                # Compiled JavaScript (generated)
├── package.json
├── tsconfig.json
├── nodemon.json
└── README.md
```

## 🛠️ Installation

1. **Clone the repository**
2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create environment file** (optional):
   ```bash
   PORT=3000
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:3000
   RESULTS_FILE_PATH=./results.json
   ```

## 🎯 Usage

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

### Available Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run clean` - Clean build directory
- `npm test` - Run tests

## 📡 API Endpoints

### Base URL: `http://localhost:3000/api`

#### 1. Execute Test
```http
POST /api/run-tests
Content-Type: application/json

{
  "testName": "test_cpu_usage.py",
  "scriptType": "python"  // optional: python, bash, shell
}
```

**Response:**
```json
{
  "success": true,
  "result": {
    "id": "uuid-here",
    "testName": "test_cpu_usage.py",
    "status": "PASS",
    "timestamp": "2024-01-01T12:00:00.000Z",
    "output": "CPU usage: 45%\nPASS\nCPU usage is within acceptable range",
    "errorOutput": null,
    "duration": 1234,
    "scriptType": "python"
  }
}
```

#### 2. Get All Results
```http
GET /api/results?limit=10&offset=0
```

**Response:**
```json
{
  "success": true,
  "results": [...],
  "total": 25
}
```

#### 3. Get Result by ID
```http
GET /api/results/{result-id}
```

#### 4. Get Results by Test Name
```http
GET /api/results/test/{test-name}
```

#### 5. Get Available Tests
```http
GET /api/tests
```

**Response:**
```json
{
  "success": true,
  "tests": [
    "test_cpu_usage.py",
    "test_memory_check.py", 
    "test_network_connectivity.sh",
    "test_always_fail.py"
  ]
}
```

#### 6. Clear All Results
```http
DELETE /api/results
```

#### 7. Health Check
```http
GET /health
```

## 🧪 Test Scripts

The system includes sample test scripts in the `tests/` folder:

### Python Tests
- `test_cpu_usage.py` - Mock CPU usage monitoring
- `test_memory_check.py` - Mock memory usage checking  
- `test_always_fail.py` - Always fails (for error testing)

### Bash Tests
- `test_network_connectivity.sh` - Mock network connectivity test

### Creating Custom Tests

#### Python Test Template
```python
#!/usr/bin/env python3
import time

def your_test():
    # Your test logic here
    time.sleep(1)  # Simulate work
    
    if condition_met:
        print("PASS")
        print("Test completed successfully")
        return True
    else:
        print("FAIL")
        print("Test failed with error")
        return False

if __name__ == "__main__":
    success = your_test()
    exit(0 if success else 1)
```

#### Bash Test Template
```bash
#!/bin/bash
echo "Running test..."

# Your test logic here
if [ condition ]; then
    echo "PASS"
    echo "Test completed successfully"
    exit 0
else
    echo "FAIL"  
    echo "Test failed"
    exit 1
fi
```

## 📊 Test Result Format

```typescript
interface TestResult {
  id: string;              // Unique identifier
  testName: string;        // Name of the test file
  status: 'PASS' | 'FAIL' | 'ERROR' | 'RUNNING';
  timestamp: Date;         // When the test was executed
  output: string;          // stdout from the test (truncated if long)
  errorOutput?: string;    // stderr from the test (if any)
  duration: number;        // Execution time in milliseconds
  scriptType: 'python' | 'bash' | 'shell';
}
```

## 🔧 Configuration

The application can be configured using environment variables:

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment mode (development/production)
- `CORS_ORIGIN` - Allowed CORS origin (default: *)
- `RESULTS_FILE_PATH` - Path to results JSON file (default: ./results.json)

## 🛡️ Error Handling

The system includes comprehensive error handling:

- **Test Execution Timeouts** - 5-minute timeout for long-running tests
- **File Not Found** - Proper handling when test files don't exist
- **Process Errors** - Graceful handling of script execution failures
- **API Errors** - Consistent error response format

## 🚦 Status Determination

Test status is determined by:

1. **Exit Code**: Non-zero exit codes indicate failure
2. **Output Keywords**: Looking for "PASS" or "FAIL" in stdout
3. **Error Output**: Presence of stderr content indicates failure
4. **Default**: Zero exit code with no errors defaults to PASS

## 🔗 CORS Configuration

CORS is configured to allow frontend integration:

```javascript
{
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}
```

## 📝 Development Notes

- Results are stored both in-memory and in `results.json`
- Test output is truncated to 1000 characters for performance
- Scripts must be executable and located in the `tests/` folder
- The system supports both Python and Bash script execution
- All timestamps are stored as ISO strings for JSON compatibility

## 🤝 Contributing

1. Follow TypeScript best practices
2. Add proper error handling for new features
3. Update API documentation for new endpoints
4. Include tests for new functionality

## 📄 License

MIT License 