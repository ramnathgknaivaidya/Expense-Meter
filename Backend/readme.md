# 📊 Expense Meter - Complete API Documentation

## 📋 Table of Contents
1. [Authentication Module](#1-authentication-module)
2. [Income API Module](#2-income-api-module)
3. [Expense API Module](#3-expense-api-module)
4. [Transaction Module](#4-transaction-module)
5. [Analytics Engine](#5-analytics-engine)
6. [Budget Management Module](#6-budget-management-module)
7. [Report Generation Module](#7-report-generation-module)

---

## 🔐 Base URL
```
http://localhost:5000/api
```

## 🔑 Authentication
All endpoints except `/auth/register` and `/auth/login` require a JWT token in the `Authorization` header:

```
Authorization: Bearer <your_jwt_token>
```

---

## 1. Authentication Module

### 1.1 Register User
Create a new user account.

**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (201 Created):**
```json
{
  "message": "Account created successfully"
}
```

**Error Responses:**
- `400` - Missing required fields
- `409` - Email already exists
- `500` - Server error

---

### 1.2 Login User
Authenticate user and receive JWT token.

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
  "user": {
    "id": "67a1b2c3d4e5f6a1b2c3d4e5",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Error Responses:**
- `400` - Missing email or password
- `401` - Invalid credentials
- `500` - Server error

---

## 2. Income API Module

### 2.1 Add Income
Create a new income record.

**Endpoint:** `POST /api/income`

**Request Body:**
```json
{
  "amount": 50000,
  "source": "Salary",
  "paymentMethod": "Bank Transfer",
  "date": "2026-07-01",
  "description": "July salary"
}
```

**Field Descriptions:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| amount | Number | Yes | Income amount |
| source | String | Yes | Source: Salary, Freelance, Business, Investment, Bonus, Rental, Other |
| paymentMethod | String | Yes | Bank Transfer, Cash, UPI, Card |
| date | Date | No | Income date (defaults to today) |
| description | String | No | Optional notes |

**Response (201 Created):**
```json
{
  "id": "67a1b2c3d4e5f6a1b2c3d4e5",
  "amount": 50000,
  "source": "Salary",
  "paymentMethod": "Bank Transfer",
  "date": "2026-07-01T00:00:00.000Z",
  "description": "July salary"
}
```

---

### 2.2 Get All Incomes
Retrieve all income records for the authenticated user.

**Endpoint:** `GET /api/income`

**Response (200 OK):**
```json
[
  {
    "id": "67a1b2c3d4e5f6a1b2c3d4e5",
    "amount": 50000,
    "source": "Salary",
    "paymentMethod": "Bank Transfer",
    "date": "2026-07-01T00:00:00.000Z",
    "description": "July salary"
  },
  {
    "id": "67a1b2c3d4e5f6a1b2c3d4e6",
    "amount": 15000,
    "source": "Freelance",
    "paymentMethod": "UPI",
    "date": "2026-07-10T00:00:00.000Z",
    "description": "Website design project"
  }
]
```

---

### 2.3 Get Single Income
Retrieve a specific income record.

**Endpoint:** `GET /api/income/:id`

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | String | Income record ID |

**Response (200 OK):**
```json
{
  "id": "67a1b2c3d4e5f6a1b2c3d4e5",
  "amount": 50000,
  "source": "Salary",
  "paymentMethod": "Bank Transfer",
  "date": "2026-07-01T00:00:00.000Z",
  "description": "July salary"
}
```

**Error Responses:**
- `404` - Income not found or unauthorized
- `500` - Server error

---

### 2.4 Update Income
Update an existing income record.

**Endpoint:** `PUT /api/income/:id`

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | String | Income record ID |

**Request Body (Partial Update Supported):**
```json
{
  "amount": 55000,
  "description": "July salary + bonus"
}
```

**Response (200 OK):**
```json
{
  "id": "67a1b2c3d4e5f6a1b2c3d4e5",
  "amount": 55000,
  "source": "Salary",
  "paymentMethod": "Bank Transfer",
  "date": "2026-07-01T00:00:00.000Z",
  "description": "July salary + bonus"
}
```

---

### 2.5 Delete Income
Delete an income record.

**Endpoint:** `DELETE /api/income/:id`

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | String | Income record ID |

**Response (200 OK):**
```json
{
  "message": "Income record deleted successfully",
  "id": "67a1b2c3d4e5f6a1b2c3d4e5"
}
```

---

## 3. Expense API Module

### 3.1 Add Expense
Create a new expense record.

**Endpoint:** `POST /api/expense`

**Request Body:**
```json
{
  "amount": 800,
  "category": "Food",
  "paymentMethod": "UPI",
  "merchant": "Swiggy",
  "date": "2026-07-13",
  "description": "Lunch delivery",
  "receipt": "https://example.com/receipt.jpg"
}
```

**Field Descriptions:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| amount | Number | Yes | Expense amount |
| category | String | Yes | Food, Transport, Housing, Bills, Shopping, Healthcare, Education, Entertainment, Travel, Other |
| paymentMethod | String | Yes | Cash, UPI, Debit Card, Credit Card, Bank Transfer |
| merchant | String | No | Merchant/vendor name |
| date | Date | No | Expense date (defaults to today) |
| description | String | No | Optional notes |
| receipt | String | No | Receipt image URL |

**Response (201 Created):**
```json
{
  "id": "67a1b2c3d4e5f6a1b2c3d4e5",
  "amount": 800,
  "category": "Food",
  "paymentMethod": "UPI",
  "merchant": "Swiggy",
  "date": "2026-07-13T00:00:00.000Z",
  "description": "Lunch delivery",
  "receipt": null
}
```

---

### 3.2 Get All Expenses
Retrieve all expense records for the authenticated user.

**Endpoint:** `GET /api/expense`

**Response (200 OK):**
```json
[
  {
    "id": "67a1b2c3d4e5f6a1b2c3d4e5",
    "amount": 800,
    "category": "Food",
    "paymentMethod": "UPI",
    "merchant": "Swiggy",
    "date": "2026-07-13T00:00:00.000Z",
    "description": "Lunch delivery",
    "receipt": null
  },
  {
    "id": "67a1b2c3d4e5f6a1b2c3d4e6",
    "amount": 300,
    "category": "Transport",
    "paymentMethod": "Cash",
    "merchant": "Uber",
    "date": "2026-07-14T00:00:00.000Z",
    "description": "Cab to office",
    "receipt": null
  }
]
```

---

### 3.3 Get Single Expense
Retrieve a specific expense record.

**Endpoint:** `GET /api/expense/:id`

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | String | Expense record ID |

**Response (200 OK):**
```json
{
  "id": "67a1b2c3d4e5f6a1b2c3d4e5",
  "amount": 800,
  "category": "Food",
  "paymentMethod": "UPI",
  "merchant": "Swiggy",
  "date": "2026-07-13T00:00:00.000Z",
  "description": "Lunch delivery",
  "receipt": null
}
```

---

### 3.4 Update Expense
Update an existing expense record.

**Endpoint:** `PUT /api/expense/:id`

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | String | Expense record ID |

**Request Body (Partial Update Supported):**
```json
{
  "amount": 900,
  "description": "Lunch with team"
}
```

**Response (200 OK):**
```json
{
  "id": "67a1b2c3d4e5f6a1b2c3d4e5",
  "amount": 900,
  "category": "Food",
  "paymentMethod": "UPI",
  "merchant": "Swiggy",
  "date": "2026-07-13T00:00:00.000Z",
  "description": "Lunch with team",
  "receipt": null
}
```

---

### 3.5 Delete Expense
Delete an expense record.

**Endpoint:** `DELETE /api/expense/:id`

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | String | Expense record ID |

**Response (200 OK):**
```json
{
  "message": "Expense record deleted successfully",
  "id": "67a1b2c3d4e5f6a1b2c3d4e5"
}
```

---

### 3.6 Expense Summary (Bonus)
Get expense summary by category for a specific month.

**Endpoint:** `GET /api/expense/summary?month=7&year=2026`

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| month | Number | Month (1-12) |
| year | Number | Year (e.g., 2026) |

**Response (200 OK):**
```json
[
  { "_id": "Food", "total": 1200, "count": 5 },
  { "_id": "Transport", "total": 500, "count": 3 },
  { "_id": "Shopping", "total": 300, "count": 1 }
]
```

---

## 4. Transaction Module

### 4.1 Get All Transactions
Retrieve all transactions (combined income & expense) with filters.

**Endpoint:** `GET /api/transactions`

**Query Parameters (All Optional):**
| Parameter | Type | Description |
|-----------|------|-------------|
| startDate | Date | Filter from this date (YYYY-MM-DD) |
| endDate | Date | Filter up to this date (YYYY-MM-DD) |
| type | String | `income` or `expense` |
| category | String | Category (case-insensitive partial match) |
| paymentMethod | String | Payment method (case-insensitive partial match) |
| minAmount | Number | Minimum transaction amount |
| maxAmount | Number | Maximum transaction amount |
| page | Number | Page number (default: 1) |
| limit | Number | Items per page (default: 50) |

**Example URL:**
```
/api/transactions?type=income&category=Salary&minAmount=1000&maxAmount=60000&page=1&limit=10
```

**Response (200 OK):**
```json
{
  "results": [
    {
      "id": "67a1b2c3d4e5f6a1b2c3d4e1",
      "type": "income",
      "amount": 75000,
      "category": "Salary",
      "paymentMethod": "Bank Transfer",
      "merchantOrSource": "Salary",
      "description": "July 2026 Salary",
      "date": "2026-07-01T00:00:00.000Z"
    },
    {
      "id": "67a1b2c3d4e5f6a1b2c3d4e2",
      "type": "expense",
      "amount": 850,
      "category": "Food",
      "paymentMethod": "UPI",
      "merchantOrSource": "Swiggy",
      "description": "Team lunch",
      "date": "2026-07-13T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 5,
    "pages": 1
  }
}
```

---

### 4.2 Get Single Transaction
Retrieve a specific transaction.

**Endpoint:** `GET /api/transactions/:id`

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | String | Transaction ID |

**Response (200 OK):**
```json
{
  "id": "67a1b2c3d4e5f6a1b2c3d4e5",
  "type": "expense",
  "amount": 850,
  "category": "Food",
  "paymentMethod": "UPI",
  "merchantOrSource": "Swiggy",
  "description": "Team lunch",
  "date": "2026-07-13T00:00:00.000Z"
}
```

---

## 5. Analytics Engine

### 5.1 Dashboard Summary
Get overall financial summary for the current month.

**Endpoint:** `GET /api/dashboard`

**Response (200 OK):**
```json
{
  "totalIncome": 90000,
  "totalExpense": 3650,
  "balance": 86350,
  "savings": 96
}
```

**Field Descriptions:**
| Field | Type | Description |
|-------|------|-------------|
| totalIncome | Number | Total income for current month |
| totalExpense | Number | Total expense for current month |
| balance | Number | Income - Expense |
| savings | Number | Savings percentage |

---

### 5.2 Income Analytics
Get detailed income analysis for the current month.

**Endpoint:** `GET /api/analytics/income`

**Response (200 OK):**
```json
{
  "monthlyIncome": 90000,
  "incomeSources": [
    { "source": "Salary", "amount": 75000, "percentage": 83 },
    { "source": "Freelance", "amount": 15000, "percentage": 17 }
  ],
  "growthPercentage": 5.2
}
```

**Field Descriptions:**
| Field | Type | Description |
|-------|------|-------------|
| monthlyIncome | Number | Total income for current month |
| incomeSources | Array | Breakdown by income source with percentages |
| growthPercentage | Number | Month-over-month income growth (%) |

---

### 5.3 Expense Analytics
Get detailed expense analysis for the current month.

**Endpoint:** `GET /api/analytics/expense`

**Response (200 OK):**
```json
{
  "categoryDistribution": [
    { "category": "Shopping", "amount": 2500, "percentage": 68 },
    { "category": "Food", "amount": 850, "percentage": 23 },
    { "category": "Transport", "amount": 300, "percentage": 8 }
  ],
  "spendingTrends": [
    { "day": 13, "total": 850, "count": 1 },
    { "day": 14, "total": 300, "count": 1 },
    { "day": 15, "total": 2500, "count": 1 }
  ],
  "highestCategory": "Shopping"
}
```

**Field Descriptions:**
| Field | Type | Description |
|-------|------|-------------|
| categoryDistribution | Array | Spending breakdown by category with percentages |
| spendingTrends | Array | Daily spending trends for the month |
| highestCategory | String | Category with the highest spending |

---

## 6. Budget Management Module

### 6.1 Create Budget
Create a new spending budget per category.

**Endpoint:** `POST /api/budget`

**Request Body:**
```json
{
  "category": "Food",
  "limitAmount": 6000,
  "month": 7,
  "year": 2026
}
```

**Field Descriptions:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| category | String | Yes | Expense category (must match Expense categories) |
| limitAmount | Number | Yes | Maximum spending limit |
| month | Number | No | Month (1-12, defaults to current month) |
| year | Number | No | Year (defaults to current year) |

**Response (201 Created):**
```json
{
  "id": "67a1b2c3d4e5f6a1b2c3d4e5",
  "category": "Food",
  "limitAmount": 6000,
  "spentAmount": 850,
  "month": 7,
  "year": 2026,
  "remaining": 5150,
  "percentage": 14
}
```

**Error Responses:**
- `400` - Missing required fields
- `409` - Budget already exists for this category/month/year
- `500` - Server error

---

### 6.2 Get All Budgets
Retrieve all budgets for a specific month/year.

**Endpoint:** `GET /api/budget?month=7&year=2026`

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| month | Number | Month (1-12, defaults to current month) |
| year | Number | Year (defaults to current year) |

**Response (200 OK):**
```json
[
  {
    "id": "67a1b2c3d4e5f6a1b2c3d4e5",
    "category": "Food",
    "limitAmount": 6000,
    "spentAmount": 850,
    "month": 7,
    "year": 2026,
    "remaining": 5150,
    "percentage": 14
  },
  {
    "id": "67a1b2c3d4e5f6a1b2c3d4e6",
    "category": "Transport",
    "limitAmount": 3000,
    "spentAmount": 300,
    "month": 7,
    "year": 2026,
    "remaining": 2700,
    "percentage": 10
  }
]
```

---

### 6.3 Get Budget Status
Get budget status summary with spending vs limits.

**Endpoint:** `GET /api/budget/status?month=7&year=2026`

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| month | Number | Month (1-12, defaults to current month) |
| year | Number | Year (defaults to current year) |

**Response (200 OK):**
```json
{
  "budgets": [
    {
      "category": "Food",
      "limit": 6000,
      "spent": 850,
      "remaining": 5150,
      "percentage": 14,
      "status": "On Track"
    },
    {
      "category": "Transport",
      "limit": 3000,
      "spent": 300,
      "remaining": 2700,
      "percentage": 10,
      "status": "On Track"
    },
    {
      "category": "Shopping",
      "limit": 5000,
      "spent": 2500,
      "remaining": 2500,
      "percentage": 50,
      "status": "On Track"
    }
  ],
  "summary": {
    "totalBudget": 14000,
    "totalSpent": 3650,
    "totalRemaining": 10350,
    "overallPercentage": 26
  }
}
```

**Status Values:**
| Status | Condition | Description |
|--------|-----------|-------------|
| "On Track" | percentage < 80% | Spending within budget |
| "Warning" | 80% <= percentage < 100% | Approaching budget limit |
| "Exceeded" | percentage >= 100% | Exceeded budget limit |

---

### 6.4 Update Budget
Update an existing budget.

**Endpoint:** `PUT /api/budget/:id`

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | String | Budget ID |

**Request Body (Partial Update Supported):**
```json
{
  "limitAmount": 8000,
  "category": "Food"
}
```

**Response (200 OK):**
```json
{
  "id": "67a1b2c3d4e5f6a1b2c3d4e5",
  "category": "Food",
  "limitAmount": 8000,
  "spentAmount": 850,
  "month": 7,
  "year": 2026,
  "remaining": 7150,
  "percentage": 11
}
```

---

### 6.5 Delete Budget
Delete a budget.

**Endpoint:** `DELETE /api/budget/:id`

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | String | Budget ID |

**Response (200 OK):**
```json
{
  "message": "Budget deleted successfully",
  "id": "67a1b2c3d4e5f6a1b2c3d4e5"
}
```

---

## 7. Report Generation Module

### 7.1 Monthly Report
Get monthly financial summary.

**Endpoint:** `GET /api/reports/monthly?month=7&year=2026`

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| month | Number | Month (1-12, defaults to current month) |
| year | Number | Year (defaults to current year) |

**Response (200 OK):**
```json
{
  "month": "July",
  "year": 2026,
  "income": 90000,
  "expense": 3650,
  "savings": 86350,
  "savingsRate": 96
}
```

---

### 7.2 Yearly Report
Get yearly financial summary with monthly breakdown.

**Endpoint:** `GET /api/reports/yearly?year=2026`

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| year | Number | Year (defaults to current year) |

**Response (200 OK):**
```json
{
  "year": 2026,
  "summary": {
    "totalIncome": 540000,
    "totalExpense": 48000,
    "totalSavings": 492000,
    "overallSavingsRate": 91
  },
  "monthlyBreakdown": [
    {
      "month": "January",
      "monthNumber": 1,
      "income": 45000,
      "expense": 4000,
      "savings": 41000,
      "savingsRate": 91
    },
    {
      "month": "February",
      "monthNumber": 2,
      "income": 45000,
      "expense": 3800,
      "savings": 41200,
      "savingsRate": 92
    },
    {
      "month": "July",
      "monthNumber": 7,
      "income": 90000,
      "expense": 3650,
      "savings": 86350,
      "savingsRate": 96
    }
  ]
}
```

---

### 7.3 Income Report (Detailed)
Get detailed income report for a date range.

**Endpoint:** `GET /api/reports/income?from=2026-07-01&to=2026-07-31`

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| from | Date | Yes | Start date (YYYY-MM-DD) |
| to | Date | Yes | End date (YYYY-MM-DD) |

**Response (200 OK):**
```json
{
  "from": "2026-07-01T00:00:00.000Z",
  "to": "2026-07-31T23:59:59.999Z",
  "summary": {
    "totalIncome": 90000,
    "totalTransactions": 2,
    "averageTransaction": 45000
  },
  "sourceBreakdown": [
    {
      "source": "Salary",
      "total": 75000,
      "count": 1,
      "percentage": 83
    },
    {
      "source": "Freelance",
      "total": 15000,
      "count": 1,
      "percentage": 17
    }
  ],
  "transactions": [
    {
      "id": "67a1b2c3d4e5f6a1b2c3d4e5",
      "amount": 15000,
      "source": "Freelance",
      "paymentMethod": "UPI",
      "description": "Website design project",
      "date": "2026-07-10T00:00:00.000Z"
    },
    {
      "id": "67a1b2c3d4e5f6a1b2c3d4e6",
      "amount": 75000,
      "source": "Salary",
      "paymentMethod": "Bank Transfer",
      "description": "July 2026 Salary",
      "date": "2026-07-01T00:00:00.000Z"
    }
  ]
}
```

---

### 7.4 Expense Report (Detailed)
Get detailed expense report for a date range.

**Endpoint:** `GET /api/reports/expense?from=2026-07-01&to=2026-07-31`

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| from | Date | Yes | Start date (YYYY-MM-DD) |
| to | Date | Yes | End date (YYYY-MM-DD) |

**Response (200 OK):**
```json
{
  "from": "2026-07-01T00:00:00.000Z",
  "to": "2026-07-31T23:59:59.999Z",
  "summary": {
    "totalExpense": 3650,
    "totalTransactions": 3,
    "averageTransaction": 1217,
    "highestCategory": "Shopping"
  },
  "categoryBreakdown": [
    {
      "category": "Shopping",
      "total": 2500,
      "count": 1,
      "percentage": 68
    },
    {
      "category": "Food",
      "total": 850,
      "count": 1,
      "percentage": 23
    },
    {
      "category": "Transport",
      "total": 300,
      "count": 1,
      "percentage": 8
    }
  ],
  "transactions": [
    {
      "id": "67a1b2c3d4e5f6a1b2c3d4e5",
      "amount": 2500,
      "category": "Shopping",
      "paymentMethod": "Credit Card",
      "merchant": "Amazon",
      "description": "New headphones",
      "date": "2026-07-15T00:00:00.000Z"
    },
    {
      "id": "67a1b2c3d4e5f6a1b2c3d4e6",
      "amount": 300,
      "category": "Transport",
      "paymentMethod": "Cash",
      "merchant": "Uber",
      "description": "Cab to office",
      "date": "2026-07-14T00:00:00.000Z"
    },
    {
      "id": "67a1b2c3d4e5f6a1b2c3d4e7",
      "amount": 850,
      "category": "Food",
      "paymentMethod": "UPI",
      "merchant": "Swiggy",
      "description": "Team lunch",
      "date": "2026-07-13T00:00:00.000Z"
    }
  ]
}
```

---

## 📊 API Summary Table

| Module | Endpoint | Method | Description |
|--------|----------|--------|-------------|
| **Auth** | `/api/auth/register` | POST | Register new user |
| **Auth** | `/api/auth/login` | POST | Login and get JWT token |
| **Income** | `/api/income` | POST | Add income |
| **Income** | `/api/income` | GET | Get all incomes |
| **Income** | `/api/income/:id` | GET | Get single income |
| **Income** | `/api/income/:id` | PUT | Update income |
| **Income** | `/api/income/:id` | DELETE | Delete income |
| **Expense** | `/api/expense` | POST | Add expense |
| **Expense** | `/api/expense` | GET | Get all expenses |
| **Expense** | `/api/expense/:id` | GET | Get single expense |
| **Expense** | `/api/expense/:id` | PUT | Update expense |
| **Expense** | `/api/expense/:id` | DELETE | Delete expense |
| **Expense** | `/api/expense/summary` | GET | Expense summary by category |
| **Transaction** | `/api/transactions` | GET | Get all transactions (with filters) |
| **Transaction** | `/api/transactions/:id` | GET | Get single transaction |
| **Analytics** | `/api/dashboard` | GET | Dashboard summary |
| **Analytics** | `/api/analytics/income` | GET | Income analytics |
| **Analytics** | `/api/analytics/expense` | GET | Expense analytics |
| **Budget** | `/api/budget` | POST | Create budget |
| **Budget** | `/api/budget` | GET | Get all budgets |
| **Budget** | `/api/budget/status` | GET | Budget status summary |
| **Budget** | `/api/budget/:id` | PUT | Update budget |
| **Budget** | `/api/budget/:id` | DELETE | Delete budget |
| **Report** | `/api/reports/monthly` | GET | Monthly report |
| **Report** | `/api/reports/yearly` | GET | Yearly report |
| **Report** | `/api/reports/income` | GET | Detailed income report |
| **Report** | `/api/reports/expense` | GET | Detailed expense report |

---

## 🔒 Authentication & Security

### JWT Token Usage
All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### Token Expiry
Tokens expire after **7 days** by default (configurable in `.env`).

### Data Isolation
All data is scoped to the authenticated user. Users can only access their own data.

---

## 🐛 Common Error Responses

| Status Code | Description |
|-------------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Missing or invalid parameters |
| 401 | Unauthorized - Missing or invalid JWT token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource already exists |
| 500 | Internal Server Error - Something went wrong |

### Error Response Format:
```json
{
  "error": "Error message description"
}
```

---

*Documentation generated for Expense Meter - Personal Finance Management System*