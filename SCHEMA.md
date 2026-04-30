# Gopo Schema

## Overview

The system uses MongoDB through Mongoose. Images are stored in Cloudinary. MongoDB stores metadata, relationships, descriptors, billing state, and analytics logs.

## Collections

### `users`

Source: `backend/models/User.js`

Purpose:

- Stores platform user identities for admins and guest-access accounts.

Fields:

- `name: String`
- `email: String`
- `passwordHash: String`
- `role: "user" | "admin"`
- `createdAt`
- `updatedAt`

Notes:

- Guest login can auto-create a `User` with role `user` from a matching `Guest` email.
- Superadmin is not stored here; it is environment-configured.

### `events`

Source: `backend/models/Event.js`

Purpose:

- Stores event or wedding records owned by admins.

Fields:

- `name: String`
- `code: String`
- `ownerId: ObjectId -> User`
- `createdAt: Date`

Notes:

- `code` is the public event identifier used by guest registration.
- Admin detail pages use `_id` internally.

### `guests`

Source: `backend/models/Guest.js`

Purpose:

- Stores guest registrations for a specific event.

Fields:

- `name: String`
- `email: String`
- `selfieUrl: String`
- `selfiePublicId: String`
- `faceDescriptor: Number[]`
- `eventId: String`
- `createdAt: Date`

Notes:

- `eventId` stores the event code, not the event document `_id`.
- `faceDescriptor` is the embedding used for face matching.

### `photos`

Source: `backend/models/Photo.js`

Purpose:

- Stores uploaded event photos and per-face detection output.

Fields:

- `cloudinaryUrl: String`
- `publicId: String`
- `eventId: String`
- `detectedFaces: Array`
- `processed: Boolean`
- `createdAt: Date`

`detectedFaces[]` structure:

- `descriptor: Number[]`
- `box.x: Number`
- `box.y: Number`
- `box.width: Number`
- `box.height: Number`

Notes:

- `processed = false` means the photo has not been matched yet.
- `eventId` stores event code.

### `matches`

Source: `backend/models/Match.js`

Purpose:

- Join table between guests and matched photos.

Fields:

- `photoId: ObjectId -> Photo`
- `guestId: ObjectId -> Guest`
- `confidence: Number`
- `createdAt: Date`

Notes:

- One photo may match many guests.
- One guest may match many photos.

### `downloadlogs`

Source: `backend/models/DownloadLog.js`

Purpose:

- Tracks photo delivery and download analytics.

Fields:

- `eventId: String`
- `photoId: ObjectId -> Photo`
- `guestId: ObjectId -> Guest`
- `downloadedAt: Date`

Uses:

- Total downloads
- Downloaded vs non-downloaded photo counts
- Unique guests who downloaded
- Last 7 days trend

### `subscriptionplans`

Source: `backend/models/SubscriptionPlan.js`

Purpose:

- Defines available admin billing plans.

Fields:

- `code: String`
- `name: String`
- `amount: Number`
- `currency: String`
- `billingCycle: "monthly" | "yearly" | "one_time"`
- `uploadLimit: Number`
- `razorpayPlanId: String | null`
- `isActive: Boolean`
- `createdAt`
- `updatedAt`

Notes:

- Default plans are seeded by `billingService.syncDefaultPlans()`.

### `adminsubscriptions`

Source: `backend/models/AdminSubscription.js`

Purpose:

- Stores active or historical billing entitlements for admins.

Fields:

- `adminId: ObjectId -> User`
- `planId: ObjectId -> SubscriptionPlan`
- `paymentGateway: "razorpay"`
- `razorpayOrderId: String | null`
- `razorpayPaymentId: String | null`
- `razorpaySubscriptionId: String | null`
- `status: "pending" | "active" | "expired" | "cancelled" | "failed" | "replaced"`
- `currentPeriodStart: Date | null`
- `currentPeriodEnd: Date | null`
- `cancelAtPeriodEnd: Boolean`
- `uploadLimit: Number`
- `createdAt`
- `updatedAt`

Notes:

- When a new plan is activated, previous active or pending plans are marked `replaced`.

### `adminuploadusages`

Source: `backend/models/AdminUploadUsage.js`

Purpose:

- Tracks quota consumption for an admin subscription.

Fields:

- `adminId: ObjectId -> User`
- `subscriptionId: ObjectId -> AdminSubscription`
- `usedUploads: Number`
- `resetDate: Date | null`
- `createdAt`
- `updatedAt`

Notes:

- One usage record per subscription.

### `payments`

Source: `backend/models/Payment.js`

Purpose:

- Stores payment attempts and paid records from Razorpay.

Fields:

- `adminId: ObjectId -> User`
- `planId: ObjectId -> SubscriptionPlan`
- `subscriptionId: ObjectId -> AdminSubscription | null`
- `paymentGateway: "razorpay"`
- `orderId: String`
- `paymentId: String | null`
- `signature: String | null`
- `amount: Number`
- `currency: String`
- `status: "created" | "paid" | "failed"`
- `notes: Mixed`
- `rawWebhookData: Mixed | null`
- `createdAt`
- `updatedAt`

## Relationship Map

```text
User(admin) 1---* Event
User(admin) 1---* Payment
User(admin) 1---* AdminSubscription

Event(code) 1---* Guest
Event(code) 1---* Photo

Guest 1---* Match *---1 Photo
Guest 1---* DownloadLog *---1 Photo

SubscriptionPlan 1---* AdminSubscription
SubscriptionPlan 1---* Payment

AdminSubscription 1---1 AdminUploadUsage
Payment *---1 AdminSubscription
```

## Logical Data Rules

- Event ownership is enforced through `ownerId` and admin auth.
- Guests and photos are grouped by `eventId = Event.code`.
- Upload quota is enforced at the admin subscription level.
- Download metrics are event-based and guest-based.
- Guest access to photos is validated through `Match`.

## Suggested Future Indexes and Constraints

These are not all implemented yet, but they would improve integrity:

- unique `Event.code`
- unique composite `Guest(email, eventId)`
- unique composite `Match(photoId, guestId)`
- index on `Photo(eventId, processed)`
- index on `Guest(eventId, email)`
- index on `AdminSubscription(adminId, status, createdAt)`

## Missing or Placeholder Model

- `backend/models/Job.js` exists but is empty.

This strongly suggests future async processing was planned but not completed.
