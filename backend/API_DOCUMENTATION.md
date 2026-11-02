# Melody Bari — API Documentation

## 1. Overview

Melody Bari is a music discovery and playlist management backend built with Node.js, Express.js, and PostgreSQL.

**Base URL**

`http://localhost:5000`

**Data format:** JSON

**Authentication:** JWT Bearer Token for protected endpoints.

### Standard Response Format

Success response:

```json
{
  "success": true,
  "message": "Operation completed successfully!",
  "data": {}
}
```

Error response:

```json
{
  "success": false,
  "message": "Error description!"
}
```

The exact response fields depend on the endpoint.

---

## 2. Authentication

Protected endpoints require a valid JWT.

In Thunder Client, select **Auth → Bearer** and enter the token received from the login endpoint.

Alternatively, use this request header:

`Authorization: Bearer YOUR_JWT_TOKEN`

The current login controller generates tokens that expire after **7 days**.

### 2.1 Register User

**Method:** `POST`
**Endpoint:** `/register`
**Authentication:** Not required

Request body:

```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "YourSecurePassword123"
}
```

Success response — `201 Created`:

```json
{
  "success": true,
  "message": "User registered successfully!",
  "data": {
    "id": 1,
    "name": "Test User",
    "email": "test@example.com",
    "created_at": "TIMESTAMP"
  }
}
```

Possible errors:

| Status | Message                                  |
| ------ | ---------------------------------------- |
| 400    | `Name, email and password are required!` |
| 409    | `Email is already registered!`           |
| 500    | `Failed to register user!`               |

### 2.2 Login

**Method:** `POST`
**Endpoint:** `/login`
**Authentication:** Not required

Request body:

```json
{
  "email": "test@example.com",
  "password": "YourSecurePassword123"
}
```

Success response:

```json
{
  "success": true,
  "message": "Login successful!",
  "token": "JWT_TOKEN",
  "data": {
    "id": 1,
    "name": "Test User",
    "email": "test@example.com"
  }
}
```

Possible errors:

| Status | Message                            |
| ------ | ---------------------------------- |
| 400    | `Email and password are required!` |
| 401    | `Invalid email or password!`       |
| 500    | `Failed to login!`                 |

Use the returned token to access protected endpoints.

### 2.3 Get Profile

**Method:** `GET`
**Endpoint:** `/profile`
**Authentication:** Required

Success message: `Profile retrieved successfully!`

Possible errors:

| Status | Message                         |
| ------ | ------------------------------- |
| 401    | Authentication middleware error |
| 404    | `User not found!`               |
| 500    | `Failed to retrieve profile!`   |

### 2.4 Delete Current User

**Method:** `DELETE`
**Endpoint:** `/users`
**Authentication:** Required

Deletes the currently authenticated user's account.

Success response:

```json
{
  "success": true,
  "message": "User deleted successfully!"
}
```

Possible errors:

| Status | Message                         |
| ------ | ------------------------------- |
| 401    | Authentication middleware error |
| 404    | `User not found!`               |
| 500    | `Failed to delete user!`        |

**Warning:** This operation deletes an account. Test carefully and only with an account you intend to delete.

---

## 3. Songs API

The Songs API supports creating, retrieving, updating, deleting, searching, and filtering songs.

The current song routes do not apply `authMiddleware`. Protect write endpoints before exposing the backend publicly.

### 3.1 Create Song

**Method:** `POST`
**Endpoint:** `/songs`
**Authentication:** Not required by the current route

Request body:

```json
{
  "title": "Example Song",
  "artist": "Example Artist",
  "year": 2024,
  "language": "Bangla",
  "mood": "Happy",
  "activity": "Coding",
  "era": "2020s",
  "gender": "Everyone",
  "external_music_id": "example001"
}
```

Required fields:

* `title` — non-empty string
* `artist` — non-empty string
* `year` — positive integer

Optional fields:

* `language`
* `mood`
* `activity`
* `era`
* `gender`
* `external_music_id`

Optional fields must be strings or `null` when supplied.

Success response: `201 Created`

Success message: `Song created successfully!`

Possible errors:

| Status | Message                                  |
| ------ | ---------------------------------------- |
| 400    | `Title and artist must be text!`         |
| 400    | `Title and artist are required!`         |
| 400    | `Year must be a valid positive integer!` |
| 400    | `<field> must be text!`                  |
| 500    | `Failed to save song!`                   |

### 3.2 Get All Songs

**Method:** `GET`
**Endpoint:** `/songs`
**Authentication:** Not required

Example:

`GET /songs`

Success message: `Songs fetched successfully!`

Songs are ordered by ascending ID.

### 3.3 Filter Songs

**Method:** `GET`
**Endpoint:** `/songs`

Supported query parameters:

* `mood`
* `activity`
* `era`
* `language`
* `gender`

Example:

`GET /songs?mood=Happy&activity=Coding&era=2020s`

Filters can be combined. Matching uses PostgreSQL `ILIKE`, so text matching is case-insensitive.

Success message: `Songs fetched successfully!`

### 3.4 Get Song by ID

**Method:** `GET`
**Endpoint:** `/songs/:id`

Example:

`GET /songs/7`

Success message: `Song retrieved successfully!`

Possible errors:

| Status | Message               |
| ------ | --------------------- |
| 400    | `Invalid song ID!`    |
| 404    | `Song not found!`     |
| 500    | `Failed to get song!` |

### 3.5 Update Song

**Method:** `PUT`
**Endpoint:** `/songs/:id`

The current controller expects `title`, `artist`, and `year` to be supplied and validated, along with any optional fields.

Example request body:

```json
{
  "title": "Updated Song",
  "artist": "Updated Artist",
  "year": 2025,
  "language": "Bangla",
  "mood": "Romantic",
  "activity": "Driving",
  "era": "2020s",
  "gender": "Everyone",
  "external_music_id": "updated001"
}
```

Success message: `Song updated successfully!`

Possible errors:

| Status | Message                                  |
| ------ | ---------------------------------------- |
| 400    | `Invalid song ID!`                       |
| 400    | `Title and artist must be text!`         |
| 400    | `Title and artist are required!`         |
| 400    | `Year must be a valid positive integer!` |
| 400    | `<field> must be text!`                  |
| 404    | `Song not found!`                        |
| 500    | `Failed to update song!`                 |

### 3.6 Delete Song

**Method:** `DELETE`
**Endpoint:** `/songs/:id`

Example:

`DELETE /songs/7`

Success message: `Song deleted successfully!`

Possible errors:

| Status | Message                  |
| ------ | ------------------------ |
| 400    | `Invalid song ID!`       |
| 404    | `Song not found!`        |
| 500    | `Failed to delete song!` |

Deleting a song may affect related playlist or favorite records, depending on the database's foreign-key configuration.

### 3.7 Search Songs

**Method:** `GET`
**Endpoint:** `/songs/search?q=keyword`

Example:

`GET /songs/search?q=love`

Searches song titles and artist names using case-insensitive partial matching.

Success message: `Songs search completed successfully!`

Possible errors:

| Status | Message                     |
| ------ | --------------------------- |
| 400    | `Search query is required!` |
| 500    | `Failed to search songs!`   |

---

## 4. Discover API

### Discover Songs

**Method:** `GET`
**Endpoint:** `/discover`
**Authentication:** Not required by the current route

Supported query parameters:

* `mood`
* `activity`
* `era`
* `language`
* `gender`

Example:

`GET /discover?mood=Happy&activity=Coding&era=2020s`

Success response contains:

* `success`
* `message`
* `discovery.title`
* `discovery.reason`
* `filters`
* `data`

Success message: `Songs discovered successfully!`

Possible errors:

| Status | Message                              |
| ------ | ------------------------------------ |
| 404    | `No songs found for your discovery!` |
| 500    | `Failed to discover songs!`          |

---

## 5. Smart Playlist API

### Generate Smart Playlist

**Method:** `GET`
**Endpoint:** `/smart-playlist`
**Authentication:** Required

Supported query parameters:

* `mood`
* `activity`
* `era`
* `language`
* `gender`

Example:

`GET /smart-playlist?mood=Romantic&activity=Driving&era=1990s`

The endpoint:

1. Filters songs using the supplied parameters.
2. Generates a playlist name.
3. Creates a playlist owned by the authenticated user.
4. Adds matching songs to that playlist.

Success response: `201 Created`

The response includes:

* `success`
* `message`
* `playlist_name`
* `playlist_id`
* `data`

Success message: `Smart playlist generated successfully!`

Possible errors:

| Status | Message                                  |
| ------ | ---------------------------------------- |
| 401    | Authentication middleware error          |
| 404    | `No songs found matching your criteria!` |
| 500    | `Failed to generate smart playlist!`     |

---

## 6. Playlists API

**Authentication:** All playlist endpoints require a valid JWT.

Playlist access is restricted to the authenticated user's own playlists.

### 6.1 Get All Playlists

**Method:** `GET`
**Endpoint:** `/playlists`

Returns playlists owned by the logged-in user.

Success message: `Playlists retrieved successfully!`

Error message: `Failed to get playlists!` — `500`

### 6.2 Get Playlist by ID

**Method:** `GET`
**Endpoint:** `/playlists/:id`

Possible errors:

| Status | Message                   |
| ------ | ------------------------- |
| 400    | `Invalid playlist ID!`    |
| 404    | `Playlist not found!`     |
| 500    | `Failed to get playlist!` |

### 6.3 Create Playlist

**Method:** `POST`
**Endpoint:** `/playlists`

Request body:

```json
{
  "name": "My Playlist",
  "description": "Songs for late-night driving"
}
```

Validation:

* `name` is required and must be a non-empty string.
* Maximum name length: 100 characters.
* `description` is optional and must be a string or `null`.
* Maximum description length: 500 characters.

Success response: `201 Created`

Success message: `Playlist created successfully!`

Possible errors:

| Status | Message                                                |
| ------ | ------------------------------------------------------ |
| 400    | `Playlist name is required and must be text!`          |
| 400    | `Playlist name must be 100 characters or less!`        |
| 400    | `Playlist description must be text!`                   |
| 400    | `Playlist description must be 500 characters or less!` |
| 500    | `Failed to create playlist!`                           |

### 6.4 Update Playlist

**Method:** `PUT`
**Endpoint:** `/playlists/:id`

Request body:

```json
{
  "name": "Updated Playlist",
  "description": "Updated description"
}
```

The `name` field is required even when updating the description.

Possible errors include:

* `Invalid playlist ID!` — `400`
* Playlist name and description validation errors — `400`
* `Playlist not found!` — `404`
* `Failed to update playlist!` — `500`

Success message: `Playlist updated successfully!`

### 6.5 Delete Playlist

**Method:** `DELETE`
**Endpoint:** `/playlists/:id`

Deletes the authenticated user's playlist.

Success message: `Playlist deleted successfully!`

Possible errors:

* `Invalid playlist ID!` — `400`
* `Playlist not found!` — `404`
* `Failed to delete playlist!` — `500`

### 6.6 Get Playlist Songs

**Method:** `GET`
**Endpoint:** `/playlists/:id/songs`

Returns songs in the playlist ordered by ascending `position`.

Possible errors:

| Status | Message                               |
| ------ | ------------------------------------- |
| 400    | `Invalid playlist ID!`                |
| 404    | `Playlist not found or has no songs!` |
| 500    | `Failed to get playlist songs!`       |

Success message: `Playlist songs retrieved successfully!`

**Note:** The current controller returns `404` both when the playlist does not belong to the user and when the playlist has no songs.

### 6.7 Add Song to Playlist

**Method:** `POST`
**Endpoint:** `/playlists/:id/songs`

Request body:

```json
{
  "songId": 7
}
```

The endpoint verifies playlist ownership, checks that the song exists, and assigns the next position.

Success response: `201 Created`

Success message: `Song added to playlist successfully!`

Possible errors:

| Status | Message                                 |
| ------ | --------------------------------------- |
| 400    | `Invalid playlist ID!`                  |
| 400    | `Song ID is required!`                  |
| 400    | `Invalid song ID!`                      |
| 400    | `Song already exists in this playlist!` |
| 404    | `Playlist not found!`                   |
| 404    | `Song not found!`                       |
| 500    | `Failed to add song to playlist!`       |

### 6.8 Reorder Playlist Song

**Method:** `PUT`
**Endpoint:** `/playlists/:id/songs/:songId/reorder`

Request body:

```json
{
  "position": 2
}
```

Positions start at `1`. The requested position cannot exceed the playlist's current song count.

Success message: `Song reordered successfully!`

Possible errors:

| Status | Message                             |
| ------ | ----------------------------------- |
| 400    | `Invalid playlist ID!`              |
| 400    | `Invalid song ID!`                  |
| 400    | `Invalid position!`                 |
| 400    | `Position must be between 1 and N!` |
| 404    | `Playlist not found!`               |
| 404    | `Song not found in this playlist!`  |
| 500    | `Failed to reorder playlist song!`  |

### 6.9 Remove Song from Playlist

**Method:** `DELETE`
**Endpoint:** `/playlists/:id/songs/:songId`

Removes the song and shifts later positions down to keep the order consecutive.

Success message: `Song removed from playlist successfully!`

Possible errors:

| Status | Message                                |
| ------ | -------------------------------------- |
| 400    | `Invalid playlist ID!`                 |
| 400    | `Invalid song ID!`                     |
| 404    | `Playlist not found!`                  |
| 404    | `Song not found in your playlist!`     |
| 500    | `Failed to remove song from playlist!` |

---

## 7. Favorites API

**Authentication:** All favorite endpoints require a valid JWT.

Favorites are associated with the authenticated user's ID.

### 7.1 Add Favorite

**Method:** `POST`
**Endpoint:** `/favorites`

Request body:

```json
{
  "song_id": 7
}
```

Success response: `201 Created`

Success message: `Song added to favorites successfully!`

Possible errors:

| Status | Message                            |
| ------ | ---------------------------------- |
| 400    | `Song ID is required!`             |
| 400    | `Invalid song ID!`                 |
| 404    | `Song not found!`                  |
| 409    | `Song is already in favorites!`    |
| 500    | `Failed to add song to favorites!` |

### 7.2 Get Favorite Songs

**Method:** `GET`
**Endpoint:** `/favorites`

Returns the authenticated user's favorite songs, newest favorites first.

Success message: `Favorite songs retrieved successfully!`

Possible error:

* `Failed to get favorite songs!` — `500`

An empty list is returned in `data` if the user has no favorites.

### 7.3 Remove Favorite

**Method:** `DELETE`
**Endpoint:** `/favorites/:songId`

Example:

`DELETE /favorites/7`

Possible errors:

| Status | Message                                 |
| ------ | --------------------------------------- |
| 400    | `Invalid song ID!`                      |
| 404    | `Song is not in favorites!`             |
| 500    | `Failed to remove song from favorites!` |

Success message: `Song removed from favorites successfully!`

---

## 8. Utility Endpoints

### 8.1 Root Endpoint

**Method:** `GET`
**Endpoint:** `/`

Returns:

`Welcome to Melody Bari Backend!`

### 8.2 Database Health Check

**Method:** `GET`
**Endpoint:** `/db-test`

Success response:

```json
{
  "success": true,
  "message": "Database connected!"
}
```

A database error is passed to the global error handler.

### 8.3 Unknown Routes

Any unmatched route returns:

**Status:** `404 Not Found`

```json
{
  "success": false,
  "message": "Route not found!"
}
```

### 8.4 Invalid JSON

If the request body contains malformed JSON, the global error handler returns:

**Status:** `400 Bad Request`

```json
{
  "success": false,
  "message": "Invalid JSON format!"
}
```

### 8.5 General Server Errors

Unhandled errors reaching the global error handler return:

**Status:** `500 Internal Server Error`

```json
{
  "success": false,
  "message": "Internal server error!"
}
```

Some controllers handle their own errors and return endpoint-specific messages instead.

---

## 9. Important Security Notes

1. Never share passwords, JWT tokens, or production secrets.
2. Passwords are hashed with bcrypt before being stored.
3. JWTs currently expire after seven days.
4. The JWT signing secret is hard-coded in the current controller. Move it into an environment variable before production deployment and rotate it if it has been exposed.
5. Song create, update, and delete endpoints currently have no authentication middleware. Add suitable authorization before exposing these endpoints publicly.
6. Playlist and favorite endpoints use the authenticated user's ID to restrict access to personal data.
7. Use parameterized SQL queries; do not construct SQL statements using untrusted values.
8. Test destructive operations with disposable test records.
9. This documentation describes the current controller and route behavior. Verify changes whenever the code is updated.

---

## 10. Endpoint Summary

| Method | Endpoint                               | Authentication |
| ------ | -------------------------------------- | -------------- |
| POST   | `/register`                            | No             |
| POST   | `/login`                               | No             |
| GET    | `/profile`                             | Yes            |
| DELETE | `/users`                               | Yes            |
| POST   | `/songs`                               | No             |
| GET    | `/songs`                               | No             |
| GET    | `/songs/search?q=keyword`              | No             |
| GET    | `/songs/:id`                           | No             |
| PUT    | `/songs/:id`                           | No             |
| DELETE | `/songs/:id`                           | No             |
| GET    | `/discover`                            | No             |
| GET    | `/smart-playlist`                      | Yes            |
| GET    | `/playlists`                           | Yes            |
| GET    | `/playlists/:id`                       | Yes            |
| POST   | `/playlists`                           | Yes            |
| PUT    | `/playlists/:id`                       | Yes            |
| DELETE | `/playlists/:id`                       | Yes            |
| GET    | `/playlists/:id/songs`                 | Yes            |
| POST   | `/playlists/:id/songs`                 | Yes            |
| PUT    | `/playlists/:id/songs/:songId/reorder` | Yes            |
| DELETE | `/playlists/:id/songs/:songId`         | Yes            |
| POST   | `/favorites`                           | Yes            |
| GET    | `/favorites`                           | Yes            |
| DELETE | `/favorites/:songId`                   | Yes            |
| GET    | `/db-test`                             | No             |
| GET    | `/`                                    | No             |
