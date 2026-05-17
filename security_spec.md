# Security Specification for Sana Pets & Accessories

## 1. Data Invariants
- A **Pet** must have at least one image and a valid price (>0).
- An **Accessory** must belong to a predefined category.
- A **Review** must be linked to an existing accessory.
- An **Enquiry** must have a valid email and a non-empty message.
- **Admin** access is strictly controlled via the `admins` collection.

## 2. The "Dirty Dozen" Payloads (Attacks to Block)
1. **Identity Spoofing**: Attempt to delete a pet as a non-authenticated user.
2. **Resource Poisoning**: Attempt to create a pet with a 2MB description string.
3. **Price Manipulation**: Attempt to update a pet's price to $0 as a customer.
4. **Shadow Update**: Attempt to add an `isAdmin` field to a user profile.
5. **Orphaned Write**: Attempt to create a review for a non-existent accessory.
6. **Information Scraping**: Attempt to list all enquiries as a guest.
7. **PII Leak**: Attempt to read another user's email from the `admins` collection.
8. **Spam Injection**: Attempt to create 1000 enquiries in 1 second (Rate limiting - though rules can only check request frequency indirectly).
9. **State Shortcutting**: Attempt to mark an enquiry as 'read' without being an admin.
10. **Type Mismatch**: Attempt to set pet price as a string "FREE".
11. **Key Injection**: Attempt to add a `verifiedPet` field to a pet document.
12. **Recursive Cost Attack**: Attempt to query reviews with a complex join-like filter that bypasses indexing.

## 3. Test Runner (Draft)
A comprehensive test suite will be implemented in `firestore.rules.test.ts` to verify these protections.
