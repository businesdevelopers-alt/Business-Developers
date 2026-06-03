# Enterprise Partner Hub Firestore Security Specification

This document details the security specification, invariants, and threat models for the Digital Transformation Consultative platform's Firestore integration.

## 1. Data Invariants

1. **Clients (`/clients/{email}`)**:
   - Every client document must have a unique ID matching their lowercase corporate email.
   - Field `email` must exactly match the document ID.
   - Credentials like `password` are mandatory for local auth checks.
   - No user can overwrite or tamper with other clients' data keys.

2. **Requests (`/requests/{requestId}`)**:
   - Every request must contain a non-empty `clientEmail` identifying its parent organization.
   - Request IDs must follow the format `BD-[0-9]{4}`.
   - Status transitions must start at `pending` and can only progress through defined stages (`pending` -> `reviewing` -> `planned` -> `approved` -> `completed`).
   - Timestamps `createdAt` are immutable after creation.

---

## 2. The "Dirty Dozen" Threat Payloads

The following payloads represent illegal queries or writes designed to corrupt the system, which are blocked by our fortress rules:

1. **Self-Assigned Elevation**: Attempting to insert a shadow field like `"isAdmin": true` in the client metadata.
2. **Identity Spoofing**: Attempting to write a request under another company's email ID (`"clientEmail": "victim@bank.com"`).
3. **Invalid ID Character Injection**: Creating projects with 1.5KB long malicious document tags to crash dashboards.
4. **State Shortcutting**: Forcing Status directly to `"completed"` upon submission to bypass financial sizing reviews.
5. **Timestamp Backdating**: Modifying `"createdAt"` of a past request to manipulate timeline performance telemetry.
6. **Immutable Key Modification**: Updating a registered client's email document ID.
7. **Recursive Cost Exhaustion**: Submitting huge arrays of nested fields in the `"techStack"` to overflow memory limits.
8. **Malicious Blueprint Poisoning**: Registering a blank client without required password or company parameters.
9. **Duplicate ID Reservation**: Registering a profile with an existing user's corporate email.
10. **State Corruption Overwrite**: Submitting floating point budgets instead of valid monetary formatted string sizes.
11. **Malicious Query Scraping**: Attempting a blanket query to read all requests belonging to other clients.
12. **Status Progression Tampering**: Attempting to move an index back from `"completed"` to `"pending"`.

---

## 3. Fortress Firestore Rules DRAFT

These rules will be validated and deployed to protect the client and request nodes.

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Global safety net: Deny all by default
    match /{document=**} {
      allow read, write: if false;
    }

    // Helper functions
    function isValidId(id) {
      return id is string && id.size() <= 64 && id.matches('^[a-zA-Z0-9_\\-\\.@]+$');
    }

    function incoming(request) {
      return request.resource.data;
    }

    function existing(resource) {
      return resource.data;
    }

    // Validation Blueprint for Clients
    function isValidClient(client) {
      return client.email is string && client.email.size() > 3 && client.email.size() <= 100
        && client.name is string && client.name.size() > 1 && client.name.size() <= 100
        && client.companyName is string && client.companyName.size() > 1 && client.companyName.size() <= 100
        && client.password is string && client.password.size() >= 6 && client.password.size() <= 128;
    }

    // Validation Blueprint for Requests
    function isValidRequest(req) {
      return req.id is string && req.id.size() <= 16
        && req.clientEmail is string && req.clientEmail.size() > 3 && req.clientEmail.size() <= 100
        && req.name is string && req.name.size() > 1 && req.name.size() <= 100
        && req.companyName is string && req.companyName.size() > 1 && req.companyName.size() <= 100
        && req.sectorId is string && req.sectorId.size() > 1 && req.sectorId.size() <= 32
        && req.solutionId is string && req.solutionId.size() > 1 && req.solutionId.size() <= 32
        && req.message is string && req.message.size() <= 10000
        && req.status is string && (req.status == 'pending' || req.status == 'reviewing' || req.status == 'planned' || req.status == 'approved' || req.status == 'completed')
        && req.createdAt is string && req.createdAt.size() <= 32;
    }

    // Client profiles matchmaking
    match /clients/{email} {
      allow create: if isValidId(email) && isValidClient(incoming(request)) && incoming(request).email == email;
      allow read: if isValidId(email);
      allow update: if isValidId(email) && isValidClient(incoming(request)) && incoming(request).email == email && incoming(request).password == existing(resource).password;
      allow delete: if false;
    }

    // Service solutions and tracker requests matchmaking
    match /requests/{requestId} {
      allow create: if isValidId(requestId) && isValidRequest(incoming(request)) && incoming(request).id == requestId;
      allow read: if isValidId(requestId);
      allow update: if isValidId(requestId) && isValidRequest(incoming(request)) 
        && incoming(request).id == existing(resource).id
        && incoming(request).clientEmail == existing(resource).clientEmail
        && incoming(request).createdAt == existing(resource).createdAt;
      allow delete: if false;
    }
  }
}
```
