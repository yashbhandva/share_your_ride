# Yavij Express - API & Entity Documentation

## 1. Technology Stack
- **Backend:** Spring Boot 3.2.0, Java 17, Maven
- **Database:** PostgreSQL (with Flyway)
- **Frontend:** React 18, Vite, Material UI
- **Security:** Spring Security, JWT
- **Payment:** Razorpay
- **Real-time:** WebSocket

## 2. System Architecture
The system follows a standard layered architecture:
- **Controller Layer:** Handles HTTP requests and responses.
- **Service Layer:** Contains business logic.
- **Repository Layer:** Interacts with the database using Spring Data JPA.
- **Entity Layer:** Defines the data model.

## 3. Database Schema & Entities

### 3.1. User (`users`)
Represents a registered user (Admin, Driver, or Passenger).
- **Fields:** `id`, `name`, `email` (unique), `password`, `mobile` (unique), `role` (ADMIN, DRIVER, PASSENGER), `verificationStatus`, `aadhaarNumber`, `drivingLicense`, `isActive`, `avgRating`, `totalRides`, `emergencyContact1`, `emergencyContact2`.
- **Relationships:**
  - One-to-Many with `Vehicle`
  - One-to-Many with `Trip` (as driver)
  - One-to-Many with `Booking` (as passenger)

### 3.2. Vehicle (`vehicles`)
Represents a vehicle owned by a driver.
- **Fields:** `id`, `vehicleNumber`, `model`, `color`, `totalSeats`, `insuranceNumber`, `insuranceExpiry`, `vehicleType`, `isActive`.
- **Relationships:**
  - Many-to-One with `User`
  - One-to-Many with `Trip`

### 3.3. Trip (`trips`)
Represents a scheduled or ongoing journey.
- **Fields:** `id`, `fromLocation`, `toLocation`, `departureTime`, `expectedArrivalTime`, `pricePerSeat`, `totalSeats`, `availableSeats`, `status` (SCHEDULED, ONGOING, COMPLETED, CANCELLED), `routePolyline`, `distanceKm`, `isFlexible`, `notes`, `soberDeclaration`, `isActive`.
- **Relationships:**
  - Many-to-One with `User` (Driver)
  - Many-to-One with `Vehicle`
  - One-to-Many with `Booking`

### 3.4. Booking (`bookings`)
Represents a reservation made by a passenger.
- **Fields:** `id`, `seatsBooked`, `totalAmount`, `status` (PENDING, CONFIRMED, CANCELLED, COMPLETED), `specialRequests`, `pickupOtp`, `bookedAt`, `cancelledAt`.
- **Relationships:**
  - Many-to-One with `Trip`
  - Many-to-One with `User` (Passenger)
  - One-to-One with `Payment`
  - One-to-One with `Rating`

### 3.5. Payment (`payments`)
Represents a payment transaction.
- **Fields:** `id`, `transactionId`, `amount`, `method` (RAZORPAY, CASH, WALLET), `status` (PENDING, SUCCESS, FAILED, REFUNDED), `razorpayOrderId`, `razorpayPaymentId`, `razorpaySignature`, `notes`.
- **Relationships:**
  - One-to-One with `Booking`

### 3.6. Rating (`ratings`)
Represents a review given by a user.
- **Fields:** `id`, `stars` (1-5), `comment`, `type` (DRIVER_TO_PASSENGER, PASSENGER_TO_DRIVER).
- **Relationships:**
  - Many-to-One with `User` (Given By)
  - Many-to-One with `User` (Given To)
  - One-to-One with `Booking`

### 3.7. Notification (`notifications`)
Represents a system notification.
- **Fields:** `id`, `title`, `message`, `type`, `isRead`, `relatedEntityType`, `relatedEntityId`, `actions`.
- **Relationships:**
  - Many-to-One with `User`

### 3.8. EmergencyAlert (`emergency_alerts`)
Represents an SOS or emergency signal.
- **Fields:** `id`, `userId`, `alertType`, `message`, `latitude`, `longitude`, `status`, `resolutionNotes`.
- **Relationships:**
  - Many-to-One with `Trip`

### 3.9. ContactMessage (`contact_messages`)
Represents a support query.
- **Fields:** `id`, `name`, `email`, `subject`, `message`, `status`.

### 3.10. Complaint (`complaints`)
Represents a user complaint.
- **Fields:** `id`, `title`, `description`, `type`, `status`, `adminResponse`.
- **Relationships:**
  - Many-to-One with `User` (Reported By)
  - Many-to-One with `User` (Reported User)
  - Many-to-One with `Trip`

---

## 4. API Documentation

### 4.1. Authentication (`/api/auth`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | `/register` | Register a new user. |
| POST | `/login` | Authenticate user and return JWT. |
| POST | `/verify-otp` | Verify email using OTP. |
| POST | `/send-otp` | Send OTP to email. |
| POST | `/change-password` | Change current user's password. |
| POST | `/forgot-password` | Initiate password reset. |
| POST | `/reset-password` | Reset password using token. |
| GET | `/profile` | Get current user's profile. |

### 4.2. Trips (`/api/trips`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | `/` | Create a new trip (Driver only). |
| PUT | `/{tripId}` | Update trip details. |
| DELETE | `/{tripId}` | Cancel a trip. |
| POST | `/search` | Search for trips based on criteria. |
| GET | `/{tripId}` | Get trip details. |
| POST | `/{tripId}/start` | Start a trip (Driver only). |
| POST | `/{tripId}/complete` | Complete a trip (Driver only). |
| GET | `/upcoming` | Get upcoming trips. |

### 4.3. Bookings (`/api/bookings`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | `/` | Create a new booking. |
| POST | `/{bookingId}/confirm` | Confirm a booking. |
| POST | `/{bookingId}/cancel` | Cancel a booking. |
| GET | `/passenger/{passengerId}` | Get bookings for a passenger. |
| GET | `/driver/{driverId}` | Get bookings for a driver. |
| POST | `/verify-otp` | Verify pickup OTP to start ride. |

### 4.4. Payments (`/api/payments`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | `/razorpay/order` | Create a Razorpay order. |
| POST | `/razorpay/verify` | Verify Razorpay payment. |
| POST | `/cash/{bookingId}` | Process cash payment. |
| POST | `/wallet/{bookingId}` | Process wallet payment. |
| POST | `/{paymentId}/refund` | Process a refund. |

### 4.5. Vehicles (`/api/vehicles`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | `/` | Add a new vehicle. |
| PUT | `/{vehicleId}` | Update vehicle details. |
| DELETE | `/{vehicleId}` | Delete a vehicle. |
| GET | `/user/{userId}` | Get vehicles for a user. |

### 4.6. Ratings (`/api/ratings`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | `/` | Submit a rating. |
| GET | `/user/{userId}` | Get ratings for a user. |
| GET | `/user/{userId}/average` | Get average rating for a user. |

### 4.7. Notifications (`/api/notifications`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | `/` | Get user notifications. |
| GET | `/unread/count` | Get unread notification count. |
| POST | `/{notificationId}/read` | Mark notification as read. |
| POST | `/read-all` | Mark all notifications as read. |

### 4.8. Emergency (`/api/emergency`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | `/sos` | Send an SOS alert. |
| POST | `/location` | Update live location. |
| GET | `/contacts/{userId}` | Get emergency contacts. |

### 4.9. Admin (`/api/admin`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | `/dashboard/stats` | Get system-wide statistics. |
| GET | `/users` | Get all users. |
| PUT | `/users/{userId}/status` | Update user status (active/inactive). |
| PUT | `/users/{userId}/verification` | Update verification status. |
| POST | `/notifications` | Send broadcast notifications. |
| GET | `/contacts` | Get all contact messages. |

## 5. Frontend Screens (UI)
- **Public:** Home, About, Contact, Login, Register, FAQ, Terms, Privacy Policy.
- **Passenger:** Dashboard, Search Ride, Booking History, Profile, Notifications.
- **Driver:** Dashboard, Post Ride, My Trips, Vehicle Management, Earnings.
- **Admin:** Dashboard, User Management, Trip Management, Reports.

## 6. Future Scope
- **Advanced AI Matching:** Better ride matching algorithms.
- **Multi-language Support:** Localization for broader reach.
- **In-app Chat:** Real-time chat between driver and passenger.
- **Subscription Model:** Premium features for frequent users.
