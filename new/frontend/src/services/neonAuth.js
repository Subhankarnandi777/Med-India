// =============================================
// Med India - Neon Authentication
// =============================================

const AUTH_URL =
  "https://ep-noisy-poetry-aiql2qy4.neonauth.c-4.us-east-1.aws.neon.tech/neondb/auth";

const DATABASE_URL =
  "https://ep-noisy-poetry-aiql2qy4.apirest.c-4.us-east-1.aws.neon.tech/neondb/rest/v1";

// =============================================
// Session
// =============================================

let jwtToken = localStorage.getItem("jwtToken");
let currentUser = null;
let pendingProfile = null;

// =============================================
// Helpers
// =============================================

const isEmail = (value) => value.includes("@");

const formatEmail = (email) =>
  isEmail(email) ? email : `${email}@medindia.com`;

function saveToken(token) {
  jwtToken = token;

  if (token)
    localStorage.setItem("jwtToken", token);
  else
    localStorage.removeItem("jwtToken");
}

export function getToken() {
  return jwtToken;
}

export function logout() {
  currentUser = null;
  pendingProfile = null;
  saveToken(null);
}

async function authHeaders() {
  const headers = {
    "Content-Type": "application/json",
  };

  if (jwtToken) {
    headers.Authorization = `Bearer ${jwtToken}`;
  }

  return headers;
}

const BACKEND_URL = "http://localhost:8000/api";

async function saveProfileBackend(profileData) {
  if (!profileData || !profileData.id) return null;
  try {
    const res = await fetch(`${BACKEND_URL}/auth/profile`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profileData),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.error("Backend profile save error:", err);
  }
  return null;
}

// =============================================
// Signup
// =============================================
// Signup
// =============================================

export async function signUp({
  email,
  password,
  fullName,
  role,
  mobile,
  address = "",
  shopName = "",
  licenseNumber = "",
  specialty = "",
  docLicenseId = "",
}) {

  email = formatEmail(email);

  const response = await fetch(
    `${AUTH_URL}/sign-up/email`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        name: fullName,
      }),
    }
  );

  const text = await response.text();

  let json = {};

  try {
    json = JSON.parse(text);
  } catch {}

  if (!response.ok && response.status !== 422) {
    throw new Error(json.message || text);
  }

  pendingProfile = {
    id: json.user?.id || null,
    email,
    full_name: fullName,
    role,
    mobile,
    extra_details: {
      address,
      shop_name: shopName,
      license_number: licenseNumber,
      specialty,
      doc_license_id: docLicenseId,
    },
  };

  try {
    localStorage.setItem("pendingProfile", JSON.stringify(pendingProfile));
  } catch (e) {}

  return {
    success: true,
    email,
  };
}

// =============================================
// Login
// =============================================

export async function signIn(email, password, selectedRole = "Patient") {

  email = formatEmail(email);

  const response = await fetch(
    `${AUTH_URL}/sign-in/email`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    }
  );

  const text = await response.text();

  let json = {};

  try {
    json = JSON.parse(text);
  } catch {}

  if (!response.ok) {
    const err = new Error(
      json.message ||
      text ||
      "Invalid email or password"
    );
    err.code = json.code || (response.status === 403 ? "EMAIL_NOT_VERIFIED" : null);
    err.email = email;
    throw err;
  }

  // Save JWT if returned directly
  if (json.token) {
    saveToken(json.token);
  }

  const userId = json.user?.id;
  const fullName = json.user?.name || email.split("@")[0];

  currentUser = {
    id: userId,
    email: json.user?.email || email,
    full_name: fullName,
  };

  // Load profile if it exists
  try {
    let profile = null;
    if (currentUser.id) {
      profile = await getProfile(currentUser.id);
    }
    if (!profile && email) {
      profile = await getProfileByEmail(email);
    }

    if (!profile && jwtToken) {
      try {
        const meRes = await fetch(`${BACKEND_URL}/auth/me`, {
          headers: await authHeaders(),
        });
        if (meRes.ok) {
          const meData = await meRes.json();
          if (meData?.user?.role) {
            profile = meData.user;
          }
        }
      } catch (err) {}
    }

    // Auto-heal missing profiles for legacy user accounts
    if (!profile && userId) {
      const newProfile = {
        id: userId,
        email: email,
        full_name: fullName,
        role: selectedRole,
        mobile: "",
        extra_details: {},
      };
      
      await saveProfileBackend(newProfile).catch(() => {});
      await fetch(`${DATABASE_URL}/profiles`, {
        method: "POST",
        headers: {
          ...(await authHeaders()),
          Prefer: "return=representation",
        },
        body: JSON.stringify(newProfile),
      }).catch(() => {});

      profile = newProfile;
    } else if (profile && userId && profile.id !== userId) {
      profile.id = userId;
      await updateProfile(userId, { id: userId }).catch(() => {});
      await saveProfileBackend(profile).catch(() => {});
    }

    if (profile) {
      currentUser = {
        ...currentUser,
        ...profile,
      };
    }
  } catch (err) {
    console.error("Error loading profile on signIn:", err);
  }

  return {
    success: true,
    token: jwtToken,
    user: currentUser,
    emailVerified:
      json.user?.emailVerified ?? true,
  };

}

// =============================================
// Resend Verification OTP
// =============================================

export async function resendOtp(email) {

  email = formatEmail(email);

  const response = await fetch(
    `${AUTH_URL}/email-otp/send-verification-otp`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        type: "email-verification",
      }),
    }
  );

  if (!response.ok) {

    const text = await response.text();

    throw new Error(text);

  }

  return true;

}

// =============================================
// Verify OTP
// =============================================

export async function verifyOtp(email, otp) {

  email = formatEmail(email);
  if (typeof otp === "string") {
    otp = otp.trim();
  }

  const response = await fetch(
    `${AUTH_URL}/email-otp/verify-email`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        otp,
      }),
    }
  );

  const text = await response.text();

  let json = {};

  try {
    json = JSON.parse(text);
  } catch {}

  if (!response.ok) {

    throw new Error(
      json.message ||
      text ||
      "OTP verification failed"
    );

  }

  if (json.token) {
    saveToken(json.token);
  }

  const userId = json.user?.id;

  let profileToSave = pendingProfile;
  if (!profileToSave) {
    try {
      const stored = localStorage.getItem("pendingProfile");
      if (stored) profileToSave = JSON.parse(stored);
    } catch (e) {}
  }

  if (profileToSave && userId) {
    profileToSave.id = userId;
  }

  currentUser = {
    ...(profileToSave || {}),
    id: userId || profileToSave?.id,
    email: email || json.user?.email,
  };

  // Create profile in database if it does not exist
  if (userId) {
    try {
      let existing = await getProfile(userId);
      if (!existing && email) {
        existing = await getProfileByEmail(email);
      }

      if (profileToSave) {
        profileToSave.id = userId;
        // Always sync with backend database first
        const backendProfile = await saveProfileBackend(profileToSave);
        if (backendProfile) {
          currentUser = backendProfile;
        }
      }

      if (!existing && profileToSave) {
        const createRes = await fetch(
          `${DATABASE_URL}/profiles`,
          {
            method: "POST",
            headers: {
              ...(await authHeaders()),
              Prefer: "return=representation",
            },
            body: JSON.stringify(profileToSave),
          }
        );

        if (createRes.ok) {
          const resData = await createRes.json().catch(() => null);
          if (resData && resData.length) {
            currentUser = resData[0];
          } else {
            currentUser = profileToSave;
          }
        } else {
          console.error("Failed to insert profile via PostgREST:", await createRes.text());
          if (!currentUser?.role) currentUser = profileToSave;
        }
      } else if (existing) {
        if (!existing.role && profileToSave?.role) {
          existing.role = profileToSave.role;
          await updateProfile(userId, { role: profileToSave.role }).catch(() => {});
        }
        if (!currentUser?.role) currentUser = existing;
      }
    } catch (err) {
      console.error("Profile creation error during verifyOtp:", err);
      if (profileToSave && !currentUser?.role) currentUser = profileToSave;
    }
  }

  pendingProfile = null;
  try {
    localStorage.removeItem("pendingProfile");
  } catch (e) {}

  return {
    success: true,
    token: jwtToken,
    user: currentUser,
  };

}

// =============================================
// Get Profile
// =============================================

export async function getProfile(userId) {
  if (!userId) return null;
  try {
    const response = await fetch(
      `${DATABASE_URL}/profiles?id=eq.${userId}&select=*`,
      {
        headers: await authHeaders(),
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    if (!data.length)
      return null;

    return data[0];
  } catch (err) {
    console.error("getProfile error:", err);
    return null;
  }
}

export async function getProfileByEmail(email) {
  if (!email) return null;
  try {
    const response = await fetch(
      `${DATABASE_URL}/profiles?email=eq.${encodeURIComponent(email)}&select=*`,
      {
        headers: await authHeaders(),
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    if (!data.length)
      return null;

    return data[0];
  } catch (err) {
    console.error("getProfileByEmail error:", err);
    return null;
  }
}

// =============================================
// Update Profile
// =============================================

export async function updateProfile(
  id,
  updates
) {

  const response = await fetch(
    `${DATABASE_URL}/profiles?id=eq.${id}`,
    {
      method: "PATCH",
      headers: {
        ...(await authHeaders()),
        Prefer: "return=representation",
      },
      body: JSON.stringify(updates),
    }
  );

  if (!response.ok) {

    throw new Error(
      await response.text()
    );

  }

  const data = await response.json();

  if (data.length) {

    currentUser = data[0];

    return data[0];

  }

  return true;

}

// =============================================
// Session Helpers
// =============================================

export function getCurrentUser() {

  return currentUser;

}

export function getCurrentUserId() {

  return currentUser?.id ?? null;

}

export function getCurrentRole() {

  return currentUser?.role ?? null;

}

export function getCurrentEmail() {

  return currentUser?.email ?? null;

}

export function isLoggedIn() {

  return !!jwtToken;

}

export function clearSession() {

  currentUser = null;

  pendingProfile = null;

  saveToken(null);

}
// =============================================
// Forgot Password
// =============================================

export async function forgotPassword(email) {

  email = formatEmail(email);

  const response = await fetch(
    `${AUTH_URL}/forget-password`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return true;
}

// =============================================
// Verify Password Reset OTP
// =============================================

export async function verifyPasswordResetOtp(
  email,
  otp
) {

  email = formatEmail(email);

  const response = await fetch(
    `${AUTH_URL}/reset-password/verify-otp`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        otp,
      }),
    }
  );

  const text = await response.text();

  let json = {};

  try {
    json = JSON.parse(text);
  } catch {}

  if (!response.ok) {
    throw new Error(
      json.message ||
      text ||
      "OTP verification failed"
    );
  }

  return json.token;
}

// =============================================
// Change Password
// =============================================

export async function changePassword(
  token,
  password
) {

  const response = await fetch(
    `${AUTH_URL}/user/change-password`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return true;
}

// =============================================
// Reset Password
// =============================================

export async function resetPassword(email) {

  email = formatEmail(email);

  const response = await fetch(
    `${AUTH_URL}/reset-password/email`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return true;
}

// =============================================
// Default Export
// =============================================

const NeonAuth = {
  signUp,
  signIn,
  verifyOtp,
  resendOtp,
  forgotPassword,
  verifyPasswordResetOtp,
  changePassword,
  resetPassword,
  getProfile,
  updateProfile,
  getCurrentUser,
  getCurrentUserId,
  getCurrentRole,
  getCurrentEmail,
  getToken,
  isLoggedIn,
  logout,
  clearSession,
};

export default NeonAuth;