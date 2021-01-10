Activity Authorization
======================

A Javascript package that provides activity based authorization. This package includes a library for determining authorization and an express middleware function for associating an `activity` to a route for guarding access.

It expects sessions to be available as a cookie variable named `token` and that the session data was encrypted with ["nJwt"](https://www.npmjs.com/package/njwt).

When a user's session is decrypted, their session data is added to the http request context. The library expects that when the user was logged in, that their `roles` were added to their session as aarray such as `["role1", "role2"]`.

When a user is authorized, their access data is added to the http request context.

The library can also determine which `entities`, `components` and `apps` a user has access to.

For example, say a program is organized into two sub-applications: `content-management` and `user-management`. Within each of these applications there are a few sub-components such as `manage-faq` and `manage-pages`. And the data that is managed in the `manage-faq` component are `faq` entities.

Why include these extra things? Depending on your application requirements, you may want to use activity based authorization to filter what links are displayed on a menu or which search results to retreive. Since all the user's access data is added to the request context before calling subsequent route handlers, it is easy to utilize this data in business logic.

# Usage

### Define Configuration Data
```
const activitiesByRole = {
  role: ["activity1", "activity2"],
  role2: ["activity0", "activity3"],
  role3: ["activity1", "activity3"]
};

// optional
const entitiesByActivity = {
  activity1: ["book", "tree"],
  activity2: ["tree", "car"],
  activity3: ["book", "frog"]
};

// optional
const components = [{id: "book-mananger", entity: "book", appId: "library"}];

// optional
const apps = [{id: "library"}];

// for nJwt to decrypt token from cookie
const signingKey = "XXX";
```

### Create Authorization Factory and Apply Middleware
```
import { authorizerFactory, middlewareFactory } from "activity-auth";

const activityAuthorizer = authorizerFactory(
  activitiesByRole,
  entitiesByActivity,
  components,
  apps
);

const authMiddleware = middlewareFactory(activityAuthorizer, signingKey);

app.get("/some/path", authMiddleware("activity1"), controller.action);
```