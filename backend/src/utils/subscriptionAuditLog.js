const pool = require("../config/pool");

const createSubscriptionAuditLog = async ({
  gym_id,
  subscription_id,
  subscription_plan_id,
  plan_name,
  admin_id,
  admin_name,
  action,
  old_amount = 0,
  new_amount = 0,
  old_expire_date = null,
  new_expire_date = null,
  details = null,
  ip_address = null,
  user_agent = null,
}) => {
  const [result] = await pool.query(
    `
    INSERT INTO subscription_audit_logs (
      gym_id,
      subscription_id,
      subscription_plan_id,
      plan_name,
      admin_id,
      admin_name,
      action,
      old_amount,
      new_amount,
      old_expire_date,
      new_expire_date,
      details,
      ip_address,
      user_agent
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      gym_id,
      subscription_id,
      subscription_plan_id,
      plan_name,
      admin_id,
      admin_name,
      action,
      old_amount,
      new_amount,
      old_expire_date,
      new_expire_date,
      details,
      ip_address,
      user_agent,
    ]
  );

  return result.insertId;
};

module.exports = createSubscriptionAuditLog;