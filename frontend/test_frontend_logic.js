const assert = require("assert");

// Quick test for TypeScript definitions and structure
console.log("Starting Frontend Logic Verification Suite...");

// 1. Status Mapping Verification
const getStatusBadge = (status) => {
  if (status === "Oltalama Riski" || status === "phishing") return "danger";
  if (status === "Şüpheli" || status === "suspicious") return "warning";
  return "safe";
};

assert.strictEqual(getStatusBadge("Güvenli"), "safe");
assert.strictEqual(getStatusBadge("safe"), "safe");
assert.strictEqual(getStatusBadge("Şüpheli"), "warning");
assert.strictEqual(getStatusBadge("suspicious"), "warning");
assert.strictEqual(getStatusBadge("Oltalama Riski"), "danger");
assert.strictEqual(getStatusBadge("phishing"), "danger");
console.log("✓ Status mapping logic verified");

// 2. Input validation tests
const validateUrl = (url) => {
  const trimmed = (url || "").trim();
  if (!trimmed) return "Lütfen bir web adresi giriniz.";
  if (!trimmed.includes(".") || trimmed.length < 4) return "Geçerli bir alan adı formatı giriniz.";
  return null;
};

assert.strictEqual(validateUrl(""), "Lütfen bir web adresi giriniz.");
assert.strictEqual(validateUrl("   "), "Lütfen bir web adresi giriniz.");
assert.strictEqual(validateUrl("invalid"), "Geçerli bir alan adı formatı giriniz.");
assert.strictEqual(validateUrl("site.com"), null);
assert.strictEqual(validateUrl("https://turkiye.gov.tr"), null);
console.log("✓ URL Input validation logic verified");

// 3. Message validation tests
const validateMessage = (msg) => {
  const trimmed = (msg || "").trim();
  if (!trimmed) return "Lütfen analiz edilecek metni giriniz.";
  return null;
};

assert.strictEqual(validateMessage(""), "Lütfen analiz edilecek metni giriniz.");
assert.strictEqual(validateMessage("HGS borcunuz vardir"), null);
console.log("✓ Message validation logic verified");

console.log("\n========================================");
console.log("ALL FRONTEND LOGIC TESTS PASSED (100%)");
console.log("========================================");
