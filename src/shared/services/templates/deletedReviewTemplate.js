exports.deletedReviewTemplate = (userName, reviewRating, reviewComment, reason) => {
  return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Hi ${userName},</h2>
          <p>Your review has been removed by our moderation team.</p>

          <h3>Your original review:</h3>
          <blockquote style="border-left: 4px solid #ccc; padding-left: 16px; color: #555;">
            <p><strong>Rating:</strong> ${reviewRating}/5</p>
            <p><strong>Comment:</strong> ${reviewComment}</p>
          </blockquote>

          <h3>Reason for removal:</h3>
          <p style="color: #d32f2f;">${reason}</p>

          <p>If you have any questions, please contact our support team.</p>
        </div>
        `;
};
