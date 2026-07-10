// controllers/campaignController.js

const db = require("../../config/pool");

/* =========================================================
   HELPER: ADD CAMPAIGN LOG
========================================================= */
const addCampaignLog = async ({
  connection,
  campaignId,
  recipientId = null,
  logType = "info",
  message,
  responseData = null,
}) => {
  await connection.query(
    `
    INSERT INTO campaign_logs (
      campaign_id,
      recipient_id,
      log_type,
      message,
      response_data
    )
    VALUES (?, ?, ?, ?, ?)
    `,
    [
      campaignId,
      recipientId,
      logType,
      message,
      responseData ? JSON.stringify(responseData) : null,
    ]
  );
};


/* =========================================================
   GET CAMPAIGN DASHBOARD
   GET /campaigns/dashboard?gymId=1
========================================================= */
const getFinalGymId = (req) => {
  return req.body?.gymId || req.query?.gymId || req.user?.gym_id || null;
};


const getCampaignDashboard = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        COUNT(DISTINCT c.id) AS totalCampaigns,

        COALESCE(
          SUM(CASE WHEN c.status = 'completed' THEN 1 ELSE 0 END),
          0
        ) AS completedCampaigns,

        COALESCE(
          SUM(
            CASE
              WHEN c.status IN ('pending', 'processing')
              THEN 1
              ELSE 0
            END
          ),
          0
        ) AS pendingCampaigns,

        COALESCE(
          SUM(CASE WHEN cr.status = 'sent' THEN 1 ELSE 0 END),
          0
        ) AS totalSent,

        COALESCE(COUNT(cr.id), 0) AS totalRecipients,

        COALESCE(
          SUM(CASE WHEN cr.status = 'failed' THEN 1 ELSE 0 END),
          0
        ) AS totalFailed,

        COALESCE(
          SUM(CASE WHEN cr.status = 'pending' THEN 1 ELSE 0 END),
          0
        ) AS totalPending,

        COALESCE(
          SUM(CASE WHEN cr.status = 'skipped' THEN 1 ELSE 0 END),
          0
        ) AS totalSkipped

      FROM campaigns c
      LEFT JOIN campaign_recipients cr
        ON cr.campaign_id = c.id
    `);

    return res.status(200).json({
      success: true,
      message: "Campaign dashboard fetched successfully",
      data: {
        totalCampaigns: Number(rows[0].totalCampaigns || 0),
        completedCampaigns: Number(rows[0].completedCampaigns || 0),
        pendingCampaigns: Number(rows[0].pendingCampaigns || 0),
        totalSent: Number(rows[0].totalSent || 0),
        totalRecipients: Number(rows[0].totalRecipients || 0),
        totalFailed: Number(rows[0].totalFailed || 0),
        totalPending: Number(rows[0].totalPending || 0),
        totalSkipped: Number(rows[0].totalSkipped || 0),
      },
    });
  } catch (error) {
    console.error("getCampaignDashboard error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch campaign dashboard",
      error: error.message,
    });
  }
};

/* =========================================================
   GET ALL CAMPAIGNS
   GET /campaigns?gymId=1&page=1&limit=10&type=notification&status=pending
========================================================= */
const getCampaigns = async (req, res) => {
  try {
    const gymId = getFinalGymId(req);

    const {
      page = 1,
      limit = 10,
      type,
      status,
      targetType,
      search,
    } = req.query;

    if (!gymId) {
      return res.status(400).json({
        success: false,
        message: "gymId is required",
      });
    }

    const pageNumber = Math.max(Number(page) || 1, 1);
    const pageLimit = Math.min(Math.max(Number(limit) || 10, 1), 100);
    const offset = (pageNumber - 1) * pageLimit;

    const conditions = ["c.gym_id = ?"];
    const params = [gymId];

    if (type && type !== "all") {
      conditions.push("c.campaign_type = ?");
      params.push(type);
    }

    if (status && status !== "all") {
      conditions.push("c.status = ?");
      params.push(status);
    }

    if (targetType && targetType !== "all") {
      conditions.push("c.target_type = ?");
      params.push(targetType);
    }

    if (search && String(search).trim()) {
      const keyword = `%${String(search).trim()}%`;

      conditions.push(`
        (
          c.campaign_name LIKE ?
          OR c.title LIKE ?
          OR c.message LIKE ?
          OR c.filter_criteria LIKE ?
        )
      `);

      params.push(keyword, keyword, keyword, keyword);
    }

    const whereClause = `WHERE ${conditions.join(" AND ")}`;

    const [campaigns] = await db.query(
      `
      SELECT
        c.id,
        c.gym_id,
        c.campaign_name,
        c.campaign_type,
        c.message,
        c.title,
        c.target_type,
        c.filter_criteria,
        c.total_recipients,
        c.sent_count,
        c.failed_count,
        c.status,
        c.scheduled_at,
        c.started_at,
        c.completed_at,
        c.created_by,
        c.created_at,
        c.updated_at,

        COUNT(cr.id) AS actual_recipients,

        COALESCE(
          SUM(CASE WHEN cr.status = 'sent' THEN 1 ELSE 0 END),
          0
        ) AS actual_sent,

        COALESCE(
          SUM(CASE WHEN cr.status = 'failed' THEN 1 ELSE 0 END),
          0
        ) AS actual_failed,

        COALESCE(
          SUM(CASE WHEN cr.status = 'pending' THEN 1 ELSE 0 END),
          0
        ) AS actual_pending,

        COALESCE(
          SUM(CASE WHEN cr.status = 'skipped' THEN 1 ELSE 0 END),
          0
        ) AS actual_skipped

      FROM campaigns c

      LEFT JOIN campaign_recipients cr
        ON cr.campaign_id = c.id

      ${whereClause}

      GROUP BY c.id

      ORDER BY c.created_at DESC

      LIMIT ? OFFSET ?
      `,
      [...params, pageLimit, offset]
    );

    const [countRows] = await db.query(
      `
      SELECT COUNT(*) AS total
      FROM campaigns c
      ${whereClause}
      `,
      params
    );

    return res.status(200).json({
      success: true,
      message: "Campaigns fetched successfully",
      pagination: {
        page: pageNumber,
        limit: pageLimit,
        total: Number(countRows[0].total || 0),
        totalPages: Math.ceil(
          Number(countRows[0].total || 0) / pageLimit
        ),
      },
      data: campaigns.map((campaign) => ({
        id: campaign.id,
        gymId: campaign.gym_id,
        campaignName: campaign.campaign_name,
        campaignType: campaign.campaign_type,
        title: campaign.title,
        message: campaign.message,
        targetType: campaign.target_type,
        filterCriteria: campaign.filter_criteria,

        recipients: Number(campaign.actual_recipients || 0),
        sent: Number(campaign.actual_sent || 0),
        failed: Number(campaign.actual_failed || 0),
        pending: Number(campaign.actual_pending || 0),
        skipped: Number(campaign.actual_skipped || 0),

        status: campaign.status,
        scheduledAt: campaign.scheduled_at,
        startedAt: campaign.started_at,
        completedAt: campaign.completed_at,
        createdBy: campaign.created_by,
        createdAt: campaign.created_at,
        updatedAt: campaign.updated_at,
      })),
    });
  } catch (error) {
    console.error("getCampaigns error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch campaigns",
      error: error.message,
    });
  }
};

/* =========================================================
   GET SINGLE CAMPAIGN
   GET /campaigns/:id
========================================================= */
const getCampaignById = async (req, res) => {
  try {
    const { id } = req.params;
    const gymId = getFinalGymId(req);

    let query = `
      SELECT
        c.*,

        COUNT(cr.id) AS actual_recipients,

        COALESCE(
          SUM(CASE WHEN cr.status = 'sent' THEN 1 ELSE 0 END),
          0
        ) AS actual_sent,

        COALESCE(
          SUM(CASE WHEN cr.status = 'failed' THEN 1 ELSE 0 END),
          0
        ) AS actual_failed,

        COALESCE(
          SUM(CASE WHEN cr.status = 'pending' THEN 1 ELSE 0 END),
          0
        ) AS actual_pending,

        COALESCE(
          SUM(CASE WHEN cr.status = 'skipped' THEN 1 ELSE 0 END),
          0
        ) AS actual_skipped

      FROM campaigns c
      LEFT JOIN campaign_recipients cr
        ON cr.campaign_id = c.id

      WHERE c.id = ?
    `;

    const params = [id];

    if (gymId) {
      query += " AND c.gym_id = ?";
      params.push(gymId);
    }

    query += " GROUP BY c.id";

    const [rows] = await db.query(query, params);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found",
      });
    }

    const campaign = rows[0];

    return res.status(200).json({
      success: true,
      message: "Campaign fetched successfully",
      data: {
        id: campaign.id,
        gymId: campaign.gym_id,
        campaignName: campaign.campaign_name,
        campaignType: campaign.campaign_type,
        title: campaign.title,
        message: campaign.message,
        targetType: campaign.target_type,
        filterCriteria: campaign.filter_criteria,

        recipients: Number(campaign.actual_recipients || 0),
        sent: Number(campaign.actual_sent || 0),
        failed: Number(campaign.actual_failed || 0),
        pending: Number(campaign.actual_pending || 0),
        skipped: Number(campaign.actual_skipped || 0),

        status: campaign.status,
        scheduledAt: campaign.scheduled_at,
        startedAt: campaign.started_at,
        completedAt: campaign.completed_at,
        createdBy: campaign.created_by,
        createdAt: campaign.created_at,
        updatedAt: campaign.updated_at,
      },
    });
  } catch (error) {
    console.error("getCampaignById error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch campaign",
      error: error.message,
    });
  }
};

/* =========================================================
   CREATE CAMPAIGN
   POST /campaigns

   BODY:
   {
     "gymId": 1,
     "campaignName": "Membership Renewal Reminder",
     "campaignType": "whatsapp",
     "title": "Renew Membership",
     "message": "Hello [Name], your membership expires soon.",
     "targetType": "selected",
     "selectedMemberIds": [1, 2, 3],
     "scheduledAt": null
   }
========================================================= */
const createCampaign = async (req, res) => {
  let connection;

  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    const gymId = getFinalGymId(req);

    const {
      campaignName,
      campaignType = "notification",
      title = null,
      message,
      targetType = "selected",
      filterCriteria = null,
      selectedMemberIds = [],
      scheduledAt = null,
    } = req.body;

    if (!gymId || !campaignName || !message) {
      await connection.rollback();

      return res.status(400).json({
        success: false,
        message: "gymId, campaignName and message are required",
      });
    }

    const allowedCampaignTypes = ["sms", "notification", "whatsapp"];
    const allowedTargetTypes = ["selected", "all", "filter"];

    if (!allowedCampaignTypes.includes(campaignType)) {
      await connection.rollback();

      return res.status(400).json({
        success: false,
        message: "campaignType must be sms, notification or whatsapp",
      });
    }

    if (!allowedTargetTypes.includes(targetType)) {
      await connection.rollback();

      return res.status(400).json({
        success: false,
        message: "targetType must be selected, all or filter",
      });
    }

    if (campaignType === "notification" && !title) {
      await connection.rollback();

      return res.status(400).json({
        success: false,
        message: "title is required for notification campaign",
      });
    }

    let memberQuery = `
      SELECT
        id,
        name,
        mobile
      FROM members
      WHERE gym_id = ?
    `;

    const memberParams = [gymId];

    if (targetType === "selected") {
      if (!Array.isArray(selectedMemberIds) || selectedMemberIds.length === 0) {
        await connection.rollback();

        return res.status(400).json({
          success: false,
          message: "selectedMemberIds are required when targetType is selected",
        });
      }

      memberQuery += `
        AND id IN (${selectedMemberIds.map(() => "?").join(",")})
      `;

      memberParams.push(...selectedMemberIds);
    }

    /*
      Update these conditions according to your actual membership table.

      Example expected table:
      memberships(member_id, gym_id, expiry_date, status)
    */
    if (targetType === "filter") {
      if (!filterCriteria) {
        await connection.rollback();

        return res.status(400).json({
          success: false,
          message: "filterCriteria is required when targetType is filter",
        });
      }

      if (filterCriteria === "expiring_1_3") {
        memberQuery += `
          AND id IN (
            SELECT member_id
            FROM memberships
            WHERE gym_id = ?
            AND expiry_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 3 DAY)
          )
        `;

        memberParams.push(gymId);
      }

      if (filterCriteria === "expiring_4_7") {
        memberQuery += `
          AND id IN (
            SELECT member_id
            FROM memberships
            WHERE gym_id = ?
            AND expiry_date BETWEEN DATE_ADD(CURDATE(), INTERVAL 4 DAY)
            AND DATE_ADD(CURDATE(), INTERVAL 7 DAY)
          )
        `;

        memberParams.push(gymId);
      }

      if (filterCriteria === "birthday_today") {
        memberQuery += `
          AND DATE_FORMAT(date_of_birth, '%m-%d') =
              DATE_FORMAT(CURDATE(), '%m-%d')
        `;
      }
    }

    const [members] = await connection.query(memberQuery, memberParams);

    const totalRecipients = members.length;

    const [campaignResult] = await connection.query(
      `
      INSERT INTO campaigns (
        gym_id,
        campaign_name,
        campaign_type,
        message,
        title,
        target_type,
        filter_criteria,
        total_recipients,
        sent_count,
        failed_count,
        status,
        scheduled_at,
        created_by
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, 0, 'pending', ?, ?)
      `,
      [
        gymId,
        campaignName,
        campaignType,
        message,
        title,
        targetType,
        filterCriteria,
        totalRecipients,
        scheduledAt,
        req.user?.id || null,
      ]
    );

    const campaignId = campaignResult.insertId;

    if (members.length > 0) {
      const recipientRows = members.map((member) => [
        campaignId,
        member.id,
        member.name || null,
        member.mobile || null,
        "pending",
        message,
      ]);

      await connection.query(
        `
        INSERT INTO campaign_recipients (
          campaign_id,
          member_id,
          member_name,
          member_mobile,
          status,
          message
        )
        VALUES ?
        `,
        [recipientRows]
      );
    }

    await addCampaignLog({
      connection,
      campaignId,
      logType: "info",
      message: `Campaign "${campaignName}" created with ${totalRecipients} recipients`,
      responseData: {
        gymId: Number(gymId),
        campaignType,
        targetType,
        filterCriteria,
        totalRecipients,
        scheduledAt,
        createdBy: req.user?.id || null,
      },
    });

    await connection.commit();

    return res.status(201).json({
      success: true,
      message: "Campaign created successfully",
      data: {
        campaignId,
        gymId: Number(gymId),
        totalRecipients,
        status: "pending",
      },
    });
  } catch (error) {
    if (connection) await connection.rollback();

    console.error("createCampaign error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create campaign",
      error: error.message,
    });
  } finally {
    if (connection) connection.release();
  }
};

/* =========================================================
   UPDATE CAMPAIGN
   PUT /campaigns/:id

   Only pending campaigns can be updated.
========================================================= */
const updateCampaign = async (req, res) => {
  let connection;

  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    const { id } = req.params;
    const gymId = getFinalGymId(req);

    const {
      campaignName,
      campaignType,
      title,
      message,
      targetType,
      filterCriteria,
      scheduledAt,
    } = req.body;

    let campaignQuery = `
      SELECT *
      FROM campaigns
      WHERE id = ?
    `;

    const campaignParams = [id];

    if (gymId) {
      campaignQuery += " AND gym_id = ?";
      campaignParams.push(gymId);
    }

    const [campaignRows] = await connection.query(
      campaignQuery,
      campaignParams
    );

    if (campaignRows.length === 0) {
      await connection.rollback();

      return res.status(404).json({
        success: false,
        message: "Campaign not found",
      });
    }

    const campaign = campaignRows[0];

    if (campaign.status !== "pending") {
      await connection.rollback();

      return res.status(400).json({
        success: false,
        message: "Only pending campaigns can be updated",
      });
    }

    const finalCampaignName = campaignName ?? campaign.campaign_name;
    const finalCampaignType = campaignType ?? campaign.campaign_type;
    const finalTitle = title ?? campaign.title;
    const finalMessage = message ?? campaign.message;
    const finalTargetType = targetType ?? campaign.target_type;
    const finalFilterCriteria =
      filterCriteria ?? campaign.filter_criteria;
    const finalScheduledAt = scheduledAt ?? campaign.scheduled_at;

    if (
      finalCampaignType === "notification" &&
      (!finalTitle || !String(finalTitle).trim())
    ) {
      await connection.rollback();

      return res.status(400).json({
        success: false,
        message: "title is required for notification campaign",
      });
    }

    await connection.query(
      `
      UPDATE campaigns
      SET
        campaign_name = ?,
        campaign_type = ?,
        title = ?,
        message = ?,
        target_type = ?,
        filter_criteria = ?,
        scheduled_at = ?
      WHERE id = ?
      `,
      [
        finalCampaignName,
        finalCampaignType,
        finalTitle,
        finalMessage,
        finalTargetType,
        finalFilterCriteria,
        finalScheduledAt,
        id,
      ]
    );

    await connection.query(
      `
      UPDATE campaign_recipients
      SET message = ?
      WHERE campaign_id = ?
      AND status = 'pending'
      `,
      [finalMessage, id]
    );

    await addCampaignLog({
      connection,
      campaignId: Number(id),
      logType: "info",
      message: "Campaign updated",
      responseData: {
        campaignName: finalCampaignName,
        campaignType: finalCampaignType,
        targetType: finalTargetType,
        scheduledAt: finalScheduledAt,
      },
    });

    await connection.commit();

    return res.status(200).json({
      success: true,
      message: "Campaign updated successfully",
    });
  } catch (error) {
    if (connection) await connection.rollback();

    console.error("updateCampaign error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update campaign",
      error: error.message,
    });
  } finally {
    if (connection) connection.release();
  }
};

/* =========================================================
   SEND CAMPAIGN
   POST /campaigns/:id/send

   Provider calls are commented.
   Add your WhatsApp / SMS / Firebase provider there.
========================================================= */
const sendCampaign = async (req, res) => {
  let connection;

  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    const { id } = req.params;
    const gymId = getFinalGymId(req);

    let campaignQuery = `
      SELECT *
      FROM campaigns
      WHERE id = ?
    `;

    const campaignParams = [id];

    if (gymId) {
      campaignQuery += " AND gym_id = ?";
      campaignParams.push(gymId);
    }

    const [campaignRows] = await connection.query(
      campaignQuery,
      campaignParams
    );

    if (campaignRows.length === 0) {
      await connection.rollback();

      return res.status(404).json({
        success: false,
        message: "Campaign not found",
      });
    }

    const campaign = campaignRows[0];

    if (campaign.status === "completed") {
      await connection.rollback();

      return res.status(400).json({
        success: false,
        message: "Campaign already completed",
      });
    }

    if (campaign.status === "cancelled") {
      await connection.rollback();

      return res.status(400).json({
        success: false,
        message: "Cancelled campaign cannot be sent",
      });
    }

    if (
      campaign.scheduled_at &&
      new Date(campaign.scheduled_at) > new Date()
    ) {
      await connection.rollback();

      return res.status(400).json({
        success: false,
        message: "This campaign is scheduled for a future time",
      });
    }

    const [recipients] = await connection.query(
      `
      SELECT
        id,
        member_id,
        member_name,
        member_mobile,
        message,
        status
      FROM campaign_recipients
      WHERE campaign_id = ?
      AND status = 'pending'
      `,
      [id]
    );

    if (recipients.length === 0) {
      await connection.rollback();

      return res.status(400).json({
        success: false,
        message: "No pending recipients found for this campaign",
      });
    }

    await connection.query(
      `
      UPDATE campaigns
      SET
        status = 'processing',
        started_at = COALESCE(started_at, NOW())
      WHERE id = ?
      `,
      [id]
    );

    await addCampaignLog({
      connection,
      campaignId: Number(id),
      logType: "info",
      message: "Campaign sending started",
      responseData: {
        campaignType: campaign.campaign_type,
        totalRecipients: recipients.length,
      },
    });

    let sentCount = 0;
    let failedCount = 0;
    let skippedCount = 0;

    for (const recipient of recipients) {
      try {
        const personalizedMessage = recipient.message
          .replace(/\[Name\]/gi, recipient.member_name || "Member");

        if (
          ["sms", "whatsapp"].includes(campaign.campaign_type) &&
          !recipient.member_mobile
        ) {
          await connection.query(
            `
            UPDATE campaign_recipients
            SET
              status = 'skipped',
              error_message = 'Mobile number not available'
            WHERE id = ?
            `,
            [recipient.id]
          );

          await addCampaignLog({
            connection,
            campaignId: Number(id),
            recipientId: recipient.id,
            logType: "warning",
            message: `Skipped ${recipient.member_name || "member"} because mobile number is missing`,
            responseData: {
              memberId: recipient.member_id,
              reason: "Mobile number not available",
            },
          });

          skippedCount++;
          continue;
        }

        /*
          ====================================================
          ADD REAL MESSAGE PROVIDER HERE
          ====================================================

          if (campaign.campaign_type === "whatsapp") {
            await sendWhatsAppMessage({
              mobile: recipient.member_mobile,
              message: personalizedMessage,
            });
          }

          if (campaign.campaign_type === "sms") {
            await sendSms({
              mobile: recipient.member_mobile,
              message: personalizedMessage,
            });
          }

          if (campaign.campaign_type === "notification") {
            await sendPushNotification({
              memberId: recipient.member_id,
              title: campaign.title,
              message: personalizedMessage,
            });
          }
        */

        await connection.query(
          `
          UPDATE campaign_recipients
          SET
            status = 'sent',
            sent_at = NOW(),
            error_message = NULL
          WHERE id = ?
          `,
          [recipient.id]
        );

        await addCampaignLog({
          connection,
          campaignId: Number(id),
          recipientId: recipient.id,
          logType: "success",
          message: `Message sent successfully to ${recipient.member_name || "member"}`,
          responseData: {
            memberId: recipient.member_id,
            mobile: recipient.member_mobile,
            campaignType: campaign.campaign_type,
            message: personalizedMessage,
          },
        });

        sentCount++;
      } catch (sendError) {
        await connection.query(
          `
          UPDATE campaign_recipients
          SET
            status = 'failed',
            error_message = ?
          WHERE id = ?
          `,
          [sendError.message, recipient.id]
        );

        await addCampaignLog({
          connection,
          campaignId: Number(id),
          recipientId: recipient.id,
          logType: "error",
          message: `Message failed for ${recipient.member_name || "member"}`,
          responseData: {
            memberId: recipient.member_id,
            mobile: recipient.member_mobile,
            error: sendError.message,
          },
        });

        failedCount++;
      }
    }

    const [recipientSummaryRows] = await connection.query(
      `
      SELECT
        COUNT(*) AS totalRecipients,
        SUM(CASE WHEN status = 'sent' THEN 1 ELSE 0 END) AS sentCount,
        SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) AS failedCount,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pendingCount,
        SUM(CASE WHEN status = 'skipped' THEN 1 ELSE 0 END) AS skippedCount
      FROM campaign_recipients
      WHERE campaign_id = ?
      `,
      [id]
    );

    const summary = recipientSummaryRows[0];

    let finalStatus = "completed";

    if (
      Number(summary.sentCount || 0) === 0 &&
      Number(summary.failedCount || 0) > 0
    ) {
      finalStatus = "failed";
    }

    await connection.query(
      `
      UPDATE campaigns
      SET
        total_recipients = ?,
        sent_count = ?,
        failed_count = ?,
        status = ?,
        completed_at = NOW()
      WHERE id = ?
      `,
      [
        Number(summary.totalRecipients || 0),
        Number(summary.sentCount || 0),
        Number(summary.failedCount || 0),
        finalStatus,
        id,
      ]
    );

    await addCampaignLog({
      connection,
      campaignId: Number(id),
      logType: finalStatus === "completed" ? "success" : "error",
      message: `Campaign completed. Sent: ${sentCount}, Failed: ${failedCount}, Skipped: ${skippedCount}`,
      responseData: {
        totalRecipients: Number(summary.totalRecipients || 0),
        sent: Number(summary.sentCount || 0),
        failed: Number(summary.failedCount || 0),
        pending: Number(summary.pendingCount || 0),
        skipped: Number(summary.skippedCount || 0),
        finalStatus,
      },
    });

    await connection.commit();

    return res.status(200).json({
      success: true,
      message: "Campaign processed successfully",
      data: {
        campaignId: Number(id),
        totalRecipients: Number(summary.totalRecipients || 0),
        sent: Number(summary.sentCount || 0),
        failed: Number(summary.failedCount || 0),
        pending: Number(summary.pendingCount || 0),
        skipped: Number(summary.skippedCount || 0),
        status: finalStatus,
      },
    });
  } catch (error) {
    if (connection) await connection.rollback();

    console.error("sendCampaign error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to send campaign",
      error: error.message,
    });
  } finally {
    if (connection) connection.release();
  }
};

/* =========================================================
   CANCEL CAMPAIGN
   PATCH /campaigns/:id/cancel
========================================================= */
const cancelCampaign = async (req, res) => {
  let connection;

  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    const { id } = req.params;
    const gymId = getFinalGymId(req);

    let campaignQuery = `
      SELECT *
      FROM campaigns
      WHERE id = ?
    `;

    const campaignParams = [id];

    if (gymId) {
      campaignQuery += " AND gym_id = ?";
      campaignParams.push(gymId);
    }

    const [campaignRows] = await connection.query(
      campaignQuery,
      campaignParams
    );

    if (campaignRows.length === 0) {
      await connection.rollback();

      return res.status(404).json({
        success: false,
        message: "Campaign not found",
      });
    }

    const campaign = campaignRows[0];

    if (campaign.status === "completed") {
      await connection.rollback();

      return res.status(400).json({
        success: false,
        message: "Completed campaign cannot be cancelled",
      });
    }

    await connection.query(
      `
      UPDATE campaigns
      SET status = 'cancelled'
      WHERE id = ?
      `,
      [id]
    );

    await connection.query(
      `
      UPDATE campaign_recipients
      SET
        status = 'skipped',
        error_message = 'Campaign cancelled'
      WHERE campaign_id = ?
      AND status = 'pending'
      `,
      [id]
    );

    await addCampaignLog({
      connection,
      campaignId: Number(id),
      logType: "warning",
      message: "Campaign cancelled",
      responseData: {
        cancelledBy: req.user?.id || null,
      },
    });

    await connection.commit();

    return res.status(200).json({
      success: true,
      message: "Campaign cancelled successfully",
    });
  } catch (error) {
    if (connection) await connection.rollback();

    console.error("cancelCampaign error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to cancel campaign",
      error: error.message,
    });
  } finally {
    if (connection) connection.release();
  }
};

/* =========================================================
   GET CAMPAIGN RECIPIENTS
   GET /campaigns/:id/recipients?page=1&limit=20&status=sent&search=rahul
========================================================= */
const getCampaignRecipients = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      page = 1,
      limit = 20,
      status,
      search,
    } = req.query;

    const pageNumber = Math.max(Number(page) || 1, 1);
    const pageLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);
    const offset = (pageNumber - 1) * pageLimit;

    const conditions = ["cr.campaign_id = ?"];
    const params = [id];

    if (status && status !== "all") {
      conditions.push("cr.status = ?");
      params.push(status);
    }

    if (search && String(search).trim()) {
      const keyword = `%${String(search).trim()}%`;

      conditions.push(`
        (
          cr.member_name LIKE ?
          OR cr.member_mobile LIKE ?
        )
      `);

      params.push(keyword, keyword);
    }

    const whereClause = `WHERE ${conditions.join(" AND ")}`;

    const [recipients] = await db.query(
      `
      SELECT
        cr.id,
        cr.campaign_id,
        cr.member_id,
        cr.member_name,
        cr.member_mobile,
        cr.status,
        cr.error_message,
        cr.sent_at,
        cr.created_at,
        cr.message

      FROM campaign_recipients cr

      ${whereClause}

      ORDER BY cr.created_at DESC
      LIMIT ? OFFSET ?
      `,
      [...params, pageLimit, offset]
    );

    const [countRows] = await db.query(
      `
      SELECT COUNT(*) AS total
      FROM campaign_recipients cr
      ${whereClause}
      `,
      params
    );

    return res.status(200).json({
      success: true,
      message: "Campaign recipients fetched successfully",
      pagination: {
        page: pageNumber,
        limit: pageLimit,
        total: Number(countRows[0].total || 0),
        totalPages: Math.ceil(
          Number(countRows[0].total || 0) / pageLimit
        ),
      },
      data: recipients.map((recipient) => ({
        id: recipient.id,
        campaignId: recipient.campaign_id,
        memberId: recipient.member_id,
        memberName: recipient.member_name,
        memberMobile: recipient.member_mobile,
        status: recipient.status,
        errorMessage: recipient.error_message,
        message: recipient.message,
        sentAt: recipient.sent_at,
        createdAt: recipient.created_at,
      })),
    });
  } catch (error) {
    console.error("getCampaignRecipients error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch campaign recipients",
      error: error.message,
    });
  }
};

/* =========================================================
   GET CAMPAIGN LOGS
   GET /campaigns/:id/logs?page=1&limit=20&logType=error&recipientId=5
========================================================= */
const getCampaignLogs = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      page = 1,
      limit = 20,
      logType,
      recipientId,
    } = req.query;

    const pageNumber = Math.max(Number(page) || 1, 1);
    const pageLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);
    const offset = (pageNumber - 1) * pageLimit;

    const conditions = ["cl.campaign_id = ?"];
    const params = [id];

    if (logType && logType !== "all") {
      conditions.push("cl.log_type = ?");
      params.push(logType);
    }

    if (recipientId) {
      conditions.push("cl.recipient_id = ?");
      params.push(recipientId);
    }

    const whereClause = `WHERE ${conditions.join(" AND ")}`;

    const [logs] = await db.query(
      `
      SELECT
        cl.id,
        cl.campaign_id,
        cl.recipient_id,
        cl.log_type,
        cl.message,
        cl.response_data,
        cl.created_at,

        cr.member_id,
        cr.member_name,
        cr.member_mobile,
        cr.status AS recipient_status

      FROM campaign_logs cl

      LEFT JOIN campaign_recipients cr
        ON cr.id = cl.recipient_id

      ${whereClause}

      ORDER BY cl.created_at DESC
      LIMIT ? OFFSET ?
      `,
      [...params, pageLimit, offset]
    );

    const [countRows] = await db.query(
      `
      SELECT COUNT(*) AS total
      FROM campaign_logs cl
      ${whereClause}
      `,
      params
    );

    const formattedLogs = logs.map((log) => {
      let responseData = null;

      if (log.response_data) {
        try {
          responseData = JSON.parse(log.response_data);
        } catch {
          responseData = log.response_data;
        }
      }

      return {
        id: log.id,
        campaignId: log.campaign_id,
        recipientId: log.recipient_id,
        logType: log.log_type,
        message: log.message,
        responseData,
        createdAt: log.created_at,
        recipient: log.recipient_id
          ? {
              memberId: log.member_id,
              memberName: log.member_name,
              memberMobile: log.member_mobile,
              status: log.recipient_status,
            }
          : null,
      };
    });

    return res.status(200).json({
      success: true,
      message: "Campaign logs fetched successfully",
      pagination: {
        page: pageNumber,
        limit: pageLimit,
        total: Number(countRows[0].total || 0),
        totalPages: Math.ceil(
          Number(countRows[0].total || 0) / pageLimit
        ),
      },
      data: formattedLogs,
    });
  } catch (error) {
    console.error("getCampaignLogs error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch campaign logs",
      error: error.message,
    });
  }
};

/* =========================================================
   DELETE CAMPAIGN
   DELETE /campaigns/:id
========================================================= */
const deleteCampaign = async (req, res) => {
  let connection;

  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    const { id } = req.params;
    const gymId = getFinalGymId(req);

    let campaignQuery = `
      SELECT *
      FROM campaigns
      WHERE id = ?
    `;

    const campaignParams = [id];

    if (gymId) {
      campaignQuery += " AND gym_id = ?";
      campaignParams.push(gymId);
    }

    const [campaignRows] = await connection.query(
      campaignQuery,
      campaignParams
    );

    if (campaignRows.length === 0) {
      await connection.rollback();

      return res.status(404).json({
        success: false,
        message: "Campaign not found",
      });
    }

    const campaign = campaignRows[0];

    await addCampaignLog({
      connection,
      campaignId: Number(id),
      logType: "warning",
      message: `Campaign "${campaign.campaign_name}" deleted`,
      responseData: {
        deletedBy: req.user?.id || null,
      },
    });

    await connection.query(
      `
      DELETE FROM campaigns
      WHERE id = ?
      `,
      [id]
    );

    await connection.commit();

    return res.status(200).json({
      success: true,
      message: "Campaign deleted successfully",
    });
  } catch (error) {
    if (connection) await connection.rollback();

    console.error("deleteCampaign error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete campaign",
      error: error.message,
    });
  } finally {
    if (connection) connection.release();
  }
};


module.exports = {
  getCampaignDashboard,
  getCampaigns,
  getCampaignById,
  createCampaign,
  updateCampaign,
  sendCampaign,
  cancelCampaign,
  getCampaignRecipients,
  getCampaignLogs,
  deleteCampaign,
};