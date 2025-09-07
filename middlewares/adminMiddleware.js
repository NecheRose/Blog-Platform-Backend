
// Superadmin only
export const superAdminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.user.role !== "superadmin") {
    return res.status(403).json({ message: "Forbidden: Admins only!" });
  }

  next();
};

// Admin only
export const adminOrSuperadminOnly = (req, res, next) => {
  // Check if authorized user
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.user.role !== "admin" && req.user.role !== "superadmin") {
    return res.status(403).json({ message: "Forbidden: Admins only!" });
  }

  next();
};