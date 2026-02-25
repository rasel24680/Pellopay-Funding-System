/**
 * Mock In-Memory Database
 * No real DB connection needed — all data is stored in memory.
 */
const bcrypt = require("bcryptjs");

// Pre-hash the demo password "Password1"
const hashedPassword = bcrypt.hashSync("Password1", 10);

// ===== In-Memory Data Store =====
const store = {
  users: [
    {
      id: 1,
      first_name: "Demo",
      last_name: "User",
      email: "demo@pellopay.com",
      password: hashedPassword,
      business_name: "Demo Business Ltd",
      business_type: "Limited company",
      phone: "+441234567890",
      phone_verified: true,
      is_active: true,
      created_at: new Date("2025-01-01"),
      last_login: new Date(),
    },
  ],
  funding_applications: [
    {
      id: 1,
      user_id: 1,
      session_id: "demo-session",
      funding_amount: 50000,
      funding_purpose: "Growth",
      asset_type: null,
      importance: "Fast approval",
      annual_turnover: 250000,
      trading_years: "Yes",
      trading_months: null,
      homeowner: "Yes",
      contact_first_name: "Demo",
      contact_last_name: "User",
      contact_email: "demo@pellopay.com",
      contact_phone: "+441234567890",
      business_type: "Limited company",
      business_name: "Demo Business Ltd",
      status: "pending",
      admin_notes: null,
      created_at: new Date("2025-06-01"),
      updated_at: new Date("2025-06-01"),
    },
  ],
  contact_inquiries: [],
  phone_verifications: [],
  password_reset_tokens: [],
  funders: [
    {
      id: 1, name: "QuickFund UK", logo_url: null, base_rate: 5.9, approval_speed: "24 hours",
      key_feature: "Same-day decisions", description: "Fast business loans for SMEs",
      min_amount: 5000, max_amount: 500000, funding_purposes: '["Growth","Cashflow","Refinancing"]',
      requires_homeowner: false, min_trading_years: 1, accepts_impaired_credit: true,
      contact_email: "info@quickfund.co.uk", website: "https://quickfund.co.uk", is_active: true,
    },
    {
      id: 2, name: "Capital Bridge Finance", logo_url: null, base_rate: 4.5, approval_speed: "48 hours",
      key_feature: "Low rates for established businesses", description: "Competitive rates for growing businesses",
      min_amount: 10000, max_amount: 2000000, funding_purposes: '["Growth","Cashflow","Refinancing","Asset Finance"]',
      requires_homeowner: false, min_trading_years: 2, accepts_impaired_credit: false,
      contact_email: "apply@capitalbridge.co.uk", website: "https://capitalbridge.co.uk", is_active: true,
    },
    {
      id: 3, name: "Horizon Business Lending", logo_url: null, base_rate: 7.2, approval_speed: "Same day",
      key_feature: "No security required under £100k", description: "Unsecured business funding",
      min_amount: 1000, max_amount: 300000, funding_purposes: '["Growth","Cashflow","Other"]',
      requires_homeowner: false, min_trading_years: 0, accepts_impaired_credit: true,
      contact_email: "hello@horizonlending.co.uk", website: "https://horizonlending.co.uk", is_active: true,
    },
    {
      id: 4, name: "Sterling Asset Finance", logo_url: null, base_rate: 3.9, approval_speed: "3-5 days",
      key_feature: "Specialist asset finance", description: "Equipment and vehicle finance experts",
      min_amount: 5000, max_amount: 5000000, funding_purposes: '["Asset Finance"]',
      requires_homeowner: false, min_trading_years: 1, accepts_impaired_credit: false,
      contact_email: "finance@sterlingasset.co.uk", website: "https://sterlingasset.co.uk", is_active: true,
    },
    {
      id: 5, name: "Pioneer SME Fund", logo_url: null, base_rate: 6.5, approval_speed: "24-48 hours",
      key_feature: "Start-up friendly", description: "Funding for new and growing businesses",
      min_amount: 1000, max_amount: 150000, funding_purposes: '["Growth","Cashflow","Other"]',
      requires_homeowner: false, min_trading_years: 0, accepts_impaired_credit: true,
      contact_email: "apply@pioneersme.co.uk", website: "https://pioneersme.co.uk", is_active: true,
    },
  ],
  _nextId: { users: 2, funding_applications: 2, contact_inquiries: 1, phone_verifications: 1, password_reset_tokens: 1 },
};

/**
 * Mock query function that mimics mysql2/promise pool.query()
 * Returns [rows, fields] like mysql2 does.
 */
async function query(sql, params = []) {
  // Normalize SQL for matching
  const s = sql.replace(/\s+/g, " ").trim().toUpperCase();

  // ===== SELECT queries =====
  if (s.startsWith("SELECT")) {
    // Users
    if (s.includes("FROM USERS")) {
      if (s.includes("WHERE EMAIL =")) {
        const rows = store.users.filter((u) => u.email === params[0]);
        return [rows, []];
      }
      if (s.includes("WHERE ID =")) {
        const rows = store.users.filter((u) => u.id === params[0]);
        return [rows, []];
      }
      return [store.users, []];
    }

    // Funding applications
    if (s.includes("FROM FUNDING_APPLICATIONS")) {
      if (s.includes("SESSION_ID =")) {
        const sid = params[0];
        const rows = store.funding_applications.filter((a) => a.session_id === sid);
        return [rows, []];
      }
      if (s.includes("USER_ID =") && s.includes("WHERE ID =")) {
        const rows = store.funding_applications.filter((a) => a.id === parseInt(params[0]) && a.user_id === params[1]);
        return [rows, []];
      }
      if (s.includes("USER_ID =")) {
        const uid = params.find((p) => typeof p === "number") || params[0];
        const rows = store.funding_applications.filter((a) => a.user_id === uid);
        return [rows, []];
      }
      return [store.funding_applications, []];
    }

    // Funders 
    if (s.includes("FROM FUNDERS")) {
      let results = store.funders.filter((f) => f.is_active);
      if (params.length >= 2) {
        const amount = params[0];
        results = results.filter((f) => f.min_amount <= amount && f.max_amount >= amount);
      }
      return [results, []];
    }

    // Contact inquiries
    if (s.includes("FROM CONTACT_INQUIRIES")) {
      return [store.contact_inquiries, []];
    }

    // Phone verifications
    if (s.includes("FROM PHONE_VERIFICATIONS")) {
      const rows = store.phone_verifications.filter((v) => v.user_id === params[0]);
      return [rows, []];
    }

    // Password reset tokens
    if (s.includes("FROM PASSWORD_RESET_TOKENS")) {
      const rows = store.password_reset_tokens.filter((t) => t.token === params[0] && !t.used);
      return [rows, []];
    }

    return [[], []];
  }

  // ===== INSERT queries =====
  if (s.startsWith("INSERT")) {
    if (s.includes("INTO USERS")) {
      const id = store._nextId.users++;
      const newUser = {
        id, first_name: params[0], last_name: params[1], email: params[2], password: params[3],
        business_name: params[4], business_type: params[5], phone: params[6],
        phone_verified: false, is_active: true, created_at: new Date(), last_login: null,
      };
      store.users.push(newUser);
      return [{ insertId: id, affectedRows: 1 }, []];
    }
    if (s.includes("INTO FUNDING_APPLICATIONS")) {
      const id = store._nextId.funding_applications++;
      const newApp = {
        id, user_id: params[0], session_id: params[1], funding_amount: params[2],
        funding_purpose: params[3], asset_type: params[4], importance: params[5],
        annual_turnover: params[6], trading_years: params[7], trading_months: params[8],
        homeowner: params[9], contact_first_name: params[10], contact_last_name: params[11],
        contact_email: params[12], contact_phone: params[13], business_type: params[14],
        business_name: params[15], status: "pending", admin_notes: null,
        created_at: new Date(), updated_at: new Date(),
      };
      store.funding_applications.push(newApp);
      return [{ insertId: id, affectedRows: 1 }, []];
    }
    if (s.includes("INTO CONTACT_INQUIRIES")) {
      const id = store._nextId.contact_inquiries++;
      store.contact_inquiries.push({
        id, name: params[0], email: params[1], phone: params[2],
        business_name: params[3], subject: params[4], message: params[5], created_at: new Date(),
      });
      return [{ insertId: id, affectedRows: 1 }, []];
    }
    if (s.includes("INTO PHONE_VERIFICATIONS")) {
      const id = store._nextId.phone_verifications++;
      store.phone_verifications.push({
        id, user_id: params[0], phone: params[1], code: params[2],
        expires_at: params[3], attempts: 0, created_at: new Date(),
      });
      return [{ insertId: id, affectedRows: 1 }, []];
    }
    if (s.includes("INTO PASSWORD_RESET_TOKENS")) {
      const id = store._nextId.password_reset_tokens++;
      store.password_reset_tokens.push({
        id, user_id: params[0], token: params[1], expires_at: params[2], used: false,
      });
      return [{ insertId: id, affectedRows: 1 }, []];
    }
    return [{ insertId: 0, affectedRows: 0 }, []];
  }

  // ===== UPDATE queries =====
  if (s.startsWith("UPDATE")) {
    if (s.includes("USERS")) {
      const userId = params[params.length - 1];
      const user = store.users.find((u) => u.id === userId);
      if (user) {
        if (s.includes("LAST_LOGIN")) user.last_login = new Date();
        if (s.includes("PHONE_VERIFIED = TRUE")) user.phone_verified = true;
        if (s.includes("PHONE_VERIFIED = FALSE")) user.phone_verified = false;
        if (s.includes("IS_ACTIVE = FALSE")) user.is_active = false;
        if (s.includes("PASSWORD =")) user.password = params[0];
        if (s.includes("PHONE =") && !s.includes("PHONE_VERIFIED")) user.phone = params[0];
        return [{ affectedRows: 1 }, []];
      }
      return [{ affectedRows: 0 }, []];
    }
    if (s.includes("FUNDING_APPLICATIONS")) {
      if (s.includes("USER_ID =") && s.includes("SESSION_ID =")) {
        const uid = params[0];
        const sid = params[1];
        let count = 0;
        store.funding_applications.forEach((a) => {
          if (a.session_id === sid && a.user_id === null) { a.user_id = uid; count++; }
        });
        return [{ affectedRows: count }, []];
      }
      return [{ affectedRows: 0 }, []];
    }
    if (s.includes("PHONE_VERIFICATIONS")) {
      return [{ affectedRows: 1 }, []];
    }
    if (s.includes("PASSWORD_RESET_TOKENS")) {
      const tok = store.password_reset_tokens.find((t) => t.id === params[0] || t.token === params[0]);
      if (tok) tok.used = true;
      return [{ affectedRows: 1 }, []];
    }
    return [{ affectedRows: 0 }, []];
  }

  // ===== DELETE queries =====
  if (s.startsWith("DELETE")) {
    if (s.includes("PHONE_VERIFICATIONS")) {
      store.phone_verifications = store.phone_verifications.filter((v) => v.user_id !== params[0]);
      return [{ affectedRows: 1 }, []];
    }
    if (s.includes("FUNDING_APPLICATIONS")) {
      const before = store.funding_applications.length;
      store.funding_applications = store.funding_applications.filter(
        (a) => !(a.id === parseInt(params[0]) && a.user_id === params[1] && a.status === "pending")
      );
      return [{ affectedRows: before - store.funding_applications.length }, []];
    }
    return [{ affectedRows: 0 }, []];
  }

  return [[], []];
}

console.log("✅ Mock in-memory database loaded (no MySQL required)");
console.log("📧 Demo login: demo@pellopay.com / Password1");

module.exports = { query };
